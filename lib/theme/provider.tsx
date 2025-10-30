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
import { type DesignTokens, designTokens } from "./tokens";

// Theme variants
export type ThemeVariant = "cosmic" | "aurora" | "nebula" | "void";

// Theme context type
interface ThemeContextType {
  variant: ThemeVariant;
  tokens: DesignTokens;
  setVariant: (variant: ThemeVariant) => void;
  isDark: boolean;
  toggleDarkMode: () => void;
}

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme variants with different color palettes
const themeVariants: Record<ThemeVariant, Partial<DesignTokens>> = {
  cosmic: {
    // Original cosmic theme (current)
    colors: designTokens.colors,
  },

  aurora: {
    // Northern lights inspired
    colors: {
      ...designTokens.colors,
      brand: {
        primary: "#00f5ff",
        secondary: "#7c3aed",
        accent: "#06ffa5",
        surface: "#0a0f1c",
        surfaceElevated: "#1a1f2e",
        surfaceHighlight: "#2a2f3e",
      },
      gradients: {
        ...designTokens.colors.gradients,
        primary: "linear-gradient(135deg, #00f5ff 0%, #7c3aed 100%)",
        rainbow:
          "linear-gradient(135deg, #00f5ff 0%, #7c3aed 50%, #06ffa5 100%)",
      },
    },
  },

  nebula: {
    // Deep space nebula theme
    colors: {
      ...designTokens.colors,
      brand: {
        primary: "#ff6b6b",
        secondary: "#4ecdc4",
        accent: "#45b7d1",
        surface: "#1a0d1a",
        surfaceElevated: "#2d1b2d",
        surfaceHighlight: "#3d2b3d",
      },
      gradients: {
        ...designTokens.colors.gradients,
        primary: "linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)",
        rainbow:
          "linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%)",
      },
    },
  },

  void: {
    // Pure dark void theme
    colors: {
      ...designTokens.colors,
      brand: {
        primary: "#ffffff",
        secondary: "#a1a1aa",
        accent: "#71717a",
        surface: "#000000",
        surfaceElevated: "#0a0a0a",
        surfaceHighlight: "#171717",
      },
      gradients: {
        ...designTokens.colors.gradients,
        primary: "linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%)",
        rainbow:
          "linear-gradient(135deg, #ffffff 0%, #a1a1aa 50%, #71717a 100%)",
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
  const tokens: DesignTokens = useMemo(
    () => ({
      ...designTokens,
      ...themeVariants[variant],
    }),
    [variant],
  );

  const toggleDarkMode = () => setIsDark(!isDark);

  // Apply CSS custom properties to document root
  useEffect(() => {
    const root = document.documentElement;

    // Apply color tokens as CSS variables
    Object.entries(tokens.colors.brand).forEach(([key, value]) => {
      root.style.setProperty(`--color-brand-${key}`, value);
    });

    Object.entries(tokens.colors.gradients).forEach(([key, value]) => {
      root.style.setProperty(`--gradient-${key}`, value);
    });

    Object.entries(tokens.colors.glass).forEach(([key, value]) => {
      root.style.setProperty(`--glass-${key}`, value);
    });

    Object.entries(tokens.colors.borders).forEach(([key, value]) => {
      root.style.setProperty(`--border-${key}`, value);
    });

    Object.entries(tokens.colors.text).forEach(([key, value]) => {
      root.style.setProperty(`--text-${key}`, value);
    });

    // Apply typography tokens
    root.style.setProperty("--font-sans", tokens.typography.fontFamily.sans);
    root.style.setProperty("--font-mono", tokens.typography.fontFamily.mono);

    // Apply spacing tokens
    Object.entries(tokens.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    // Apply theme class to body
    document.body.className = `theme-${variant} ${isDark ? "dark" : "light"}`;
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
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Utility hook for theme-aware styling
export function useThemeStyles() {
  const { tokens, variant, isDark } = useTheme();

  return {
    // Glass morphism styles
    glass: (intensity: keyof typeof tokens.colors.glass = "light") => ({
      backgroundColor: tokens.colors.glass[intensity],
      backdropFilter: tokens.backdrop.blur.lg,
      border: `1px solid ${tokens.colors.borders.light}`,
    }),

    // Gradient backgrounds
    gradient: (type: keyof typeof tokens.colors.gradients = "primary") => ({
      background: tokens.colors.gradients[type],
    }),

    // Brand shadows
    shadow: (type: keyof typeof tokens.shadows.brand = "primary") => ({
      boxShadow: tokens.shadows.brand[type],
    }),

    // Animation styles
    transition: (
      duration: keyof typeof tokens.animation.duration = "normal",
    ) => ({
      transition: `all ${tokens.animation.duration[duration]} ${tokens.animation.easing.spring}`,
    }),

    // Hover scale effect
    hoverScale: (scale: keyof typeof tokens.animation.scale = "small") => ({
      "&:hover": {
        transform: `scale(${tokens.animation.scale[scale]})`,
      },
    }),

    // Utilities
    variant,
    isDark,
    tokens,
  };
}
