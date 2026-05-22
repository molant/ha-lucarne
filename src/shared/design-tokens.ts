import { css } from 'lit';

export const LUCARNE_PALETTE: Record<string, string> = {
  family: '#a8d8b9',
  anton: '#a8c5e8',
  ingrid: '#c8b4e0',
  kid1: '#f5c89c',
  kid2: '#b8e0d2',
  kid3: '#f0b8c8',
  holidays: '#d4cfc4',
  birthdays: '#f0dca0',
  lesLilas: '#b8b4e8',
};

export const LUCARNE_SPACING = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  xxl: '32px',
} as const;

export const LUCARNE_RADII = {
  sm: '4px',
  md: '8px',
  lg: '16px',
} as const;

export const LUCARNE_TYPE_SCALE = {
  sm: 'clamp(0.75rem, 0.5vw + 0.5rem, 0.875rem)',
  md: 'clamp(0.875rem, 0.75vw + 0.6rem, 1rem)',
  lg: 'clamp(1rem, 1vw + 0.75rem, 1.25rem)',
  xl: 'clamp(1.25rem, 1.5vw + 0.875rem, 1.75rem)',
} as const;

export const LUCARNE_SHADOWS = {
  card: '0 1px 4px rgba(0,0,0,0.08)',
} as const;

export const lucarneStyles = css`
  :host {
    --lucarne-spacing-xs: 4px;
    --lucarne-spacing-sm: 8px;
    --lucarne-spacing-md: 12px;
    --lucarne-spacing-lg: 16px;
    --lucarne-spacing-xl: 24px;
    --lucarne-spacing-xxl: 32px;

    --lucarne-radius-sm: 4px;
    --lucarne-radius-md: 8px;
    --lucarne-radius-lg: 16px;

    --lucarne-fs-sm: clamp(0.75rem, 0.5vw + 0.5rem, 0.875rem);
    --lucarne-fs-md: clamp(0.875rem, 0.75vw + 0.6rem, 1rem);
    --lucarne-fs-lg: clamp(1rem, 1vw + 0.75rem, 1.25rem);
    --lucarne-fs-xl: clamp(1.25rem, 1.5vw + 0.875rem, 1.75rem);

    --lucarne-shadow-card: 0 1px 4px rgba(0, 0, 0, 0.08);

    --lucarne-color-family: #a8d8b9;
    --lucarne-color-anton: #a8c5e8;
    --lucarne-color-ingrid: #c8b4e0;
    --lucarne-color-holidays: #d4cfc4;
    --lucarne-color-birthdays: #f0dca0;
    --lucarne-color-les-lilas: #b8b4e8;

    --lucarne-surface: var(--ha-card-background, var(--card-background-color, #fff));
    --lucarne-on-surface: var(--primary-text-color, #212121);
    --lucarne-on-surface-muted: var(--secondary-text-color, #727272);
  }
`;
