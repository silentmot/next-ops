/**
 * Date Picker Component
 * Source: DeskOps-Dashboard-P1.md Section 2.3
 *
 * REQUIREMENTS:
 * - Width: 180px (default) → 320px (expanded)
 * - Height: 40px
 * - Calendar dropdown with date/range selection
 * - Integrates with dashboard store
 */

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DROPDOWN_CONFIG, HEADER_CONFIG } from "@/lib/constants/dashboard";
import { useDashboardStore } from "@/lib/stores/dashboardStore";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const DATE_PRESETS = [
  { label: "Today", days: 0 },
  { label: "Last 7 Days", days: 7 },
  { label: "Last 30 Days", days: 30 },
  { label: "This Month", days: -1 }, // Special case
  { label: "Last Month", days: -2 }, // Special case
];

export function DatePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const dateRange = useDashboardStore((state) => state.dateRange);
  const setDateRange = useDashboardStore((state) => state.setDateRange);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const formatDateRange = () => {
    const start = dateRange.start;
    const end = dateRange.end;

    if (start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }

    return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    setDateRange({ start: selectedDate, end: selectedDate });
    setIsOpen(false);
  };

  const handlePresetSelect = (preset: (typeof DATE_PRESETS)[0]) => {
    const today = new Date();
    let start: Date;
    let end: Date = today;

    if (preset.days === 0) {
      // Today
      start = today;
    } else if (preset.days === -1) {
      // This Month
      start = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (preset.days === -2) {
      // Last Month
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end = new Date(today.getFullYear(), today.getMonth(), 0);
    } else {
      // Last N days
      start = new Date(today);
      start.setDate(today.getDate() - preset.days);
    }

    setDateRange({ start, end });
    setIsOpen(false);
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setDateRange({ start: today, end: today });
    setIsOpen(false);
  };

  const handleClear = () => {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    setDateRange({ start: lastWeek, end: today });
    setIsOpen(false);
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: startingDayOfWeek }, (_, i) => i);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        className="relative flex items-center gap-2 bg-(--input-bg) border border-(--border-color) text-(--text-primary) text-sm font-medium cursor-pointer transition-all duration-200 hover:border-(--border-hover) hover:bg-(--input-hover) focus:outline-none focus:border-2 focus:border-(--primary) focus:shadow-[0_0_0_3px_var(--focus-ring)]"
        style={{
          width: `${HEADER_CONFIG.datePicker.widthDefault}px`,
          height: `${HEADER_CONFIG.datePicker.height}px`,
          borderRadius: `${HEADER_CONFIG.datePicker.borderRadius}px`,
          padding: `0 ${HEADER_CONFIG.datePicker.padding.right}px 0 ${HEADER_CONFIG.datePicker.padding.left}px`,
        }}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Calendar
          size={HEADER_CONFIG.datePicker.iconSize}
          className="absolute text-(--text-secondary)"
          style={{ left: `${HEADER_CONFIG.datePicker.iconPosition}px` }}
        />
        <span className="flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis">
          {formatDateRange()}
        </span>
        <ChevronDown
          size={16}
          className="text-(--text-secondary) shrink-0"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 200ms ease",
          }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 flex bg-(--dropdown-bg) border border-(--border-color) shadow-(--shadow-lg) overflow-hidden"
            style={{
              top: `${DROPDOWN_CONFIG.datePicker.topOffset}px`,
              borderRadius: `${DROPDOWN_CONFIG.datePicker.borderRadius}px`,
              zIndex: DROPDOWN_CONFIG.datePicker.zIndex,
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: DROPDOWN_CONFIG.datePicker.animation.duration / 1000,
              ease: [0.4, 0, 0.2, 1],
            }}
            role="dialog"
            aria-label="Date picker"
          >
            {/* Presets Sidebar */}
            <div
              className="border-r border-(--border-color) flex flex-col gap-1"
              style={{
                width: `${DROPDOWN_CONFIG.datePicker.rangePresets.width}px`,
                padding: `${DROPDOWN_CONFIG.datePicker.padding}px`,
              }}
            >
              {DATE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className="bg-transparent border-none rounded-md text-(--text-primary) text-[13px] text-left cursor-pointer transition-[background] duration-150 hover:bg-(--hover-bg)"
                  style={{
                    height: `${DROPDOWN_CONFIG.datePicker.rangePresets.itemHeight}px`,
                    padding: `0 ${DROPDOWN_CONFIG.datePicker.rangePresets.itemPadding}px`,
                  }}
                  onClick={() => handlePresetSelect(preset)}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Calendar */}
            <div
              className="flex flex-col gap-3"
              style={{
                width: `${DROPDOWN_CONFIG.datePicker.widthSingle}px`,
                padding: `${DROPDOWN_CONFIG.datePicker.padding}px`,
              }}
            >
              {/* Month Navigation */}
              <div
                className="flex items-center justify-between"
                style={{
                  height: `${DROPDOWN_CONFIG.datePicker.calendar.monthNavHeight}px`,
                }}
              >
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center bg-transparent border-none rounded-md text-(--text-primary) cursor-pointer transition-[background] duration-150 hover:bg-(--hover-bg)"
                  onClick={handlePreviousMonth}
                  aria-label="Previous month"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-base font-semibold text-(--text-primary)">
                  {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center bg-transparent border-none rounded-md text-(--text-primary) cursor-pointer transition-[background] duration-150 hover:bg-(--hover-bg)"
                  onClick={handleNextMonth}
                  aria-label="Next month"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Weekday Header */}
              <div
                className="grid grid-cols-7 gap-1"
                style={{
                  height: `${DROPDOWN_CONFIG.datePicker.calendar.weekdayHeight}px`,
                }}
              >
                {WEEKDAYS.map((day) => (
                  <div
                    key={day}
                    className="flex items-center justify-center text-xs font-semibold text-(--text-secondary) uppercase tracking-wider"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1">
                {emptyDays.map((i) => (
                  <div key={`empty-${i}`} className="cursor-default" />
                ))}
                {days.map((day) => {
                  const date = new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth(),
                    day,
                  );
                  const isToday =
                    date.toDateString() === new Date().toDateString();
                  const isSelected =
                    date.toDateString() === dateRange.start.toDateString() ||
                    date.toDateString() === dateRange.end.toDateString();

                  return (
                    <button
                      key={day}
                      type="button"
                      className={`flex items-center justify-center text-sm bg-transparent border-none text-(--text-primary) cursor-pointer transition-[background] duration-150 hover:bg-(--hover-bg) ${
                        isToday ? "border-2 border-(--primary)" : ""
                      } ${
                        isSelected
                          ? "bg-(--primary) text-(--primary-text) font-semibold hover:bg-(--primary)"
                          : ""
                      }`}
                      style={{
                        width: `${DROPDOWN_CONFIG.datePicker.calendar.dayCellSize}px`,
                        height: `${DROPDOWN_CONFIG.datePicker.calendar.dayCellSize}px`,
                        borderRadius: `${DROPDOWN_CONFIG.datePicker.calendar.dayCellRadius}px`,
                      }}
                      onClick={() => handleDateSelect(day)}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-(--border-color)">
                <button
                  type="button"
                  className="px-4 text-sm font-medium cursor-pointer transition-all duration-150 border-none bg-(--secondary-bg) text-(--text-primary) hover:bg-(--secondary-hover)"
                  style={{
                    height: `${DROPDOWN_CONFIG.datePicker.calendar.buttonHeight}px`,
                    minWidth: `${DROPDOWN_CONFIG.datePicker.calendar.buttonMinWidth}px`,
                    borderRadius: `${DROPDOWN_CONFIG.datePicker.calendar.buttonRadius}px`,
                  }}
                  onClick={handleToday}
                >
                  Today
                </button>
                <button
                  type="button"
                  className="px-4 text-sm font-medium cursor-pointer transition-all duration-150 border-none bg-transparent text-(--text-secondary) hover:bg-(--hover-bg) hover:text-(--text-primary)"
                  style={{
                    height: `${DROPDOWN_CONFIG.datePicker.calendar.buttonHeight}px`,
                    minWidth: `${DROPDOWN_CONFIG.datePicker.calendar.buttonMinWidth}px`,
                    borderRadius: `${DROPDOWN_CONFIG.datePicker.calendar.buttonRadius}px`,
                  }}
                  onClick={handleClear}
                >
                  Clear
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
