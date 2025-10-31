/**
 * Line Chart Component
 * Source: Document 2 - "FLOW TREND CHART (Production, Received, Dispatch)"
 */

"use client";

import {
  Brush,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DesignTokens } from "@/lib/DesignTokens";
import { abbreviateNumber } from "@/lib/utils";
import { CHART_CONFIG } from "./chartConfig";

export interface LineChartData {
  date: string;
  [key: string]: string | number;
}

export interface LineConfig {
  dataKey: string;
  name: string;
  color: string;
  strokeWidth?: number;
}

export interface LineChartComponentProps {
  data: LineChartData[];
  lines: LineConfig[];
  height?: number;
  showBrush?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
  theme?: typeof DesignTokens.theme.dark;
}

export function LineChartComponent({
  data,
  lines,
  height = 400,
  showBrush = true,
  showGrid = true,
  showLegend = true,
  theme = DesignTokens.theme.dark,
}: LineChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={CHART_CONFIG.margin}>
        {showGrid && <CartesianGrid {...CHART_CONFIG.cartesianGrid} />}

        <XAxis
          dataKey="date"
          stroke={theme.text.tertiary}
          style={{
            fontSize: DesignTokens.typography.fontSize.xs,
            fontFamily: DesignTokens.typography.fontFamily.sans,
          }}
        />

        <YAxis
          stroke={theme.text.tertiary}
          tickFormatter={(value) => abbreviateNumber(value)}
          style={{
            fontSize: DesignTokens.typography.fontSize.xs,
            fontFamily: DesignTokens.typography.fontFamily.sans,
          }}
        />

        <Tooltip {...CHART_CONFIG.tooltip} />

        {showLegend && <Legend {...CHART_CONFIG.legend} />}

        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color}
            strokeWidth={line.strokeWidth || 2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        ))}

        {showBrush && (
          <Brush
            dataKey="date"
            height={30}
            stroke={theme.accent.emerald.from}
            fill={theme.background.glass}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
