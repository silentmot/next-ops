# DeskOps Dashboard Implementation Plan

**GZANSP × AOC Compliance**: GZANSP Adhered: Sources listed, no inventions.

**Mode**: Procedural + Factual

**Date**: 2025-11-01

---

## GZANSP Compliance Declaration

```
I MUST follow GZANSP × AOC verbatim in EVERY response.
I WILL NOT assume, invent, skip, or deviate from provided sources.
Any violation INVALIDATES my output and requires complete restart.
CONFIRMATION: "GZANSP Adhered: Sources listed, no inventions."
```

---

## Source Documents

**Primary Sources**:

- `docs/Dashboard/DeskOps-Dashboard-P1.md` (2285 lines) - Layout, Header, Sidebar, KPI Cards (Row 1), Trend Charts (Row 2)
- `docs/Dashboard/DeskOps-Dashboard-P2.md` (697 lines) - Row 3 Utilization Metrics (Manpower, Equipment, KPI)
- `docs/Dashboard/DeskOps-Dashboard-P3.md` (1159 lines) - Row 4 Flow Analysis, Row 5 Detail Tables
- `docs/Dashboard/DeskOps-Dashboard-Appendix.md` (1084 lines) - Optional features, variations, patterns

**Referenced Sources**:

- `docs/I've read through the DeskOps-Dashboard.md` (259 lines) - Q&A clarifications
  - Lines 69-73: API data fetching confirmation, default date range (Daily), hours display in tooltips, date picker in header
  - Lines 85-91: Row 3 spacing (40% Composition Bar, 30% Trend Line, 30% Manpower), heatmap skipped, DeskOps definition

---

## Scope Declaration

**Files to Create** (16 files):

### Core Files

- `lib/constants/dashboard.ts` - Dashboard constants (SSOT)
- `lib/types/dashboard.ts` - Dashboard type definitions
- `lib/stores/dashboardStore.ts` - Dashboard state management (Zustand)

### Pages

- `app/(dashboard)/page.tsx` - Main dashboard page

### Layout Components

- `components/dashboard/Header.tsx` - Header component (64px fixed)
- `components/dashboard/Sidebar.tsx` - Sidebar navigation (240px/64px)

### Header Sub-components

- `components/dashboard/header/SiteSelector.tsx` - Site selection dropdown
- `components/dashboard/header/DatePicker.tsx` - Date range picker
- `components/dashboard/header/GlobalSearch.tsx` - Global search with keyboard shortcut
- `components/dashboard/header/ThemeToggle.tsx` - Dark/light theme toggle

### Dashboard Components

- `components/dashboard/MetricCard.tsx` - KPI metric cards (Row 1)

### Chart Components (Rows 2-4)

- `components/dashboard/charts/InventoryLevelsChart.tsx` - Inventory area chart (Row 2 Left)
- `components/dashboard/charts/ProductionTargetChart.tsx` - Production vs target chart (Row 2 Right)
- `components/dashboard/charts/ManpowerAttendanceChart.tsx` - Manpower tracking chart (Row 3 Left)
- `components/dashboard/charts/EquipmentUtilizationChart.tsx` - Equipment tracking dual-view chart (Row 3 Middle)
- `components/dashboard/charts/ReceivedDispatchedChart.tsx` - Flow analysis chart (Row 4 Left)
- `components/dashboard/charts/RecyclingRateChart.tsx` - Recycling rate chart (Row 4 Right)

### Table Components (Row 5)

- `components/dashboard/tables/MovementsTable.tsx` - Movements data table
- `components/dashboard/tables/EquipmentTable.tsx` - Equipment data table
- `components/dashboard/tables/ManpowerTable.tsx` - Manpower data table

**Endpoints to Verify** (13 endpoints):

### Metrics API (Row 1)

- `/api/metrics/production-today` - Total production today metric
- `/api/metrics/received-today` - Received materials today metric
- `/api/metrics/dispatched-today` - Total dispatched today metric
- `/api/metrics/inventory-current` - Current inventory status metric

### Charts API (Rows 2-4)

- `/api/charts/inventory-levels` - 30-day inventory by material
- `/api/charts/production-target` - Daily production vs target
- `/api/charts/manpower-attendance` - Daily attendance by role
- `/api/charts/equipment-utilization?view={trend|composition}` - Equipment utilization data
- `/api/charts/received-dispatched` - Daily received vs dispatched
- `/api/charts/recycling-rate` - Recycling rate over time

