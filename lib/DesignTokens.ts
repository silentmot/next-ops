// ============================================================================
// COLOR SYSTEM
// ============================================================================

/**
 * Color Palette - Dark Theme (Primary)
 * Source: DeskOps-DashboardGuide.md Lines 21-45
 * Converted from rgba to oklch format
 */
export const DarkTheme = {
  background: {
    primary: "oklch(0.15 0.06 264)", // rgba(10, 14, 39, 1) - Deep Navy
    secondary: "oklch(0.20 0.05 264)", // rgba(26, 31, 58, 1) - Slate Navy
    tertiary: "oklch(0.26 0.05 270)", // rgba(37, 46, 74, 1) - Purple-Tinted Navy
    glass: "oklch(1 0 0 / 0.05)", // rgba(255, 255, 255, 0.05) - Glass Surface
  },
  text: {
    primary: "oklch(0.96 0.01 264)", // rgba(241, 245, 249, 1) - Off-White
    secondary: "oklch(0.86 0.01 264)", // rgba(203, 213, 225, 1) - Light Gray
    tertiary: "oklch(0.70 0.01 264)", // rgba(148, 163, 184, 1) - Muted Gray
    interactive: "oklch(1 0 0)", // rgba(255, 255, 255, 1) - Pure White on Hover
  },
  accent: {
    emerald: {
      from: "oklch(0.75 0.17 166)", // rgba(52, 211, 153, 1) - Primary Gradient Start
      to: "oklch(0.78 0.15 195)", // rgba(34, 211, 238, 1) - Primary Gradient End
    },
    violet: {
      from: "oklch(0.60 0.24 293)", // rgba(139, 92, 246, 1) - Secondary Gradient Start
      to: "oklch(0.65 0.27 340)", // rgba(236, 72, 153, 1) - Secondary Gradient End
    },
    orange: {
      from: "oklch(0.73 0.16 50)", // rgba(251, 146, 60, 1) - Tertiary Gradient Start
      to: "oklch(0.70 0.18 45)", // rgba(249, 115, 22, 1) - Tertiary Gradient End
    },
  },
  status: {
    success: "oklch(0.65 0.20 158)", // rgba(16, 185, 129, 1) - Emerald
    warning: "oklch(0.70 0.16 70)", // rgba(245, 158, 11, 1) - Amber
    critical: "oklch(0.58 0.23 25)", // rgba(239, 68, 68, 1) - Red
    info: "oklch(0.60 0.19 251)", // rgba(59, 130, 246, 1) - Blue
  },
} as const;

/**
 * Color Palette - Light Theme (Secondary)
 * Source: DeskOps-DashboardGuide.md Lines 47-60
 * Converted from rgba to oklch format
 */
export const LightTheme = {
  background: {
    primary: "oklch(0.98 0.01 264)", // rgba(248, 250, 252, 1) - Off-White
    secondary: "oklch(0.96 0.01 264)", // rgba(241, 245, 249, 1) - Light Blue-Gray
    tertiary: "oklch(0.92 0.01 264)", // rgba(226, 232, 240, 1) - Light Slate
    glass: "oklch(1 0 0 / 0.8)", // rgba(255, 255, 255, 0.8) - Glass Surface
  },
  text: {
    primary: "oklch(0.18 0.02 264)", // rgba(15, 23, 42, 1) - Near Black
    secondary: "oklch(0.30 0.02 264)", // rgba(51, 65, 85, 1) - Dark Gray
    tertiary: "oklch(0.50 0.02 264)", // rgba(100, 116, 139, 1) - Medium Gray
  },
  accent: DarkTheme.accent, // Accent colors remain consistent
  status: DarkTheme.status, // Status colors remain consistent
} as const;

// ============================================================================
// TYPOGRAPHY SYSTEM
// ============================================================================

/**
 * Typography Scaling Factor
 * Source: Enhanced typography system specification
 * Used for calculating font sizes in a modular scale
 */
