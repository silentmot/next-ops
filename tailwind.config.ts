import type { Config } from "tailwindcss";
import { DesignTokens } from "./lib/DesignTokens";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      // Colors - Import from DesignTokens (ENHANCED)
      colors: {
        bg: {
          primary: DesignTokens.theme.dark.background.primary,
          secondary: DesignTokens.theme.dark.background.secondary,
          tertiary: DesignTokens.theme.dark.background.tertiary,
          glass: DesignTokens.theme.dark.background.glass,
        },
        text: {
          primary: DesignTokens.theme.dark.text.primary,
          secondary: DesignTokens.theme.dark.text.secondary,
          tertiary: DesignTokens.theme.dark.text.tertiary,
          interactive: DesignTokens.theme.dark.text.interactive,
        },
        accent: {
          emerald: {
            from: DesignTokens.theme.dark.accent.emerald.from,
            to: DesignTokens.theme.dark.accent.emerald.to,
          },
          violet: {
            from: DesignTokens.theme.dark.accent.violet.from,
            to: DesignTokens.theme.dark.accent.violet.to,
          },
          orange: {
            from: DesignTokens.theme.dark.accent.orange.from,
            to: DesignTokens.theme.dark.accent.orange.to,
          },
        },
        status: {
          success: DesignTokens.theme.dark.status.success,
          warning: DesignTokens.theme.dark.status.warning,
          critical: DesignTokens.theme.dark.status.critical,
          info: DesignTokens.theme.dark.status.info,
        },
      },

      // Typography (ENHANCED with text scaling and new font families)
      fontFamily: {
        base: DesignTokens.typography.fontFamily.base,
        heading: DesignTokens.typography.fontFamily.heading,
        anchor: DesignTokens.typography.fontFamily.anchor,
        sans: DesignTokens.typography.fontFamily.sans,
        mono: [DesignTokens.typography.fontFamily.mono, "monospace"],
      },
      fontSize: DesignTokens.typography.fontSize,
      fontWeight: DesignTokens.typography.fontWeight,
      lineHeight: DesignTokens.typography.lineHeight,
      letterSpacing: DesignTokens.typography.letterSpacing,

      // Spacing
      spacing: DesignTokens.spacing,

      // Border Radius
      borderRadius: DesignTokens.borderRadius,

      // Box Shadow (ENHANCED with glow and branded shadows)
      boxShadow: {
        ...DesignTokens.boxShadow,
        // Access nested glow shadows
        "glow-subtle": DesignTokens.boxShadow.glow.subtle,
        "glow-medium": DesignTokens.boxShadow.glow.medium,
        "glow-strong": DesignTokens.boxShadow.glow.strong,
        // Access branded shadows
        "brand-primary": DesignTokens.boxShadow.brand.primary,
        "brand-secondary": DesignTokens.boxShadow.brand.secondary,
        "brand-accent": DesignTokens.boxShadow.brand.accent,
      },

      // Backdrop Blur
      backdropBlur: DesignTokens.backdropBlur,

      // Animations
      transitionDuration: DesignTokens.duration,
      transitionTimingFunction: DesignTokens.easing,
      transitionDelay: DesignTokens.delay,
      scale: DesignTokens.scale,

      // Z-Index (ENHANCED with behind and toast)
      zIndex: DesignTokens.zIndex,

      // Breakpoints
      screens: DesignTokens.breakpoints,

      // Opacity (ENHANCED with glass and border opacity)
      opacity: DesignTokens.opacity,

      // Animation keyframes (ENHANCED)
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        pulse: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.1)" },
        },
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px currentColor", opacity: "1" },
          "50%": { boxShadow: "0 0 40px currentColor", opacity: "0.8" },
        },
      },
      animation: {
        "gradient-shift": "gradient-shift 8s ease infinite",
        fadeIn: "fadeIn 400ms cubic-bezier(0.23, 1, 0.320, 1)",
        shimmer: "shimmer 2s linear infinite",
        pulse: "pulse 2s ease-in-out infinite",
        spin: "spin 1s linear infinite",
        bounce: "bounce 1s ease-in-out infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
