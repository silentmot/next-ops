/**
 * OPS Design System - Design Tokens
 * Museum-quality theming system
 * Created: October 29, 2025
 */

export const designTokens = {
  // Core Brand Colors
  colors: {
    brand: {
      primary: "oklch(58.61% 0.203 264.05)" as string,
      secondary: "oklch(66.52% 0.241 307.73)" as string,
      accent: "oklch(65.69% 0.241 3.18)" as string,
      surface: "oklch(11.37% 0.032 264.05)" as string,
      surfaceElevated: "oklch(25.62% 0.099 286.69)" as string,
      surfaceHighlight: "oklch(33.16% 0.114 286.69)" as string,
    },

    // Gradient Definitions
    gradients: {
      primary: "linear-gradient(135deg, oklch(58.61% 0.203 264.05) 0%, oklch(66.52% 0.241 307.73) 100%)" as string,
      rainbow:
        "linear-gradient(135deg, oklch(58.61% 0.203 264.05) 0%, oklch(66.52% 0.241 307.73) 50%, oklch(65.69% 0.241 3.18) 100%)" as string,
      surface:
        "linear-gradient(135deg, oklch(11.37% 0.032 264.05) 0%, oklch(25.62% 0.099 286.69) 50%, oklch(33.16% 0.114 286.69) 100%)" as string,

      // Feature-specific gradients
      secure: "linear-gradient(135deg, oklch(68.31% 0.158 165.38) 0%, oklch(71.13% 0.144 193.14) 100%)" as string, // emerald to teal
      fast: "linear-gradient(135deg, oklch(79.27% 0.153 96.96) 0%, oklch(71.28% 0.199 44.6) 100%)" as string, // yellow to orange
      beautiful: "linear-gradient(135deg, oklch(65.69% 0.241 3.18) 0%, oklch(63.41% 0.241 14.13) 100%)" as string, // pink to rose

      // Authentication gradients
      signIn: "linear-gradient(135deg, oklch(55.98% 0.155 254.62) 0%, oklch(58.61% 0.203 264.05) 100%)" as string, // blue to indigo
      signUp: "linear-gradient(135deg, oklch(66.52% 0.241 307.73) 0%, oklch(69.54% 0.262 316.8) 100%)" as string, // purple to purple
    },

    // Semantic Colors
    semantic: {
      success: "oklch(68.31% 0.158 165.38)",
      warning: "oklch(76.96% 0.164 79.52)",
      error: "oklch(62.8% 0.258 27.33)",
      info: "oklch(58.61% 0.203 264.05)",
    },

    // Glass/Transparency System
    glass: {
      subtle: "oklch(100% 0 none / 0.03)",
      light: "oklch(100% 0 none / 0.05)",
      medium: "oklch(100% 0 none / 0.08)",
      strong: "oklch(100% 0 none / 0.12)",
    },

    // Border System
    borders: {
      subtle: "oklch(100% 0 none / 0.08)",
      light: "oklch(100% 0 none / 0.1)",
      medium: "oklch(100% 0 none / 0.15)",
      strong: "oklch(100% 0 none / 0.2)",
    },

    // Text Colors
    text: {
      primary: "oklch(100% 0 none)",
      secondary: "oklch(100% 0 none / 0.8)",
      tertiary: "oklch(100% 0 none / 0.6)",
      muted: "oklch(100% 0 none / 0.4)",
    },
  },

  // Typography System
  typography: {
    fontFamily: {
      sans: '"Geist", -apple-system, BlinkMacSystemFont, sans-serif',
      mono: '"Geist Mono", "Fira Code", "Monaco", monospace',
    },

    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
      "6xl": "3.75rem", // 60px
      "7xl": "4.5rem", // 72px
    },

    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },

    lineHeight: {
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },

    letterSpacing: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0em",
      wide: "0.025em",
      wider: "0.05em",
    },
  },

  // Spacing System
  spacing: {
    px: "1px",
    0: "0",
    1: "0.25rem", // 4px
    2: "0.5rem", // 8px
    3: "0.75rem", // 12px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    8: "2rem", // 32px
    10: "2.5rem", // 40px
    12: "3rem", // 48px
    16: "4rem", // 64px
    20: "5rem", // 80px
    24: "6rem", // 96px
    32: "8rem", // 128px
  },

  // Border Radius System
  borderRadius: {
    none: "0",
    sm: "0.25rem", // 4px
    base: "0.5rem", // 8px
    md: "0.75rem", // 12px
    lg: "1rem", // 16px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    full: "9999px",
  },

  // Shadow System
  shadows: {
    subtle: "0 1px 3px oklch(0% 0 none / 0.1)",
    soft: "0 4px 6px oklch(0% 0 none / 0.1)",
    medium: "0 10px 15px oklch(0% 0 none / 0.1)",
    large: "0 20px 25px oklch(0% 0 none / 0.1)",
    xl: "0 25px 50px oklch(0% 0 none / 0.2)",

    // Glow effects
    glow: {
      subtle: "0 0 10px oklch(58.61% 0.203 264.05 / 0.1)",
      medium: "0 0 20px oklch(58.61% 0.203 264.05 / 0.2)",
      strong: "0 0 30px oklch(58.61% 0.203 264.05 / 0.3)",
    },

    // Branded shadows
    brand: {
      primary: "0 4px 20px oklch(58.61% 0.203 264.05 / 0.3)",
      secondary: "0 4px 20px oklch(66.52% 0.241 307.73 / 0.3)",
      accent: "0 4px 20px oklch(65.69% 0.241 3.18 / 0.3)",
    },
  },

  // Animation System
  animation: {
    duration: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
      slower: "750ms",
    },

    easing: {
      linear: "linear",
      ease: "ease",
      easeIn: "ease-in",
      easeOut: "ease-out",
      easeInOut: "ease-in-out",
      spring: "cubic-bezier(0.4, 0, 0.2, 1)",
      bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    },

    scale: {
      subtle: "1.02",
      small: "1.05",
      medium: "1.1",
      large: "1.15",
    },
  },

  // Backdrop Effects
  backdrop: {
    blur: {
      none: "blur(0)",
      sm: "blur(4px)",
      base: "blur(8px)",
      md: "blur(12px)",
      lg: "blur(16px)",
      xl: "blur(24px)",
    },
  },

  // Z-Index System
  zIndex: {
    behind: -1,
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    toast: 1080,
  },
} as const;

// Type exports for TypeScript
export type DesignTokens = typeof designTokens;
export type ColorTokens = typeof designTokens.colors;
export type TypographyTokens = typeof designTokens.typography;
export type SpacingTokens = typeof designTokens.spacing;