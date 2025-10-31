/**
 * Dashboard navigation icons
 * Source: Document 1 - Sidebar navigation items
 */

import {
  ChevronLeft,
  ChevronRight,
  Download,
  Factory,
  FileText,
  LayoutDashboard,
  Menu,
  Package,
  Settings,
  TruckIcon,
  Users,
  Wrench,
} from "lucide-react";

export const DashboardIcons = {
  dashboard: LayoutDashboard,
  production: Factory,
  dispatch: TruckIcon,
  received: Download,
  equipment: Wrench,
  manpower: Users,
  inventory: Package,
  reports: FileText,
  settings: Settings,
  menu: Menu,
  collapse: ChevronLeft,
  expand: ChevronRight,
} as const;

export type DashboardIconKey = keyof typeof DashboardIcons;
