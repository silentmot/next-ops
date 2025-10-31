/**
 * Animated Icon Component
 * Source: DesignTokens.ts animationVariant system
 */

"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { DesignTokens, type IconSizeKey } from "@/lib/DesignTokens";

export interface AnimatedIconProps {
  icon: LucideIcon;
  size?: IconSizeKey;
  color?: string;
  animation?: "pulse" | "spin" | "bounce" | "wave" | "flip";
  "aria-label"?: string;
}

export function AnimatedIcon({
  icon: IconComponent,
  size = "md",
  color,
  animation = "pulse",
  "aria-label": ariaLabel,
}: AnimatedIconProps) {
  const sizeValue = DesignTokens.iconSize[size];

  const getAnimationVariant = () => {
    const variants = {
      pulse: {
        scale: [1, 1.1, 1],
        opacity: [1, 0.7, 1],
        transition: {
          duration: parseFloat(DesignTokens.duration.pulse) / 1000,
          repeat: Infinity,
          ease: [0.42, 0, 0.58, 1] as const, // easeInOut cubic-bezier
        },
      },
      spin: {
        rotate: [0, 360],
        transition: {
          duration: parseFloat(DesignTokens.duration.pulse) / 1000,
          repeat: Infinity,
          ease: [0, 0, 1, 1] as const, // linear cubic-bezier
        },
      },
      bounce: {
        y: [0, -8, 0],
        transition: {
          duration: parseFloat(DesignTokens.duration.pulse) / 1000,
          repeat: Infinity,
          ease: [0.42, 0, 0.58, 1] as const, // easeInOut cubic-bezier
        },
      },
      wave: {
        rotate: [0, 15, -15, 0],
        transition: {
          duration: parseFloat(DesignTokens.duration.pulse) / 1000,
          repeat: Infinity,
          ease: [0.42, 0, 0.58, 1] as const, // easeInOut cubic-bezier
        },
      },
      flip: {
        rotateY: [0, 360],
        transition: {
          duration: parseFloat(DesignTokens.duration.pulse) / 1000,
          repeat: Infinity,
          ease: [0.42, 0, 0.58, 1] as const, // easeInOut cubic-bezier
        },
      },
    };

    return variants[animation];
  };

  return (
    <motion.div
      animate={getAnimationVariant()}
      style={{
        display: "inline-flex",
        width: sizeValue,
        height: sizeValue,
      }}
    >
      <IconComponent
        style={{
          width: sizeValue,
          height: sizeValue,
          color: color,
        }}
        aria-label={ariaLabel}
      />
    </motion.div>
  );
}
