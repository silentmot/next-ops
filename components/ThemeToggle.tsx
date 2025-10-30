"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { DesignTokens } from "@/lib/DesignTokens";

/**
 * ThemeToggle Component
 * Source: DeskOps-DashboardGuide.md Lines 617-647
 * Toggle between light and dark theme modes
 */

interface ThemeToggleProps {
  className?: string;
  compact?: boolean;
}

export function ThemeToggle({
  className = "",
  compact = false,
}: ThemeToggleProps) {
  const { isDark, toggleDarkMode } = useTheme();

  return (
    <motion.button
      onClick={toggleDarkMode}
      className={`relative p-2 rounded-lg backdrop-blur-md hover:bg-white/10 transition-all duration-200 ${className}`}
      whileHover={{ scale: parseFloat(DesignTokens.scale.small) }}
      whileTap={{ scale: parseFloat(DesignTokens.scale.subtle) }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      style={{
        background: DesignTokens.glassOpacity.light,
        border: `1px solid ${DesignTokens.borderOpacity.light}`,
      }}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 0 : 180,
          scale: isDark ? 1 : 0.8,
        }}
        transition={{
          duration: parseFloat(DesignTokens.duration.normal) / 1000,
          ease: [0.23, 1, 0.32, 1],
        }}
      >
        {isDark ? (
          <Sun
            size={compact ? 16 : 20}
            color={DesignTokens.theme.dark.text.primary}
          />
        ) : (
          <Moon
            size={compact ? 16 : 20}
            color={DesignTokens.theme.light.text.primary}
          />
        )}
      </motion.div>
    </motion.button>
  );
}
