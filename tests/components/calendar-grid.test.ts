import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import type { CalendarLayoutResult } from '../../src/shared/calendar-layout.js';
import { isoDateKey } from '../../src/shared/calendar-layout.js';
import type { LucarneCalendarGrid } from '../../src/components/calendar-grid.js';

await import('../../src/components/calendar-grid.js');

function makeLayout(day: Date): CalendarLayoutResult {
  return {
    days: [day],
    perDay: new Map([
      [isoDateKey(day), { allDay: [], inBand: [], earlier: [], later: [] }],
    ]),
  };
}

function makeLayoutMulti(days: Date[]): CalendarLayoutResult {
  return {
    days,
    perDay: new Map(
      days.map((d) => [isoDateKey(d), { allDay: [], inBand: [], earlier: [], later: [] }]),
    ),
  };
}

function makeGrid(): LucarneCalendarGrid {
  const grid = document.createElement('lucarne-calendar-grid') as LucarneCalendarGrid;
  grid.layout = makeLayout(new Date(2026, 4, 25));
  grid.cachedDayKeys = new Set(['2026-05-25']);
  grid.calendars = [{ entity: 'calendar.family', color: '#a8d8b9' }];
  document.body.appendChild(grid);
  return grid;
}

function shadowQueryAll(grid: LucarneCalendarGrid, selector: string): Element[] {
  return Array.from(grid.shadowRoot?.querySelectorAll(selector) ?? []);
}

describe('LucarneCalendarGrid — column-2 clip wrapper (issue #3)', () => {
  // The transformed `.day-cols-track` shifts left during pan; without a
  // scoped clip the all-day events painted in the wider track bleed across
  // the column-1 gutter on iPad Safari (sticky + transform-induced stacking
  // context don't reliably stack).
  //
  // The clip is intentionally applied ONLY to row 2 (all-day):
  //  - Row 1's .day-header uses `position: sticky; top: 0` — wrapping it
  //    in overflow:hidden would re-parent the sticky scrollport.
  //  - Row 3 hosts <lucarne-out-of-band-stub> whose backdrop/popover are
  //    `position: fixed`; because .day-cols-track has `transform`, it is
  //    their containing block, so a clip would also clip the stub overlay.
  let grid: LucarneCalendarGrid;
  afterEach(() => grid?.remove());

  it('renders three .day-cols-track elements (one per outer grid row)', async () => {
    grid = makeGrid();
    await grid.updateComplete;

    const tracks = shadowQueryAll(grid, '.day-cols-track');
    assert.equal(tracks.length, 3, 'pan logic relies on three tracks (one per row)');
  });

  it('wraps ONLY the row-2 track in a .day-cols-clip; rows 1 and 3 remain direct', async () => {
    grid = makeGrid();
    await grid.updateComplete;

    const clips = shadowQueryAll(grid, '.day-cols-clip');
    assert.equal(clips.length, 1, 'expect exactly one clip wrapper (row 2 only)');
    const clip = clips[0] as HTMLElement;
    assert.match(clip.getAttribute('style') ?? '', /grid-row:\s*2/);
    const innerTrack = clip.querySelector('.day-cols-track');
    assert.ok(innerTrack, 'clip should contain the row-2 .day-cols-track');

    // Rows 1 and 3: track is a direct grid child of .grid-wrapper.
    const directTracks = shadowQueryAll(grid, '.grid-wrapper > .day-cols-track') as HTMLElement[];
    assert.equal(directTracks.length, 2, 'rows 1 and 3 keep direct tracks');
    const rows = directTracks
      .map((el) => (el.getAttribute('style') ?? '').match(/grid-row:\s*(\d+)/)?.[1])
      .sort();
    assert.deepEqual(rows, ['1', '3']);
  });

  it('.day-cols-clip rule declares overflow:hidden and grid-column:2', async () => {
    grid = makeGrid();
    await grid.updateComplete;

    // Walk the constructed stylesheets on the shadow root to find the rule.
    // happy-dom doesn't resolve `grid-column` / `overflow` via getComputedStyle
    // for rules declared in adopted stylesheets, so we inspect the rule
    // declarations directly. Test fails if the declaration is removed,
    // renamed, or merged into a combined selector.
    const sheets = grid.shadowRoot?.adoptedStyleSheets ?? [];
    let found = false;
    for (const sheet of sheets) {
      for (const rule of Array.from(sheet.cssRules) as CSSStyleRule[]) {
        if (rule.selectorText && rule.selectorText.split(',').map((s) => s.trim()).includes('.day-cols-clip')) {
          assert.equal(rule.style.overflow, 'hidden');
          assert.equal(rule.style.gridColumn, '2');
          found = true;
        }
      }
    }
    assert.ok(found, '.day-cols-clip CSS rule must exist with overflow:hidden + grid-column:2');
  });
});

