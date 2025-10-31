/** biome-ignore-all assist/source/organizeImports: Manual import order required for clarity */

"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Users, UserX } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";

// Import design system and components
import { GlassContainer } from "@/components/GlassContainer";
import { Header } from "@/components/Header";
import { DesignTokens } from "@/lib/DesignTokens";

// Import constants
import { ROLES, SHIFT_TYPES } from "@/lib/constants";
import { toISODate } from "@/lib/utils";

/**
 * Manpower Attendance Chart Component
 * Source: mpchart.html analysis - Attendance tracking by role and shift
 * Mode: Creative (UI/UX Artistic Agent)
 *
 * Features:
 * - 4 bars per role: 3 shifts (MORNING, AFTERNOON, NIGHT) + ABSENT
 * - Bar width represents attendees (max 5 per role/shift)
 * - Bar height represents hours worked (max 10 per shift)
 * - Dynamic date range filtering (daily, weekly, monthly, custom)
 * - Summary cards showing totals
 */

type DateRange = "daily" | "weekly" | "monthly" | "custom";

interface AttendanceData {
  [role: string]: {
    MORNING: { attendees: number; hours: number };
    AFTERNOON: { attendees: number; hours: number };
    NIGHT: { attendees: number; hours: number };
    ABSENT: number;
  };
}

interface SummaryStats {
  totalAttendance: number;
  totalAbsent: number;
  totalHours: number;
  avgHours: number;
}

