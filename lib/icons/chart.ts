/**
 * Chart type icons
 * Source: Document 2 - Chart components required
 */

import {
  AreaChart,
  BarChart3,
  LineChart,
  Minus,
  PieChart,
  ScatterChart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

export const ChartIcons = {
  line: LineChart,
  bar: BarChart3,
  area: AreaChart,
  pie: PieChart,
  scatter: ScatterChart,
  trendingUp: TrendingUp,
  trendingDown: TrendingDown,
  neutral: Minus,
} as const;

export type ChartIconKey = keyof typeof ChartIcons;
