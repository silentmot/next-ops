# DeskOps Dashboard Core Specification
<!--markdownlint-disable-file-->
**Using the current design system and tech stack, create a production-ready operational dashboard for the DeskOps system.**

**Document Structure**:
- **This Document**: Core implementation specifications (~2500 lines)
- **DeskOps-Dashboard-Appendix.md**: Optional features, variations, and detailed patterns
- **DeskOps-API-Specification.md**: Backend API contracts and data models

---

## **DON'T MAKE ANY ASSUMPTIONS**

- Always check for existing code before creating new code or adding new features **AVOID DUPLICATION**.
- Use `bun` Never use `npm` or `yarn`
- Use `bunx` to run commands
- For linting and formatting use `biome` With `bunx biome {command}`
- For Prisma use `bunx prisma {command}` direct CLI Commands
- For icons use `lucide-react` or `iconify` (check `@lib/icons`) Check for existing icons before creating new ones
- For charts use `recharts`
- For animations use `framer-motion`
- For state management use `zustand`
- For validation use `zod`
- For styling use `tailwindcss`
- **NO Hardcoded Styling/colors/etc** Use DesignTokens.ts and globals.css for all values
- **NO Random Data/Information** Use SSOT constants for all data `@lib/constants`, `@lib/utils`, `@lib/types`, and Prisma Schemas (Also the backend API Endpoints is fully implemnted)

 **Current Project Tech Stack**:

- Next.js 16+ with App Router
- Tailwind CSS v4 with @import syntax
- TypeScript 5.9+
- Prisma 6.18+
- Clerk 6.34+
- Recharts 3.3+
- Framer Motion 12.23+
- Lucide React 0.552+
- Zustand 5.0+
- Biome 2.3+
- Zod 4.1+

---

## **7. ROW 4: FLOW ANALYSIS**

**Source**: Original document + enhanced to match Row 3 detail level

### 7.1 Container Layout

**Grid Configuration**:

- Left chart: 7 columns (58%)
- Right chart: 5 columns (42%)
- Gap: 24px
- Height: 400px
- Row margin-bottom: 24px

**Responsive Breakpoints**:

- Desktop (>1440px): Side by side (7 + 5 columns)
- Tablet (1024-1439px): Stack vertically (12 columns each)
- Mobile (<1024px): Stack vertically (12 columns each)

### 7.2 Left Chart: Received vs Dispatched Trend

**Source**: Document specifies "ComposedChart with grouped Bars and Line (net = received − dispatched)"

#### Chart Type & Configuration

**Type**: ComposedChart (Bars + Line)
**Purpose**: Show material flow balance over time
**Time Range**: 7-day trend (default)

**Recharts Implementation**:

```typescript
<ComposedChart data={flowTrendData}>
  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
  <XAxis
    dataKey="date"
    tickFormatter={(date) => format(date, 'EEE dd')}
  />
  <YAxis
    label={{ value: 'Quantity (TON)', angle: -90, position: 'insideLeft' }}
    tickFormatter={(value) => `${value} T`}
    width={70}
  />
  <Tooltip content={<FlowTooltip />} />
  <Legend verticalAlign="bottom" />

  {/* Reference line at 0 */}
  <ReferenceLine y={0} stroke="#666" />

  {/* Bars */}
  <Bar
    dataKey="received"
    fill={SUCCESS_COLOR}
    name="Received"
    radius={[8, 8, 0, 0]}
  />
  <Bar
    dataKey="dispatched"
    fill={INFO_COLOR}
    name="Dispatched"
    radius={[8, 8, 0, 0]}
  />

  {/* Net line */}
  <Line
    type="monotone"
    dataKey="net"
    stroke={ACCENT_COLOR}
    strokeWidth={3}
    dot={{ r: 5 }}
    activeDot={{ r: 7 }}
    name="Net Flow"
  />
</ComposedChart>
```

#### Data Structure

```typescript
interface FlowTrendData {
  date: string;           // ISO date
  received: number;       // Received materials (TON)
  dispatched: number;     // Dispatched materials (TON)
  net: number;            // received - dispatched
  receivedCount: number;  // Number of receive transactions
  dispatchCount: number;  // Number of dispatch transactions
}

// Example:
{
  date: '2025-10-31',
  received: 1234.56,
  dispatched: 987.65,
  net: 246.91,
  receivedCount: 15,
  dispatchCount: 12
}
```

#### Visual Specifications

**Bar Configuration**:

- Grouped (side-by-side), not stacked
- Bar width: Auto-calculated with gap
- Gap between grouped bars: 4px
- Border-radius: Top corners rounded (8px)

