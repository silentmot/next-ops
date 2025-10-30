/**
 * Type definitions for DeskOps Dashboard
 * Source: DeskOps-DashboardGuide.md
 */

import type { ReactNode } from "react";
import type {
  BorderOpacityKey,
  BorderRadiusKey,
  BoxShadowKey,
  FontSizeKey,
  GlassOpacityKey,
  GradientKey,
  SpacingKey,
  ThemeMode,
} from "@/lib/DesignTokens";

// Theme Types
export type { ThemeMode };

// Component Props Types
export interface BaseComponentProps {
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// Metric Card Types
export interface MetricData {
  id: string;
  label: string;
  value: string | number;
  change: number;
  icon: ReactNode;
  trend?: "up" | "down" | "neutral";
}

export interface MetricCardProps extends BaseComponentProps {
  label: string;
  value: string | number;
  change: number;
  icon: ReactNode;
  index?: number;
  gradientType?: GradientKey;
}

// Chart Types
export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface ChartCardProps extends BaseComponentProps {
  title: string;
  description?: string;
  height?: "sm" | "md" | "lg";
  loading?: boolean;
}

// Glass Container Types
export interface GlassContainerProps extends BaseComponentProps {
  variant?: "sm" | "md" | "lg";
  glassIntensity?: keyof GlassOpacityKey;
  glowEffect?: "emerald" | "violet" | "orange" | "none";
  hover?: boolean;
}

// Theme Toggle Types
export interface ThemeToggleProps {
  className?: string;
  compact?: boolean;
}

// Icon Types
export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type IconColor =
  | "primary"
  | "secondary"
  | "tertiary"
  | "emerald"
  | "violet"
  | "orange";

export interface IconProps {
  size?: IconSize;
  color?: IconColor;
  className?: string;
}

// Animation Types
export type AnimationType = "pulse" | "spin" | "bounce" | "wave" | "flip";

export interface AnimatedIconProps extends IconProps {
  animation?: AnimationType;
  duration?: number;
}

// Dashboard Layout Types
export interface DashboardSection {
  id: string;
  title: string;
  description?: string;
  component: ReactNode;
}

// Status Types
export type StatusType = "success" | "warning" | "critical" | "info";

export interface StatusIndicator {
  type: StatusType;
  message: string;
  timestamp?: Date;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  progress?: number;
  message?: string;
}

// Design Token Type Re-exports
export type {
  FontSizeKey,
  SpacingKey,
  BorderRadiusKey,
  BoxShadowKey,
  GradientKey,
  GlassOpacityKey,
  BorderOpacityKey,
};
