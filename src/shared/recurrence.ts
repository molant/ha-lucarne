/**
 * Hand-rolled RRULE builder/parser for the six contract patterns locked in
 * Phase 2 Sub-Phase A. Does NOT depend on rrule.js.
 *
 * Contract table (must round-trip with recurrence.py):
 *  none      | "" (empty string)
 *  daily     | FREQ=DAILY[;INTERVAL=N]
 *  weekly    | FREQ=WEEKLY;BYDAY=<MO,TU,...>[;INTERVAL=N]
 *  monthly-d | FREQ=MONTHLY;BYMONTHDAY=<1-31>[;INTERVAL=N]
 *  monthly-n | FREQ=MONTHLY;BYDAY=<+/-N><DAY>[;INTERVAL=N]
 *  yearly    | FREQ=YEARLY;BYMONTH=<1-12>;BYMONTHDAY=<1-31>[;INTERVAL=N]
 */

export type RecurrenceMode =
  | 'none'
  | 'daily'
  | 'weekly'
  | 'monthly-date'
  | 'monthly-nth'
  | 'yearly'
  | 'unknown';

export const WEEKDAY_CODES = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'] as const;
export type WeekdayCode = (typeof WEEKDAY_CODES)[number];

export interface RecurrenceNone {
  mode: 'none';
}
export interface RecurrenceDaily {
  mode: 'daily';
  interval?: number;
}
export interface RecurrenceWeekly {
  mode: 'weekly';
  days: WeekdayCode[];
  interval?: number;
}
export interface RecurrenceMonthlyDate {
  mode: 'monthly-date';
  dayOfMonth: number;
  interval?: number;
}
export interface RecurrenceMonthlyNth {
  mode: 'monthly-nth';
  nth: number;
  day: WeekdayCode;
  interval?: number;
}
export interface RecurrenceYearly {
  mode: 'yearly';
  month: number;
  dayOfMonth: number;
  interval?: number;
}
export interface RecurrenceUnknown {
  mode: 'unknown';
  raw: string;
}

export type ParsedRecurrence =
  | RecurrenceNone
  | RecurrenceDaily
  | RecurrenceWeekly
  | RecurrenceMonthlyDate
  | RecurrenceMonthlyNth
  | RecurrenceYearly
  | RecurrenceUnknown;

/** Parse RRULE string into structured form. Unknown patterns return {mode:'unknown', raw}. */
export function parseRRule(rrule: string): ParsedRecurrence {
  if (!rrule || rrule.trim() === '') return { mode: 'none' };

  const parts = rrule.trim().split(';');
  const props: Record<string, string> = {};
  for (const p of parts) {
    const eq = p.indexOf('=');
    if (eq === -1) return { mode: 'unknown', raw: rrule };
    props[p.slice(0, eq)] = p.slice(eq + 1);
  }

  const freq = props['FREQ'];
  let interval: number | undefined;
  if (props['INTERVAL'] !== undefined) {
    if (!/^[1-9]\d*$/.test(props['INTERVAL'])) return { mode: 'unknown', raw: rrule };
    interval = parseInt(props['INTERVAL'], 10);
  }
  const byDay = props['BYDAY'];
  const byMonthDay = props['BYMONTHDAY'];
  const byMonth = props['BYMONTH'];

  function hasOnlyKeys(...allowed: string[]): boolean {
    const allowedSet = new Set(allowed);
    return Object.keys(props).every((k) => allowedSet.has(k));
  }

  if (freq === 'DAILY' && !byDay && !byMonthDay && !byMonth) {
    if (!hasOnlyKeys('FREQ', 'INTERVAL')) return { mode: 'unknown', raw: rrule };
    return { mode: 'daily', ...(interval ? { interval } : {}) };
  }

  if (freq === 'WEEKLY' && byDay && !byMonthDay && !byMonth) {
    if (!hasOnlyKeys('FREQ', 'BYDAY', 'INTERVAL')) return { mode: 'unknown', raw: rrule };
    const days = byDay.split(',') as WeekdayCode[];
    if (!days.every((d) => (WEEKDAY_CODES as readonly string[]).includes(d))) {
      return { mode: 'unknown', raw: rrule };
    }
    return { mode: 'weekly', days, ...(interval ? { interval } : {}) };
  }

  if (freq === 'MONTHLY' && byMonthDay && !byDay && !byMonth) {
    if (!hasOnlyKeys('FREQ', 'BYMONTHDAY', 'INTERVAL')) return { mode: 'unknown', raw: rrule };
    if (!/^([1-9]|[12]\d|3[01])$/.test(byMonthDay)) return { mode: 'unknown', raw: rrule };
    const dom = parseInt(byMonthDay, 10);
    return { mode: 'monthly-date', dayOfMonth: dom, ...(interval ? { interval } : {}) };
  }

  if (freq === 'MONTHLY' && byDay && !byMonthDay && !byMonth) {
    if (!hasOnlyKeys('FREQ', 'BYDAY', 'INTERVAL')) return { mode: 'unknown', raw: rrule };
    // e.g. BYDAY=1SA (first Saturday) or BYDAY=-1MO (last Monday)
    const m = byDay.match(/^([+-]?\d+)([A-Z]{2})$/);
    if (!m) return { mode: 'unknown', raw: rrule };
    const nth = parseInt(m[1], 10);
    // Restrict to {1,2,3,4,-1}: the set the UI dropdown exposes.
    // recurrence.py accepts [+-]?[1-5], but values outside this set cannot be represented
    // in the edit form without silently corrupting the nth value on save.
    // Values like -2..-5 and 5 are returned as 'unknown' (round-trip preserved via raw pass-through).
    if (![1, 2, 3, 4, -1].includes(nth)) return { mode: 'unknown', raw: rrule };
    const day = m[2] as WeekdayCode;
    if (!(WEEKDAY_CODES as readonly string[]).includes(day)) return { mode: 'unknown', raw: rrule };
    return { mode: 'monthly-nth', nth, day, ...(interval ? { interval } : {}) };
  }

  if (freq === 'YEARLY' && byMonth && byMonthDay && !byDay) {
    if (!hasOnlyKeys('FREQ', 'BYMONTH', 'BYMONTHDAY', 'INTERVAL')) return { mode: 'unknown', raw: rrule };
    if (!/^([1-9]|1[0-2])$/.test(byMonth)) return { mode: 'unknown', raw: rrule };
    if (!/^([1-9]|[12]\d|3[01])$/.test(byMonthDay)) return { mode: 'unknown', raw: rrule };
    const month = parseInt(byMonth, 10);
    const dom = parseInt(byMonthDay, 10);
    return { mode: 'yearly', month, dayOfMonth: dom, ...(interval ? { interval } : {}) };
  }

  return { mode: 'unknown', raw: rrule };
}