describe('LucarneCalendarGrid — single-row day header (issue #5)', () => {
  // Day header used to stack weekday name above the day number (two text
  // lines), with the "today" pill only encircling the number. The header is
  // now a single inline pill where weekday + number share the pill background
  // when the day is today. When the column gets too narrow the weekday hides.
  let grid: LucarneCalendarGrid;
  afterEach(() => grid?.remove());

  // We can't fake Date here without module-mocking calendar-grid's `new Date()`
  // call, so tests pass today's real date through and rely on isSameDay(day,
  // new Date()) inside the component.
  function buildGridWith(days: Date[]): LucarneCalendarGrid {
    const g = document.createElement('lucarne-calendar-grid') as LucarneCalendarGrid;
    g.layout = makeLayoutMulti(days);
    g.cachedDayKeys = new Set(days.map(isoDateKey));
    g.calendars = [{ entity: 'calendar.family', color: '#a8d8b9' }];
    document.body.appendChild(g);
    return g;
  }

  it('renders weekday + day number as a single inline pill (no stacked rows)', async () => {
    const today = new Date();
    grid = buildGridWith([today]);
    await grid.updateComplete;

    const header = grid.shadowRoot?.querySelector('.day-header') as HTMLElement | null;
    assert.ok(header, '.day-header should exist');
    const pill = header.querySelector('.day-pill') as HTMLElement | null;
    assert.ok(pill, '.day-pill should wrap weekday + number on one row');
    const weekday = pill.querySelector('.day-weekday');
    const num = pill.querySelector('.day-num');
    assert.ok(weekday, '.day-weekday should be inside .day-pill');
    assert.ok(num, '.day-num should be inside .day-pill');
    assert.equal(num!.textContent?.trim(), String(today.getDate()));
  });

  it('today highlight applies to the whole pill, not just the number', async () => {
    const today = new Date();
    grid = buildGridWith([today]);
    await grid.updateComplete;

    // The rendered header for today must carry the `today` class — otherwise
    // the CSS rule below could exist while runtime logic stopped applying it.
    const header = grid.shadowRoot?.querySelector('.day-header') as HTMLElement | null;
    assert.ok(header, '.day-header should exist');
    assert.ok(
      header.classList.contains('today'),
      '.day-header for today\'s date must have the `today` class',
    );

    const sheets = grid.shadowRoot?.adoptedStyleSheets ?? [];
    let pillRule: CSSStyleRule | null = null;
    let numRule: CSSStyleRule | null = null;
    for (const sheet of sheets) {
      for (const rule of Array.from(sheet.cssRules) as CSSStyleRule[]) {
        if (!rule.selectorText) continue;
        const sels = rule.selectorText.split(',').map((s) => s.trim());
        if (sels.includes('.day-header.today .day-pill')) pillRule = rule;
        if (sels.includes('.day-header.today .day-num')) numRule = rule;
      }
    }
    // Asserting the rule's selector exists is the structural guarantee that
    // matters; happy-dom's CSSOM silently drops `var(..., fallback)` values so
    // we can't reliably read the background back from .style.* — verified
    // manually in-browser.
    assert.ok(pillRule, '.day-header.today .day-pill rule must exist (carries the today pill background)');
    assert.equal(
      numRule,
      null,
      'today background must no longer be scoped to .day-num alone — it should cover the whole pill',
    );
  });

  it('hides .day-weekday in narrow columns via a container query', async () => {
    const today = new Date();
    grid = buildGridWith([today]);
    await grid.updateComplete;

    const sheets = grid.shadowRoot?.adoptedStyleSheets ?? [];
    let found = false;
    for (const sheet of sheets) {
      for (const rule of Array.from(sheet.cssRules)) {
        const text = rule.cssText ?? '';
        if (text.includes('@container') && text.includes('.day-weekday') && text.includes('display: none')) {
          found = true;
        }
      }
    }
    assert.ok(found, 'a @container rule should hide .day-weekday in narrow columns');
  });
});