**Bar Colors**:

- Received: Success color (green tone)
- Dispatched: Info color (blue tone)
- Consistent throughout dashboard

**Net Flow Line**:

- Type: Monotone curve
- Stroke width: 3px
- Stroke: Accent color
- Dots: Always visible (5px radius)
- Active dot: 7px radius

**Net Flow Color Logic** (Optional enhancement):

- Positive net (received > dispatched): Success color
- Negative net (dispatched > received): Warning color
- Zero net: Neutral color

**Reference Line**:

- Position: Y = 0
- Style: Solid, neutral color
- Purpose: Visual baseline for net flow

#### Interactive Features

**Bar Hover**:

- Effect: Slight opacity increase
- Cursor: pointer
- Tooltip: Show detailed breakdown

**Line Hover**:

- Effect: Dot scales to 8px
- Tooltip: Show net calculation

**Date Range Selector**:

```css
.date-range-quick-select {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.range-button {
  height: 32px;
  padding: 0 12px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}
```

**Quick Range Options**:

- "7 Days" (default)
- "30 Days"
- "This Month"
- "Custom" (opens date picker)

**Tooltip Content**:

```
Oct 31, 2025
─────────────────────────
Received: 1,234.56 T (15 transactions)
Dispatched: 987.65 T (12 transactions)
─────────────────────────
Net Flow: +246.91 T
```

#### Drill-Down Capability

**Interaction**: Click on bar or date
**Action**: Opens modal with detailed transactions

**Description**: Modal displays tabbed view of received and dispatched transactions for the selected date, with export capability.

**Full Specification**: See `DeskOps-Dashboard-Appendix.md` Section 2.1

### 7.3 Right Chart: Recycling Rate

**Source**: Document specifies "Line Chart with area fill" + "Recycling percentage over time" + "Threshold line at target rate"

#### Chart Type & Configuration

**Type**: AreaChart (Line + Area Fill)
**Purpose**: Track recycling efficiency trend
**Time Range**: 30 days

**Recharts Implementation**:

```typescript
<AreaChart data={recyclingRateData}>
  <defs>
    <linearGradient id="recyclingGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor={SUCCESS_COLOR} stopOpacity={0.3}/>
      <stop offset="95%" stopColor={SUCCESS_COLOR} stopOpacity={0.05}/>
    </linearGradient>
  </defs>

  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
  <XAxis
    dataKey="date"
    tickFormatter={(date) => format(date, 'MMM dd')}
  />
  <YAxis
    domain={[0, 100]}
    tickFormatter={(value) => `${value}%`}
    label={{ value: 'Recycling Rate (%)', angle: -90, position: 'insideLeft' }}
    width={60}
  />
  <Tooltip content={<RecyclingTooltip />} />
  <Legend verticalAlign="bottom" />

  {/* Target reference line */}
  <ReferenceLine
    y={TARGET_RECYCLING_RATE}
    stroke={INFO_COLOR}
    strokeDasharray="5 5"
    label="Target"
  />

  {/* Area + Line */}
  <Area
    type="monotone"
    dataKey="rate"
    stroke={SUCCESS_COLOR}
    strokeWidth={2}
    fillOpacity={1}
    fill="url(#recyclingGradient)"
    name="Recycling Rate"
  />
</AreaChart>
```

#### Data Structure

```typescript
interface RecyclingRateData {
  date: string;
  rate: number;              // Percentage (0-100)
  recycledMaterial: number;  // TON
  totalReceived: number;     // TON
  targetRate: number;        // Target percentage
  variance: number;          // rate - targetRate
}

// Calculation:
// rate = (recycledMaterial / totalReceived) × 100
```

#### Visual Specifications

**Line Properties**:

- Type: Monotone (smooth curve)
- Stroke width: 2px
- Stroke: Success color
- Dot size: 0 (hidden unless hover)
- Active dot: 6px

**Area Fill**:

- Gradient: Top (30% opacity) → Bottom (5% opacity)
- Color: Success color base
- Creates subtle depth effect

**Target Line**:

- Type: Horizontal reference line
- Position: Y = target rate (e.g., 75%)
- Style: Dashed (5px dash, 5px gap)
- Color: Info color
- Label: "Target" at right end

**Zone Highlighting** (Optional):

- Above target: Green tint background
- Below target: Yellow tint background
- Visual: Very subtle opacity (0.05)

#### Interactive Features

**Hover on Line**:

- Effect: Show dot at position
- Tooltip: Detailed metrics

**Click on Point**:

- Action: Opens daily detail modal
- Modal content: Breakdown of recycled vs non-recycled materials