export const TextScaling = 1.067 as const;

/**
 * Font Families
 * Source: Enhanced typography system
 * Base: Avenir, Montserrat, Corbel, 'URW Gothic', source-sans-pro, sans-serif
 * Mono: Geist Mono (preserved for code blocks)
 */
export const FontFamily = {
  base: "var(--base-font-family)",
  heading: "var(--heading-font-family)",
  anchor: "var(--anchor-font-family)",
  sans: "Avenir, Montserrat, Corbel, 'URW Gothic', source-sans-pro, sans-serif",
  mono: "var(--font-geist-mono)",
} as const;

/**
 * Font Sizes
 * Source: Modular scale based on text-scaling: 1.067
 * Base font size: 1rem (16px)
 */
export const FontSize = {
  xs: "0.75rem", // 12px
  sm: "0.875rem", // 14px
  base: "1rem", // 16px - Base size
  lg: "1.067rem", // ~17px - 1 step up
  xl: "1.138rem", // ~18.2px - 2 steps up
  "2xl": "1.214rem", // ~19.4px - 3 steps up
  "3xl": "1.295rem", // ~20.7px - 4 steps up
  "4xl": "1.382rem", // ~22.1px - 5 steps up
  "5xl": "1.475rem", // ~23.6px - 6 steps up
  "6xl": "1.574rem", // ~25.2px - 7 steps up
} as const;

/**
 * Font Weights
 * Source: Enhanced typography system
 */
