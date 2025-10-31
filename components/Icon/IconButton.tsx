/**
 * Clickable Icon Button Component
 * Source: DesignTokens.ts button variants + Document 2 accessibility
 */

"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { DesignTokens, type IconSizeKey, type Theme } from "@/lib/DesignTokens";
import { Icon } from "./Icon";

export interface IconButtonProps {
  icon: LucideIcon;
  size?: IconSizeKey;
  variant?: "ghost" | "solid" | "outline";
  onClick?: () => void;
  disabled?: boolean;
  "aria-label": string; // Required for accessibility
  theme: Theme;
  className?: string;
}

export function IconButton({
  icon,
  size = "md",
  variant = "ghost",
  onClick,
  disabled = false,
  "aria-label": ariaLabel,
  theme,
  className = "",
}: IconButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "solid":
        return {
          background: theme.background.tertiary,
          border: `1px solid ${DesignTokens.borderColor.dark.base}`,
        };
      case "outline":
        return {
          background: "transparent",
          border: `1px solid ${DesignTokens.borderColor.dark.base}`,
        };
      default:
        return {
          background: "transparent",
          border: "none",
        };
    }
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={className}
      whileHover={{ scale: parseFloat(DesignTokens.scale.small) }}
      whileTap={{ scale: parseFloat(DesignTokens.scale.subtle) }}
      style={{
        ...getVariantStyles(),
        padding: DesignTokens.spacing["2"],
        borderRadius: DesignTokens.borderRadius.lg,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: `all ${DesignTokens.duration.normal} ${DesignTokens.easing.smooth}`,
      }}
    >
      <Icon icon={icon} size={size} color={theme.text.primary} aria-hidden />
    </motion.button>
  );
}
