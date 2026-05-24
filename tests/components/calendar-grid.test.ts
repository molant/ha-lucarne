import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import type { CalendarLayoutResult } from '../../src/shared/calendar-layout.js';
import type { LucarneCalendarGrid } from '../../src/components/calendar-grid.js';

await import('../../src/components/calendar-grid.js');

function makeLayout(day: Date): CalendarLayoutResult {
  return {
    days: [day],
    perDay: new Map([
      [
        `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`,
        { allDay: [], inBand: [], earlier: [], later: [] },
      ],
    ]),
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