export const FontWeight = {
  normal: 400, // var(--base-font-weight)
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

/**
 * Line Heights
 * Source: Enhanced typography system with inherit support
 */
export const LineHeight = {
  tight: 1.2,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
  inherit: "inherit", // var(--base-line-height)
} as const;

/**
 * Letter Spacing
 * Source: Enhanced typography system
 */
export const LetterSpacing = {
  tighter: "-0.05em",
  tight: "-0.025em",
  normal: "0em", // var(--base-letter-spacing)
  wide: "0.025em",
  wider: "0.05em",
  inherit: "inherit", // var(--heading-letter-spacing), var(--anchor-letter-spacing)
} as const;

// ============================================================================
// SPACING SYSTEM
// ============================================================================

/**
 * Spacing Scale
 * Source: Lines 161-182 (padding: 24px) and standard 4px base unit
 */
export const Spacing = {
  px: "1px",
  0: "0",
  0.5: "0.125rem", // 2px
  1: "0.25rem", // 4px
  1.5: "0.375rem", // 6px
  2: "0.5rem", // 8px - Line 1030: IconButton padding
  2.5: "0.625rem", // 10px
  3: "0.75rem", // 12px
  3.5: "0.875rem", // 14px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px - Line 166: Glass container padding
  7: "1.75rem", // 28px
  8: "2rem", // 32px
  9: "2.25rem", // 36px
  10: "2.5rem", // 40px
  11: "2.75rem", // 44px
  12: "3rem", // 48px
  14: "3.5rem", // 56px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  32: "8rem", // 128px
  40: "10rem", // 160px
  48: "12rem", // 192px
  56: "14rem", // 224px
  64: "16rem", // 256px
} as const;

// ============================================================================
// BORDER RADIUS SYSTEM
// ============================================================================

/**
 * Border Radius Values
 * Source: Line 125 (rounded-2xl), Line 165 (border-radius: 20px)
 */
export const BorderRadius = {
  none: "0",
  sm: "0.25rem", // 4px
  base: "0.5rem", // 8px
  md: "0.75rem", // 12px
  lg: "1rem", // 16px
  xl: "1.25rem", // 20px - Line 165, Line 1030: Glass container and buttons
  "2xl": "1.25rem", // 20px - Line 125: MetricCard specification
  "3xl": "1.5rem", // 24px
  full: "9999px",
} as const;

// ============================================================================
// SHADOW SYSTEM
// ============================================================================

/**
 * Box Shadow Tokens
 * Source: Lines 169-180 (Glass container shadows) + tokens.ts Lines 160-171
 */
export const BoxShadow = {
  none: "none",
  sm: "0 1px 2px 0 oklch(0 0 0 / 0.05)",
  base: "0 1px 3px 0 oklch(0 0 0 / 0.1), 0 1px 2px -1px oklch(0 0 0 / 0.1)",
  md: "0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px oklch(0 0 0 / 0.1), 0 4px 6px -4px oklch(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px oklch(0 0 0 / 0.1), 0 8px 10px -6px oklch(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px oklch(0 0 0 / 0.25)",

  // Glass morphism specific shadows - Lines 169-180
  glass: "0 8px 32px oklch(0 0 0 / 0.1), inset 1px 1px 0 oklch(1 0 0 / 0.2)",
  glassHover:
    "0 20px 48px oklch(0 0 0 / 0.2), inset 1px 1px 0 oklch(1 0 0 / 0.3)",

  // Glow effects - Lines 311-317 + tokens.ts Lines 160-164
  glowEmerald: "0 0 20px oklch(0.65 0.20 158 / 0.3)", // Emerald glow
  glowViolet: "0 0 20px oklch(0.60 0.24 293 / 0.3)", // Violet glow
  glowAmber: "0 0 20px oklch(0.70 0.16 70 / 0.3)", // Amber glow
  glowCritical: "0 0 20px oklch(0.58 0.23 25 / 0.3)", // Red glow

  // Enhanced glow system - tokens.ts Lines 160-164
  glow: {
    subtle: "0 0 10px oklch(0.5861 0.203 264.05 / 0.1)", // tokens.ts Line 161
    medium: "0 0 20px oklch(0.5861 0.203 264.05 / 0.2)", // tokens.ts Line 162
    strong: "0 0 30px oklch(0.5861 0.203 264.05 / 0.3)", // tokens.ts Line 163
  },

  // Branded shadows - tokens.ts Lines 167-171
  brand: {
    primary: "0 4px 20px oklch(0.5861 0.203 264.05 / 0.3)", // tokens.ts Line 168
    secondary: "0 4px 20px oklch(0.6652 0.241 307.73 / 0.3)", // tokens.ts Line 169
    accent: "0 4px 20px oklch(0.6569 0.241 3.18 / 0.3)", // tokens.ts Line 170
  },

  inner: "inset 0 2px 4px 0 oklch(0 0 0 / 0.05)",
} as const;

// ============================================================================
// BACKDROP FILTER SYSTEM
// ============================================================================

/**
 * Backdrop Blur Values
 * Source: Lines 167, 295-299 (Glass effects)
 */
export const BackdropBlur = {
  none: "none",
  sm: "blur(4px)", // Line 297: glass-sm
  base: "blur(8px)",
  md: "blur(10px)", // Line 167, Line 298: glass-md, Glass container default
  lg: "blur(20px)", // Line 299: glass-lg
  xl: "blur(24px)",
  "2xl": "blur(40px)",
  "3xl": "blur(64px)",
} as const;

/**
 * Backdrop Saturation
 * Source: Line 167 (saturate(180%))
 */
export const BackdropSaturate = {
  0: "saturate(0)",
  50: "saturate(.5)",
  100: "saturate(1)",
  150: "saturate(1.5)",
  180: "saturate(1.8)", // Line 167: Glass container saturation
  200: "saturate(2)",
} as const;

/**
 * Border Width
 * Source: Line 163 (border: 1px)
 */
export const BorderWidth = {
  0: "0",
  1: "1px", // Line 123, Line 163: Default border width
  2: "2px",
  4: "4px",
  8: "8px",
} as const;

/**
 * Border Colors - Dark Theme
 * Source: Lines 163, 176 (Glass container borders)
 */
export const BorderColor = {
  dark: {
    base: "oklch(1 0 0 / 0.1)", // Line 163: rgba(255, 255, 255, 0.1)
    hover: "oklch(1 0 0 / 0.15)", // Line 176: rgba(255, 255, 255, 0.15)
    focus: "oklch(1 0 0 / 0.2)",
  },
  light: {
    base: "oklch(0 0 0 / 0.1)",
    hover: "oklch(0 0 0 / 0.15)",
    focus: "oklch(0 0 0 / 0.2)",
  },
} as const;

/**
 * Border Opacity Levels
 * Source: tokens.ts Lines 58-64
 * Specialized opacity values for borders
 */
export const BorderOpacity = {
  subtle: "oklch(1 0 0 / 0.08)", // tokens.ts Line 60
  light: "oklch(1 0 0 / 0.1)", // tokens.ts Line 61
  medium: "oklch(1 0 0 / 0.15)", // tokens.ts Line 62
  strong: "oklch(1 0 0 / 0.2)", // tokens.ts Line 63
} as const;

// ============================================================================
// ANIMATION SYSTEM
// ============================================================================

/**
 * Animation Durations
 * Source: Lines 186-207 (Animation specifications)
 */
export const Duration = {
  instant: "0ms",
  fast: "150ms", // Line 204: Chart tooltip fade-in
  normal: "300ms", // Line 172: Glass container transition
  medium: "400ms", // Line 190: Entrance animation duration
  slow: "600ms",
  counter: "1200ms", // Line 199: Number counter duration
  shimmer: "2000ms", // Line 206: Loading skeleton wave
  pulse: "3000ms", // Line 203: Sparkline dots pulse
  gradient: "8000ms", // Line 330: Gradient shift animation
} as const;

/**
 * Animation Easing Functions
 * Source: Lines 172, 192 (Cubic bezier functions)
 */
export const Easing = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  smooth: "cubic-bezier(0.4, 0, 0.2, 1)", // Line 172: Glass container transition
  elastic: "cubic-bezier(0.23, 1, 0.320, 1)", // Line 192: Entrance animation easing
  spring: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
} as const;

