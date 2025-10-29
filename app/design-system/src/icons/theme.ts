/**
 * Icon Theme Configuration
 * Source: DeskOps-DashboardGuide.md - ICON COLOR SYSTEM
 */

export const IconColors = {
  dark: {
    primary: 'rgba(241, 245, 249, 1)',
    secondary: 'rgba(203, 213, 225, 1)',
    tertiary: 'rgba(148, 163, 184, 1)',
    accent: {
      emerald: 'rgba(16, 185, 129, 1)',
      violet: 'rgba(139, 92, 246, 1)',
      amber: 'rgba(245, 158, 11, 1)',
      blue: 'rgba(59, 130, 246, 1)',
      pink: 'rgba(236, 72, 153, 1)',
      cyan: 'rgba(6, 182, 212, 1)',
    },
    status: {
      success: 'rgba(16, 185, 129, 1)',
      warning: 'rgba(245, 158, 11, 1)',
      critical: 'rgba(239, 68, 68, 1)',
      info: 'rgba(59, 130, 246, 1)',
    },
  },
  light: {
    primary: 'rgba(15, 23, 42, 1)',
    secondary: 'rgba(51, 65, 85, 1)',
    tertiary: 'rgba(100, 116, 139, 1)',
    accent: {
      emerald: 'rgba(5, 150, 105, 1)',
      violet: 'rgba(124, 58, 237, 1)',
      amber: 'rgba(217, 119, 6, 1)',
      blue: 'rgba(37, 99, 235, 1)',
      pink: 'rgba(219, 39, 119, 1)',
      cyan: 'rgba(8, 145, 178, 1)',
    },
    status: {
      success: 'rgba(5, 150, 105, 1)',
      warning: 'rgba(217, 119, 6, 1)',
      critical: 'rgba(220, 38, 38, 1)',
      info: 'rgba(37, 99, 235, 1)',
    },
  },
} as const;

export const IconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
} as const;

export type IconSize = keyof typeof IconSizes;

export const IconStrokeWidths = {
  thin: 1,
  normal: 1.5,
  bold: 2,
  extra: 2.5,
} as const;

export type IconStrokeWidth = keyof typeof IconStrokeWidths;