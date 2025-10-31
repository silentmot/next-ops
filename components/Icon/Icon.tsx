/**
 * Base Icon Component
 * Source: DesignTokens.ts iconSize system
 */

"use client";

import type { LucideIcon } from "lucide-react";
import { DesignTokens, type IconSizeKey } from "@/lib/DesignTokens";
import styles from "./Icon.module.css";

export interface IconProps {
  icon: LucideIcon;
  size?: IconSizeKey;
  color?: string;
  className?: string;
  "aria-label"?: string;
  "aria-hidden"?: boolean;
}

export function Icon({
  icon: IconComponent,
  size = "md",
  color,
  className = "",
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden = false,
}: IconProps) {
  const sizeValue = DesignTokens.iconSize[size];

  return (
    <IconComponent
      className={`${styles.icon} ${className}`}
      style={{
        width: sizeValue,
        height: sizeValue,
        color: color,
      }}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
    />
  );
}