### Tables API (Row 5)

- `/api/tables/movements` - Movements table data (paginated)
- `/api/tables/equipment` - Equipment table data (paginated)
- `/api/tables/manpower` - Manpower table data (paginated)

**Coverage Requirement**: 100% of items must be accounted for

---

## Implementation Phases

### Phase 1: Foundation & Layout Constants

**Source**: `DeskOps-Dashboard-P1.md` Section 1 + `DeskOps-Dashboard-P2.md` Section 6.2

#### Task 1.1: Layout Constants (SSOT)

**File**: `lib/constants/dashboard.ts`

**Source**: `DeskOps-Dashboard-P1.md` Section 1.1 (Lines 18-45)

```typescript
// Layout Constants (SSOT)
// Source: DeskOps-Dashboard-P1.md Section 1.1
export const LAYOUT_CONFIG = {
  viewport: {
    minWidth: 320,
    maxWidth: 1920
  },
  sidebar: {
    expanded: 240,
    collapsed: 64,
    transition: 300
  },
  header: {
    height: 64,
    zIndex: 100
  },
  content: {
    padding: 24,
    gap: 24,
    rowGap: 24
  },
  breakpoints: {
    mobile: 640,
    tablet: 1024,
    desktop: 1440,
    wide: 1920
  }
} as const;

// Grid System Constants
// Source: DeskOps-Dashboard-P1.md Section 1.2
export const GRID_CONFIG = {
  desktop: {
    columns: 12,
    columnGap: 24,
    rowGap: 24,
    containerPadding: 24
  },
  tablet: {
    columns: 8,
    columnGap: 24,
    rowGap: 24,
    containerPadding: 24
  },
  mobile: {
    columns: 4,
    columnGap: 16,
    rowGap: 16,
    containerPadding: 16
  }
} as const;

// Row Heights
// Source: DeskOps-Dashboard-P1.md Section 1.3
export const ROW_HEIGHTS = {
  kpiCards: 140,        // Row 1
  trendCharts: 400,     // Row 2
  utilization: 350,     // Row 3
  flowAnalysis: 400,    // Row 4
  detailTables: 500     // Row 5 (minimum)
} as const;

// Row 3 Spacing (Source: Q&A Lines 85-88)
export const ROW3_LAYOUT = {
  manpower: { columns: 4, percentage: 33 },      // 30% per Q&A, but 4/12 columns = 33%
  equipment: { columns: 5, percentage: 42 },     // 40% Composition + 30% Trend per Q&A
  kpi: { columns: 3, percentage: 25 }
} as const;
```

#### Task 1.2: Type Definitions (SSOT)

**File**: `lib/types/dashboard.ts`

**Source**: `DeskOps-Dashboard-P2.md` Section 6.2 (Lines 67-96)

