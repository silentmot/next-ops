/**
 * Bar Chart Component
 * Source: Document 2 - "Production VS Target"
 */

"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DesignTokens } from "@/lib/DesignTokens";
import { abbreviateNumber } from "@/lib/utils";
import { CHART_CONFIG } from "./chartConfig";

export interface BarChartData {
  name: string;
  [key: string]: string | number;
}

export interface BarConfig {
  dataKey: string;
  name: string;
  fill: string;
}

export interface BarChartComponentProps {
  data: BarChartData[];
  bars: BarConfig[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  layout?: "horizontal" | "vertical";
  theme?: typeof DesignTokens.theme.dark;
}

export function BarChartComponent({
  data,
  bars,
  height = 400,
  showGrid = true,
  showLegend = true,
  layout = "vertical",
  theme = DesignTokens.theme.dark,
}: BarChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={CHART_CONFIG.margin} layout={layout}>
        {showGrid && <CartesianGrid {...CHART_CONFIG.cartesianGrid} />}

        <XAxis
          type={layout === "vertical" ? "number" : "category"}
          dataKey={layout === "vertical" ? undefined : "name"}
          stroke={theme.text.tertiary}
          tickFormatter={(value) =>
            typeof value === "number" ? abbreviateNumber(value) : value
          }
          style={{
            fontSize: DesignTokens.typography.fontSize.xs,
            fontFamily: DesignTokens.typography.fontFamily.sans,
          }}
        />

        <YAxis
          type={layout === "vertical" ? "category" : "number"}
          dataKey={layout === "vertical" ? "name" : undefined}
          stroke={theme.text.tertiary}
          tickFormatter={(value) =>
            typeof value === "number" ? abbreviateNumber(value) : value
          }
          style={{
            fontSize: DesignTokens.typography.fontSize.xs,
            fontFamily: DesignTokens.typography.fontFamily.sans,
          }}
        />

        <Tooltip {...CHART_CONFIG.tooltip} />

        {showLegend && <Legend {...CHART_CONFIG.legend} />}

        {bars.map((bar) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.name}
            fill={bar.fill}
            radius={[8, 8, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
