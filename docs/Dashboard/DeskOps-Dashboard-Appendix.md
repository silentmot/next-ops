# DeskOps Dashboard Appendix
<!--markdownlint-disable-file-->

**Additional features, variations, and detailed specifications for the DeskOps Dashboard.**

**Source**: Extracted from DeskOps-Dashboard.md

---

## **TABLE OF CONTENTS**

1. [Chart Variations](#1-chart-variations)
2. [Interaction Patterns](#2-interaction-patterns)
3. [Export Functionality](#3-export-functionality)
4. [Table Virtualization](#4-table-virtualization)
5. [Phase 2 Features](#5-phase-2-features)

---

## **1. CHART VARIATIONS**

### 1.1 Equipment Utilization Heatmap View

**Source**: DeskOps-Dashboard.md lines 2832-2867

**Activation**: Third view toggle option "Heatmap"

**Type**: Calendar Heatmap
**Purpose**: Quickly identify patterns over time

**Structure**:

```
        Day 1  Day 2  Day 3  ...
CRUSHER_01   [85%] [72%] [90%]
CRUSHER_02   [45%] [80%] [88%]
EXCAVATOR_01 [92%] [65%] [78%]
...
```

**Cell Specifications**:

```css
.heatmap-cell {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease;
}
```

- Size: 32×32px
- Border-radius: 4px
- Color intensity: Based on utilization rate
- Gradient: 0% (danger) → 50% (warning) → 80%+ (success)

**Color Mapping**:

```typescript
const getHeatmapColor = (utilizationRate: number): string => {
  if (utilizationRate >= 80) return SUCCESS_COLOR;
  if (utilizationRate >= 50) return WARNING_COLOR;
  return DANGER_COLOR;
};

const getHeatmapOpacity = (utilizationRate: number): number => {
  return Math.max(0.2, utilizationRate / 100);
};
```

**Cell States**:

- **Default**: Base color with opacity based on rate
- **Hover**: Border highlight (2px), tooltip shows details, scale 1.1
- **Click**: Drill down to day view (opens modal)
- **No data**: Gray background, dashed border

**Tooltip Content**:

```
CRUSHER 01 - Oct 31, 2025
─────────────────────────
Utilization: 85.2%
Run Hours: 204 / 240
Status: Above Target
```

**Tooltip Specifications**:

```css
.heatmap-tooltip {
  min-width: 200px;
  padding: 12px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.5;
  backdrop-filter: blur(10px);
}
```

**Drill-Down Modal**:

**Trigger**: Click on cell
**Content**: Detailed day view for selected equipment unit

**Modal Structure**:

```
┌────────────────────────────────┐
│ CRUSHER 01 - Oct 31, 2025  [X]│
├────────────────────────────────┤
│ Utilization: 85.2%             │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                │
│ Run Time: 204 hours (85.2%)    │
│ Idle Time: 26 hours (10.8%)    │
│ Downtime: 10 hours (4.0%)      │
│                                │
│ Downtime Reasons:              │
│ • Scheduled Maintenance (6h)   │
│ • Belt Replacement (4h)        │
│                                │
│ [View Full Log] [Export]       │
└────────────────────────────────┘
```

**Implementation**:

```typescript
interface HeatmapData {
  unit: string;
  def: EquipmentDef;
  type: EquipmentType;
  dailyUtilization: Array<{
    date: string;
    rate: number;
    runHours: number;
    availableHours: number;
  }>;
}
```

---

### 1.2 Recycling Rate Moving Average

**Source**: DeskOps-Dashboard.md lines 3247-3269

**Type**: Additional line overlay on Recycling Rate chart
**Purpose**: Show trend smoothing

**Moving Average Line**:

- Type: 7-day moving average
- Style: Dashed, lower opacity
- Color: Same as main line
- Purpose: Show trend smoothing

**Configuration**:

```typescript
<Line
  type="monotone"
  dataKey="movingAverage"
  stroke={SUCCESS_COLOR}
  strokeWidth={2}
  strokeDasharray="3 3"
  opacity={0.5}
  dot={false}
  name="7-Day Average"
/>
```

**Calculation**:

```typescript
const calculateMovingAverage = (
  data: RecyclingRateData[],
  windowSize: number = 7
): number[] => {
  const result: number[] = [];

  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const window = data.slice(start, i + 1);
    const average = window.reduce((sum, d) => sum + d.rate, 0) / window.length;
    result.push(average);
  }

  return result;
};
```

**Toggle Control**:

```css
.moving-average-toggle {
  position: absolute;
  top: 16px;
  right: 56px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}
```

**Toggle Content**:

- Checkbox: 16×16px
- Label: "Show 7-day average"
- Default: Checked

---

## **2. INTERACTION PATTERNS**

### 2.1 Flow Trend Drill-Down

**Source**: DeskOps-Dashboard.md lines 3091-3102

**Trigger**: Click on bar or date in Flow Trend chart
**Action**: Opens modal with detailed transactions

**Modal Dimensions**:

```css
.drill-down-modal {
  width: 800px;
  max-height: 80vh;
  border-radius: 16px;
  padding: 0;
  overflow: hidden;
}
```

**Modal Structure**:

```
┌──────────────────────────────────────────┐
│ Oct 31, 2025 - Material Flow          [X]│
├──────────────────────────────────────────┤
│ [Received (15)] [Dispatched (12)]        │ ← Tabs
├──────────────────────────────────────────┤
│ Time    Material         Qty    Source   │
│ 08:15   Aggregate Base   45.2T  CDW-001  │
│ 09:30   Crushed Concrete 32.1T  CDW-002  │
│ 10:45   Recycled Asphalt 28.9T  CDW-003  │
│ ...                                       │
├──────────────────────────────────────────┤
│ Total: 1,234.56 T         [Export] [Close]│
└──────────────────────────────────────────┘
```

**Header Section** (64px):

- Date display: 18px font, bold
- Close button: 32×32px, top-right
- Background: Glass morphism

**Tab Section** (48px):

```css
.drill-down-tabs {
  display: flex;
  border-bottom: 1px solid;
  padding: 0 24px;
}

.drill-down-tab {
  height: 48px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 200ms;
}

.drill-down-tab.active {
  border-bottom-color: var(--accent-color);
  font-weight: 600;
}
```

**Tab Content**:

- Label: "Received" or "Dispatched"
- Badge: Transaction count (e.g., "(15)")
- Badge style: 20px height, 6px padding, border-radius 10px

**Table Section** (Scrollable):

```css
.drill-down-table {
  max-height: calc(80vh - 176px);
  overflow-y: auto;
  padding: 0 24px;
}
```

**Table Columns**:

1. Time (80px) - HH:mm format
2. Material (200px) - Material type name
3. Quantity (100px) - Number with unit
4. Source/Destination (180px) - Origin or target
5. Vehicle ID (120px) - Optional
6. Notes (flex) - Optional

**Row Specifications**:

```css
.drill-down-row {
  height: 48px;
  display: grid;
  grid-template-columns: 80px 200px 100px 180px 120px 1fr;
  align-items: center;
  border-bottom: 1px solid;
  transition: background 150ms;
}

.drill-down-row:hover {
  background: rgba(255, 255, 255, 0.05);
}
```

**Footer Section** (64px):

```css
.drill-down-footer {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-top: 1px solid;
}
```

**Footer Content**:

- Left: Total summary (e.g., "Total: 1,234.56 T")
- Right: Action buttons (Export, Close)

**Export Button**:

- Opens export dialog pre-configured for this date
- Default format: Excel
- Includes all transactions from both tabs

---

### 2.2 Chart Tooltip Interactions

**Universal Tooltip Behavior**:

**Trigger**: Hover over chart element
**Delay**: 100ms
**Position**: Follow cursor with 10px offset
**Boundary**: Constrain within chart area

**Tooltip Container**:

```css
.chart-tooltip {
  min-width: 200px;
  max-width: 320px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid;
  backdrop-filter: blur(10px) saturate(180%);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  pointer-events: none;
  z-index: 1000;
}
```

**Animation**:

```css
@keyframes tooltip-fade-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chart-tooltip {
  animation: tooltip-fade-in 150ms ease-out;
}
```

**Content Structure**:

```
┌──────────────────────────┐
│ Date: Oct 31, 2025      │ ← Header (bold, 14px)
├──────────────────────────┤
│ ● Material A: 123.45 T  │ ← Entry (dot + label + value)
│ ● Material B: 234.56 T  │
│ ● Material C: 345.67 T  │
├──────────────────────────┤
│ Total: 703.68 T         │ ← Footer (bold, 14px)
└──────────────────────────┘
```

**Entry Specifications**:

```css
.tooltip-entry {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  font-size: 13px;
}

.tooltip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.tooltip-label {
  flex: 1;
  opacity: 0.9;
}

.tooltip-value {
  font-weight: 600;
  font-feature-settings: 'tnum' on;
}
```

---

## **3. EXPORT FUNCTIONALITY**

**Source**: DeskOps-Dashboard.md lines 4324-4763

### 3.1 Export Dialog

**Trigger Locations**:

1. Header toolbar (global export)
2. Individual chart export buttons
3. Table export dropdown
4. Right-click context menu on charts/tables

**Dialog Dimensions**:

```css
.export-dialog {
  width: 480px;
  max-height: 680px;
  border-radius: 16px;
  padding: 24px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}
```

**Dialog Animation**:

```css
@keyframes dialog-enter {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
```

**Backdrop**:

```css
.dialog-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
}
```

### 3.2 Dialog Structure

**Header** (56px):

```
┌────────────────────────────────┐
│ Export Data              [X]   │
└────────────────────────────────┘
```

- Title: "Export Data" (18px, font-weight 600)
- Close button: 32×32px, top-right

**Content** (Scrollable):

```
┌────────────────────────────────┐
│ Format                         │
│ ○ Excel (.xlsx)                │
│ ○ PDF (.pdf)                   │
│ ○ CSV (.csv)                   │
├────────────────────────────────┤
│ Module                         │
│ [Dropdown: Dashboard ▼]        │
├────────────────────────────────┤
│ Filters                        │
│ Site: [ALASLA-29 ▼]           │
│ Date Range: [Oct 1-31 ▼]     │
│ Material: [All ▼]             │
├────────────────────────────────┤
│ Granularity                    │
│ ○ Daily                        │
│ ○ Weekly                       │
│ ○ Monthly                      │
├────────────────────────────────┤
│ Columns                        │
│ ☑ Date                         │
│ ☑ Material                     │
│ ☑ Quantity                     │
│ ☐ Notes                        │
├────────────────────────────────┤
│ Grouping                       │
│ [None ▼]                       │
├────────────────────────────────┤
│ Layout (PDF only)              │
│ ○ Portrait                     │
│ ○ Landscape                    │
└────────────────────────────────┘
```

**Footer** (64px):

```
┌────────────────────────────────┐
│ [Cancel]          [Export]     │
└────────────────────────────────┘
```

- Cancel: Secondary button (left)
- Export: Primary button (right)
- Button height: 40px

### 3.3 Field Specifications

#### Format Selection

**Type**: Radio buttons
**Options**:

1. Excel (.xlsx) - Default
2. PDF (.pdf)
3. CSV (.csv)
4. Power BI (.pbix) - Optional if supported

**Layout**:

```css
.format-option {
  height: 40px;
  padding: 0 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}
```

**Option Content**:

- Radio button: 20×20px
- Icon: File type icon (20×20px)
- Label: "Excel (.xlsx)"
- Description: Small text (12px, opacity 0.7)

#### Module Selection

**Type**: Dropdown
**Width**: 100%
**Height**: 40px

**Options**:

- Dashboard (all metrics summary)
- Production
- Dispatch
- Received
- Equipment
- Manpower
- Inventory
- Reports (custom)

**Default**: Current module/page user is on

#### Filters Section

**Site Filter**:

- Type: Dropdown
- Default: Current selected site
- Multi-select: Optional (allow "All Sites")

**Date Range Filter**:

- Type: Date picker (range mode)
- Default: Current selected date range
- Quick presets: Today, Last 7 Days, Last 30 Days, This Month

**Material Filter** (if applicable to module):

- Type: Multi-select dropdown
- Options: All material types
- Default: All selected

**Additional Filters**: Dynamic based on module

#### Granularity Selection

**Type**: Radio buttons
**Options**:

1. Daily (default)
2. Weekly
3. Monthly

**Visibility**: Hidden if not applicable (e.g., single-date export)

#### Columns Selection

**Type**: Checkbox list
**Max-height**: 200px (scrollable if many columns)

**Structure**:

```css
.column-checkbox-item {
  height: 36px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
```

**Features**:

- Select All / Deselect All toggle
- Required columns: Disabled checkboxes (always selected)
- Optional columns: User can toggle

**Default**: All columns selected

#### Grouping Selection

**Type**: Dropdown
**Options**:

- None (default)
- Group by Material
- Group by Date
- Group by Site
- Group by Type (context-dependent)

**Visibility**: Only for modules with groupable data

#### Layout Selection

**Type**: Radio buttons
**Options**:

1. Portrait
2. Landscape (default)

**Visibility**: Only when PDF format selected

### 3.4 Export Process Flow

**Sequence**:

1. User clicks Export button (any location)
2. Dialog opens with pre-populated fields
3. User configures export options
4. User clicks "Export" button
5. Client-side validation (<150ms)
6. If valid: Job queued, toast notification
7. Progress indicator with estimated time
8. Server generates file
9. File ready notification (<10s target)
10. Download link provided or auto-download

#### Validation Rules

**Required Fields**:

- Format must be selected
- Module must be selected
- At least one column must be selected
- Date range must be valid (start <= end)

**Validation Errors**:

- Display: Inline below field with error icon
- Color: Danger color from tokens
- Font size: 12px
- Prevent submit: Disable Export button

**Example Error**:

```
⚠ Date range is invalid. End date must be after start date.
```

#### Toast Notifications

**Export Initiated**:

```
┌────────────────────────────────┐
│ ⏳ Export Started              │
│ Preparing your file...         │
└────────────────────────────────┘
```

- Duration: Persistent until complete
- Position: Bottom-right
- Type: Info

**Export Complete**:

```
┌────────────────────────────────┐
│ ✓ Export Ready                 │
│ [Download File]                │
└────────────────────────────────┘
```

- Duration: 10 seconds or until dismissed
- Position: Bottom-right
- Type: Success
- Action: Download button

**Export Failed**:

```
┌────────────────────────────────┐
│ ✕ Export Failed                │
│ An error occurred. [Retry]     │
└────────────────────────────────┘
```

- Duration: Until dismissed
- Position: Bottom-right
- Type: Error
- Action: Retry button

#### Progress Indicator

**Implementation**: Progress bar in toast

```css
.export-progress-toast {
  width: 360px;
  padding: 16px;
}

.progress-bar {
  height: 4px;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 12px;
}

.progress-bar-fill {
  height: 100%;
  transition: width 300ms ease;
}
```

**Content**:

- Title: "Exporting..."
- Message: "Estimated time: 5 seconds"
- Progress bar: 0-100%
- Cancel button: Optional (cancels export job)

### 3.5 File Naming Convention

**Format**: `{module}_{site}_{dateRange}_{timestamp}.{ext}`

**Examples**:

- `dashboard_ALASLA29_2025-10-01_2025-10-31_1730400000.xlsx`
- `production_AllSites_2025-10_1730400000.pdf`
- `inventory_ALASLA29_2025-10-31_1730400000.csv`

**Rules**:

- Module: Lowercase
- Site: Remove hyphens, alphanumeric only
- Date range: ISO format (YYYY-MM-DD)
- Timestamp: Unix timestamp
- Extension: Lowercase

---

## **4. TABLE VIRTUALIZATION**

### 4.1 Implementation Strategy

**Library**: React Virtuoso or similar
**Purpose**: Handle 10,000+ rows smoothly

**Container Configuration**:

```typescript
import { Virtuoso } from 'react-virtuoso';

<Virtuoso
  data={tableData}
  itemContent={(index, row) => <TableRow data={row} />}
  style={{ height: '600px' }}
  overscan={10}
  fixedItemHeight={52}
/>
```

**Performance Targets**:

- Initial render: <100ms for 10,000 rows
- Scroll performance: 60fps
- Memory usage: <100MB for 10,000 rows

### 4.2 Row Recycling

**Strategy**: Render only visible rows + buffer

**Buffer Configuration**:

```typescript
const VIRTUALIZATION_CONFIG = {
  overscan: 10,              // Rows above/below viewport
  itemHeight: 52,            // Fixed row height
  estimatedItemSize: 52,     // For initial calculations
  scrollThrottle: 16,        // ~60fps
};
```

**Row Lifecycle**:

1. Row enters viewport buffer
2. Component mounts with data
3. Row visible in viewport
4. Row exits viewport buffer
5. Component unmounts
6. Row recycled for new data

### 4.3 Scroll Optimization

**Techniques**:

1. **Passive scroll listeners**: No scroll blocking
2. **RequestAnimationFrame**: Smooth updates
3. **Debounced data fetching**: Load more on scroll end
4. **Memoized row components**: Prevent unnecessary re-renders

**Implementation**:

```typescript
const TableRow = React.memo(({ data }: { data: RowData }) => {
  return (
    <div className="table-row">
      {/* Row content */}
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.data.id === nextProps.data.id;
});
```

### 4.4 Infinite Scroll

**Trigger**: User scrolls to bottom threshold
**Threshold**: 200px from bottom
**Action**: Fetch next page

**Implementation**:

```typescript
const handleEndReached = () => {
  if (!isLoading && hasMore) {
    fetchNextPage();
  }
};

<Virtuoso
  data={tableData}
  endReached={handleEndReached}
  components={{
    Footer: () => isLoading ? <LoadingSpinner /> : null
  }}
/>
```

**Loading Indicator**:

```css
.table-loading-footer {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### 4.5 Selection Management

**Challenge**: Maintain selection state across virtualized rows

**Solution**: Store selection in Set

```typescript
const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

const toggleSelection = (id: string) => {
  setSelectedIds(prev => {
    const next = new Set(prev);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    return next;
  });
};

const isSelected = (id: string) => selectedIds.has(id);
```

**Select All**:

```typescript
const selectAll = () => {
  const allIds = tableData.map(row => row.id);
  setSelectedIds(new Set(allIds));
};

const deselectAll = () => {
  setSelectedIds(new Set());
};
```

---

## **5. PHASE 2 FEATURES**

### 5.1 Real-Time Updates

**Technology**: WebSocket or Server-Sent Events
**Purpose**: Live dashboard updates without polling

**Implementation**:

```typescript
const useRealtimeUpdates = (siteId: string) => {
  useEffect(() => {
    const ws = new WebSocket(`wss://api.example.com/realtime?siteId=${siteId}`);

    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      handleUpdate(update);
    };

    return () => ws.close();
  }, [siteId]);
};
```

**Update Types**:

- New production record
- New dispatch/received record
- Equipment status change
- Manpower attendance update
- Inventory recalculation

### 5.2 Advanced Filtering

**Features**:

- Saved filter presets
- Complex filter logic (AND/OR)
- Filter templates
- Quick filter chips

**UI Enhancement**:

```
┌────────────────────────────────┐
│ [Saved Filters ▼]             │
│ ┌──────┬──────┬──────┐        │
│ │ Site │ Date │ Type │ [+]    │
│ └──────┴──────┴──────┘        │
└────────────────────────────────┘
```

### 5.3 Custom Dashboard Builder

**Features**:

- Drag-and-drop widget placement
- Resizable widgets
- Custom widget configuration
- Save/load layouts
- Share layouts with team

**Implementation**: React Grid Layout

### 5.4 Alerts & Notifications

**Alert Types**:

- Utilization below threshold
- Inventory low/high
- Equipment downtime
- Attendance below target

**Notification Channels**:

- In-app notifications
- Email alerts
- SMS (optional)
- Push notifications

### 5.5 Comparison Mode

**Feature**: Compare two date ranges side-by-side

**UI**:

```
┌──────────────┬──────────────┐
│ Oct 1-31     │ Sep 1-30     │
│              │              │
│ [Chart A]    │ [Chart A]    │
│              │              │
│ [Chart B]    │ [Chart B]    │
└──────────────┴──────────────┘
```

---

**End of Appendix**

**Related Documents**:
- DeskOps-Dashboard.md (Core specification)
- DeskOps-API-Specification.md (Backend contracts)
- DeskOps-DB-Prisma.md (Database schema)