/**
 * Animation Delays
 * Source: Line 191 (Stagger effect: 50ms between cards)
 */
export const Delay = {
  0: "0ms",
  50: "50ms", // Line 191: Stagger delay
  100: "100ms",
  150: "150ms",
  200: "200ms",
  300: "300ms",
  500: "500ms",
  700: "700ms",
  1000: "1000ms",
} as const;

/**
 * Transform Scale Values
 * Source: Lines 196-197 (Hover scale specifications) + tokens.ts Lines 193-198
 */
export const Scale = {
  0: "0",
  50: "0.5",
  75: "0.75",
  90: "0.9",
  95: "0.95", // Line 1040: IconButton whileTap
  100: "1",
  102: "1.02", // Line 196: Card hover scale
  105: "1.05", // Line 1039: IconButton whileHover
  110: "1.1",
  115: "1.15", // tokens.ts Line 197: large scale
  125: "1.25",
  150: "1.5",
  200: "2",

  // Semantic scale names - tokens.ts Lines 193-198
  subtle: "1.02", // tokens.ts Line 194
  small: "1.05", // tokens.ts Line 195
  medium: "1.1", // tokens.ts Line 196
  large: "1.15", // tokens.ts Line 197
} as const;

// ============================================================================
// GRADIENT SYSTEM
// ============================================================================

/**
 * Gradient Definitions
 * Source: Lines 31-34 (Accent color gradients) + tokens.ts Lines 28-39 (Feature & Auth gradients)
 */
