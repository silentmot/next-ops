"use client";

import { motion } from "framer-motion";
import type React from "react";
import { DesignTokens } from "@/lib/DesignTokens";
import { GlassContainer } from "./GlassContainer";

/**
 * ChartCard Component
 * Source: DeskOps-DashboardGuide.md Lines 115-142
 * Wrapper for chart components with title, description, and loading states
 */

interface ChartCardProps {
  title: string;
  description?: string;
  height?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  description,
  height = "md",
  loading = false,
  children,
  className = "",
}: ChartCardProps) {
  const heightMap = {
    sm: DesignTokens.chartHeight.sm,
    md: DesignTokens.chartHeight.md,
    lg: DesignTokens.chartHeight.lg,
  };

  return (
    <GlassContainer className={`${className}`} glassIntensity="light">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div>
          <h3
            className="font-semibold mb-1"
            style={{
              fontSize: DesignTokens.typography.fontSize.lg,
              color: DesignTokens.theme.dark.text.primary,
              fontWeight: DesignTokens.typography.fontWeight.semibold,
            }}
          >
            {title}
          </h3>
          {description && (
            <p
              className="text-sm"
              style={{
                color: DesignTokens.theme.dark.text.tertiary,
              }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Chart Content */}
        <div
          className="relative"
          style={{
            height: heightMap[height],
          }}
        >
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="skeleton skeleton-card"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: parseFloat(DesignTokens.duration.shimmer) / 1000,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: DesignTokens.borderRadius.lg,
                }}
              />
            </div>
          ) : (
            <motion.div
              className="h-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: parseFloat(DesignTokens.duration.medium) / 1000,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </GlassContainer>
  );
}
