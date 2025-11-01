/**
 * OPS Design System - Theme Provider
 * React Context system for theme management
 * Created: October 29, 2025
 */

"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DesignTokens } from "./DesignTokens";

// Theme variants
export type ThemeVariant = "cosmic" | "aurora" | "nebula" | "void";

// Theme context type
interface ThemeContextType {
  variant: ThemeVariant;
  tokens: typeof DesignTokens;
  setVariant: (variant: ThemeVariant) => void;
  isDark: boolean;
  toggleDarkMode: () => void;
}

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme variant override type
type ThemeVariantOverride = {
  colors?: {
    brand?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      surface?: string;
      surfaceElevated?: string;
      surfaceHighlight?: string;
    };
    gradients?: {
      primary?: string;
      secondary?: string;
      tertiary?: string;
      rainbow?: string;
      [key: string]: string | undefined;
    };
    glass?: typeof DesignTokens.colors.glass;
    borders?: typeof DesignTokens.colors.borders;
    text?: typeof DesignTokens.colors.text;
  };
};

// Theme variants with different color palettes
const themeVariants: Record<ThemeVariant, ThemeVariantOverride> = {
  cosmic: {
    // Original cosmic theme (current)
    colors: DesignTokens.colors,
  },

  aurora: {
    // Northern lights inspired
    colors: {
      ...DesignTokens.colors,
      brand: {
        primary: "oklch(0.85 0.20 195)",
        secondary: "oklch(0.60 0.25 285)",
        accent: "oklch(0.85 0.18 165)",
        surface: "oklch(0.15 0.02 250)",
        surfaceElevated: "oklch(0.20 0.02 250)",
        surfaceHighlight: "oklch(0.25 0.02 250)",
      },
      gradients: {
        ...DesignTokens.colors.gradients,
        primary:
          "linear-gradient(135deg, oklch(0.85 0.20 195) 0%, oklch(0.60 0.25 285) 100%)",
        rainbow:
          "linear-gradient(135deg, oklch(0.85 0.20 195) 0%, oklch(0.60 0.25 285) 50%, oklch(0.85 0.18 165) 100%)",
      },
    },
  },

  nebula: {
    // Deep space nebula theme
    colors: {
      ...DesignTokens.colors,
      brand: {
        primary: "oklch(0.68 0.20 25)",
        secondary: "oklch(0.72 0.14 195)",
        accent: "oklch(0.70 0.13 220)",
        surface: "oklch(0.15 0.03 330)",
        surfaceElevated: "oklch(0.22 0.03 330)",
        surfaceHighlight: "oklch(0.28 0.03 330)",
      },
      gradients: {
        ...DesignTokens.colors.gradients,
        primary:
          "linear-gradient(135deg, oklch(0.68 0.20 25) 0%, oklch(0.72 0.14 195) 100%)",
        rainbow:
          "linear-gradient(135deg, oklch(0.68 0.20 25) 0%, oklch(0.72 0.14 195) 50%, oklch(0.70 0.13 220) 100%)",
      },
    },
  },

  void: {
    // Pure dark void theme
    colors: {
      ...DesignTokens.colors,
      brand: {
        primary: "oklch(1.0 0 0)",
        secondary: "oklch(0.68 0 0)",
        accent: "oklch(0.55 0 0)",
        surface: "oklch(0 0 0)",
        surfaceElevated: "oklch(0.10 0 0)",
        surfaceHighlight: "oklch(0.18 0 0)",
      },
      gradients: {
        ...DesignTokens.colors.gradients,
        primary:
          "linear-gradient(135deg, oklch(1.0 0 0) 0%, oklch(0.68 0 0) 100%)",
        rainbow:
          "linear-gradient(135deg, oklch(1.0 0 0) 0%, oklch(0.68 0 0) 50%, oklch(0.55 0 0) 100%)",
      },
    },
  },
};

// Theme Provider Component
interface ThemeProviderProps {
  children: ReactNode;
  defaultVariant?: ThemeVariant;
  defaultDarkMode?: boolean;
}

export function ThemeProvider({
  children,
  defaultVariant = "cosmic",
  defaultDarkMode = true,
}: ThemeProviderProps) {
  const [variant, setVariant] = useState<ThemeVariant>(defaultVariant);
  const [isDark, setIsDark] = useState(defaultDarkMode);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedVariant = localStorage.getItem(
      "ops-theme-variant",
    ) as ThemeVariant;
    const savedDarkMode = localStorage.getItem("ops-theme-dark") === "true";

    if (savedVariant && themeVariants[savedVariant]) {
      setVariant(savedVariant);
    }
    setIsDark(savedDarkMode);
  }, []);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem("ops-theme-variant", variant);
    localStorage.setItem("ops-theme-dark", isDark.toString());
  }, [variant, isDark]);

  // Merge base tokens with variant overrides - memoized for performance
  const tokens = useMemo(
    () => ({
      ...DesignTokens,
      ...themeVariants[variant],
    }),
    [variant],
  ) as typeof DesignTokens;

  const toggleDarkMode = () => setIsDark(!isDark);

  // Apply CSS custom properties to document root
  useEffect(() => {
    const root = document.documentElement;

    Object.entries(tokens.colors.brand).forEach(([key, value]) => {
      root.style.setProperty(`--color-brand-${key}`, value as string);
    });

    Object.entries(tokens.colors.gradients).forEach(([key, value]) => {
      root.style.setProperty(`--gradient-${key}`, value as string);
    });

    Object.entries(tokens.colors.glass).forEach(([key, value]) => {
      root.style.setProperty(`--glass-${key}`, value as string);
    });

    Object.entries(tokens.colors.borders).forEach(([key, value]) => {
      root.style.setProperty(`--border-${key}`, value as string);
    });

    Object.entries(tokens.colors.text).forEach(([key, value]) => {
      root.style.setProperty(`--text-${key}`, value as string);
    });

    // Apply typography tokens
    root.style.setProperty("--font-sans", tokens.typography.fontFamily.sans);
    root.style.setProperty("--font-mono", tokens.typography.fontFamily.mono);

    // Apply spacing tokens
    Object.entries(tokens.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value as string);
    });

    // Apply theme class and data-theme attribute to <html> element
    root.className = `theme-${variant} ${isDark ? "dark" : "light"}`;
    root.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [tokens, variant, isDark]);

  const value: ThemeContextType = {
    variant,
    tokens,
    setVariant,
    isDark,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// Hook to use theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
