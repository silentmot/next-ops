/**
 * Scatter Chart Component
 * Source: Document 2 - "Equipment Utilization"
 */

"use client";

import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { DesignTokens } from "@/lib/DesignTokens";
import { abbreviateNumber } from "@/lib/utils";
import { CHART_CONFIG } from "./chartConfig";

export interface ScatterChartData {
  x: number;
  y: number;
  z?: number; // Optional size dimension
  name?: string;
}

export interface ScatterConfig {
  data: ScatterChartData[];
  name: string;
  fill: string;
}

export interface ScatterChartComponentProps {
  scatters: ScatterConfig[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  theme?: typeof DesignTokens.theme.dark;
}

export function ScatterChartComponent({
  scatters,
  height = 400,
  showGrid = true,
  showLegend = true,
  xAxisLabel,
  yAxisLabel,
  theme = DesignTokens.theme.dark,
}: ScatterChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={CHART_CONFIG.margin}>
        {showGrid && <CartesianGrid {...CHART_CONFIG.cartesianGrid} />}

        <XAxis
          type="number"
          dataKey="x"
          name={xAxisLabel}
          stroke={theme.text.tertiary}
          tickFormatter={(value) => abbreviateNumber(value)}
          style={{
            fontSize: DesignTokens.typography.fontSize.xs,
            fontFamily: DesignTokens.typography.fontFamily.sans,
          }}
        />

        <YAxis
          type="number"
          dataKey="y"
          name={yAxisLabel}
          stroke={theme.text.tertiary}
          tickFormatter={(value) => abbreviateNumber(value)}
          style={{
            fontSize: DesignTokens.typography.fontSize.xs,
            fontFamily: DesignTokens.typography.fontFamily.sans,
          }}
        />

        <ZAxis type="number" dataKey="z" range={[60, 400]} />

        <Tooltip {...CHART_CONFIG.tooltip} />

        {showLegend && <Legend {...CHART_CONFIG.legend} />}

        {scatters.map((scatter) => (
          <Scatter
            key={scatter.name}
            name={scatter.name}
            data={scatter.data}
            fill={scatter.fill}
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
}
