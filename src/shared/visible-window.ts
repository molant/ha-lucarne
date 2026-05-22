/**
 * Configuration for the responsive visible-day-count algorithm.
 *
 * If minDays > maxDays or minColWidth > maxColWidth, the values are silently
 * swapped so the larger value becomes the effective max. This prevents invalid
 * configs from throwing; the card renders with a sane fallback instead.
 *
 * Worked examples (minDays=3, maxDays=7, minColWidth=140, maxColWidth=220, timeColWidth=40):
 *   containerWidth=720  → visibleCount=4,  dayWidthPx=170
 *   containerWidth=1080 → visibleCount=7,  dayWidthPx≈148.6
 *   containerWidth=1366 → visibleCount=7,  dayWidthPx≈189.4
 *   containerWidth=480  → visibleCount=3,  dayWidthPx≈146.6
 */
export interface VisibleWindowConfig {
  minDays: number;
  maxDays: number;
  minColWidth: number;
  maxColWidth: number;
  timeColWidth: number;
}

export interface VisibleWindowResult {
  visibleCount: number;
  dayWidthPx: number;
}

export function computeVisibleDays(
  containerWidth: number,
  cfg: VisibleWindowConfig,
): VisibleWindowResult {
  // Defensive: swap if inverted
  const minCol = Math.min(cfg.minColWidth, cfg.maxColWidth);
  const maxCol = Math.max(cfg.minColWidth, cfg.maxColWidth);
  const minD = Math.min(cfg.minDays, cfg.maxDays);
  const maxD = Math.max(cfg.minDays, cfg.maxDays);

  const available = Math.max(0, containerWidth - cfg.timeColWidth);
  if (available <= 0) {
    return { visibleCount: minD, dayWidthPx: minCol };
  }

  const maxFitting = Math.floor(available / minCol);   // largest N respecting min col
  const minFitting = Math.ceil(available / maxCol);    // smallest N respecting max col
  const visibleCount = Math.min(maxD, Math.max(minD, minFitting, Math.min(maxFitting, maxD)));
  const dayWidthPx = available / visibleCount;

  return { visibleCount, dayWidthPx };
}
