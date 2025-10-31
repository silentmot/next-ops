/**
 * Shared Chart Configuration
 * Source: Document 2 - "Shared Defaults"
 */

import { DesignTokens } from "@/lib/DesignTokens";

export const CHART_CONFIG = {
  margin: { top: 10, right: 30, left: 0, bottom: 0 },
  cartesianGrid: {
    strokeDasharray: "3 3",
    stroke: DesignTokens.borderColor.dark.base,
    opacity: 0.3,
  },
  tooltip: {
    contentStyle: {
      background: DesignTokens.theme.dark.background.glass,
      border: `1px solid ${DesignTokens.borderColor.dark.base}`,
      borderRadius: DesignTokens.borderRadius.lg,
      backdropFilter: DesignTokens.backdropBlur.md,
      color: DesignTokens.theme.dark.text.primary,
    },
    cursor: { fill: DesignTokens.glassOpacity.light },
  },
  legend: {
    wrapperStyle: {
      paddingTop: "20px",
      color: DesignTokens.theme.dark.text.secondary,
    },
  },
} as const;
