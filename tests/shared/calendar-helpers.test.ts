import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { resolveCalendarLabel, resolveCalendars } from '../../src/shared/calendar-helpers.js';
import type { HomeAssistant } from '../../src/shared/types.js';

function makeHass(states: Record<string, { friendly_name?: string } | undefined>): HomeAssistant {
  const built: Record<string, { entity_id: string; state: string; attributes: Record<string, unknown> }> = {};
  for (const [id, attrs] of Object.entries(states)) {
    if (!attrs) continue;
    built[id] = {
      entity_id: id,
      state: 'on',
      attributes: attrs.friendly_name ? { friendly_name: attrs.friendly_name } : {},
    };
  }
  return { states: built } as unknown as HomeAssistant;
}

describe('resolveCalendarLabel', () => {
  it('returns the entity friendly_name from hass states', () => {
    const hass = makeHass({ 'calendar.holidays': { friendly_name: 'Holidays in united states' } });
    const label = resolveCalendarLabel({ entity: 'calendar.holidays', color: '#fff' }, hass);
    assert.equal(label, 'Holidays in united states');
  });

  it('ignores legacy cal.label so users renaming via entity modal see the change', () => {
    // Stale label preserved in old YAML/saved configs must not shadow friendly_name.
    const hass = makeHass({ 'calendar.holidays': { friendly_name: 'Holidays' } });
    const label = resolveCalendarLabel(
      { entity: 'calendar.holidays', color: '#fff', label: 'OLD STALE LABEL' },
      hass,
    );
    assert.equal(label, 'Holidays');
  });

  it('falls back to the entity_id when no friendly_name', () => {
    const hass = makeHass({ 'calendar.unknown': {} });
    const label = resolveCalendarLabel({ entity: 'calendar.unknown', color: '#fff' }, hass);
    assert.equal(label, 'calendar.unknown');
  });

  it('returns the entity_id when the entity is not in hass states', () => {
    const hass = makeHass({});
    const label = resolveCalendarLabel({ entity: 'calendar.missing', color: '#fff' }, hass);
    assert.equal(label, 'calendar.missing');
  });

  it('returns the entity_id when hass is undefined', () => {
    const label = resolveCalendarLabel({ entity: 'calendar.x', color: '#fff' }, undefined);
    assert.equal(label, 'calendar.x');
  });
});

describe('resolveCalendars', () => {
  it('returns calendars with label always populated from friendly_name', () => {
    const hass = makeHass({
      'calendar.a': { friendly_name: 'A' },
      'calendar.b': { friendly_name: 'B from entity' },
    });
    const out = resolveCalendars(
      [
        { entity: 'calendar.a', color: '#1' },
        // Stale cal.label is ignored — friendly_name wins.
        { entity: 'calendar.b', color: '#2', label: 'B-OLD' },
        { entity: 'calendar.c', color: '#3' },
      ],
      hass,
    );
    assert.equal(out.length, 3);
    assert.equal(out[0].label, 'A');
    assert.equal(out[1].label, 'B from entity');
    assert.equal(out[2].label, 'calendar.c');
    // ensure original fields are preserved
    assert.equal(out[0].color, '#1');
    assert.equal(out[0].entity, 'calendar.a');
  });

  it('does not mutate the input array', () => {
    const hass = makeHass({ 'calendar.a': { friendly_name: 'A' } });
    const input = [{ entity: 'calendar.a', color: '#fff' }];
    resolveCalendars(input, hass);
    assert.equal(input[0].label, undefined);
  });
});