/** Build RRULE string from structured form. */
export function buildRRule(parsed: Exclude<ParsedRecurrence, RecurrenceUnknown>): string {
  if (parsed.mode === 'none') return '';

  if (parsed.mode === 'daily') {
    let s = 'FREQ=DAILY';
    if (parsed.interval && parsed.interval > 1) s += `;INTERVAL=${parsed.interval}`;
    return s;
  }

  if (parsed.mode === 'weekly') {
    let s = `FREQ=WEEKLY;BYDAY=${parsed.days.join(',')}`;
    if (parsed.interval && parsed.interval > 1) s += `;INTERVAL=${parsed.interval}`;
    return s;
  }

  if (parsed.mode === 'monthly-date') {
    let s = `FREQ=MONTHLY;BYMONTHDAY=${parsed.dayOfMonth}`;
    if (parsed.interval && parsed.interval > 1) s += `;INTERVAL=${parsed.interval}`;
    return s;
  }

  if (parsed.mode === 'monthly-nth') {
    const nth = `${parsed.nth}`;
    let s = `FREQ=MONTHLY;BYDAY=${nth}${parsed.day}`;
    if (parsed.interval && parsed.interval > 1) s += `;INTERVAL=${parsed.interval}`;
    return s;
  }

  if (parsed.mode === 'yearly') {
    let s = `FREQ=YEARLY;BYMONTH=${parsed.month};BYMONTHDAY=${parsed.dayOfMonth}`;
    if (parsed.interval && parsed.interval > 1) s += `;INTERVAL=${parsed.interval}`;
    return s;
  }

  return '';
}

/** Friendly summary for display next to the picker. */
export function friendlySummary(rrule: string): string {
  const parsed = parseRRule(rrule);
  if (parsed.mode === 'none') return 'One-off (no repeat)';
  if (parsed.mode === 'unknown') return 'Custom recurrence (not editable here)';

  const interval = 'interval' in parsed && parsed.interval ? parsed.interval : 1;

  if (parsed.mode === 'daily') {
    return interval === 1 ? 'Daily' : `Every ${interval} days`;
  }

  if (parsed.mode === 'weekly') {
    const dayNames: Record<WeekdayCode, string> = {
      MO: 'Mon', TU: 'Tue', WE: 'Wed', TH: 'Thu', FR: 'Fri', SA: 'Sat', SU: 'Sun',
    };
    const days = parsed.days.map((d) => dayNames[d]).join(', ');
    return interval === 1 ? `Weekly on ${days}` : `Every ${interval} weeks on ${days}`;
  }

  if (parsed.mode === 'monthly-date') {
    const suffix = ordinalSuffix(parsed.dayOfMonth);
    return interval === 1
      ? `Monthly on the ${parsed.dayOfMonth}${suffix}`
      : `Every ${interval} months on the ${parsed.dayOfMonth}${suffix}`;
  }

  if (parsed.mode === 'monthly-nth') {
    const nth = nthLabel(parsed.nth);
    const dayNames: Record<WeekdayCode, string> = {
      MO: 'Monday', TU: 'Tuesday', WE: 'Wednesday', TH: 'Thursday',
      FR: 'Friday', SA: 'Saturday', SU: 'Sunday',
    };
    return interval === 1
      ? `Monthly on the ${nth} ${dayNames[parsed.day]}`
      : `Every ${interval} months on the ${nth} ${dayNames[parsed.day]}`;
  }

  if (parsed.mode === 'yearly') {
    const monthNames = [
      '', 'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const suffix = ordinalSuffix(parsed.dayOfMonth);
    return interval === 1
      ? `Yearly on ${monthNames[parsed.month]} ${parsed.dayOfMonth}${suffix}`
      : `Every ${interval} years on ${monthNames[parsed.month]} ${parsed.dayOfMonth}${suffix}`;
  }

  return '';
}

function ordinalSuffix(n: number): string {
  if (n >= 11 && n <= 13) return 'th';
  switch (n % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

function nthLabel(n: number): string {
  if (n === -1) return 'last';
  if (n === 1) return '1st';
  if (n === 2) return '2nd';
  if (n === 3) return '3rd';
  return `${n}th`;
}
