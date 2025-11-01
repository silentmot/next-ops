/**
 * Dashboard Sidebar Component
 * Source: DeskOps-Dashboard-P1.md Section 3
 *
 * REQUIREMENTS:
 * - Width: 240px (expanded) / 64px (collapsed)
 * - Collapsible with smooth transition
 * - Navigation items with icons
 * - Integrates with dashboard store
 */

"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  Package,
  Settings,
  Truck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LAYOUT_CONFIG } from "@/lib/constants/dashboard";
import { useDashboardStore } from "@/lib/stores/dashboardStore";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Production",
    href: "/dashboard/production",
    icon: BarChart3,
  },
  {
    label: "Inventory",
    href: "/dashboard/inventory",
    icon: Package,
  },
  {
    label: "Dispatch",
    href: "/dashboard/dispatch",
    icon: Truck,
  },
  {
    label: "Manpower",
    href: "/dashboard/manpower",
    icon: Users,
  },
  {
    label: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const sidebarCollapsed = useDashboardStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useDashboardStore((state) => state.toggleSidebar);
  const pathname = usePathname();

  return (
    <motion.aside
      className="h-screen bg-(--sidebar-bg) border-r border-(--border-color) flex flex-col sticky top-0 overflow-hidden"
      animate={{
        width: sidebarCollapsed
          ? LAYOUT_CONFIG.sidebar.collapsed
          : LAYOUT_CONFIG.sidebar.expanded,
      }}
      transition={{
        duration: LAYOUT_CONFIG.sidebar.transition / 1000,
        ease: "easeInOut",
      }}
    >
      {/* Collapse Toggle Button */}
      <button
        type="button"
        className={`w-full h-12 flex items-center bg-transparent border-none border-b border-(--border-color) text-(--text-secondary) cursor-pointer transition-all duration-200 hover:bg-(--hover-bg) hover:text-(--text-primary) ${
          sidebarCollapsed ? "justify-center px-0" : "justify-end px-4"
        }`}
        onClick={toggleSidebar}
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {sidebarCollapsed ? (
          <ChevronRight size={20} />
        ) : (
          <ChevronLeft size={20} />
        )}
      </button>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col py-4 gap-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-4 text-(--text-secondary) no-underline text-sm font-medium transition-all duration-200 hover:bg-(--hover-bg) hover:text-(--text-primary) ${
                sidebarCollapsed
                  ? "py-3 px-0 mx-0 rounded-none justify-center"
                  : "py-3 px-4 mx-2 rounded-lg justify-start"
              } ${isActive ? "bg-(--active-bg) text-(--primary)" : ""}`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon size={24} className="shrink-0" />
              {!sidebarCollapsed && (
                <motion.span
                  className="whitespace-nowrap overflow-hidden text-ellipsis"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.span>
              )}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-(--primary) rounded-r" />
              )}
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}
