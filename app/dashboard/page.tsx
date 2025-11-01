/**
 * Dashboard Main Page
 * Displays the DeskOps operational dashboard
 * Future: Will include KPI cards, charts, and tables
 */

"use client";

import { useDashboardStore } from "@/lib/stores/dashboardStore";

export default function DashboardPage() {
  const currentSite = useDashboardStore((state) => state.currentSite);
  const dateRange = useDashboardStore((state) => state.dateRange);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-(--text-primary) mb-2">
          DeskOps Dashboard
        </h1>
        <p className="text-lg text-(--text-secondary)">
          Site: <strong>{currentSite}</strong> | Date Range:{" "}
          <strong>
            {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
          </strong>
        </p>
      </div>

      <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(500px,1fr))]">
        <div className="bg-(--card-bg) border border-(--border-color) rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-semibold text-(--text-primary) mb-4">
            Phase 1 & 2 Complete! 🎉
          </h2>
          <p className="text-base text-(--text-secondary) mb-4 leading-relaxed">
            The foundation and header/navigation components are now ready. This
            page demonstrates:
          </p>
          <ul className="list-none p-0 m-0 mb-4">
            <li className="py-2 text-(--text-primary) text-base leading-relaxed">
              ✓ Layout constants and grid system (Phase 1)
            </li>
            <li className="py-2 text-(--text-primary) text-base leading-relaxed">
              ✓ Type definitions for all dashboard data (Phase 1)
            </li>
            <li className="py-2 text-(--text-primary) text-base leading-relaxed">
              ✓ Zustand store for state management (Phase 1)
            </li>
            <li className="py-2 text-(--text-primary) text-base leading-relaxed">
              ✓ Dashboard Header with glass morphism (Phase 2)
            </li>
            <li className="py-2 text-(--text-primary) text-base leading-relaxed">
              ✓ Collapsible Sidebar with navigation (Phase 2)
            </li>
            <li className="py-2 text-(--text-primary) text-base leading-relaxed">
              ✓ Site Selector with dropdown (Phase 2)
            </li>
            <li className="py-2 text-(--text-primary) text-base leading-relaxed">
              ✓ Date Picker with calendar (Phase 2)
            </li>
            <li className="py-2 text-(--text-primary) text-base leading-relaxed">
              ✓ Global Search with Cmd/Ctrl+K (Phase 2)
            </li>
            <li className="py-2 text-(--text-primary) text-base leading-relaxed">
              ✓ Theme Toggle with animations (Phase 2)
            </li>
          </ul>

          <div className="mt-6 pt-6 border-t border-(--border-color)">
            <p className="text-base text-(--text-primary) mb-3">
              <strong>Try it out:</strong>
            </p>
            <ul className="list-none p-0 m-0">
              <li className="py-2 text-(--text-secondary) text-sm">
                • Click the site selector to change sites
              </li>
              <li className="py-2 text-(--text-secondary) text-sm">
                • Use the date picker to adjust the date range
              </li>
              <li className="py-2 text-(--text-secondary) text-sm">
                • Press Cmd/Ctrl+K to focus the search
              </li>
              <li className="py-2 text-(--text-secondary) text-sm">
                • Toggle the theme between light/dark
              </li>
              <li className="py-2 text-(--text-secondary) text-sm">
                • Collapse/expand the sidebar
              </li>
              <li className="py-2 text-(--text-secondary) text-sm">
                • Navigate between different sections
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-(--card-bg) border border-(--border-color) rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-semibold text-(--text-primary) mb-4">
            Next Steps
          </h2>
          <p className="text-base text-(--text-secondary) mb-4 leading-relaxed">
            Ready to implement the dashboard content:
          </p>
          <ul className="list-none p-0 m-0 mb-4">
            <li className="py-2 text-(--text-primary) text-base leading-relaxed">
              Row 1: KPI Metric Cards (Production, Received, Dispatched,
              Inventory)
            </li>
            <li className="py-2 text-(--text-primary) text-base leading-relaxed">
              Row 2: Trend Charts (Inventory Levels, Production Target)
            </li>
            <li className="py-2 text-(--text-primary) text-base leading-relaxed">
              Row 3: Utilization Metrics (Manpower, Equipment, KPI)
            </li>
            <li className="py-2 text-(--text-primary) text-base leading-relaxed">
              Row 4: Flow Analysis (Received/Dispatched, Recycling Rate)
            </li>
            <li className="py-2 text-(--text-primary) text-base leading-relaxed">
              Row 5: Detail Tables (Movements, Equipment, Manpower)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