**Period Selector**:

```css
.period-selector {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
}
```

**Options**:

- "7 Days"
- "30 Days" (default)
- "90 Days"
- "YTD"

**Tooltip Content**:

```
Oct 31, 2025
─────────────────────────
Recycling Rate: 78.5%
Recycled: 1,234.56 T
Total Received: 1,572.00 T
─────────────────────────
Target: 75%
Above Target: +3.5%
```

#### Statistical Overlay (Optional)

**Status**: Phase 2 Feature

**Description**: 7-day moving average line overlay for trend smoothing.

**Full Specification**: See `DeskOps-Dashboard-Appendix.md` Section 1.2

---

## **8. ROW 5: DETAIL TABLES**

**Source**: Document "Detail Tabs" + enhanced to match header detail level

### 8.1 Container Layout

**Grid Configuration**:

- Width: 12 columns (100%)
- Min-height: 500px (variable based on content)
- Padding: 24px
- Border-radius: 20px

**Tab System**:

```
┌─────────────────────────────────────────┐
│ [Movements] [Equipment] [Manpower]      │ ← Tab headers (48px)
├─────────────────────────────────────────┤
│                                         │
│     Paginated Data Table                │
│     (min-height: 500px)                 │
│                                         │
└─────────────────────────────────────────┘
```

### 8.2 Tab Header Component

**Dimensions**:

```css
.tab-header-container {
  height: 48px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid;
  gap: 4px;
  padding: 0 4px;
}
```

**Tab Button**:

```css
.tab-button {
  height: 40px;
  padding: 0 20px;
  border-radius: 8px 8px 0 0;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
}
```

**Tab States**:

- **Default**: Base background, normal opacity
- **Hover**: Background highlight, transition 200ms
- **Active**: Background emphasis, font weight 600, bottom border (3px accent color)
- **Disabled**: Opacity 0.4, cursor not-allowed

**Tab Labels**:

1. "Movements" (Material flow transactions)
2. "Equipment" (Equipment usage logs)
3. "Manpower" (Attendance records)

**Active Indicator**:

- Type: Bottom border (3px thick)
- Color: Accent from design tokens
- Width: 100% of tab button
- Position: Absolute bottom
- Transition: 200ms ease

### 8.3 Table Component Architecture

**Table Container**:

```css
.detail-table-container {
  width: 100%;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  padding: 16px 0;
}
```

**Layout Sections**:

1. Toolbar (48px height)
2. Table header (fixed, 44px height)
3. Table body (virtualized, variable height)
4. Footer (pagination + info, 56px height)

---

#### Toolbar Section

**Dimensions**:

```css
.table-toolbar {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  margin-bottom: 16px;
}
```

**Left Side** (Search + Filters):

```
[Search input............] [Filter ▼] [Columns ▼]
```

**Search Input**:

```css
.table-search {
  width: 300px;
  height: 36px;
  padding: 0 12px 0 36px;
  border-radius: 8px;
  font-size: 13px;
}
```

- Icon: Magnifying glass (16×16px) at left
- Placeholder: "Search {table name}..."
- Clear button: X icon (when input has value)
- Debounce: 300ms

**Filter Dropdown**:

```css
.table-filter-button {
  height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  gap: 8px;
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  cursor: pointer;
}
```

- Icon: Filter funnel
- Label: "Filter" + badge count (if filters active)
- Badge: Small circle showing filter count

**Column Selector**:

```css
.column-selector-button {
  height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  gap: 8px;
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  cursor: pointer;
}
```

- Icon: Columns icon
- Label: "Columns"
- Opens dropdown with column visibility toggles

**Right Side** (Actions):

```
[Refresh] [Export ▼]
```

**Refresh Button**:

```css
.table-refresh-button {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
```

- Icon: Refresh arrow (16×16px)
- States: Default, Hover, Loading (rotating)
- Tooltip: "Refresh data"

**Export Dropdown**:

```css
.table-export-button {
  height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  gap: 8px;
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  cursor: pointer;
}
```

- Icon: Download
- Label: "Export"
- Dropdown options: Excel, CSV, PDF
- Opens export configuration dialog

---

#### Filter Dropdown Panel

**Container**:

```css
.filter-panel {
  width: 320px;
  max-height: 480px;
  border-radius: 12px;
  padding: 16px;
  position: absolute;
  top: 44px;
  z-index: 10;
  overflow-y: auto;
}
```

**Structure**:

