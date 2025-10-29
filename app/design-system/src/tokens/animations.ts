/**
 * Animation Design Tokens
 * Source: DeskOps-DashboardGuide.md - ANIMATION SPECIFICATIONS
 */

export const animations = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '400ms',
    counter: '1200ms',
    wave: '2000ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    elastic: 'cubic-bezier(0.23, 1, 0.320, 1)',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    linear: 'linear',
  },
  delay: {
    cascade: '50ms',
    stagger: '100ms',
  },
  scale: {
    hover: '1.02',
    click: '0.95',
  },
} as const;

export type AnimationDuration = keyof typeof animations.duration;
export type AnimationEasing = keyof typeof animations.easing;