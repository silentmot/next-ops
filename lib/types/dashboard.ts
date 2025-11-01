/**
 * Dashboard Type Definitions (SSOT)
 * Source: DeskOps-Dashboard-P2.md Section 6.2 and related sections
 *
 * CRITICAL REQUIREMENTS:
 * - Import base types from @lib/constants
 * - DO NOT DUPLICATE type definitions
 * - Use these types throughout dashboard components
 */

import type {
  EquipmentType,
  ManpowerRole,
  ShiftType,
  UOM,
} from "@/lib/constants";

// =============================================================================
// EQUIPMENT DEFINITIONS (Extended from base types)
// =============================================================================

/**
 * Equipment definition codes
 * Source: DeskOps-Dashboard-P2.md Section 6.2
 */
export type EquipmentDef =
  | "CRUSHER"
  | "EXCAVATOR"
  | "LOADER"
  | "DUMPTRUCK"
  | "GENERATOR"
  | "BULLDOZER";

// =============================================================================
// METRIC RESPONSE INTERFACE
// =============================================================================

/**
 * Metric Response Interface
 * Source: DeskOps-Dashboard-P1.md Section 4.7
 */
export interface MetricResponse {
  value: number; // Current value in TON
  previousValue: number; // Yesterday's value or previous snapshot
  change: number; // Percentage change
  trend: "up" | "down" | "stable";
  sparkline: number[]; // Last 7 days
}

// =============================================================================
// INVENTORY DATA INTERFACE
// =============================================================================

/**
 * Inventory Data Interface
 * Source: DeskOps-Dashboard-P1.md Section 5.3
 */
export interface InventoryDataPoint {
  date: string; // ISO date string
  [materialType: string]: number | string; // Dynamic material keys
}

// =============================================================================
// PRODUCTION DATA INTERFACE
// =============================================================================

/**
 * Production Data Interface
 * Source: DeskOps-Dashboard-P1.md Section 5.4
 */
export interface ProductionDataPoint {
  date: string; // ISO date string
  production: number; // Actual production in TON
  target: number; // Target production in TON
  variance: number; // production - target
  variancePercent: number; // (variance / target) × 100
}

// =============================================================================
// MANPOWER ATTENDANCE INTERFACE
// =============================================================================

/**
 * Manpower Attendance Interface
 * Source: DeskOps-Dashboard-P2.md Section 6.3
 */
export interface ManpowerAttendanceData {
  date: string; // ISO date
  shift: ShiftType;
  present: {
    [role in ManpowerRole]: number; // Headcount
  };
  presentHours: {
    [role in ManpowerRole]: number; // Total hours worked
  };
  absent: number; // Absent count
  totalScheduled: number; // Total workforce
  attendanceRate: number; // (present / totalScheduled) × 100
}

// =============================================================================
// EQUIPMENT TREND DATA INTERFACE
// =============================================================================

/**
 * Equipment Trend Data Interface
 * Source: DeskOps-Dashboard-P2.md Section 6.4
 */
export interface EquipmentTrendData {
  date: string;
  CRUSHING_SCREENING: number; // Utilization rate 0-100
  EARTH_MOVING: number;
  HAULING: number;
  AUXILIARY: number;
}

// =============================================================================
// EQUIPMENT COMPOSITION DATA INTERFACE
// =============================================================================

/**
 * Equipment Composition Data Interface
 * Source: DeskOps-Dashboard-P2.md Section 6.4
 */
export interface EquipmentCompositionData {
  unit: string; // "CRUSHER_01"
  def: EquipmentDef;
  type: EquipmentType;
  runTime: number; // Percentage (0-100)
  idleTime: number; // Percentage
  downtime: number; // Percentage
  runHours: number; // Absolute hours
  idleHours: number;
  downtimeHours: number;
  totalAvailableHours: number;
  downtimeReasons?: string[]; // If tracked
}

// =============================================================================
// FLOW TREND DATA INTERFACE
// =============================================================================

/**
 * Flow Trend Data Interface
 * Source: DeskOps-Dashboard-P3.md Section 7.2
 */
export interface FlowTrendData {
  date: string; // ISO date
  received: number; // Received materials (TON)
  dispatched: number; // Dispatched materials (TON)
  net: number; // received - dispatched
  receivedCount: number; // Number of receive transactions
  dispatchCount: number; // Number of dispatch transactions
}

// =============================================================================
// RECYCLING RATE DATA INTERFACE
// =============================================================================

/**
 * Recycling Rate Data Interface
 * Source: DeskOps-Dashboard-P3.md Section 7.3
 */
export interface RecyclingRateData {
  date: string;
  rate: number; // Percentage (0-100)
  recycledMaterial: number; // TON
  totalReceived: number; // TON
  targetRate: number; // Target percentage
  variance: number; // rate - targetRate
}

// =============================================================================
// MOVEMENTS TABLE DATA INTERFACE
// =============================================================================

/**
 * Movements Table Row Interface
 * Source: DeskOps-Dashboard-P3.md Section 8.1
 */
export interface MovementsTableRow {
  id: string;
  date: string;
  time: string;
  type: "RECEIVED" | "DISPATCHED";
  material: string;
  quantity: number;
  uom: UOM;
  vehicleNo?: string;
  source?: string;
  destination?: string;
  operator?: string;
}

