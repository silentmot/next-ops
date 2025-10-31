/**
 * Pie/Donut Chart Component
 * Source: Document 2 - "Manpower Attendance - Donut"
 */

"use client";

// biome-ignore assist/source/organizeImports: <explanation>
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  PieLabelRenderProps,
} from "recharts";
import { DesignTokens } from "@/lib/DesignTokens";
import { CHART_CONFIG } from "./chartConfig";

export interface PieChartData {
  name: string;
  value: number;
  fill: string;
  [key: string]: string | number; // Index signature for ChartDataInput compatibility
}

export interface PieChartComponentProps {
  data: PieChartData[];
  height?: number;
  innerRadius?: number; // 0 for pie, >0 for donut
  outerRadius?: number;
  showLegend?: boolean;
  showLabels?: boolean;
  theme?: typeof DesignTokens.theme.dark;
}

export function PieChartComponent({
  data,
  height = 400,
  innerRadius = 60, // Donut by default
  outerRadius = 100,
  showLegend = true,
  showLabels = true,
}: PieChartComponentProps) {
  const renderLabel = (props: PieLabelRenderProps) => {
    if (!showLabels) return null;
    const index = props.index ?? 0;
    const entry = data[index];
    const percent = props.percent ?? 0;
    const percentValue: number = typeof percent === "number" ? percent : 0;
    return `${entry.name}: ${(percentValue * 100).toFixed(0)}%`;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          fill="#8884d8"
          dataKey="value"
          label={renderLabel}
          labelLine={showLabels}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Pie>

        <Tooltip {...CHART_CONFIG.tooltip} />

        {showLegend && <Legend {...CHART_CONFIG.legend} />}
      </PieChart>
    </ResponsiveContainer>
  );
}