export default function ManpowerChart() {
  const [dateRange, setDateRange] = useState<DateRange>("daily");
  const [startDate, setStartDate] = useState<string>(toISODate(new Date()));
  const [endDate, setEndDate] = useState<string>(toISODate(new Date()));
  const [attendanceData, setAttendanceData] = useState<AttendanceData>({});

  // Generate deterministic attendance data (GZANSP compliance)
  const generateAttendanceData = useCallback(
    (start: string, _end: string): AttendanceData => {
      const data: AttendanceData = {};

      ROLES.forEach((role, roleIndex) => {
        // Use deterministic calculations based on role and date
        const _roleBase = roleIndex + 1;
        const dateHash = start
          .split("-")
          .reduce((acc, val) => acc + parseInt(val, 10), 0);

        data[role.code] = {
          MORNING: {
            attendees: Math.min(
              5,
              Math.max(
                1,
                Math.round(3 + Math.sin(roleIndex * 0.5 + dateHash * 0.1) * 2),
              ),
            ),
            hours: Math.min(
              10,
              Math.max(
                4,
                Math.round(8 + Math.cos(roleIndex * 0.3 + dateHash * 0.1) * 2),
              ),
            ),
          },
          AFTERNOON: {
            attendees: Math.min(
              5,
              Math.max(
                1,
                Math.round(3 + Math.sin(roleIndex * 0.7 + dateHash * 0.15) * 2),
              ),
            ),
            hours: Math.min(
              10,
              Math.max(
                4,
                Math.round(8 + Math.cos(roleIndex * 0.4 + dateHash * 0.15) * 2),
              ),
            ),
          },
          NIGHT: {
            attendees: Math.min(
              5,
              Math.max(
                1,
                Math.round(
                  2 + Math.sin(roleIndex * 0.9 + dateHash * 0.2) * 1.5,
                ),
              ),
            ),
            hours: Math.min(
              10,
              Math.max(
                6,
                Math.round(
                  8 + Math.cos(roleIndex * 0.6 + dateHash * 0.2) * 1.5,
                ),
              ),
            ),
          },
          ABSENT: Math.max(
            0,
            Math.round(1 + Math.sin(roleIndex * 1.1 + dateHash * 0.25) * 1),
          ),
        };
      });

      return data;
    },
    [],
  );

  // Calculate summary statistics
  const summaryStats: SummaryStats = useMemo(() => {
    let totalAttendance = 0;
    let totalAbsent = 0;
    let totalHours = 0;
    let shiftCount = 0;

    Object.values(attendanceData).forEach((roleData) => {
      SHIFT_TYPES.forEach((shift) => {
        totalAttendance += roleData[shift]?.attendees || 0;
        totalHours += roleData[shift]?.hours || 0;
        shiftCount++;
      });
      totalAbsent += roleData.ABSENT || 0;
    });

    return {
      totalAttendance,
      totalAbsent,
      totalHours,
      avgHours:
        shiftCount > 0 ? Math.round((totalHours / shiftCount) * 10) / 10 : 0,
    };
  }, [attendanceData]);

  // Update data when date range changes
  useEffect(() => {
    let start = startDate;
    let end = endDate;

    if (dateRange !== "custom") {
      const today = new Date();
      end = toISODate(today);

      switch (dateRange) {
        case "weekly": {
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - 7);
          start = toISODate(weekStart);
          break;
        }
        case "monthly": {
          const monthStart = new Date(today);
          monthStart.setMonth(today.getMonth() - 1);
          start = toISODate(monthStart);
          break;
        }
        default: // daily
          start = toISODate(today);
          break;
      }
    }

    setAttendanceData(generateAttendanceData(start, end));
  }, [dateRange, startDate, endDate, generateAttendanceData]);

  // Color scheme for shifts
  const shiftColors = {
    MORNING: DesignTokens.theme.dark.accent.emerald.from,
    AFTERNOON: DesignTokens.theme.dark.accent.violet.from,
    NIGHT: DesignTokens.theme.dark.accent.orange.from,
    ABSENT: DesignTokens.theme.dark.status.critical,
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background: DesignTokens.theme.dark.background.primary,
        fontFamily: DesignTokens.typography.fontFamily.sans,
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header
          title="Manpower Attendance Chart"
          subtitle="Track attendance by role, shift, and time period"
        />

        {/* Summary Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <GlassContainer glassIntensity="light" className="text-center p-6">
            <Users
              size={32}
              className="mx-auto mb-3"
              style={{ color: DesignTokens.theme.dark.accent.emerald.from }}
            />
            <div
              className="text-3xl font-bold mb-2"
              style={{
                color: DesignTokens.theme.dark.text.primary,
                fontWeight: DesignTokens.typography.fontWeight.bold,
              }}
            >
              {summaryStats.totalAttendance}
            </div>
            <div
              className="text-sm"
              style={{ color: DesignTokens.theme.dark.text.secondary }}
            >
              Total Attendance
            </div>
          </GlassContainer>

          <GlassContainer glassIntensity="light" className="text-center p-6">
            <UserX
              size={32}
              className="mx-auto mb-3"
              style={{ color: DesignTokens.theme.dark.status.critical }}
            />
            <div
              className="text-3xl font-bold mb-2"
              style={{
                color: DesignTokens.theme.dark.text.primary,
                fontWeight: DesignTokens.typography.fontWeight.bold,
              }}
            >
              {summaryStats.totalAbsent}
            </div>
            <div
              className="text-sm"
              style={{ color: DesignTokens.theme.dark.text.secondary }}
            >
              Total Absent
            </div>
          </GlassContainer>

          <GlassContainer glassIntensity="light" className="text-center p-6">
            <Clock
              size={32}
              className="mx-auto mb-3"
              style={{ color: DesignTokens.theme.dark.accent.violet.from }}
            />
            <div
              className="text-3xl font-bold mb-2"
              style={{
                color: DesignTokens.theme.dark.text.primary,
                fontWeight: DesignTokens.typography.fontWeight.bold,
              }}
            >
              {summaryStats.totalHours}
            </div>
            <div
              className="text-sm"
              style={{ color: DesignTokens.theme.dark.text.secondary }}
            >
              Total Hours Worked
            </div>
          </GlassContainer>

          <GlassContainer glassIntensity="light" className="text-center p-6">
            <Calendar
              size={32}
              className="mx-auto mb-3"
              style={{ color: DesignTokens.theme.dark.accent.orange.from }}
            />
            <div
              className="text-3xl font-bold mb-2"
              style={{
                color: DesignTokens.theme.dark.text.primary,
                fontWeight: DesignTokens.typography.fontWeight.bold,
              }}
            >
              {summaryStats.avgHours}
            </div>
            <div
              className="text-sm"
              style={{ color: DesignTokens.theme.dark.text.secondary }}
            >
              Avg. Hours/Shift
            </div>
          </GlassContainer>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <GlassContainer glassIntensity="light" className="p-6 mb-8">
            <div className="flex flex-wrap gap-6 items-end">
              <div className="flex-1 min-w-[200px]">
                <label
                  htmlFor="dateRange"
                  className="block mb-2 text-sm font-semibold"
                  style={{ color: DesignTokens.theme.dark.text.primary }}
                >
                  Date Range
                </label>
                <select
                  id="dateRange"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as DateRange)}
                  className="w-full p-3 rounded-lg transition-all focus:outline-none focus:ring-2"
                  style={{
                    background: DesignTokens.theme.dark.background.tertiary,
                    border: `1px solid ${DesignTokens.borderColor.dark.base}`,
                    color: DesignTokens.theme.dark.text.primary,
                    fontSize: DesignTokens.typography.fontSize.base,
                  }}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              {dateRange === "custom" && (
                <>
                  <div className="flex-1 min-w-[200px]">
                    <label
                      htmlFor="startDate"
                      className="block mb-2 text-sm font-semibold"
                      style={{ color: DesignTokens.theme.dark.text.primary }}
                    >
                      Start Date
                    </label>
                    <input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-3 rounded-lg transition-all focus:outline-none focus:ring-2"
                      style={{
                        background: DesignTokens.theme.dark.background.tertiary,
                        border: `1px solid ${DesignTokens.borderColor.dark.base}`,
                        color: DesignTokens.theme.dark.text.primary,
                        fontSize: DesignTokens.typography.fontSize.base,
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <label
                      htmlFor="endDate"
                      className="block mb-2 text-sm font-semibold"
                      style={{ color: DesignTokens.theme.dark.text.primary }}
                    >
                      End Date
                    </label>
                    <input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-3 rounded-lg transition-all focus:outline-none focus:ring-2"
                      style={{
                        background: DesignTokens.theme.dark.background.tertiary,
                        border: `1px solid ${DesignTokens.borderColor.dark.base}`,
                        color: DesignTokens.theme.dark.text.primary,
                        fontSize: DesignTokens.typography.fontSize.base,
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </GlassContainer>
        </motion.div>

        {/* Chart Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <GlassContainer glassIntensity="light" className="p-6">
            <h3
              className="text-xl font-semibold mb-6 text-center"
              style={{
                color: DesignTokens.theme.dark.text.primary,
                fontWeight: DesignTokens.typography.fontWeight.semibold,
              }}
            >
              Attendance by Role and Shift
            </h3>

            {/* Custom Vertical Bar Chart */}
            <div className="flex flex-wrap justify-center gap-8">
              {ROLES.map((role, roleIndex) => (
                <motion.div
                  key={role.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + roleIndex * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <h4
                    className="text-lg font-medium mb-4 text-center"
                    style={{ color: DesignTokens.theme.dark.text.primary }}
                  >
                    {role.name}
                  </h4>

                  <div className="flex items-end gap-2 h-80">
                    {/* Shift bars */}
                    {SHIFT_TYPES.map((shift) => {
                      const shiftData = attendanceData[role.code]?.[shift];
                      const attendees = shiftData?.attendees || 0;
                      const hours = shiftData?.hours || 0;
                      const heightPercent = (hours / 10) * 100; // Max 10 hours
                      const widthPx = Math.max(40, (attendees / 5) * 60); // Max 5 attendees = 60px width

                      return (
                        <div key={shift} className="flex flex-col items-center">
                          <div
                            className="relative flex items-end"
                            style={{
                              height: "280px",
                              width: `${widthPx}px`,
                            }}
                          >
                            <motion.div
                              className="rounded-lg flex flex-col items-center justify-end text-xs font-medium text-white pb-2"
                              style={{
                                background: shiftColors[shift],
                                height: `${heightPercent}%`,
                                width: "100%",
                                minHeight: hours > 0 ? "40px" : "0px",
                                boxShadow: DesignTokens.boxShadow.md,
                              }}
                              initial={{ height: 0 }}
                              animate={{ height: `${heightPercent}%` }}
                              transition={{
                                duration: 0.6,
                                delay: 0.5 + roleIndex * 0.1,
                              }}
                            >
                              {hours > 0 && (
                                <>
                                  <div className="font-bold">{attendees}p</div>
                                  <div>{hours}h</div>
                                </>
                              )}
                            </motion.div>
                          </div>
                          <div
                            className="mt-2 text-xs text-center"
                            style={{
                              color: DesignTokens.theme.dark.text.secondary,
                            }}
                          >
                            {shift}
                          </div>
                          <div
                            className="text-xs text-center"
                            style={{
                              color: DesignTokens.theme.dark.text.tertiary,
                            }}
                          >
                            {attendees}/5
                          </div>
                        </div>
                      );
                    })}

                    {/* Absent bar */}
                    <div className="flex flex-col items-center">
                      <div
                        className="relative flex items-end"
                        style={{
                          height: "280px",
                          width: "50px",
                        }}
                      >
                        <motion.div
                          className="rounded-lg flex flex-col items-center justify-center text-xs font-medium text-white"
                          style={{
                            background: shiftColors.ABSENT,
                            height: `${((attendanceData[role.code]?.ABSENT || 0) / 5) * 100}%`,
                            width: "100%",
                            minHeight:
                              (attendanceData[role.code]?.ABSENT || 0) > 0
                                ? "30px"
                                : "0px",
                            boxShadow: DesignTokens.boxShadow.md,
                          }}
                          initial={{ height: 0 }}
                          animate={{
                            height: `${((attendanceData[role.code]?.ABSENT || 0) / 5) * 100}%`,
                          }}
                          transition={{
                            duration: 0.6,
                            delay: 0.6 + roleIndex * 0.1,
                          }}
                        >
                          {(attendanceData[role.code]?.ABSENT || 0) > 0 &&
                            `${attendanceData[role.code]?.ABSENT}`}
                        </motion.div>
                      </div>
                      <div
                        className="mt-2 text-xs text-center"
                        style={{
                          color: DesignTokens.theme.dark.text.secondary,
                        }}
                      >
                        ABSENT
                      </div>
                      <div
                        className="text-xs text-center"
                        style={{ color: DesignTokens.theme.dark.text.tertiary }}
                      >
                        {attendanceData[role.code]?.ABSENT || 0}/5
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              {Object.entries(shiftColors).map(([shift, color]) => (
                <div key={shift} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ background: color }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: DesignTokens.theme.dark.text.secondary }}
                  >
                    {shift}
                  </span>
                </div>
              ))}
            </div>
          </GlassContainer>
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          style={{
            color: DesignTokens.theme.dark.text.tertiary,
            fontSize: DesignTokens.typography.fontSize.sm,
          }}
        >
          <p>
            Manpower Attendance Tracking • Built with{" "}
            <span style={{ color: DesignTokens.theme.dark.status.critical }}>
              ♥
            </span>{" "}
            using DeskOps Design System
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