export const Gradient = {
  primary: {
    direction: "135deg",
    from: DarkTheme.accent.emerald.from, // Line 32
    to: DarkTheme.accent.emerald.to, // Line 32
    css: `linear-gradient(135deg, ${DarkTheme.accent.emerald.from}, ${DarkTheme.accent.emerald.to})`,
  },
  secondary: {
    direction: "135deg",
    from: DarkTheme.accent.violet.from, // Line 33
    to: DarkTheme.accent.violet.to, // Line 33
    css: `linear-gradient(135deg, ${DarkTheme.accent.violet.from}, ${DarkTheme.accent.violet.to})`,
  },
  tertiary: {
    direction: "135deg",
    from: DarkTheme.accent.orange.from, // Line 34
    to: DarkTheme.accent.orange.to, // Line 34
    css: `linear-gradient(135deg, ${DarkTheme.accent.orange.from}, ${DarkTheme.accent.orange.to})`,
  },
  // Additional utility gradients
  emeraldGlow: {
    direction: "135deg",
    from: "oklch(0.65 0.20 158)",
    to: "oklch(0.75 0.17 166)",
    css: `linear-gradient(135deg, oklch(0.65 0.20 158), oklch(0.75 0.17 166))`,
  },
  violetGlow: {
    direction: "135deg",
    from: "oklch(0.60 0.24 293)",
    to: "oklch(0.65 0.27 340)",
    css: `linear-gradient(135deg, oklch(0.60 0.24 293), oklch(0.65 0.27 340))`,
  },

  // Feature-specific gradients
  // Source: tokens.ts Lines 28-33
  secure: {
    direction: "135deg",
    from: "oklch(0.6831 0.158 165.38)", // tokens.ts Line 30: emerald
    to: "oklch(0.7113 0.144 193.14)", // tokens.ts Line 30: teal
    css: "linear-gradient(135deg, oklch(0.6831 0.158 165.38) 0%, oklch(0.7113 0.144 193.14) 100%)",
  },
  fast: {
    direction: "135deg",
    from: "oklch(0.7927 0.153 96.96)", // tokens.ts Line 31: yellow
    to: "oklch(0.7128 0.199 44.6)", // tokens.ts Line 31: orange
    css: "linear-gradient(135deg, oklch(0.7927 0.153 96.96) 0%, oklch(0.7128 0.199 44.6) 100%)",
  },
  beautiful: {
    direction: "135deg",
    from: "oklch(0.6569 0.241 3.18)", // tokens.ts Line 33: pink
    to: "oklch(0.6341 0.241 14.13)", // tokens.ts Line 33: rose
    css: "linear-gradient(135deg, oklch(0.6569 0.241 3.18) 0%, oklch(0.6341 0.241 14.13) 100%)",
  },

  // Authentication gradients
  // Source: tokens.ts Lines 35-39
  signIn: {
    direction: "135deg",
    from: "oklch(0.5598 0.155 254.62)", // tokens.ts Line 37: blue
    to: "oklch(0.5861 0.203 264.05)", // tokens.ts Line 37: indigo
    css: "linear-gradient(135deg, oklch(0.5598 0.155 254.62) 0%, oklch(0.5861 0.203 264.05) 100%)",
  },
  signUp: {
    direction: "135deg",
    from: "oklch(0.6652 0.241 307.73)", // tokens.ts Line 39: purple
    to: "oklch(0.6954 0.262 316.8)", // tokens.ts Line 39: purple bright
    css: "linear-gradient(135deg, oklch(0.6652 0.241 307.73) 0%, oklch(0.6954 0.262 316.8) 100%)",
  },

  // Multi-color gradient for vibrant displays
  rainbow: {
    direction: "135deg",
    from: DarkTheme.accent.emerald.from,
    to: DarkTheme.accent.violet.to,
    css: `linear-gradient(135deg, ${DarkTheme.accent.emerald.from} 0%, ${DarkTheme.accent.violet.from} 50%, ${DarkTheme.accent.orange.from} 100%)`,
  },
} as const;

// ============================================================================
// OPACITY SYSTEM
// ============================================================================

