/**
 * Centralized utility functions for Next-Ops Dashboard
 * Source: P2.md Section 2.1, DesignTokens.ts
 */

import type { Theme } from "./DesignTokens";

// ============================================================================
// NUMBER FORMATTING
// Source: Document 2 - Metric display requirements
// ============================================================================

/**
 * Format number with commas and optional decimals
 * Source: Document 2 - Metric display requirements
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format number as currency
 * Source: Document 2 - Financial metric display
 */
export function formatCurrency(
  value: number,
  currency: string = "USD",
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

/**
 * Format number as percentage
 * Source: Document 1 - KPI metric cards (percentage changes)
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(decimals)}%`;
}

/**
 * Abbreviate large numbers (1000 → 1K, 1000000 → 1M)
 * Source: Document 2 - Chart axis abbreviations
 */
export function abbreviateNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

// ============================================================================
// DATE UTILITIES
// Source: Document 1 - Dashboard date range filter
// ============================================================================

/**
 * Format date with configurable format
 * Source: Document 1 - Dashboard date range filter
 */
export function formatDate(
  date: Date,
  format: "short" | "medium" | "long" = "medium",
): string {
  const formats = {
    short: { month: "numeric", day: "numeric" } as const,
    medium: { month: "short", day: "numeric", year: "numeric" } as const,
    long: {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    } as const,
  };

  return new Intl.DateTimeFormat("en-US", formats[format]).format(date);
}

/**
 * Get date range (start and end dates)
 * Source: Document 1 - Date range filter in header
 */
export function getDateRange(days: number): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);

  return { start, end };
}

/**
 * Get ISO date string (YYYY-MM-DD)
 * Source: Chart data formatting
 */
export function toISODate(date: Date): string {
  return date.toISOString().split("T")[0];
}

// ============================================================================
// CHART UTILITIES
// Source: Document 1 - KPI metric cards trend indicators
// ============================================================================

/**
 * Calculate trend direction and value
 * Source: Document 1 - KPI metric cards trend indicators
 */
export function calculateTrend(
  current: number,
  previous: number,
): { value: number; direction: "up" | "down" | "neutral" } {
  if (previous === 0) {
    return { value: 0, direction: "neutral" };
  }

  const change = ((current - previous) / previous) * 100;

  return {
    value: Math.abs(change),
    direction: change > 0 ? "up" : change < 0 ? "down" : "neutral",
  };
}

/**
 * Generate sparkline data (mock for demo)
 * Source: Document 2 - KPI cards sparkline (7-day trend)
 */
export function generateSparklineData(
  days: number,
  baseValue: number,
  variance: number = 0.1,
): number[] {
  return Array.from({ length: days }, (_, i) => {
    const randomVariance = (Math.random() - 0.5) * variance * baseValue;
    const trend = (i / days) * baseValue * 0.2;
    return Math.max(0, baseValue + randomVariance + trend);
  });
}

/**
 * Get status color based on value and thresholds
 * Source: Document 1 - Status indicators
 */
export function getStatusColor(
  value: number,
  threshold: { warning: number; critical: number },
  theme: Theme,
): string {
  if (value >= threshold.critical) {
    return theme.status.critical;
  }
  if (value >= threshold.warning) {
    return theme.status.warning;
  }
  return theme.status.success;
}

// ============================================================================
// CLASS NAME UTILITIES
// Source: Standard React utility pattern
// ============================================================================

/**
 * Combine class names (cn helper)
 * Source: Standard React utility pattern
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Create responsive class names
 * Source: DesignTokens.ts breakpoints
 */
export function responsive(
  base: string,
  breakpoints: Partial<Record<"sm" | "md" | "lg" | "xl", string>>,
): string {
  const classes = [base];

  Object.entries(breakpoints).forEach(([bp, className]) => {
    classes.push(`${bp}:${className}`);
  });

  return classes.join(" ");
}

// ============================================================================
// DATA TRANSFORMATION
// Source: Document 2 - Chart data formatting
// ============================================================================

/**
 * Transform array data for chart consumption
 * Source: Document 2 - Chart data formatting
 */
export function transformChartData<T extends Record<string, unknown>>(
  data: T[],
  xKey: keyof T,
  yKeys: (keyof T)[],
): Array<Record<string, string | number>> {
  return data.map((item) => {
    const transformed: Record<string, string | number> = {
      [String(xKey)]: String(item[xKey]),
    };

    yKeys.forEach((key) => {
      const value = item[key];
      transformed[String(key)] = typeof value === "number" ? value : 0;
    });

    return transformed;
  });
}

/**
 * Calculate percentage distribution
 * Source: Document 2 - Donut chart percentages
 */
export function calculatePercentages(values: number[]): number[] {
  const total = values.reduce((sum, val) => sum + val, 0);
  if (total === 0) return values.map(() => 0);

  return values.map((val) => (val / total) * 100);
}