// =============================================================================
// EQUIPMENT TABLE DATA INTERFACE
// =============================================================================

/**
 * Equipment Table Row Interface
 * Source: DeskOps-Dashboard-P3.md Section 8.2
 */
export interface EquipmentTableRow {
  id: string;
  equipmentCode: string;
  equipmentName: string;
  type: EquipmentType;
  status: "OPERATIONAL" | "MAINTENANCE" | "BREAKDOWN" | "IDLE";
  runHours: number;
  idleHours: number;
  downtimeHours: number;
  utilizationRate: number;
  lastMaintenance?: string;
  nextMaintenance?: string;
}

// =============================================================================
// MANPOWER TABLE DATA INTERFACE
// =============================================================================

/**
 * Manpower Table Row Interface
 * Source: DeskOps-Dashboard-P3.md Section 8.3
 */
export interface ManpowerTableRow {
  id: string;
  employeeId: string;
  name: string;
  role: ManpowerRole;
  shift: ShiftType;
  date: string;
  hoursWorked: number;
  status: "PRESENT" | "ABSENT" | "LEAVE" | "OVERTIME";
  overtime?: number;
}

// =============================================================================
// DATE PICKER TYPES
// =============================================================================

/**
 * Date Picker Mode
 * Source: DeskOps-Dashboard-P1.md Section 2.3
 */
export type DateMode = "single" | "range";

/**
 * Date Selection Interface
 * Source: DeskOps-Dashboard-P1.md Section 2.3
 */
export interface DateSelection {
  mode: DateMode;
  start: Date;
  end?: Date;
}

/**
 * Date Picker Props Interface
 * Source: DeskOps-Dashboard-P1.md Section 2.3
 */
export interface DatePickerProps {
  mode: DateMode;
  value: DateSelection | null;
  onChange: (selection: DateSelection) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  showPresets?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

// =============================================================================
// SITE SELECTOR TYPES
// =============================================================================

/**
 * Site Interface
 * Source: DeskOps-Dashboard-P1.md Section 2.2
 */
export interface Site {
  id: string;
  code: string; // Display value: "ALASLA-29"
  name: string; // Full name for tooltip
  status: "active" | "inactive";
  location?: string;
}

/**
 * Site Selector Props Interface
 * Source: DeskOps-Dashboard-P1.md Section 2.2
 */
export interface SiteSelectorProps {
  sites: Site[];
  selectedSiteId: string | null;
  onSiteChange: (siteId: string) => void;
  loading?: boolean;
  disabled?: boolean;
}

// =============================================================================
// CHART COMPONENT PROPS
// =============================================================================

/**
 * Base Chart Props
 */
export interface BaseChartProps {
  height?: number;
  loading?: boolean;
  error?: string | null;
}

/**
 * Inventory Levels Chart Props
 */
export interface InventoryLevelsChartProps extends BaseChartProps {
  data: InventoryDataPoint[];
}

/**
 * Production Target Chart Props
 */
export interface ProductionTargetChartProps extends BaseChartProps {
  data: ProductionDataPoint[];
}

/**
 * Manpower Attendance Chart Props
 */
export interface ManpowerAttendanceChartProps extends BaseChartProps {
  data: ManpowerAttendanceData[];
}

/**
 * Equipment Utilization Chart Props
 */
export interface EquipmentUtilizationChartProps extends BaseChartProps {
  view: "trend" | "composition";
  trendData?: EquipmentTrendData[];
  compositionData?: EquipmentCompositionData[];
}

/**
 * Received Dispatched Chart Props
 */
export interface ReceivedDispatchedChartProps extends BaseChartProps {
  data: FlowTrendData[];
}

/**
 * Recycling Rate Chart Props
 */
export interface RecyclingRateChartProps extends BaseChartProps {
  data: RecyclingRateData[];
}

// =============================================================================
// TABLE COMPONENT PROPS
// =============================================================================

/**
 * Base Table Props
 */
export interface BaseTableProps {
  loading?: boolean;
  error?: string | null;
  pageSize?: number;
  currentPage?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

/**
 * Movements Table Props
 */
export interface MovementsTableProps extends BaseTableProps {
  data: MovementsTableRow[];
}

/**
 * Equipment Table Props
 */
export interface EquipmentTableProps extends BaseTableProps {
  data: EquipmentTableRow[];
}

/**
 * Manpower Table Props
 */
export interface ManpowerTableProps extends BaseTableProps {
  data: ManpowerTableRow[];
}

// =============================================================================
// DASHBOARD STATE TYPES
// =============================================================================

/**
 * Dashboard Filter State
 */
export interface DashboardFilters {
  siteId: string;
  dateRange: DateSelection;
  refreshInterval?: number; // in milliseconds
}

/**
 * Dashboard Data Loading State
 */
export interface DashboardLoadingState {
  metrics: boolean;
  charts: boolean;
  tables: boolean;
}

/**
 * Dashboard Error State
 */
export interface DashboardErrorState {
  metrics: string | null;
  charts: string | null;
  tables: string | null;
}
