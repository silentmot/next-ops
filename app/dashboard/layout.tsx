/**
 * Dashboard Layout
 * Uses DashboardHeader and DashboardSidebar from Phase 2
 * No hardcoded styles - all values from design tokens
 */

import { DashboardHeader, DashboardSidebar } from "@/components/dashboard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-(--background-primary)">
      {/* Sidebar - Fixed on the left */}
      <DashboardSidebar />

      {/* Main content area - Header + Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header spans the top of main content */}
        <DashboardHeader />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-(--background-secondary)">
          <div className="max-w-[1920px] mx-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
