import type { CalendarEvent } from './types.js';
import {
  weekDays,
  startOfWeek,
  eventBandPortion,
} from './date-helpers.js';

export interface InBandBlock {
  event: CalendarEvent;
  lane: number;
  laneCount: number;
  topPercent: number;
  heightPercent: number;
}

export interface PerDayLayout {
  allDay: CalendarEvent[];
  inBand: InBandBlock[];
  earlier: CalendarEvent[];
  later: CalendarEvent[];
}

export interface CalendarLayoutResult {
  weekDays: Date[];
  perDay: Map<string, PerDayLayout>;
}

function isAllDay(event: CalendarEvent): boolean {
  // All-day events have date-only strings (no 'T'). HA/iCal convention: end is exclusive
  // (a single-day event has end = start + 1 day, e.g. start="2026-01-05", end="2026-01-06").
  return event.start.length === 10 && !event.start.includes('T');
}

function isoDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

interface TimedEventEntry {
  event: CalendarEvent;
  start: Date;
  end: Date;
  lane: number;
}

/** Returns per-entry {lane, laneCount} in the SAME order as the input entries.
 *  laneCount reflects the size of each event's connected overlap cluster, so
 *  disjoint clusters render at full width independently. */
function assignLanes(entries: TimedEventEntry[]): { lane: number; laneCount: number }[] {
  if (entries.length === 0) return [];

  // Sort by start time, tracking original index for writeback
  const indexed = entries.map((e, i) => ({ ...e, _idx: i }));
  indexed.sort((a, b) => a.start.getTime() - b.start.getTime());

  const laneEnds: number[] = [];
  const lanes = new Array<number>(entries.length);

  for (const entry of indexed) {
    const startMs = entry.start.getTime();
    let lane = laneEnds.findIndex((endMs) => endMs <= startMs);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(entry.end.getTime());
    } else {
      laneEnds[lane] = entry.end.getTime();
    }
    lanes[entry._idx] = lane;
  }

  // Compute per-cluster laneCount: walk sorted events, group by continuous overlap.
  // A new group starts when an event's start >= the max end time seen so far in the group.
  const clusterIds = new Array<number>(entries.length);
  const clusterMaxLane: number[] = [];
  let currentCluster = 0;
  let clusterMaxEnd = indexed[0].end.getTime();
  clusterIds[indexed[0]._idx] = 0;
  clusterMaxLane.push(lanes[indexed[0]._idx]);

  for (let i = 1; i < indexed.length; i++) {
    const entry = indexed[i];
    if (entry.start.getTime() >= clusterMaxEnd) {
      // Start a new cluster
      currentCluster++;
      clusterMaxLane.push(0);
      clusterMaxEnd = entry.end.getTime();
    } else {
      clusterMaxEnd = Math.max(clusterMaxEnd, entry.end.getTime());
    }
    clusterIds[entry._idx] = currentCluster;
    clusterMaxLane[currentCluster] = Math.max(clusterMaxLane[currentCluster], lanes[entry._idx]);
  }

  return lanes.map((lane, origIdx) => ({
    lane,
    laneCount: clusterMaxLane[clusterIds[origIdx]] + 1,
  }));
}

function bandMs(day: Date, timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  const d = new Date(day);
  d.setHours(h, m, 0, 0);
  return d.getTime();
}

export function layoutEvents(
  events: CalendarEvent[],
  weekStart: Date,
  bandStart: string,
  bandEnd: string,
  weekStartsOn: 'monday' | 'sunday',
): CalendarLayoutResult {
  const days = weekDays(startOfWeek(weekStart, weekStartsOn));
  const perDay = new Map<string, PerDayLayout>();

  // Initialize all days
  for (const day of days) {
    perDay.set(isoDateKey(day), { allDay: [], inBand: [], earlier: [], later: [] });
  }

  for (const event of events) {
    if (isAllDay(event)) {
      // All-day event: add to every day it covers within the week
      const eventStartDate = new Date(event.start + 'T00:00:00');
      // For all-day events, end is exclusive (e.g., single day event end = start + 1 day)
      const eventEndDate = new Date(event.end + 'T00:00:00');

      for (const day of days) {
        const dayKey = isoDateKey(day);
        const layout = perDay.get(dayKey)!;
        // Day falls within [eventStart, eventEnd)
        if (day >= eventStartDate && day < eventEndDate) {
          layout.allDay.push(event);
        }
      }
      continue;
    }

    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);

    // For each day in the week, check if the event has a presence
    for (const day of days) {
      const dayKey = isoDateKey(day);
      const layout = perDay.get(dayKey)!;

      // Day boundaries in local time
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);

      // Event does not touch this day at all
      if (eventEnd <= dayStart || eventStart > dayEnd) continue;

      const bStartMs = bandMs(day, bandStart);
      const bEndMs = bandMs(day, bandEnd);

      if (eventEnd.getTime() <= bStartMs) {
        // Entirely before the band
        layout.earlier.push(event);
      } else if (eventStart.getTime() >= bEndMs) {
        // Entirely after the band
        layout.later.push(event);
      } else {
        // Overlaps the band
        const portion = eventBandPortion(event, day, bandStart, bandEnd);
        if (portion) {
          const bandDurationMs = bEndMs - bStartMs;
          const topPercent = ((portion.start.getTime() - bStartMs) / bandDurationMs) * 100;
          const heightPercent = ((portion.end.getTime() - portion.start.getTime()) / bandDurationMs) * 100;

          // Store in inBand (lane/laneCount will be filled after per-day pass)
          layout.inBand.push({
            event,
            lane: 0,
            laneCount: 1,
            topPercent: Math.max(0, Math.min(100, topPercent)),
            heightPercent: Math.max(0, Math.min(100 - topPercent, heightPercent)),
          });
        }
      }
    }
  }

  // Assign lanes per day
  for (const day of days) {
    const dayKey = isoDateKey(day);
    const layout = perDay.get(dayKey)!;
    if (layout.inBand.length === 0) continue;

    // Hoist band boundaries — constant for the whole day
    const bStartMs = bandMs(day, bandStart);
    const bEndMs = bandMs(day, bandEnd);
    const bandDurationMs = bEndMs - bStartMs;

    // Build entries for lane assignment using the clipped portion times
    const entries: TimedEventEntry[] = layout.inBand.map((block) => {
      const startMs = bStartMs + (block.topPercent / 100) * bandDurationMs;
      const endMs = startMs + (block.heightPercent / 100) * bandDurationMs;
      return {
        event: block.event,
        start: new Date(startMs),
        end: new Date(endMs),
        lane: 0,
      };
    });

    const assigned = assignLanes(entries);

    layout.inBand = layout.inBand.map((block, i) => ({
      ...block,
      lane: assigned[i].lane,
      laneCount: assigned[i].laneCount,
    }));
  }

  return { weekDays: days, perDay };
}
