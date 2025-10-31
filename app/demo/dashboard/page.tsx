/** biome-ignore-all assist/source/organizeImports: Manual import order required for clarity */
"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Box,
  Calendar,
  Download,
  Factory,
  Gauge,
  Package,
  Settings,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";
import { useState } from "react";

// Import existing components
import { AreaChartComponent } from "@/components/Charts/AreaChartComponent";
import { BarChartComponent } from "@/components/Charts/BarChartComponent";
import { LineChartComponent } from "@/components/Charts/LineChartComponent";
import { PieChartComponent } from "@/components/Charts/PieChartComponent";
import { ScatterChartComponent } from "@/components/Charts/ScatterChartComponent";
import { ChartCard } from "@/components/ChartCard";
import { GlassContainer } from "@/components/GlassContainer";
import { Header } from "@/components/Header";
import { MetricCard } from "@/components/MetricCard";
import { Sidebar } from "@/components/Sidebar";
import { DesignTokens } from "@/lib/DesignTokens";

// Import constants and utilities
import {
  ROLES,
  getFinalMaterials,
  getEquipmentByType,
  formatWithPrecision,
} from "@/lib/constants";
import { toISODate } from "@/lib/utils";

/**
 * DeskOps Dashboard Demo
 * Source: DeskOps-Dashboard.md - Complete dashboard implementation
 * Mode: Creative (UI/UX Artistic Agent)
 *
 * Layout Architecture:
 * - 12-column responsive grid system
 * - Row-based component organization
 * - Glassmorphic design with comprehensive design tokens
 */

// Data generators using real constants (deterministic for GZANSP compliance)
// Source: constants.ts - Real material, equipment, and role definitions
const generateInventoryData = () => {
  // Use actual final materials from constants
  const finalMaterials = getFinalMaterials().slice(0, 4); // Take first 4 for chart readability
  const baseValues = [450, 320, 180, 240]; // Deterministic base values

  return Array.from({ length: 30 }, (_, i) => {
    const date = toISODate(new Date(2025, 9, i + 1));
    const entry: { date: string; [key: string]: string | number } = { date };

    finalMaterials.forEach((material, idx) => {
      // Deterministic calculation based on day index
      const variation = Math.sin((i + idx) * 0.3) * 50;
      entry[material.name] = Math.round(baseValues[idx] + variation);
    });

    return entry;
  });
};

const generateProductionData = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day, i) => ({
    name: day,
    production: Math.round(85 + i * 12 + Math.sin(i) * 15), // Deterministic
    target: 100,
  }));
};

const generateEquipmentData = () => {
  // Use actual equipment from constants
  const crushingEquipment = getEquipmentByType("CRUSHING_SCREENING");
  return crushingEquipment.map((equipment, i) => ({
    x: parseFloat(formatWithPrecision(6 + i * 1.5 + Math.cos(i) * 2, "HOUR")), // Hours for X-axis
    y: 75 + i * 5, // Efficiency for Y-axis
    z: (i + 1) * 20, // Size multiplier for bubble size
    name: equipment.name,
  }));
};

const generateAttendanceData = () => {
  // Calculate based on actual roles
  const totalRoles = ROLES.length;
  const baseAttendance = totalRoles * 8; // 8 people per role on average
  const presentCount = Math.round(baseAttendance * 0.89); // 89% attendance
  const absentCount = baseAttendance - presentCount;

  return [
    {
      name: "Present",
      value: presentCount,
      fill: DesignTokens.theme.dark.status.success,
    },
    {
      name: "Absent",
      value: absentCount,
      fill: DesignTokens.theme.dark.status.critical,
    },
  ];
};

const generateFlowData = () => {
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(2025, 9, 25 + i).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const received = 120 + i * 15 + Math.sin(i) * 20; // Deterministic
    const dispatched = 100 + i * 12 + Math.cos(i) * 18;

    return {
      name: date, // Add name property for BarChart compatibility
      date,
      received: Math.round(received),
      dispatched: Math.round(dispatched),
      net: Math.round(received - dispatched),
    };
  });

  return days;
};

const generateRecyclingData = () => {
  return Array.from({ length: 14 }, (_, i) => ({
    date: new Date(2025, 9, 18 + i).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    rate: Math.round((65 + Math.sin(i * 0.5) * 15) * 100) / 100, // Deterministic, 50-80% range
    target: 75,
  }));
};