```typescript
// Core Type Definitions
// Source: DeskOps-Dashboard-P2.md Section 6.2

export type ManpowerRole =
  | "EQUIPMENT_DRIVER"
  | "CRUSHER_OPERATOR"
  | "MAINTENANCE_WORKER"
  | "LABORER"
  | "SECURITY";

export type EquipmentDef =
  | "CRUSHER"
  | "EXCAVATOR"
  | "LOADER"
  | "DUMPTRUCK"
  | "GENERATOR"
  | "BULLDOZER";

export type EquipmentType =
  | "CRUSHING_SCREENING"
  | "EARTH_MOVING"
  | "HAULING"
  | "AUXILIARY";

export type ShiftType = "MORNING" | "AFTERNOON" | "NIGHT";

export type UOM = "TON" | "LOAD" | "HOUR" | "COUNT" | "PERCENT";

// Metric Response Interface
// Source: DeskOps-Dashboard-P1.md Section 4.7
export interface MetricResponse {
  value: number;          // Current value in TON
  previousValue: number;  // Yesterday's value or previous snapshot
  change: number;         // Percentage change
  trend: 'up' | 'down' | 'stable';
  sparkline: number[];    // Last 7 days
}

// Inventory Data Interface
// Source: DeskOps-Dashboard-P1.md Section 5.3
export interface InventoryDataPoint {
  date: string;           // ISO date string
  [materialType: string]: number | string; // Dynamic material keys
}

// Production Data Interface
// Source: DeskOps-Dashboard-P1.md Section 5.4
export interface ProductionDataPoint {
  date: string;           // ISO date string
  production: number;     // Actual production in TON
  target: number;         // Target production in TON
  variance: number;       // production - target
  variancePercent: number; // (variance / target) × 100
}

// Manpower Attendance Interface
// Source: DeskOps-Dashboard-P2.md Section 6.3
export interface ManpowerAttendanceData {
  date: string;           // ISO date
  shift: ShiftType;
  present: {
    [role in ManpowerRole]: number; // Headcount
  };
  presentHours: {
    [role in ManpowerRole]: number; // Total hours worked
  };
  absent: number;         // Absent count
  totalScheduled: number; // Total workforce
  attendanceRate: number; // (present / totalScheduled) × 100
}

// Equipment Trend Data Interface
// Source: DeskOps-Dashboard-P2.md Section 6.4
export interface EquipmentTrendData {
  date: string;
  CRUSHING_SCREENING: number; // Utilization rate 0-100
  EARTH_MOVING: number;
  HAULING: number;
  AUXILIARY: number;
}

// Equipment Composition Data Interface
// Source: DeskOps-Dashboard-P2.md Section 6.4
export interface EquipmentCompositionData {
  unit: string;          // "CRUSHER_01"
  def: EquipmentDef;
  type: EquipmentType;
  runTime: number;       // Percentage (0-100)
  idleTime: number;      // Percentage
  downtime: number;      // Percentage
  runHours: number;      // Absolute hours
  idleHours: number;
  downtimeHours: number;
  totalAvailableHours: number;
  downtimeReasons?: string[]; // If tracked
}

// Flow Trend Data Interface
// Source: DeskOps-Dashboard-P3.md Section 7.2
export interface FlowTrendData {
  date: string;           // ISO date
  received: number;       // Received materials (TON)
  dispatched: number;     // Dispatched materials (TON)
  net: number;            // received - dispatched
  receivedCount: number;  // Number of receive transactions
  dispatchCount: number;  // Number of dispatch transactions
}

// Recycling Rate Data Interface
// Source: DeskOps-Dashboard-P3.md Section 7.3
export interface RecyclingRateData {
  date: string;
  rate: number;              // Percentage (0-100)
  recycledMaterial: number;  // TON
  totalReceived: number;     // TON
  targetRate: number;        // Target percentage
  variance: number;          // rate - targetRate
}
```

#### Task 1.3: Dashboard Store (Zustand)

**File**: `lib/stores/dashboardStore.ts`

**Source**: Q&A document (state management answer)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      // Default site: ALASLA-29
      currentSite: 'ALASLA-29',
      setCurrentSite: (site) => set({ currentSite: site }),

      // Default date range: Last 7 days
      dateRange: {
        start: new Date(new Date().setDate(new Date().getDate() - 7)),
        end: new Date(),
      },
      setDateRange: (range) => set({ dateRange: range }),

      // Sidebar default: Expanded
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      // Refresh tracking
      lastRefresh: new Date(),
      triggerRefresh: () => set({ lastRefresh: new Date() }),
    }),
    {
      name: 'deskops-dashboard-store',
    }
  )
);
```

---

### Phase 2: Header & Navigation Components

**Source**: `DeskOps-Dashboard-P1.md` Sections 2 & 3

#### Task 2.1: Main Header Component

**File**: `components/dashboard/Header.tsx`

**Source**: `DeskOps-Dashboard-P1.md` Section 2 (Lines 47-70)

**Requirements**:

- **Height**: 64px (fixed)
- **Width**: 100% viewport width
- **Position**: Sticky top
- **Z-index**: 100
- **Layout**: Flex, justify-content: space-between, align-items: center
- **Padding**: 0 24px
- **Gap**: 16px
- **Visual Treatment**: Glass morphism base, border-bottom 1px solid, backdrop-filter blur(10px) saturate(180%)

**Structure**:

```
┌────────────────────────────────────────────────────────────────┐
│ [Site Selector] [Date Picker] [Global Search] {Theme} [Clerk] │
└────────────────────────────────────────────────────────────────┘
```

**Layout Distribution**:

- Left section (68%): Site Selector + Date Picker + Global Search
- Right section (32%): Theme Toggle + Clerk Component

**Implementation**:

```typescript
import { SiteSelector } from './header/SiteSelector';
import { DatePicker } from './header/DatePicker';
import { GlobalSearch } from './header/GlobalSearch';
import { ThemeToggle } from './header/ThemeToggle';
import { UserButton } from '@clerk/nextjs';

