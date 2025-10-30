"use client";

import { type HTMLMotionProps, motion } from "framer-motion";
import type React from "react";
import { DesignTokens } from "@/lib/DesignTokens";

/**
 * GlassContainer Component
 * Source: DeskOps-DashboardGuide.md Lines 655-706
 * Reusable glassmorphic container with configurable blur and glow effects
 */

interface GlassContainerProps extends HTMLMotionProps<"div"> {
  variant?: "sm" | "md" | "lg";
  glassIntensity?: keyof typeof DesignTokens.glassOpacity;
  glowEffect?: "emerald" | "violet" | "orange" | "none";
  children: React.ReactNode;
  className?: string;
}

export function GlassContainer({
  variant = "md",
  glassIntensity = "medium",
  glowEffect = "none",
  children,
  className = "",
  ...props
}: GlassContainerProps) {
  const glowShadows = {
    emerald: DesignTokens.boxShadow.glowEmerald,
    violet: DesignTokens.boxShadow.glowViolet,
    orange: DesignTokens.boxShadow.glowAmber,
    none: undefined,
  };

  const blurMap = {
    sm: DesignTokens.backdropBlur.sm,
    md: DesignTokens.backdropBlur.md,
    lg: DesignTokens.backdropBlur.lg,
  };

  return (
    <motion.div
      className={`glass-container glass-${variant} ${className}`}
      style={{
        background: DesignTokens.glassOpacity[glassIntensity],
        border: `1px solid ${DesignTokens.borderOpacity.light}`,
        borderRadius: DesignTokens.borderRadius["2xl"],
        padding: DesignTokens.spacing["6"],
        backdropFilter: blurMap[variant],
        WebkitBackdropFilter: blurMap[variant],
        boxShadow:
          glowEffect !== "none"
            ? glowShadows[glowEffect]
            : DesignTokens.boxShadow.glass,
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: parseFloat(DesignTokens.duration.medium) / 1000,
        ease: [0.23, 1, 0.32, 1],
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
