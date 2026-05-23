import type { ReactiveController, ReactiveControllerHost } from 'lit';
import type { HomeAssistant, CalendarEvent, CalendarConfig } from './types.js';
import { fetchCalendarEvents, type FetchCalendarEventsResult } from './ha-subscriptions.js';
import { isoDateKey } from './calendar-layout.js';

export interface RollingWindowOptions {
  calendars: CalendarConfig[];
  visibleCount: number;
  onFetchStart?: (range: { start: Date; end: Date }) => void;
  /**
   * Fires on every successful fetch. `events` contains the tagged events
   * (uid prefixed with `${entityId}::`); `failed` contains entity ids whose
   * fetch threw — callers should NOT treat their absence from `events` as
   * authoritative (e.g. for optimistic-delete tombstone pruning).
   */
  onFetchComplete?: (events: Map<string, CalendarEvent[]>, failed: Set<string>) => void;
  /**
   * Fires whenever `dayOffset`, `visibleCount`, or the anchor day (midnight tick)
   * changes — even when no fetch is triggered. The card MUST hook this to
   * `_recompute()` so `_layout` stays current.
   */
  onChange?: () => void;
  now?: () => Date;
  panBoundDays?: number;
  /** Injected fetcher for tests; defaults to `fetchCalendarEvents`. */
  fetcher?: (hass: HomeAssistant, entityIds: string[], start: Date, end: Date) => Promise<FetchCalendarEventsResult>;
  /** Set to 0 in tests to suppress the real-time poll. Default: 5 * 60_000. */
  pollIntervalMs?: number;
  /** Set to 0 in tests to suppress the real-time midnight tick. Default: 60_000. */
  tickIntervalMs?: number;
  /**
   * Number of off-screen days rendered on EACH side of the visible window.
   * Used by the grid to draw buffer columns that slide into view during a pan
   * gesture, so the user never sees a blank gap. If undefined, defaults to the
   * current visibleCount — the rendered range then matches the event-data
   * cache range (visible ± visibleCount), with skeleton columns for any day
   * not yet fetched.
   */
  bufferDays?: number;
}

/**
 * Stable synthetic uid for events whose upstream uid is missing or empty.
 * Built from `start|end|summary` so the same event maps to the same uid
 * across fetches. Prevents downstream collisions (color lookup, optimistic
 * delete filter, allDayClipped keying) when an integration returns
 * uid-less events. Prefixed with `syn:` so consumers (Delete button, Google
 * deep-link) can detect synthetic ids and skip operations that need a real
 * upstream uid.
 */
function makeSyntheticUid(e: CalendarEvent): string {
  return `syn:${e.start}|${e.end}|${e.summary ?? ''}`;
}

/**
 * Coerce a user-supplied bufferDays value to a non-negative integer, or
 * `undefined` if the input is missing, non-numeric, NaN, or infinite. Keeps
 * a bad YAML config from blanking the grid (NaN propagates through
 * `Array.from({length: NaN})` to an empty array otherwise).
 */
