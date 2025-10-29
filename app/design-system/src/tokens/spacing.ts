/**
 * Spacing Design Tokens
 * Source: DeskOps-DashboardGuide.md
 */

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
} as const;

export type SpacingScale = keyof typeof spacing;