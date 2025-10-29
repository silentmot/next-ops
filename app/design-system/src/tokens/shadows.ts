/**
 * Shadow Design Tokens
 * Source: DeskOps-DashboardGuide.md - Glass morphism specifications
 */

export const shadows = {
  glass: {
    default: '0 8px 32px rgba(0, 0, 0, 0.1), inset 1px 1px 0 rgba(255, 255, 255, 0.2)',
    hover: '0 20px 48px rgba(0, 0, 0, 0.2), inset 1px 1px 0 rgba(255, 255, 255, 0.3)',
  },
  glow: {
    emerald: '0 0 20px rgba(16, 185, 129, 0.3)',
    violet: '0 0 20px rgba(139, 92, 246, 0.3)',
    amber: '0 0 20px rgba(245, 158, 11, 0.3)',
    blue: '0 0 20px rgba(59, 130, 246, 0.3)',
  },
  elevation: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
  },
} as const;

export type ShadowType = keyof typeof shadows;