export function Header() {
  return (
    <header className="dashboard-header">
      {/* Left section */}
      <div className="header-left">
        <SiteSelector />
        <DatePicker />
        <GlobalSearch />
      </div>

      {/* Right section */}
      <div className="header-right">
        <ThemeToggle />
        <UserButton
          appearance={{
            elements: {
              avatarBox: {
                width: 40,
                height: 40,
                borderRadius: 10
              }
            }
          }}
          afterSignOutUrl="/"
          showName={false}
        />
      </div>
    </header>
  );
}
```

**Styling** (Use design tokens, no hardcoded values):

```css
.dashboard-header {
  height: 64px;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  gap: 16px;
  background: var(--glass-base);
  border-bottom: 1px solid var(--border-color);
  backdrop-filter: blur(10px) saturate(180%);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  max-width: 68%;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
```

#### Task 2.2: Site Selector Component

**File**: `components/dashboard/header/SiteSelector.tsx`

**Source**: `DeskOps-Dashboard-P1.md` Section 2.2 (Lines 72-169)

**Dimensions & Positioning**:

- Width: 200px (fixed)
- Height: 40px
- Position: Leftmost element
- Margin-right: 16px

**Structure**:

```css
.site-selector {
  width: 200px;
  height: 40px;
  border-radius: 12px;
  padding: 0 12px 0 40px;
  position: relative;
}
```

**Icon Configuration**:

- Position: Absolute left at 12px
- Size: 20×20px
- Icon: Building/location marker
- Vertical align: center

**Text Content**:

- Placeholder text: "Select site..."
- Selected text: Site code (e.g., "ALASLA-29")
- Font size: 14px
- Font weight: 500
- Text overflow: ellipsis
- White-space: nowrap

**Interaction States**:

- **Hover**: Cursor pointer, transition 200ms, border opacity increase, background opacity increase
- **Focus/Active**: Border width 2px, focus ring 3px blur, dropdown opens below
- **Disabled**: Cursor not-allowed, opacity 0.5, pointer-events none

**Dropdown Specifications**:

- **Container Width**: 280px
- **Max-height**: 400px
- **Position**: Absolute, top offset 48px (8px gap from trigger), left align 0
- **Border-radius**: 12px
- **Overflow-y**: auto
- **Z-index**: 110

**Animation**:

- Enter: fade + translateY(-8px to 0)
- Duration: 200ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Exit: fade + translateY(0 to -8px)

**Item Structure**:

```css
.site-option {
  height: 44px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

**Item Content Layout**:

- Left: Site code (primary text)
- Right: Checkmark icon (if selected) 20×20px
- Optional: Status badge (8px dot indicator)

**Item States**:

- Default: Base background
- Hover: Background highlight, cursor pointer
- Selected: Background emphasis, font weight 600, checkmark visible
- Focus (keyboard): Focus ring, background highlight

**Data Contract**:

```typescript
interface Site {
  id: string;
  code: string;          // Display value: "ALASLA-29"
  name: string;          // Full name for tooltip
  status: "active" | "inactive";
  location?: string;
}

interface SiteSelectorProps {
  sites: Site[];
  selectedSiteId: string | null;
  onSiteChange: (siteId: string) => void;
  loading?: boolean;
  disabled?: boolean;
}
```

**Keyboard Navigation**:

- Tab: Focus selector
- Enter/Space: Open dropdown
- Arrow Up/Down: Navigate options
- Enter: Select option
- Escape: Close dropdown

#### Task 2.3: Date Picker Component

**File**: `components/dashboard/header/DatePicker.tsx`

**Source**: `DeskOps-Dashboard-P1.md` Section 2.3 (Lines 171-403) + Q&A Lines 73 (placement in header)

**Dimensions & Positioning**:

- Width: 180px (default) → 320px (range mode open)
- Height: 40px
- Position: After Site Selector
- Margin-right: 16px

**Structure**:

```css
.date-picker {
  width: 180px;
  height: 40px;
  border-radius: 12px;
  padding: 0 12px 0 40px;
  position: relative;
  transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Icon Configuration**:

- Position: Absolute left at 12px
- Size: 20×20px
- Icon: Calendar
- Vertical align: center

**Text Display**:

- Placeholder: "Select date..."
- Single date format: "Oct 31, 2025"
- Range format: "Oct 1 - Oct 31, 2025"
- Font size: 14px
- Font weight: 500
- Text overflow: ellipsis

**Interaction States**:

- **Hover**: Cursor pointer, transition 200ms, border opacity increase, background opacity increase
- **Focus/Active**: Border width 2px, focus ring 3px blur, width expansion (if range mode) 180px → 320px, calendar dropdown opens

**Calendar Dropdown Specifications**:

- **Container Width**: 320px (single mode) / 640px (range mode)
- **Position**: Absolute, top offset 48px, right align 0
- **Border-radius**: 16px
- **Padding**: 16px
- **Z-index**: 110

**Animation**:

- Enter: scale(0.95) + fade
- Duration: 250ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Exit: scale(0.95) + fade

**Calendar Layout Structure**:

```
┌──────────────────────────────┐
│  [◀] October 2025 [▶]       │ ← Month navigation (44px height)
├──────────────────────────────┤
│ Su Mo Tu We Th Fr Sa        │ ← Weekday header (32px height)
│          1  2  3  4  5       │
│  6  7  8  9 10 11 12        │
│ 13 14 15 16 17 18 19        │
│ 20 21 22 23 24 25 26        │
│ 27 28 29 30 [31]            │ ← Day cells (40×40px each)
├──────────────────────────────┤
│ [Today] [Clear] [Apply]     │ ← Actions (44px height)
└──────────────────────────────┘
```

**Month Navigation**:

- Height: 44px
- Prev/Next arrows: 32×32px touch targets
- Month label: Font size 16px, font weight 600
- Centered text between arrows

**Weekday Header**:

- Height: 32px
- Font size: 12px
- Font weight: 600
- Text transform: uppercase
- Letter spacing: 0.5px

**Day Cell**:

```css
.day-cell {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
}
```

**Day Cell States**:

- Default: Base background
- Hover: Background highlight
- Today: Border 2px solid
- Selected: Background emphasis, font weight 600
- Disabled (other month): Opacity 0.3, cursor not-allowed
- In range (range mode): Light background fill

**Action Buttons** (Bottom row):

- Height: 44px total
- Padding: 12px
- Gap: 8px between buttons
- Button height: 32px

**Button Specifications**:

- "Today": Jump to current date, secondary style
- "Clear": Reset selection, ghost style
- "Apply": Confirm selection (range mode only), primary style
- Min-width: 80px each
- Border-radius: 8px

**Range Selection Mode**:

- **Activation**: Toggle switch in dropdown header, label "Single Date" / "Date Range", width expands to 640px when activated

**Range Selection Behavior**:

1. First click: Set start date (solid highlight)
2. Hover after first click: Preview end date (dashed outline)
3. Hover between dates: Preview range fill
4. Second click: Set end date (solid highlight)
5. All dates between: Background fill

**Visual Indicators**:

- Start date: Left-rounded background
- End date: Right-rounded background
- In-range dates: Full-width background, no border-radius
- Hover preview: Dashed border

**Range Presets** (Optional sidebar, 120px width):

- Today
- Last 7 Days
- Last 30 Days
- This Month
- Last Month
- Custom
- Each preset: 32px height, 8px padding

**Data Contract**:

```typescript
type DateMode = "single" | "range";

interface DateSelection {
  mode: DateMode;
  start: Date;
  end?: Date;
}

interface DatePickerProps {
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
```

**Keyboard Navigation**:

- Tab: Focus date picker
- Enter/Space: Open calendar
- Arrow keys: Navigate days
- Shift + Arrow keys: Navigate weeks
- Page Up/Down: Navigate months
- Home/End: First/last day of month
- Enter: Select date
- Escape: Close calendar

---

**(Plan continues with remaining tasks...)**