```
┌────────────────────────────┐
│ Filters                    │ ← Header
├────────────────────────────┤
│ Date Range                 │ ← Filter group
│ [Date picker]              │
├────────────────────────────┤
│ Material Type              │
│ □ Aggregate Base           │ ← Checkboxes
│ □ Crushed Concrete         │
│ □ Recycled Asphalt         │
├────────────────────────────┤
│ Status                     │
│ ○ All                      │ ← Radio buttons
│ ○ Active                   │
│ ○ Inactive                 │
├────────────────────────────┤
│ [Clear All] [Apply]        │ ← Actions
└────────────────────────────┘
```

**Filter Group**:

```css
.filter-group {
  margin-bottom: 16px;
}

.filter-group-label {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
}
```

**Filter Actions**:

- Clear All: Remove all filters (secondary style)
- Apply: Commit filters and close (primary style)
- Button height: 36px
- Gap: 8px

---

#### Column Selector Dropdown

**Container**: Same style as filter panel

**Structure**:

```
┌────────────────────────────┐
│ Show/Hide Columns          │
├────────────────────────────┤
│ ☑ Date                     │ ← Toggles
│ ☑ Material                 │
│ ☑ Quantity                 │
│ ☑ Source                   │
│ ☐ Notes                    │ (hidden)
├────────────────────────────┤
│ [Reset] [Apply]            │
└────────────────────────────┘
```

**Column Toggle Item**:

```css
.column-toggle-item {
  height: 36px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  border-radius: 6px;
}
```

**Interaction**:

- Click: Toggle visibility
- Checkbox reflects state
- Hover: Background highlight
- Some columns pinned (cannot hide, e.g., ID column)

**Pinned Indicator**:

- Icon: Pin icon next to checkbox
- Tooltip: "This column cannot be hidden"

---

#### Table Header

**Container**:

```css
.table-header {
  display: grid;
  grid-template-columns: /* Dynamic based on columns */;
  height: 44px;
  border-bottom: 1px solid;
  position: sticky;
  top: 0;
  z-index: 5;
  background: /* Inherit from card background */;
}
```

**Header Cell**:

```css
.table-header-cell {
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer; /* If sortable */
}
```

**Cell Content**:

- Label text
- Sort indicator (if sortable): Arrow icon (12×12px)
- Resize handle (right edge): Drag to resize column

**Sort States**:

- Unsorted: No arrow or neutral arrow
- Ascending: Arrow up
- Descending: Arrow down
- Hover: Arrow appears/highlights

**Resize Handle**:

```css
.resize-handle {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  cursor: col-resize;
}

.resize-handle:hover {
  background: /* Accent color */;
}
```

---

#### Table Body (Virtualized)

**Implementation**: Use React Virtuoso or similar for performance

**Container**:

```css
.table-body {
  flex: 1;
  overflow: auto;
  min-height: 400px;
}
```

**Row Configuration**:

```css
.table-row {
  display: grid;
  grid-template-columns: /* Match header */;
  height: 52px;
  border-bottom: 1px solid;
  transition: background 150ms;
}
```

**Row States**:

- **Default**: Base background
- **Hover**: Background highlight, cursor pointer
- **Selected**: Background emphasis, checkbox checked
- **Disabled**: Opacity 0.5, no hover effect

**Cell**:

```css
.table-cell {
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

**Cell Types**:

1. **Text Cell**: Plain text with ellipsis overflow
2. **Number Cell**: Right-aligned, tabular numbers
3. **Date Cell**: Formatted date (MMM dd, yyyy)
4. **Status Cell**: Badge component (chip style)
5. **Action Cell**: Icon buttons (edit, delete, etc.)

**Status Badge**:

```css
.status-badge {
  height: 24px;
  padding: 0 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
}
```

- Colors: Based on status (success, warning, danger, info)
- Text: Uppercase or title case
- Icon: Optional small icon (10×10px)

**Action Buttons**:

```css
.table-action-button {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
```

- Common actions: Edit, Delete, View details
- Icon size: 16×16px
- Hover: Background highlight
- Tooltip: Action name

**Row Selection**:

- First column: Checkbox (24×24px)
- Multi-select: Ctrl/Cmd + click
- Range select: Shift + click
- Select all: Checkbox in header

**Virtualization**:

- Render: Only visible rows + buffer (10 rows above/below)
- Row height: Fixed 52px
- Total rows: Display in footer
- Performance: Handle 10,000+ rows smoothly

**Empty State**:

```
┌─────────────────────────────────┐
│                                 │
│        [Icon]                   │ ← Large icon (48×48px)
│    No data available            │ ← Message
│  Try adjusting your filters     │ ← Hint
│                                 │
└─────────────────────────────────┘
```

- Height: 300px
- Centered content
- Icon: Table with X overlay
- Text: 14px, opacity 0.7

**Loading State**:

- Skeleton rows: 10 visible
- Shimmer animation: 2s loop
- Height: Match row height (52px)

---

#### Table Footer

**Container**:

```css
.table-footer {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-top: 1px solid;
}
```

**Left Side** (Info):

```css
.table-info {
  font-size: 13px;
  opacity: 0.7;
}
```

**Content**: "Showing {start}-{end} of {total} results"
**Example**: "Showing 1-25 of 234 results"

**Selected Info** (if rows selected):
**Content**: "{count} row(s) selected"
**Actions**: Bulk action buttons appear

**Right Side** (Pagination):

```css
.table-pagination {
  display: flex;
  align-items: center;
  gap: 8px;
}
```

**Components**:

1. Rows per page selector
2. Page navigation buttons
3. Current page indicator

**Rows Per Page**:

```css
.rows-per-page-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}
```

- Label: "Rows per page:"
- Dropdown: 10, 25, 50, 100
- Width: 80px

**Page Navigation**:

```
[First] [Prev] [1] 2 [3] [Next] [Last]
```

**Button Specs**:

```css
.pagination-button {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  cursor: pointer;
}
```

**Button States**:

- Active (current page): Background emphasis, font weight 600
- Hover: Background highlight
- Disabled (first/last bounds): Opacity 0.4, cursor not-allowed

**Page Number Display**:

- Show: Current ± 2 pages
- Ellipsis: "..." for gaps
- Example: "1 ... 5 6 [7] 8 9 ... 15"

---

### 8.4 Tab-Specific Table Configurations

#### Movements Tab

**Columns**:

1. Checkbox (select)
2. ID (auto-generated)
3. Date
4. Type (Received/Dispatched/Production)
5. Material
6. Quantity (TON)
7. Source/Destination
8. Status
9. Actions

**Column Widths**:

- Checkbox: 48px
- ID: 100px
- Date: 120px
- Type: 120px
- Material: 180px (flex-grow)
- Quantity: 120px
- Source/Dest: 160px
- Status: 100px
- Actions: 80px

**Default Sort**: Date descending (newest first)

**Filters**:

- Date range
- Type (multi-select)
- Material (multi-select)
- Status (radio)

**Row Actions**:

- View details (opens modal)
- Edit (if permissions allow)
- Delete (confirmation dialog)

#### Equipment Tab

**Columns**:

1. Checkbox
2. Equipment ID
3. Definition
4. Type
5. Date
6. Shift
7. Run Hours
8. Idle Hours
9. Downtime
10. Utilization %
11. Actions

**Column Widths**:

- Checkbox: 48px
- Equipment ID: 120px
- Definition: 140px
- Type: 160px
- Date: 120px
- Shift: 100px
- Run Hours: 100px
- Idle Hours: 100px
- Downtime: 100px
- Utilization: 100px
- Actions: 80px

**Default Sort**: Date descending

**Filters**:

- Date range
- Equipment type (multi-select)
- Equipment definition (multi-select)
- Shift (multi-select)
- Utilization range (slider: 0-100%)

**Row Actions**:

- View usage details
- Download maintenance log
- Schedule maintenance (if authorized)

#### Manpower Tab

**Columns**:

1. Checkbox
2. Record ID
3. Date
4. Shift
5. Role
6. Present Count
7. Absent Count
8. Total Hours
9. Attendance Rate %
10. Actions

**Column Widths**:

- Checkbox: 48px
- Record ID: 100px
- Date: 120px
- Shift: 100px
- Role: 160px
- Present: 100px
- Absent: 100px
- Hours: 100px
- Rate: 120px
- Actions: 80px

**Default Sort**: Date descending

**Filters**:

- Date range
- Shift (multi-select)
- Role (multi-select)
- Attendance rate range (slider: 0-100%)

**Row Actions**:

- View attendance details
- Download attendance report
- Mark exceptions (if authorized)

---

**End of Core Dashboard Specification**

---

**Related Documents**:

- `DeskOps-Dashboard-P2.md` - Detailed dashboard specification Row 3 and Row 4
- `DeskOps-Dashboard-P1.md` - Detailed dashboard specification Introduction and Row 1 and Row 2
- `DeskOps-Dashboard-Appendix.md` - Optional features, chart variations, interaction patterns, export details, table virtualization
- `DeskOps-API-Specification.md` - Backend API contracts, data models, endpoints, response structures
- `DeskOps-DB-Prisma.md` - Database schema and Prisma configuration
