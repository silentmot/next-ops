/**
 * Color Design Tokens
 * Source: DeskOps-DashboardGuide.md - DESIGN SYSTEM section
 */

export const colors = {
  dark: {
    background: {
      primary: 'rgba(10, 14, 39, 1)',
      secondary: 'rgba(26, 31, 58, 1)',
      tertiary: 'rgba(37, 46, 74, 1)',
      glass: 'rgba(255, 255, 255, 0.05)',
    },
    text: {
      primary: 'rgba(241, 245, 249, 1)',
      secondary: 'rgba(203, 213, 225, 1)',
      tertiary: 'rgba(148, 163, 184, 1)',
      interactive: 'rgba(255, 255, 255, 1)',
    },
    accent: {
      emerald: {
        start: 'rgba(52, 211, 153, 1)',
        end: 'rgba(34, 211, 238, 1)',
        solid: 'rgba(16, 185, 129, 1)',
      },
      violet: {
        start: 'rgba(139, 92, 246, 1)',
        end: 'rgba(236, 72, 153, 1)',
        solid: 'rgba(139, 92, 246, 1)',
      },
      amber: {
        start: 'rgba(251, 146, 60, 1)',
        end: 'rgba(249, 115, 22, 1)',
        solid: 'rgba(245, 158, 11, 1)',
      },
    },
    status: {
      success: 'rgba(16, 185, 129, 1)',
      warning: 'rgba(245, 158, 11, 1)',
      critical: 'rgba(239, 68, 68, 1)',
      info: 'rgba(59, 130, 246, 1)',
    },
  },
  light: {
    background: {
      primary: 'rgba(248, 250, 252, 1)',
      secondary: 'rgba(241, 245, 249, 1)',
      tertiary: 'rgba(226, 232, 240, 1)',
      glass: 'rgba(255, 255, 255, 0.8)',
    },
    text: {
      primary: 'rgba(15, 23, 42, 1)',
      secondary: 'rgba(51, 65, 85, 1)',
      tertiary: 'rgba(100, 116, 139, 1)',
      interactive: 'rgba(15, 23, 42, 1)',
    },
    accent: {
      emerald: {
        start: 'rgba(52, 211, 153, 1)',
        end: 'rgba(34, 211, 238, 1)',
        solid: 'rgba(5, 150, 105, 1)',
      },
      violet: {
        start: 'rgba(139, 92, 246, 1)',
        end: 'rgba(236, 72, 153, 1)',
        solid: 'rgba(124, 58, 237, 1)',
      },
      amber: {
        start: 'rgba(251, 146, 60, 1)',
        end: 'rgba(249, 115, 22, 1)',
        solid: 'rgba(217, 119, 6, 1)',
      },
    },
    status: {
      success: 'rgba(5, 150, 105, 1)',
      warning: 'rgba(217, 119, 6, 1)',
      critical: 'rgba(220, 38, 38, 1)',
      info: 'rgba(37, 99, 235, 1)',
    },
  },
} as const;

export type ColorTheme = 'dark' | 'light';
export type ColorCategory = keyof typeof colors.dark;