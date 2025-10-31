/**
 * Area Chart Component
 * Source: Document 2 - "Inventory by Material"
 */

"use client";

import {
  Area,
  AreaChart,
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

export interface AreaChartData {
  date: string;
  [key: string]: string | number;
}

export interface AreaConfig {
  dataKey: string;
  name: string;
  fill: string;
  stroke: string;
}

export interface AreaChartComponentProps {
  data: AreaChartData[];
  areas: AreaConfig[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  stacked?: boolean;
  theme?: typeof DesignTokens.theme.dark;
}

export function AreaChartComponent({
  data,
  areas,
  height = 400,
  showGrid = true,
  showLegend = true,
  stacked = true,
  theme = DesignTokens.theme.dark,
}: AreaChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={CHART_CONFIG.margin}>
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

        {areas.map((area) => (
          <Area
            key={area.dataKey}
            type="monotone"
            dataKey={area.dataKey}
            name={area.name}
            fill={area.fill}
            stroke={area.stroke}
            fillOpacity={0.6}
            stackId={stacked ? "1" : undefined}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
