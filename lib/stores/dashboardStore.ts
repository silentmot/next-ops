/**
 * Dashboard Store - Zustand State Management
 * Source: DeskOps-Dashboard-Implementation.md Task 1.3
 *
 * CRITICAL REQUIREMENTS:
 * - Uses Zustand with persist middleware
 * - Manages site selection, date range, sidebar state, and refresh triggers
 * - Default site: ALASLA-29
 * - Default date range: Last 7 days
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

// =============================================================================
// STORE INTERFACE
// =============================================================================

interface DashboardStore {
  // Site Management
  currentSite: string;
  setCurrentSite: (site: string) => void;

  // Date Range Management
  dateRange: { start: Date; end: Date };
  setDateRange: (range: { start: Date; end: Date }) => void;

  // Sidebar State
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Chart Refresh
  lastRefresh: Date;
  triggerRefresh: () => void;
}

// =============================================================================
// STORE CREATION
// =============================================================================

/**
 * Dashboard Store with Persistence
 *
 * Persisted state:
 * - currentSite
 * - dateRange
 * - sidebarCollapsed
 *
 * Non-persisted state:
 * - lastRefresh (resets on page reload)
 */
export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      // Default site: ALASLA-29
      currentSite: "ALASLA-29",
      setCurrentSite: (site) => set({ currentSite: site }),

      // Default date range: Last 7 days
      dateRange: {
        start: new Date(new Date().setDate(new Date().getDate() - 7)),
        end: new Date(),
      },
      setDateRange: (range) => set({ dateRange: range }),

      // Sidebar default: Expanded
      sidebarCollapsed: false,
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      // Refresh tracking
      lastRefresh: new Date(),
      triggerRefresh: () => set({ lastRefresh: new Date() }),
    }),
    {
      name: "deskops-dashboard-store",
      // Only persist specific fields
      partialize: (state) => ({
        currentSite: state.currentSite,
        dateRange: state.dateRange,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
      // Custom storage with Date serialization
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state } = JSON.parse(str);
          // Convert date strings back to Date objects
          if (state.dateRange) {
            state.dateRange.start = new Date(state.dateRange.start);
            state.dateRange.end = new Date(state.dateRange.end);
          }
          return { state };
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    },
  ),
);

// =============================================================================
// SELECTORS (Optional - for optimized re-renders)
// =============================================================================

/**
 * Selector hooks for optimized component re-renders
 * Use these in components that only need specific parts of the store
 */

export const useCurrentSite = () =>
  useDashboardStore((state) => state.currentSite);
export const useDateRange = () => useDashboardStore((state) => state.dateRange);
export const useSidebarCollapsed = () =>
  useDashboardStore((state) => state.sidebarCollapsed);
export const useLastRefresh = () =>
  useDashboardStore((state) => state.lastRefresh);

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Helper to get formatted date range as ISO strings
 */
export const getDateRangeISO = () => {
  const { dateRange } = useDashboardStore.getState();
  return {
    start: dateRange.start.toISOString().split("T")[0],
    end: dateRange.end.toISOString().split("T")[0],
  };
};

/**
 * Helper to get current site code
 */
export const getCurrentSiteCode = () => {
  return useDashboardStore.getState().currentSite;
};

/**
 * Helper to trigger data refresh
 */
export const refreshDashboardData = () => {
  useDashboardStore.getState().triggerRefresh();
};