/**
 * Opacity Values
 * Source: Various references throughout the document + tokens.ts Lines 50-64
 */
export const Opacity = {
  0: "0",
  3: "0.03", // tokens.ts Line 52: Glass subtle
  5: "0.05", // Line 28: Glass surface
  8: "0.08", // Line 180: Glass container hover
  10: "0.1",
  12: "0.12", // tokens.ts Line 55: Glass strong
  15: "0.15", // tokens.ts Line 62: Border medium
  20: "0.2",
  30: "0.3",
  40: "0.4",
  50: "0.5",
  60: "0.6",
  70: "0.7",
  80: "0.8", // Line 54: Light theme glass surface
  90: "0.9",
  95: "0.95",
  100: "1",
} as const;

/**
 * Glass Transparency Levels
 * Source: tokens.ts Lines 50-56
 * Specialized opacity values for glass morphism effects
 */
export const GlassOpacity = {
  subtle: "oklch(1 0 0 / 0.03)", // tokens.ts Line 52
  light: "oklch(1 0 0 / 0.05)", // tokens.ts Line 53
  medium: "oklch(1 0 0 / 0.08)", // tokens.ts Line 54
  strong: "oklch(1 0 0 / 0.12)", // tokens.ts Line 55
} as const;

/**
 * Z-Index Layers
 * Source: Inferred from component hierarchy + tokens.ts Lines 215, 224
 */
export const ZIndex = {
  behind: -1, // tokens.ts Line 215
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080, // tokens.ts Line 224
} as const;

// ============================================================================
// GRID & LAYOUT SYSTEM
// ============================================================================

/**
 * Grid Configuration
 * Source: Lines 210-218 (Metrics dashboard layout)
 */
export const Grid = {
  columns: {
    1: "1",
    2: "2",
    3: "3",
    4: "4", // Line 214: Row 1 - 4 KPI Cards
    5: "5",
    6: "6",
    12: "12",
  },
  rows: {
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5", // Line 218: Dashboard has 5 rows
    6: "6",
    auto: "auto",
  },
  gap: {
    xs: Spacing["2"], // 8px
    sm: Spacing["4"], // 16px
    md: Spacing["6"], // 24px
    lg: Spacing["8"], // 32px
    xl: Spacing["10"], // 40px
  },
} as const;

/**
 * Breakpoints
 * Source: Line 15 (Responsiveness: Mobile-first, desktop-optimized at 1920px+)
 */
export const Breakpoints = {
  xs: "320px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
  "3xl": "1920px", // Line 15: Desktop-optimized breakpoint
} as const;

/**
 * Container Max Widths
 * Source: Aligned with breakpoints
 */
export const Container = {
  xs: Breakpoints.xs,
  sm: Breakpoints.sm,
  md: Breakpoints.md,
  lg: Breakpoints.lg,
  xl: Breakpoints.xl,
  "2xl": Breakpoints["2xl"],
  "3xl": Breakpoints["3xl"],
} as const;

// ============================================================================
// COMPONENT-SPECIFIC TOKENS
// ============================================================================

/**
 * Chart Heights
 * Source: Line 134 (Configurable height: 300px, 400px, 500px)
 */
export const ChartHeight = {
  sm: "300px", // Line 134
  md: "400px", // Line 134
  lg: "500px", // Line 134
} as const;

/**
 * Icon Sizes
 * Source: Lines 336-889 (Icon system specifications)
 */
export const IconSize = {
  xs: "12px",
  sm: "16px", // Line 1127: Small icon button
  md: "20px", // Line 919: Default icon size
  lg: "24px", // Line 1077: Metric card icon
  xl: "32px",
  "2xl": "48px",
} as const;

/**
 * Card Variants
 * Source: Line 156 (Variants: solid, gradient, interactive)
 */
export const CardVariant = {
  solid: "solid",
  gradient: "gradient",
  interactive: "interactive",
} as const;

