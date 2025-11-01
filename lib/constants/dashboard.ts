/**
 * Dashboard Layout Constants (SSOT)
 * Source: DeskOps-Dashboard-P1.md Section 1
 *
 * CRITICAL REQUIREMENTS:
 * - DO NOT DUPLICATE these constants in components
 * - ALWAYS IMPORT from this centralized constants file
 * - NO HARDCODED VALUES in components
 */

// =============================================================================
// LAYOUT CONFIGURATION
// =============================================================================

/**
 * Layout Constants (SSOT)
 * Source: DeskOps-Dashboard-P1.md Section 1.1 (Lines 18-45)
 */
export const LAYOUT_CONFIG = {
  viewport: {
    minWidth: 320,
    maxWidth: 1920,
  },
  sidebar: {
    expanded: 240,
    collapsed: 64,
    transition: 300,
  },
  header: {
    height: 64,
    zIndex: 100,
  },
  content: {
    padding: 24,
    gap: 24,
    rowGap: 24,
  },
  breakpoints: {
    mobile: 640,
    tablet: 1024,
    desktop: 1440,
    wide: 1920,
  },
} as const;

// =============================================================================
// GRID SYSTEM CONFIGURATION
// =============================================================================

/**
 * Grid System Constants
 * Source: DeskOps-Dashboard-P1.md Section 1.2
 */
export const GRID_CONFIG = {
  desktop: {
    columns: 12,
    columnGap: 24,
    rowGap: 24,
    containerPadding: 24,
  },
  tablet: {
    columns: 8,
    columnGap: 24,
    rowGap: 24,
    containerPadding: 24,
  },
  mobile: {
    columns: 4,
    columnGap: 16,
    rowGap: 16,
    containerPadding: 16,
  },
} as const;

// =============================================================================
// ROW HEIGHT CONFIGURATION
// =============================================================================

/**
 * Row Heights
 * Source: DeskOps-Dashboard-P1.md Section 1.3
 */
export const ROW_HEIGHTS = {
  kpiCards: 140, // Row 1
  trendCharts: 400, // Row 2
  utilization: 350, // Row 3
  flowAnalysis: 400, // Row 4
  detailTables: 500, // Row 5 (minimum)
} as const;

// =============================================================================
// ROW 3 LAYOUT CONFIGURATION
// =============================================================================

/**
 * Row 3 Spacing (Source: Q&A Lines 85-88)
 * Manpower (30%), Equipment (40% + 30% = 70%), KPI (remaining)
 */
export const ROW3_LAYOUT = {
  manpower: { columns: 4, percentage: 33 }, // ~33% (4/12 columns)
  equipment: { columns: 5, percentage: 42 }, // ~42% (5/12 columns) for composition + trend
  kpi: { columns: 3, percentage: 25 }, // ~25% (3/12 columns)
} as const;

// =============================================================================
// HEADER COMPONENT DIMENSIONS
// =============================================================================

/**
 * Header Layout Specifications
 * Source: DeskOps-Dashboard-P1.md Section 2
 */
export const HEADER_CONFIG = {
  height: 64,
  padding: 24,
  gap: 16,
  zIndex: 100,
  distribution: {
    left: 68, // Left section percentage
    right: 32, // Right section percentage
  },
  siteSelector: {
    width: 200,
    height: 40,
    iconSize: 20,
    iconPosition: 12,
    borderRadius: 12,
    padding: {
      left: 40,
      right: 12,
    },
  },
  datePicker: {
    widthDefault: 180,
    widthExpanded: 320,
    height: 40,
    iconSize: 20,
    iconPosition: 12,
    borderRadius: 12,
    padding: {
      left: 40,
      right: 12,
    },
    transition: 300,
  },
  globalSearch: {
    widthDefault: 240,
    widthExpanded: 400,
    height: 40,
    iconSize: 20,
    iconPosition: 12,
    borderRadius: 12,
    padding: {
      left: 40,
      right: 12,
    },
    transition: 300,
  },
  userButton: {
    size: 40,
    borderRadius: 10,
  },
} as const;

// =============================================================================
// DROPDOWN SPECIFICATIONS
// =============================================================================

/**
 * Dropdown Configuration
 * Source: DeskOps-Dashboard-P1.md Section 2.2
 */
export const DROPDOWN_CONFIG = {
  siteSelector: {
    width: 280,
    maxHeight: 400,
    topOffset: 48,
    borderRadius: 12,
    zIndex: 110,
    itemHeight: 44,
    itemPadding: 16,
    animation: {
      duration: 200,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
  datePicker: {
    widthSingle: 320,
    widthRange: 640,
    topOffset: 48,
    borderRadius: 16,
    padding: 16,
    zIndex: 110,
    calendar: {
      monthNavHeight: 44,
      weekdayHeight: 32,
      dayCellSize: 40,
      dayCellRadius: 8,
      actionsHeight: 44,
      buttonHeight: 32,
      buttonMinWidth: 80,
      buttonRadius: 8,
    },
    rangePresets: {
      width: 120,
      itemHeight: 32,
      itemPadding: 8,
    },
    animation: {
      duration: 250,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
} as const;

// =============================================================================
// CHART CONFIGURATION
// =============================================================================

/**
 * Chart Default Configuration
 * Source: DeskOps-Dashboard-P1.md
 */
export const CHART_CONFIG = {
  margins: {
    top: 20,
    right: 30,
    bottom: 20,
    left: 20,
  },
  animation: {
    duration: 300,
    easing: "ease-in-out",
  },
  tooltip: {
    borderRadius: 8,
    padding: 12,
  },
} as const;

// =============================================================================
// TABLE CONFIGURATION
// =============================================================================

/**
 * Table Default Configuration
 * Source: DeskOps-Dashboard-P3.md
 */
export const TABLE_CONFIG = {
  rowHeight: 48,
  headerHeight: 56,
  pageSize: 10,
  pageSizeOptions: [10, 25, 50, 100],
  borderRadius: 12,
} as const;

// =============================================================================
// API ENDPOINTS
// =============================================================================

/**
 * Dashboard API Endpoints (SSOT)
 * Source: DeskOps-Dashboard-Implementation.md Lines 84-107
 */
export const API_ENDPOINTS = {
  metrics: {
    productionToday: "/api/metrics/production-today",
    receivedToday: "/api/metrics/received-today",
    dispatchedToday: "/api/metrics/dispatched-today",
    inventoryCurrent: "/api/metrics/inventory-current",
  },
  charts: {
    inventoryLevels: "/api/charts/inventory-levels",
    productionTarget: "/api/charts/production-target",
    manpowerAttendance: "/api/charts/manpower-attendance",
    equipmentUtilization: "/api/charts/equipment-utilization",
    receivedDispatched: "/api/charts/received-dispatched",
    recyclingRate: "/api/charts/recycling-rate",
  },
  tables: {
    movements: "/api/tables/movements",
    equipment: "/api/tables/equipment",
    manpower: "/api/tables/manpower",
  },
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type LayoutConfig = typeof LAYOUT_CONFIG;
export type GridConfig = typeof GRID_CONFIG;
export type RowHeights = typeof ROW_HEIGHTS;
export type Row3Layout = typeof ROW3_LAYOUT;
export type HeaderConfig = typeof HEADER_CONFIG;
export type DropdownConfig = typeof DROPDOWN_CONFIG;
export type ChartConfig = typeof CHART_CONFIG;
export type TableConfig = typeof TABLE_CONFIG;
export type ApiEndpoints = typeof API_ENDPOINTS;
