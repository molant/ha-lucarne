const VELOCITY_THRESHOLD = 500; // px/s

/**
 * Snap a horizontal drag delta to the nearest whole day count.
 *
 * Returns a **px-direction** count: positive when the user dragged right,
 * negative when they dragged left. The caller (lucarne-calendar-card) inverts
 * the sign before calling `controller.pan()` to convert px-direction into
 * window-direction (positive = advance into the future).
 *
 * @param deltaPx  Raw horizontal pointer displacement (positive = finger moved right).
 * @param dayWidthPx  Width of one day column in px. Returns 0 if ≤ 0.
 * @param velocity  Instantaneous velocity in px/s. When |velocity| ≥ 500 px/s the
 *   snap rounds in the direction of motion regardless of distance ("flick to advance").
 */
export function snapToDay(deltaPx: number, dayWidthPx: number, velocity: number): number {
  if (dayWidthPx <= 0) return 0;
  if (Math.abs(velocity) >= VELOCITY_THRESHOLD) {
    return velocity > 0
      ? Math.ceil(deltaPx / dayWidthPx)
      : Math.floor(deltaPx / dayWidthPx);
  }
  return Math.round(deltaPx / dayWidthPx);
}

/**
 * Apply rubber-band resistance to an overshoot past a bound.
 *
 * Linear up to `maxPx`, then 1/3-rate beyond.
 *
 * @param deltaPx  Displacement (signed).
 * @param maxPx  The boundary magnitude. Must be ≥ 0.
 */
export function rubberBand(deltaPx: number, maxPx: number): number {
  if (Math.abs(deltaPx) <= maxPx) return deltaPx;
  const overshoot = Math.abs(deltaPx) - maxPx;
  return Math.sign(deltaPx) * (maxPx + overshoot * 0.33);
}