/**
 * Button Variants
 * Source: Lines 1014-1020 (IconButton variants)
 */
export const ButtonVariant = {
  ghost: "ghost", // Line 1015
  solid: "solid", // Line 1016
  outline: "outline", // Line 1017
  gradient: "gradient", // Line 1018-1019
} as const;

/**
 * Focus Ring Configuration
 * Source: Lines 1033-1034 (Focus-visible ring)
 */
export const FocusRing = {
  width: "2px",
  offset: "2px",
  color: DarkTheme.status.success, // Line 1034: emerald-500
  style: "solid",
} as const;

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

/**
 * Framer Motion Animation Presets
 * Source: Lines 925-947 (AnimatedIcon variants)
 */
export const AnimationVariant = {
  pulse: {
    scale: [1, 1.1, 1], // Line 927
    opacity: [1, 0.7, 1], // Line 928
    timing: Duration.pulse, // Line 929: 2s duration
  },
  spin: {
    rotate: [0, 360], // Line 932
    timing: Duration.pulse, // Line 933
  },
  bounce: {
    y: [0, -8, 0], // Line 936
    timing: Duration.pulse, // Line 937
  },
  wave: {
    rotate: [0, 15, -15, 0], // Line 940
    timing: Duration.pulse, // Line 941
  },
  flip: {
    rotateY: [0, 360], // Line 944
    timing: Duration.pulse, // Line 945
  },
} as const;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Theme Type Definition
 */
export type Theme = typeof DarkTheme;
export type ThemeMode = "dark" | "light";

/**
 * Design Token Types
 */
export type FontSizeKey = keyof typeof FontSize;
export type FontWeightKey = keyof typeof FontWeight;
export type LineHeightKey = keyof typeof LineHeight;
export type LetterSpacingKey = keyof typeof LetterSpacing;
export type SpacingKey = keyof typeof Spacing;
export type BorderRadiusKey = keyof typeof BorderRadius;
export type BoxShadowKey = keyof typeof BoxShadow;
export type BackdropBlurKey = keyof typeof BackdropBlur;
export type DurationKey = keyof typeof Duration;
export type EasingKey = keyof typeof Easing;
export type ScaleKey = keyof typeof Scale;
export type IconSizeKey = keyof typeof IconSize;
export type BreakpointKey = keyof typeof Breakpoints;
export type GradientKey = keyof typeof Gradient;
export type GlassOpacityKey = keyof typeof GlassOpacity;
export type BorderOpacityKey = keyof typeof BorderOpacity;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get theme based on mode
 * Source: Lines 275-286 (Theme toggle implementation)
 */
export function getTheme(
  mode: ThemeMode,
): typeof DarkTheme | typeof LightTheme {
  return mode === "dark" ? DarkTheme : LightTheme;
}

/**
 * Get responsive value based on breakpoint
 */
export function getResponsiveValue<T>(
  values: Partial<Record<BreakpointKey, T>>,
  breakpoint: BreakpointKey,
): T | undefined {
  return values[breakpoint];
}

/**
 * Compose backdrop filter string
 * Source: Line 167 (backdrop-filter: blur(10px) saturate(180%))
 */
export function composeBackdropFilter(
  blur: BackdropBlurKey,
  saturate: keyof typeof BackdropSaturate = 180,
): string {
  return `${BackdropBlur[blur]} ${BackdropSaturate[saturate]}`;
}

/**
 * Generate glass morphism styles
 * Source: Lines 161-182 (Glass container base styles)
 */
export function getGlassMorphismStyles(variant: "sm" | "md" | "lg" = "md") {
  const blurMap = {
    sm: "sm" as BackdropBlurKey,
    md: "md" as BackdropBlurKey,
    lg: "lg" as BackdropBlurKey,
  };

  return {
    background: DarkTheme.background.glass,
    border: `${BorderWidth["1"]} solid ${BorderColor.dark.base}`,
    borderRadius: BorderRadius["2xl"],
    padding: Spacing["6"],
    backdropFilter: composeBackdropFilter(blurMap[variant], 180),
    WebkitBackdropFilter: composeBackdropFilter(blurMap[variant], 180),
    boxShadow: BoxShadow.glass,
    transition: `all ${Duration.normal} ${Easing.smooth}`,
  };
}

