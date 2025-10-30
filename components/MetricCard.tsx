"use client";

import { motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";
import type React from "react";
import { DesignTokens } from "@/lib/DesignTokens";
import { GlassContainer } from "./GlassContainer";

/**
 * MetricCard Component
 * Source: DeskOps-DashboardGuide.md Lines 710-789
 * Display KPI metrics with animated values and trend indicators
 */

interface MetricCardProps {
  label: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  index?: number;
  gradientType?: keyof typeof DesignTokens.gradient;
}

export function MetricCard({
  label,
  value,
  change,
  icon,
  index = 0,
  gradientType = "primary",
}: MetricCardProps) {
  const isPositive = change >= 0;

  return (
    <GlassContainer
      className="metric-card hover-scale"
      glassIntensity="medium"
      glowEffect={isPositive ? "emerald" : "none"}
      style={{
        animationDelay: `${index * 50}ms`,
        background: DesignTokens.gradient[gradientType].css,
        backgroundSize: "200% 200%",
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className="text-sm mb-2"
            style={{
              color: DesignTokens.theme.dark.text.secondary,
              letterSpacing: DesignTokens.typography.letterSpacing.wide,
              textTransform: "uppercase",
            }}
          >
            {label}
          </p>
          <motion.p
            className="text-3xl font-bold"
            style={{
              color: DesignTokens.theme.dark.text.primary,
              lineHeight: DesignTokens.typography.lineHeight.snug,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "linear" }}
          >
            {value}
          </motion.p>
          <div
            className={`percentage-badge ${isPositive ? "positive" : "negative"} mt-2`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: DesignTokens.spacing["1"],
              padding: `${DesignTokens.spacing["1"]} ${DesignTokens.spacing["2"]}`,
              borderRadius: DesignTokens.borderRadius.base,
              fontSize: DesignTokens.typography.fontSize.sm,
              fontWeight: DesignTokens.typography.fontWeight.semibold,
              background: isPositive
                ? "oklch(0.65 0.2 158 / 0.1)"
                : "oklch(0.58 0.23 25 / 0.1)",
              color: isPositive
                ? DesignTokens.theme.dark.status.success
                : DesignTokens.theme.dark.status.critical,
            }}
          >
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{Math.abs(change)}%</span>
          </div>
        </div>
        <div className="opacity-80">{icon}</div>
      </div>
    </GlassContainer>
  );
}