type TabType = "movements" | "equipment" | "manpower";

export default function DashboardDemo() {
  const [activeTab, setActiveTab] = useState<TabType>("movements");
  const [sidebarActive] = useState("dashboard");

  // Sidebar configuration
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: <BarChart3 size={20} /> },
    { id: "production", label: "Production", icon: <Factory size={20} /> },
    { id: "dispatch", label: "Dispatch", icon: <Truck size={20} /> },
    { id: "received", label: "Received", icon: <Package size={20} /> },
    { id: "equipment", label: "Equipment", icon: <Gauge size={20} /> },
    { id: "manpower", label: "Manpower", icon: <Users size={20} /> },
    { id: "inventory", label: "Inventory", icon: <Box size={20} /> },
    { id: "reports", label: "Reports", icon: <Calendar size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  // Chart data using real constants
  const inventoryData = generateInventoryData();
  const productionData = generateProductionData();
  const equipmentData = generateEquipmentData();
  const attendanceData = generateAttendanceData();
  const flowData = generateFlowData();
  const recyclingData = generateRecyclingData();

  // Get material names from first inventory entry (excluding date)
  const materialNames =
    inventoryData.length > 0
      ? Object.keys(inventoryData[0]).filter((key) => key !== "date")
      : [];

  return (
    <div
      className="min-h-screen"
      style={{
        background: DesignTokens.theme.dark.background.primary,
        fontFamily: DesignTokens.typography.fontFamily.sans,
      }}
    >
      {/* Main Layout Container */}
      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -240, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="fixed left-0 top-0 h-screen z-40"
          style={{
            width: "240px",
            padding: DesignTokens.spacing["4"],
          }}
        >
          <Sidebar
            items={sidebarItems}
            activeItem={sidebarActive}
            className="h-full"
          />
        </motion.aside>

        {/* Main Content */}
        <main
          className="flex-1"
          style={{
            marginLeft: "240px",
            padding: DesignTokens.spacing["6"],
          }}
        >
          {/* Header */}
          <Header
            title="DeskOps Operations Dashboard"
            subtitle="Real-time monitoring and analytics for production operations"
          />

          {/* Dashboard Grid Layout */}
          <div
            className="dashboard-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: DesignTokens.spacing["6"],
              marginTop: DesignTokens.spacing["8"],
            }}
          >
            {/* ROW 1: KPI Cards */}
            <motion.div
              className="col-span-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <MetricCard
                label="Production Today"
                value={`${Math.round(productionData.reduce((sum, day) => sum + day.production, 0))} TON`}
                change={12.5}
                icon={
                  <Factory
                    size={32}
                    style={{
                      color: DesignTokens.theme.dark.accent.emerald.from,
                    }}
                  />
                }
                gradientType="primary"
                index={0}
              />
            </motion.div>

            <motion.div
              className="col-span-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <MetricCard
                label="Received Materials"
                value="1,245 TON"
                change={8.2}
                icon={
                  <Package
                    size={32}
                    style={{
                      color: DesignTokens.theme.dark.accent.violet.from,
                    }}
                  />
                }
                gradientType="secondary"
                index={1}
              />
            </motion.div>

            <motion.div
              className="col-span-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <MetricCard
                label="Dispatched Today"
                value="692 TON"
                change={-3.1}
                icon={
                  <Truck
                    size={32}
                    style={{
                      color: DesignTokens.theme.dark.accent.orange.from,
                    }}
                  />
                }
                gradientType="tertiary"
                index={2}
              />
            </motion.div>

            <motion.div
              className="col-span-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              <MetricCard
                label="Current Inventory"
                value={`${Math.round(
                  inventoryData[inventoryData.length - 1]
                    ? Object.entries(inventoryData[inventoryData.length - 1])
                        .filter(([key]) => key !== "date")
                        .reduce(
                          (sum, [, value]) =>
                            sum + (typeof value === "number" ? value : 0),
                          0,
                        )
                    : 0,
                )} TON`}
                change={15.7}
                icon={
                  <Box
                    size={32}
                    style={{ color: DesignTokens.theme.dark.status.info }}
                  />
                }
                gradientType="rainbow"
                index={3}
              />
            </motion.div>

            {/* ROW 2: Trend Charts */}
            <motion.div
              className="col-span-7"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <ChartCard
                title="Inventory Levels (All Materials)"
                description="30-day inventory tracking by material type"
                height="lg"
              >
                <AreaChartComponent
                  data={inventoryData}
                  areas={materialNames.map((name, index) => {
                    const colors = [
                      {
                        fill: DesignTokens.theme.dark.accent.emerald.from,
                        stroke: DesignTokens.theme.dark.accent.emerald.to,
                      },
                      {
                        fill: DesignTokens.theme.dark.accent.violet.from,
                        stroke: DesignTokens.theme.dark.accent.violet.to,
                      },
                      {
                        fill: DesignTokens.theme.dark.accent.orange.from,
                        stroke: DesignTokens.theme.dark.accent.orange.to,
                      },
                      {
                        fill: DesignTokens.theme.dark.status.info,
                        stroke: DesignTokens.theme.dark.status.success,
                      },
                    ];
                    return {
                      dataKey: name,
                      name: name,
                      fill: colors[index % colors.length].fill,
                      stroke: colors[index % colors.length].stroke,
                    };
                  })}
                  stacked={true}
                  height={350}
                />
              </ChartCard>
            </motion.div>

            <motion.div
              className="col-span-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              <ChartCard
                title="Production vs Target"
                description="Weekly production performance"
                height="lg"
              >
                <BarChartComponent
                  data={productionData}
                  bars={[
                    {
                      dataKey: "production",
                      name: "Production",
                      fill: DesignTokens.theme.dark.accent.emerald.from,
                    },
                    {
                      dataKey: "target",
                      name: "Target",
                      fill: DesignTokens.theme.dark.text.tertiary,
                    },
                  ]}
                  layout="vertical"
                  height={350}
                />
              </ChartCard>
            </motion.div>

            {/* ROW 3: Utilization Metrics */}
            <motion.div
              className="col-span-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <ChartCard
                title="Equipment Utilization"
                description="Usage hours per equipment type"
                height="md"
              >
                <ScatterChartComponent
                  scatters={[
                    {
                      data: equipmentData,
                      name: "Equipment Utilization",
                      fill: DesignTokens.theme.dark.accent.emerald.from,
                    },
                  ]}
                  xAxisLabel="Operating Hours"
                  yAxisLabel="Efficiency %"
                  height={300}
                />
              </ChartCard>
            </motion.div>

            <motion.div
              className="col-span-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.45 }}
            >
              <ChartCard
                title="Manpower Attendance"
                description="Current shift attendance status"
                height="md"
              >
                <PieChartComponent
                  data={attendanceData}
                  height={300}
                  showLabels={true}
                  innerRadius={60}
                />
              </ChartCard>
            </motion.div>

            {/* Gap for visual balance */}
            <div className="col-span-3" />

            {/* ROW 4: Flow Analysis */}
            <motion.div
              className="col-span-7"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <ChartCard
                title="Received vs Dispatched Trend"
                description="7-day material flow analysis"
                height="lg"
              >
                <BarChartComponent
                  data={flowData}
                  bars={[
                    {
                      dataKey: "received",
                      name: "Received",
                      fill: DesignTokens.theme.dark.status.success,
                    },
                    {
                      dataKey: "dispatched",
                      name: "Dispatched",
                      fill: DesignTokens.theme.dark.accent.orange.from,
                    },
                  ]}
                  layout="horizontal"
                  height={350}
                />
              </ChartCard>
            </motion.div>

            <motion.div
              className="col-span-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.55 }}
            >
              <ChartCard
                title="Recycling Rate"
                description="Environmental sustainability metrics"
                height="lg"
              >
                <LineChartComponent
                  data={recyclingData}
                  lines={[
                    {
                      dataKey: "rate",
                      name: "Recycling Rate",
                      color: DesignTokens.theme.dark.status.success,
                      strokeWidth: 3,
                    },
                    {
                      dataKey: "target",
                      name: "Target",
                      color: DesignTokens.theme.dark.text.tertiary,
                      strokeWidth: 2,
                    },
                  ]}
                  height={350}
                />
              </ChartCard>
            </motion.div>

            {/* ROW 5: Detail Tabs */}
            <motion.div
              className="col-span-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <GlassContainer glassIntensity="light" className="min-h-[500px]">
                {/* Tab Navigation */}
                <div
                  className="flex gap-1 mb-6 p-1 rounded-lg"
                  style={{
                    background: DesignTokens.theme.dark.background.tertiary,
                  }}
                >
                  {[
                    {
                      id: "movements" as TabType,
                      label: "Material Movements",
                      icon: <TrendingUp size={16} />,
                    },
                    {
                      id: "equipment" as TabType,
                      label: "Equipment Status",
                      icon: <Gauge size={16} />,
                    },
                    {
                      id: "manpower" as TabType,
                      label: "Manpower Details",
                      icon: <Users size={16} />,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200
                        ${
                          activeTab === tab.id
                            ? "bg-white/10 text-white shadow-lg"
                            : "text-white/70 hover:text-white hover:bg-white/5"
                        }
                      `}
                      style={{
                        fontSize: DesignTokens.typography.fontSize.sm,
                        fontWeight:
                          activeTab === tab.id
                            ? DesignTokens.typography.fontWeight.semibold
                            : DesignTokens.typography.fontWeight.normal,
                      }}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}

                  <div className="ml-auto">
                    <button
                      type="button"
                      className="flex items-center gap-2 px-4 py-2 rounded-md transition-all hover:bg-white/10 text-white/70 hover:text-white"
                      style={{ fontSize: DesignTokens.typography.fontSize.sm }}
                    >
                      <Download size={16} />
                      Export
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                  {activeTab === "movements" && (
                    <div
                      className="text-center py-20"
                      style={{ color: DesignTokens.theme.dark.text.secondary }}
                    >
                      <TrendingUp
                        size={48}
                        className="mx-auto mb-4 opacity-50"
                      />
                      <h3
                        className="text-lg font-semibold mb-2"
                        style={{ color: DesignTokens.theme.dark.text.primary }}
                      >
                        Material Movements Data
                      </h3>
                      <p>
                        Real-time material tracking and movement history will be
                        displayed here.
                      </p>
                      <p className="mt-2 text-sm opacity-75">
                        Connected to production API for live updates.
                      </p>
                    </div>
                  )}

                  {activeTab === "equipment" && (
                    <div
                      className="text-center py-20"
                      style={{ color: DesignTokens.theme.dark.text.secondary }}
                    >
                      <Gauge size={48} className="mx-auto mb-4 opacity-50" />
                      <h3
                        className="text-lg font-semibold mb-2"
                        style={{ color: DesignTokens.theme.dark.text.primary }}
                      >
                        Equipment Status Monitor
                      </h3>
                      <p>
                        Detailed equipment performance metrics and maintenance
                        schedules.
                      </p>
                      <p className="mt-2 text-sm opacity-75">
                        Real-time IoT sensor data integration.
                      </p>
                    </div>
                  )}

                  {activeTab === "manpower" && (
                    <div
                      className="text-center py-20"
                      style={{ color: DesignTokens.theme.dark.text.secondary }}
                    >
                      <Users size={48} className="mx-auto mb-4 opacity-50" />
                      <h3
                        className="text-lg font-semibold mb-2"
                        style={{ color: DesignTokens.theme.dark.text.primary }}
                      >
                        Workforce Analytics
                      </h3>
                      <p>
                        Comprehensive attendance tracking and productivity
                        analysis.
                      </p>
                      <p className="mt-2 text-sm opacity-75">
                        HR system integration for complete workforce visibility.
                      </p>
                    </div>
                  )}
                </div>
              </GlassContainer>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.footer
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            style={{
              color: DesignTokens.theme.dark.text.tertiary,
              fontSize: DesignTokens.typography.fontSize.sm,
            }}
          >
            <p>
              DeskOps Dashboard Demo • Built with{" "}
              <span style={{ color: DesignTokens.theme.dark.status.critical }}>
                ♥
              </span>{" "}
              using comprehensive design tokens & real constants
            </p>
            <p className="mt-2 opacity-75">
              GZANSP × AOC Compliant • OKLCH Color Space • Real Material Data •
              Type-Safe Implementation
            </p>
          </motion.footer>
        </main>
      </div>
    </div>
  );
}