function coerceBufferDays(n: number | undefined): number | undefined {
  if (n === undefined) return undefined;
  if (typeof n !== 'number' || !Number.isFinite(n)) return undefined;
  return Math.max(0, Math.floor(n));
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function todayMidnight(now: Date): Date {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return d;
}

export class RollingWindowController implements ReactiveController {
  private readonly _host: ReactiveControllerHost;
  private readonly _opts: RollingWindowOptions;
  private readonly _fetcher: (hass: HomeAssistant, ids: string[], start: Date, end: Date) => Promise<FetchCalendarEventsResult>;
  private readonly _pollIntervalMs: number;
  private readonly _tickIntervalMs: number;
  private readonly _panBound: number;

  private _hass?: HomeAssistant;
  private _isConnected = false;
  private _hasHass = false;

  private _visibleCount: number;
  private _dayOffset = 0;
  /** Explicit buffer override; when undefined, bufferDays returns _visibleCount. */
  private _bufferDaysExplicit?: number;

  // Stored as midnight-local Date
  private _anchorToday: Date;

  private _fetchSeq = 0;
  private _cachedEvents: Map<string, CalendarEvent[]> = new Map();
  private _cachedDayKeys: Set<string> = new Set();

  // The start/end of the last successfully-fetched range
  private _cacheStart?: Date;
  private _cacheEnd?: Date;

  private _pollTimer?: ReturnType<typeof setInterval>;
  private _tickTimer?: ReturnType<typeof setInterval>;

  constructor(host: ReactiveControllerHost, opts: RollingWindowOptions) {
    this._host = host;
    this._opts = opts;
    this._fetcher = opts.fetcher ?? fetchCalendarEvents;
    this._pollIntervalMs = opts.pollIntervalMs ?? 5 * 60_000;
    this._tickIntervalMs = opts.tickIntervalMs ?? 60_000;
    this._panBound = opts.panBoundDays ?? 90;
    this._visibleCount = opts.visibleCount;
    this._bufferDaysExplicit = coerceBufferDays(opts.bufferDays);

    const now = (opts.now ?? (() => new Date()))();
    this._anchorToday = todayMidnight(now);

    host.addController(this);
  }

  // -------------------------------------------------------------------------
  // Lit ReactiveController lifecycle
  // -------------------------------------------------------------------------

  hostConnected(): void {
    this._isConnected = true;
    if (this._tickIntervalMs > 0) {
      this._tickTimer = setInterval(() => this.tick(), this._tickIntervalMs);
    }
    if (this._pollIntervalMs > 0) {
      this._pollTimer = setInterval(() => this._poll(), this._pollIntervalMs);
    }
    if (this._hass) {
      this._fetchRange(...this._computeRange());
    }
  }

  hostDisconnected(): void {
    this._isConnected = false;
    clearInterval(this._tickTimer);
    clearInterval(this._pollTimer);
    this._tickTimer = undefined;
    this._pollTimer = undefined;
  }

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  setHass(hass: HomeAssistant): void {
    const wasUnset = !this._hasHass;
    this._hass = hass;
    this._hasHass = true;
    if (wasUnset && this._isConnected) {
      this._fetchRange(...this._computeRange());
    }
  }

  updateCalendars(calendars: CalendarConfig[]): void {
    const oldIds = new Set(this._opts.calendars.map((c) => c.entity));
    const newIds = new Set(calendars.map((c) => c.entity));
    const changed =
      oldIds.size !== newIds.size ||
      [...newIds].some((id) => !oldIds.has(id));
    (this._opts as { calendars: CalendarConfig[] }).calendars = calendars;
    if (changed && this._hass) {
      this._fetchRange(...this._computeRange());
    }
  }

  setVisibleCount(n: number): void {
    const prev = this._visibleCount;
    this._visibleCount = n;
    this._opts.onChange?.();
    this._host.requestUpdate();
    if (n !== prev) {
      // If the new range extends past the cache, re-fetch
      const [start, end] = this._computeRange();
      if (!this._rangeIsCovered(start, end)) {
        this._fetchRange(start, end);
      }
    }
  }

  /**
   * Set the off-screen render buffer (days drawn on each side of the visible
   * window). Pass `undefined` to revert to the default (matches visibleCount).
   * Non-finite or non-numeric input is coerced to `undefined` (default) so
   * bad YAML config doesn't blank the grid.
   */
  setBufferDays(n: number | undefined): void {
    const next = coerceBufferDays(n);
    if (next === this._bufferDaysExplicit) return;
    this._bufferDaysExplicit = next;
    this._opts.onChange?.();
    this._host.requestUpdate();
  }

  pan(deltaDays: number): void {
    const minOffset = -this._panBound;
    const maxOffset = this._panBound - this._visibleCount;
    const clamped = Math.max(minOffset, Math.min(maxOffset, this._dayOffset + deltaDays));
    this._dayOffset = clamped;
    this._opts.onChange?.();
    this._host.requestUpdate();
    const [start, end] = this._computeRange();
    if (!this._rangeIsCovered(start, end)) {
      this._fetchRange(start, end);
    }
  }

  goToToday(): void {
    const wasAtToday = this._dayOffset === 0;
    this._dayOffset = 0;
    if (!wasAtToday) {
      this._opts.onChange?.();
    }
    this._host.requestUpdate();
    const [start, end] = this._computeRange();
    if (!this._rangeIsCovered(start, end)) {
      this._fetchRange(start, end);
    }
  }

  tick(): void {
    const now = (this._opts.now ?? (() => new Date()))();
    const newToday = todayMidnight(now);
    if (newToday.getTime() === this._anchorToday.getTime()) return;

    // Day has changed — update internal "today" regardless
    this._anchorToday = newToday;

    if (this._dayOffset === 0) {
      // User is at the today anchor — re-anchor and re-fetch
      this._opts.onChange?.();
      this._host.requestUpdate();
      if (this._hass) {
        this._fetchRange(...this._computeRange());
      }
    }
    // If panned away: just update _anchorToday so the next goToToday lands correctly
  }

  async _poll(): Promise<void> {
    if (!this._hass) return;
    this._fetchRange(...this._computeRange());
  }

  // -------------------------------------------------------------------------
  // Getters
  // -------------------------------------------------------------------------

  get days(): Date[] {
    return Array.from({ length: this._visibleCount }, (_, i) => {
      const d = addDays(this._anchorToday, this._dayOffset + i);
      d.setHours(0, 0, 0, 0);
      return d;
    });
  }

  /** Effective buffer-day count (explicit override or visibleCount). */
  get bufferDays(): number {
    return this._bufferDaysExplicit ?? this._visibleCount;
  }

  /**
   * Days to render in the grid track: `bufferDays + visibleCount + bufferDays`.
   * The visible window occupies indices `[bufferDays, bufferDays + visibleCount)`.
   * Days outside the cached event range are rendered as skeleton columns.
   */
  get renderDays(): Date[] {
    const b = this.bufferDays;
    const total = b * 2 + this._visibleCount;
    return Array.from({ length: total }, (_, i) => {
      const d = addDays(this._anchorToday, this._dayOffset - b + i);
      d.setHours(0, 0, 0, 0);
      return d;
    });
  }

  get dayOffset(): number {
    return this._dayOffset;
  }

  get isAtToday(): boolean {
    return this._dayOffset === 0;
  }

  get canPanBack(): boolean {
    return this._dayOffset > -this._panBound;
  }

  get canPanForward(): boolean {
    return this._dayOffset + this._visibleCount < this._panBound;
  }

  get cachedEvents(): Map<string, CalendarEvent[]> {
    return this._cachedEvents;
  }

  get cachedRange(): Date[] {
    if (!this._cacheStart || !this._cacheEnd) return [];
    const result: Date[] = [];
    const d = new Date(this._cacheStart);
    while (d < this._cacheEnd) {
      result.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    return result;
  }

  isDayCached(day: Date): boolean {
    return this._cachedDayKeys.has(isoDateKey(day));
  }

  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------

  /** Compute [start, end) for the current visible+buffer range. */
  private _computeRange(): [Date, Date] {
    const vc = this._visibleCount;
    // start = anchorToday + dayOffset - visibleCount
    const start = addDays(this._anchorToday, this._dayOffset - vc);
    start.setHours(0, 0, 0, 0);
    // end = anchorToday + dayOffset + 2*visibleCount (exclusive)
    const end = addDays(this._anchorToday, this._dayOffset + 2 * vc);
    end.setHours(0, 0, 0, 0);
    return [start, end];
  }

  private _rangeIsCovered(start: Date, end: Date): boolean {
    if (!this._cacheStart || !this._cacheEnd) return false;
    return start >= this._cacheStart && end <= this._cacheEnd;
  }

  private _fetchRange(start: Date, end: Date): void {
    if (!this._hass) return;
    const seq = ++this._fetchSeq;
    const entityIds = this._opts.calendars.map((c) => c.entity);
    this._opts.onFetchStart?.({ start, end });

    this._fetcher(this._hass, entityIds, start, end).then(({ events: map, failed }) => {
      if (seq !== this._fetchSeq) return; // stale response — discard

      // Tag every event's uid with its source entity (required for color lookup
      // in calendar-grid._eventColor and the visibility filter in _recompute).
      // Events with no upstream uid get a stable synthetic one — same content
      // produces the same uid across fetches, avoiding the `entity::` collision
      // that would otherwise merge multiple uid-less events under one key.
      const tagged = new Map<string, CalendarEvent[]>();
      for (const [entityId, events] of map.entries()) {
        tagged.set(
          entityId,
          events.map((e) => {
            const original = e.uid && e.uid.length > 0 ? e.uid : makeSyntheticUid(e);
            return { ...e, uid: `${entityId}::${original}` };
          }),
        );
      }
      this._cachedEvents = tagged;

      // Replace _cachedDayKeys wholesale (do NOT merge — stale keys from prior
      // range would make isDayCached return true for days no longer in cache)
      this._cachedDayKeys = new Set();
      for (const d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        this._cachedDayKeys.add(isoDateKey(d));
      }

      this._cacheStart = new Date(start);
      this._cacheEnd = new Date(end);

      this._opts.onFetchComplete?.(tagged, failed);
    }).catch((err) => {
      console.warn('[lucarne] RollingWindowController fetch failed:', err);
    });
  }
}