/**
 * Get gradient CSS string
 */
export function getGradientCSS(gradientKey: keyof typeof Gradient): string {
  return Gradient[gradientKey].css;
}

// ============================================================================
// EXPORT ALL TOKENS
// ============================================================================

export const DesignTokens = {
  // Themes
  theme: {
    dark: DarkTheme,
    light: LightTheme,
  },

  // Typography
  typography: {
    textScaling: TextScaling,
    fontFamily: FontFamily,
    fontSize: FontSize,
    fontWeight: FontWeight,
    lineHeight: LineHeight,
    letterSpacing: LetterSpacing,
  },

  // Spacing & Layout
  spacing: Spacing,
  borderRadius: BorderRadius,
  grid: Grid,
  breakpoints: Breakpoints,
  container: Container,

  // Visual Effects
  boxShadow: BoxShadow,
  backdropBlur: BackdropBlur,
  backdropSaturate: BackdropSaturate,
  opacity: Opacity,
  glassOpacity: GlassOpacity,
  borderOpacity: BorderOpacity,

  // Borders
  borderWidth: BorderWidth,
  borderColor: BorderColor,

  // Animations
  duration: Duration,
  easing: Easing,
  delay: Delay,
  scale: Scale,
  animationVariant: AnimationVariant,

  // Colors (Convenient access API for components)
  colors: {
    // Brand colors for surfaces and primary UI elements
    brand: {
      primary: DarkTheme.accent.emerald.from,
      secondary: DarkTheme.accent.violet.from,
      accent: DarkTheme.accent.orange.from,
      surface: DarkTheme.background.secondary,
      surfaceElevated: DarkTheme.background.tertiary,
      surfaceHighlight: DarkTheme.background.glass,
    },
    // Gradient definitions (mapped for convenience)
    gradients: {
      primary: Gradient.primary.css,
      secondary: Gradient.secondary.css,
      tertiary: Gradient.tertiary.css,
      rainbow: Gradient.rainbow.css,
      secure: Gradient.secure.css,
      fast: Gradient.fast.css,
      beautiful: Gradient.beautiful.css,
      signIn: Gradient.signIn.css,
      signUp: Gradient.signUp.css,
    },
    // Glass morphism colors
    glass: {
      subtle: GlassOpacity.subtle,
      light: GlassOpacity.light,
      medium: GlassOpacity.medium,
      strong: GlassOpacity.strong,
    },
    // Border colors (dark theme)
    borders: {
      base: BorderColor.dark.base,
      hover: BorderColor.dark.hover,
      focus: BorderColor.dark.focus,
      subtle: BorderOpacity.subtle,
      light: BorderOpacity.light,
      medium: BorderOpacity.medium,
      strong: BorderOpacity.strong,
    },
    // Text colors (dark theme)
    text: {
      primary: DarkTheme.text.primary,
      secondary: DarkTheme.text.secondary,
      tertiary: DarkTheme.text.tertiary,
      interactive: DarkTheme.text.interactive,
    },
  },
  gradient: Gradient,

  // Z-Index
  zIndex: ZIndex,

  // Component-Specific
  chartHeight: ChartHeight,
  iconSize: IconSize,
  cardVariant: CardVariant,
  buttonVariant: ButtonVariant,

  // Accessibility
  focusRing: FocusRing,

  // Helpers
  helpers: {
    getTheme,
    getResponsiveValue,
    composeBackdropFilter,
    getGlassMorphismStyles,
    getGradientCSS,
  },
} as const;

// Default export
export default DesignTokens;
