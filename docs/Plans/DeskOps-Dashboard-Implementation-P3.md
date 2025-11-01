# DeskOps Dashboard Implementation Plan - Part 3

**Continuation from Part 2**

---

### Phase 4: Row 2 - Trend Charts

**Source**: `DeskOps-Dashboard-P1.md` Section 5

#### Task 4.1: Container Layout

**Source**: `DeskOps-Dashboard-P1.md` Section 5.1 (Lines 1291-1310)

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

#### Task 4.2: ChartCard Component Structure

**Source**: `DeskOps-Dashboard-P1.md` Section 5.2 (Lines 1312-1424)

**Dimensions**:
```css
.chart-card {
  height: 400px;
  padding: 24px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
```

**Content Layout**:
```
┌─────────────────────────────────────┐
│ Header Section (48px)               │
│ ┌─────┐ Title           [Export]   │
│ │ Icon│ Description                │
│ └─────┘                             │
├─────────────────────────────────────┤
│                                     │
│     Chart Render Area (308px)      │
│     (ResponsiveContainer)           │
│                                     │
└─────────────────────────────────────┘
```

**Header Section**:
```css
.chart-header {
  height: 48px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
```

**Left Side** (Title + Icon):
```css
.chart-title-group {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.chart-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.chart-icon svg {
  width: 20px;
  height: 20px;
}
```

**Title Text**:
```css
.chart-title {
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  margin-bottom: 4px;
}

.chart-description {
  font-size: 13px;
  line-height: 18px;
  opacity: 0.7;
}
```

**Right Side** (Export Button):
```css
.chart-export-button {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.chart-export-button svg {
  width: 16px;
  height: 16px;
}
```

**Export Button States**:
- Hover: Background highlight, scale 1.05
- Active: Scale 0.95
- Loading: Spinner replaces icon
- Tooltip: "Export chart data"

**Chart Container**:
```typescript
<ResponsiveContainer width="100%" height={308}>
  <ChartType
    data={chartData}
    margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
  >
    {/* Chart elements */}
  </ResponsiveContainer>
</ResponsiveContainer>
```

**Universal Chart Properties**:
- CartesianGrid: Dashed strokes, opacity 0.1
- Tooltip: Custom styled
- Legend: Bottom positioned, toggleable
- Brush: Enabled for zoom on time-series

#### Task 4.3: Inventory Levels Chart

**File**: `components/dashboard/charts/InventoryLevelsChart.tsx`

**Source**: `DeskOps-Dashboard-P1.md` Section 5.3 (Lines 1426-1593)

**Chart Type & Configuration**:
- **Type**: AreaChart (Stacked)
- **Data**: 30-day daily inventory by material category
- **Time Range**: Last 30 days from selected date

**Recharts Implementation**:
```typescript
<AreaChart data={inventoryData}>
  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
  <XAxis
    dataKey="date"
    type="category"
    tickFormatter={(date) => format(date, 'MMM dd')}
    interval="preserveStartEnd"
  />
  <YAxis
    tickFormatter={(value) => `${value} T`}
    width={60}
  />
  <Tooltip content={<CustomTooltip />} />
  <Legend
    verticalAlign="bottom"
    height={36}
    onClick={handleLegendClick}
  />
  <Brush
    dataKey="date"
    height={30}
    stroke="#8884d8"
  />
  {materials.map((material, index) => (
    <Area
      key={material.id}
      type="monotone"
      dataKey={material.name}
      stackId="1"
      stroke={CHART_COLORS[index]}
      fill={CHART_COLORS[index]}
      fillOpacity={0.6}
    />
  ))}
</AreaChart>
```

**Data Structure**:
```typescript
interface InventoryDataPoint {
  date: string;           // ISO date string
  [materialType: string]: number | string; // Dynamic material keys
}

// Example:
[
  {
    date: '2025-10-01',
    'Aggregate Base': 1234.56,
    'Crushed Concrete': 2345.67,
    'Recycled Asphalt': 3456.78,
    // ... other materials
  },
  // ... 30 days
]
```

**Visual Specifications**:
- **Stack Behavior**: Cumulative stacking, order consistent across all data points, blend mode normal (no blending)
- **Area Properties**: Type monotone (smooth curves), fill opacity 0.6, stroke width 2px, stroke solid material color, fill material color with opacity

**Material Categories**:
- Aggregate Base
- Crushed Concrete
- Recycled Asphalt
- Fine Sand
- Coarse Aggregate
- Mixed Rubble
- (Additional material types as configured)

**Color Assignment**: Colors from design tokens chart palette, consistent mapping (same material = same color), accessible contrast ratios

**Interactive Features**:
- **Legend Click**: Action toggle material visibility, visual fade out area (opacity 0.2) when hidden, persist remember state during session
- **Brush Zoom**: Position bottom of chart 30px height, drag select date range to zoom, reset double-click brush area
- **Area Hover**: Effect increase opacity to 0.8, cursor pointer, visual feedback subtle glow

**Threshold Lines** (Optional):
- Min inventory threshold: Red dashed line
- Max capacity threshold: Orange dashed line
- Label: Small text at line end

#### Task 4.4: Production vs Target Chart

**File**: `components/dashboard/charts/ProductionTargetChart.tsx`

**Source**: `DeskOps-Dashboard-P1.md` Section 5.4 (Lines 1595-1758)

**Chart Type & Configuration**:
- **Type**: ComposedChart (Horizontal orientation)
- **Data**: Daily production vs target goals
- **Time Range**: Selected date range (default last 7 days)

**Recharts Implementation**:
```typescript
<ComposedChart
  data={productionData}
  layout="vertical"
  margin={{ left: 80 }}
>
  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
  <XAxis
    type="number"
    tickFormatter={(value) => `${value} T`}
  />
  <YAxis
    dataKey="date"
    type="category"
    width={80}
    tickFormatter={(date) => format(date, 'MMM dd')}
  />
  <Tooltip content={<CustomTooltip />} />
  <Legend verticalAlign="bottom" />
  <Bar
    dataKey="production"
    fill={CHART_COLORS[0]}
    radius={[0, 8, 8, 0]}
    barSize={20}
  />
  <Line
    dataKey="target"
    stroke={CHART_COLORS[1]}
    strokeWidth={3}
    strokeDasharray="5 5"
    dot={{ r: 5 }}
  />
</ComposedChart>
```

**Data Structure**:
```typescript
interface ProductionDataPoint {
  date: string;           // ISO date string
  production: number;     // Actual production in TON
  target: number;         // Target production in TON
  variance: number;       // production - target
  variancePercent: number; // (variance / target) × 100
}

// Example:
{
  date: '2025-10-31',
  production: 1234.56,
  target: 1200.00,
  variance: 34.56,
  variancePercent: 2.88
}
```

**Visual Specifications**:
- **Bar Properties**: Orientation horizontal (layout="vertical" in Recharts), bar size 20px height, border-radius [0, 8, 8, 0] (right side rounded), fill gradient optional, stroke none
- **Bar Color Logic**: Production >= Target (success color), Production < Target (warning color), Production << Target (< 80%) (danger color)
- **Target Line**: Type line with dots, stroke width 3px, stroke style dashed (5px dash, 5px gap), dot radius 5px, dot fill same as stroke color
- **Percentage Labels**: Position end of bar (right side), content variance percentage ("+2.88%" or "-5.2%"), font size 12px, font weight 600, color success/danger based on positive/negative, visibility always show if |variance| > 0.5%

**Interactive Features**:
- **Bar Hover**: Effect increase bar height to 24px, tooltip show detailed breakdown, animation 200ms ease
- **Tooltip Content**:
```
Date: Oct 31, 2025
─────────────────────────
Production: 1,234.56 T
Target: 1,200.00 T
Variance: +34.56 T (+2.88%)
```

#### Task 4.5: Universal Chart Components

**Source**: `DeskOps-Dashboard-P1.md` Section 5.5 (Lines 1760-1926)

**Custom Tooltip**:
```css
.custom-tooltip {
  min-width: 200px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid;
  backdrop-filter: blur(10px) saturate(180%);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}
```

**Content Structure**:
```
┌──────────────────────────┐
│ Date: Oct 31, 2025      │ ← Header (bold)
├──────────────────────────┤
│ ● Material A: 123.45 T  │ ← Entry (dot + label + value)
│ ● Material B: 234.56 T  │
│ ● Material C: 345.67 T  │
├──────────────────────────┤
│ Total: 703.68 T         │ ← Footer (bold)
└──────────────────────────┘
```

**Animation**: Fade-in 150ms, position follow cursor with 10px offset, boundary stays within chart area

**Legend Component**:
- **Position**: Bottom, 36px height
- **Layout**: Horizontal, centered, wrap if needed
- **Gap**: 16px between items

**Legend Item**:
```css
.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
}
```

**Item Content**:
- Color indicator: 12×12px square/circle
- Label text: 13px, font-weight 500
- Optional: Value sum "(1,234 T)"

**Item States**:
- Default: Base style
- Hover: Background highlight
- Active (visible): Normal opacity
- Inactive (hidden): Opacity 0.4, strike-through text

**Interaction**: Click toggle series visibility, visual feedback fade series in/out over 300ms

**Loading State**:
```
┌─────────────────────────────────────┐
│ ▓▓▓▓▓▓ ▓▓▓▓▓▓▓▓        [▓▓▓]      │
│                                     │
│     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓           │
│     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓           │
│     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓           │
│                                     │
└─────────────────────────────────────┘
```
Shimmer animation: Wave effect, 2s loop

**Empty State**: Centered message, icon chart icon with slash 48×48px, text "No data available", secondary text "Select a different date range", min-height 300px (to maintain layout)

**Error State**: Centered error message, icon alert triangle 48×48px, text "Failed to load chart", action button "Retry", min-height 300px

**Chart Entrance Animation**: Type fade + slide up, duration 400ms, easing ease-out, stagger 100ms between charts

**Animation Sequence**:
1. Card container fades in
2. Skeleton shows immediately
3. When data loads: Skeleton fades out
4. Chart elements draw/animate in
5. Complete

---

### Phase 5: Row 3 - Utilization Metrics

**Source**: `DeskOps-Dashboard-P2.md` Section 6

#### Task 5.1: Container Layout

**Source**: `DeskOps-Dashboard-P2.md` Section 6.1 (Lines 48-64) + Q&A Lines 85-88

**Grid Configuration**:
- Left (Manpower): 4 columns (33%)
- Middle (Equipment): 5 columns (42%)
- Right (KPI): 3 columns (25%)
- Gap: 24px
- Height: 350px
- Row margin-bottom: 24px

**Responsive Breakpoints**:
- Desktop (>1440px): 4 + 5 + 3 columns
- Tablet (1024-1439px): Stack vertically (12 columns each)
- Mobile (<1024px): Stack vertically (12 columns each)

**Q&A Clarification** (Lines 85-88):
- Row 3 spacing: 40% Composition Bar, 30% Trend Line, 30% Manpower
- Heatmap: Skipped ("For now and forever")

#### Task 5.2: Manpower Attendance Chart

**File**: `components/dashboard/charts/ManpowerAttendanceChart.tsx`

**Source**: `DeskOps-Dashboard-P2.md` Section 6.3 (Lines 97-325)

**Quick Reference** (Source: Lines 103-115):
- **Chart Type**: Stacked Column Chart (Time-Series)
- **Purpose**: Daily attendance tracking by role over date range
- **Data Points**: Present count by role + Absent count
- **Time Range**: Selected date range (default: last 7 days)
- **Key Metrics**: Worker count, hours worked, attendance rate
- **Interactions**: Role filter, shift toggle, tooltip details
- **API Endpoint**: `/api/charts/manpower-attendance`

**Chart Type & Configuration** (Source: Lines 117-151):
- **Type**: Stacked Column Chart (Time-Series)
- **Purpose**: Dynamic daily tracking over selected date range
- **Rationale**: Shows trend over time, crucial for daily tracking

**Recharts Implementation**:
```typescript
<BarChart data={manpowerData}>
  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
  <XAxis
    dataKey="date"
    tickFormatter={(date) => format(date, 'MMM dd')}
    interval="preserveStartEnd"
  />
  <YAxis
    label={{ value: 'Worker Count', angle: -90, position: 'insideLeft' }}
    width={60}
  />
  <Tooltip content={<ManpowerTooltip />} />
  <Legend
    verticalAlign="bottom"
    onClick={handleRoleToggle}
  />
  {/* Present workers by role */}
  {MANPOWER_ROLES.map((role) => (
    <Bar
      key={role}
      dataKey={`present.${role}`}
      stackId="present"
      fill={ROLE_COLORS[role]}
      name={formatRoleName(role)}
    />
  ))}
  {/* Absent workers */}
  <Bar
    dataKey="absent"
    stackId="present"
    fill={DANGER_COLOR}
    name="Absent"
  />
</BarChart>
```

**Visual Specifications** (Source: Lines 153-177):
- **Column Structure**: Total height (total scheduled workforce), stack 1 bottom (present workers count segmented by role), stack 2 top (absent workers count), bar width auto (responsive to data density), gap between bars 8px
- **Role Segmentation**: Each role gets a unique color (from design tokens), color consistency across all charts, stack order alphabetical by role name
- **Color Mapping**: EQUIPMENT_DRIVER (Color 1), CRUSHER_OPERATOR (Color 2), MAINTENANCE_WORKER (Color 3), LABORER (Color 4), SECURITY (Color 5), ABSENT (Danger color red tone)

**Data Structure** (Source: Lines 179-211):
```typescript
interface ManpowerAttendanceData {
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
  attendanceRate: number; // Percentage (0-100)
}

// Example:
{
  date: '2025-10-31',
  shift: 'MORNING',
  present: {
    EQUIPMENT_DRIVER: 12,
    CRUSHER_OPERATOR: 8,
    MAINTENANCE_WORKER: 5,
    LABORER: 20,
    SECURITY: 4
  },
  presentHours: {
    EQUIPMENT_DRIVER: 96,
    CRUSHER_OPERATOR: 64,
    MAINTENANCE_WORKER: 40,
    LABORER: 160,
    SECURITY: 32
  },
  absent: 5,
  totalScheduled: 54,
  attendanceRate: 90.74
}
```

**Interactive Features** (Source: Lines 213-272):

**Role Filter Dropdown**:
```css
.role-filter {
  width: 180px;
  height: 36px;
  margin-bottom: 12px;
  border-radius: 8px;
}
```
- **Options**: "All Roles" (default), individual role options (EQUIPMENT_DRIVER, CRUSHER_OPERATOR, etc.)
- **When filtered**: Show only selected role + absent

**Shift Toggle**:
- Position: Next to role filter
- Options: All Shifts, Morning, Afternoon, Night
- Width: 140px
- Height: 36px

**Tooltip Content** (Q&A Line 71: Hours display in tooltips):
```
Date: Oct 31, 2025 (Morning)
────────────────────────────
Present Workers:
  ● Equipment Driver: 12 (96 hours)
  ● Crusher Operator: 8 (64 hours)
  ● Maintenance Worker: 5 (40 hours)
  ● Laborer: 20 (160 hours)
  ● Security: 4 (32 hours)
────────────────────────────
Absent: 5
Total Scheduled: 54
Attendance Rate: 90.74%
```

**Supporting KPI Card** (Right Side) (Source: Lines 274-298):
- **Position**: Adjacent to chart (in Row 3 right section)
- **Dimensions**: 3 columns width, 350px height

**Content**:
```
┌────────────────────────┐
│ Manpower Overview      │
├────────────────────────┤
│ 392                    │
│ Total Hours Today      │
├────────────────────────┤
│ 90.74%                 │
│ Attendance Rate        │
├────────────────────────┤
│ EQUIPMENT_DRIVER       │
│ Most Utilized Role     │
└────────────────────────┘
```

**KPI Layout**: 3 stacked metrics, each value (24px) + label (12px), gap 16px between metrics, padding 24px

**Secondary View: Hours Worked Line Overlay** (Source: Lines 300-325):
- **Toggle**: Button to switch between "Count" and "Hours" view
- **Implementation**: Adds a line series for total hours on right Y-axis

```typescript
<BarChart data={manpowerData}>
  {/* ... existing config */}
  <YAxis
    yAxisId="right"
    orientation="right"
    label={{ value: 'Hours', angle: 90, position: 'insideRight' }}
    width={60}
  />
  <Line
    yAxisId="right"
    type="monotone"
    dataKey="totalHours"
    stroke={ACCENT_COLOR}
    strokeWidth={2}
    dot={{ r: 4 }}
    name="Total Hours"
  />
</BarChart>
```

#### Task 5.3: Equipment Utilization Chart

**File**: `components/dashboard/charts/EquipmentUtilizationChart.tsx`

**Source**: `DeskOps-Dashboard-P2.md` Section 6.4 (Lines 327-646)

**Quick Reference** (Source: Lines 333-347):
- **Chart Type**: Dual-View: Trend (Line) / Composition (Stacked Bar)
- **Purpose**: Track equipment utilization by type and unit
- **View 1: Trend**: Multi-line chart showing utilization rate % over time
- **View 2: Composition**: 100% stacked horizontal bars (Run/Idle/Downtime)
- **Target Threshold**: 80% utilization (configurable)
- **Interactions**: View toggle, type filter, sort options
- **API Endpoint**: `/api/charts/equipment-utilization?view={trend|composition}`
- **Note**: Heatmap view skipped (Q&A Line 89: "For now and forever")

**Dual-View Architecture** (Source: Lines 351-384):

**View Toggle**:
```css
.view-toggle {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 4px;
  border-radius: 8px;
  padding: 4px;
  background: rgba(255, 255, 255, 0.05);
}

.view-toggle-button {
  width: 80px;
  height: 32px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}

.view-toggle-button.active {
  font-weight: 600;
}
```

**Buttons**: "Trend" (default active), "Composition"

**Primary View: Utilization Trend Line Chart** (Source: Lines 388-462):
- **Type**: Multi-Line Chart with Area Fill
- **Purpose**: Show utilization rate trend by equipment type

**Recharts Implementation**:
```typescript
<LineChart data={equipmentTrendData}>
  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
  <XAxis
    dataKey="date"
    tickFormatter={(date) => format(date, 'MMM dd')}
  />
  <YAxis
    domain={[0, 100]}
    tickFormatter={(value) => `${value}%`}
    label={{ value: 'Utilization Rate (%)', angle: -90, position: 'insideLeft' }}
  />
  <Tooltip content={<EquipmentTrendTooltip />} />
  <Legend verticalAlign="bottom" />

  {/* Target line */}
  <ReferenceLine
    y={80}
    stroke={WARNING_COLOR}
    strokeDasharray="3 3"
    label="Target"
  />

  {/* Equipment type lines */}
  {EQUIPMENT_TYPES.map((type, index) => (
    <React.Fragment key={type}>
      <Area
        type="monotone"
        dataKey={type}
        fill={EQUIPMENT_COLORS[index]}
        fillOpacity={0.2}
        stroke="none"
      />
      <Line
        type="monotone"
        dataKey={type}
        stroke={EQUIPMENT_COLORS[index]}
        strokeWidth={2}
        dot={{ r: 4 }}
        activeDot={{ r: 6 }}
        name={formatEquipmentType(type)}
      />
    </React.Fragment>
  ))}
</LineChart>
```

**Visual Specifications**:
- **Lines**: One line per Equipment Type (4 lines total), type monotone (smooth curves), stroke width 2px, area fill 20% opacity, dot size 4px (normal) 6px (active)
- **Target Threshold**: Type horizontal reference line, position Y = 80% (or configured target), style dashed warning color, label "Target" at right end
- **Threshold Breach Indicators**: When utilization < target red zone shading, visual gradient fill below target line, opacity 0.1
- **Equipment Type Colors**: CRUSHING_SCREENING (Color 1), EARTH_MOVING (Color 2), HAULING (Color 3), AUXILIARY (Color 4)

**Data Structure**:
```typescript
interface EquipmentTrendData {
  date: string;
  CRUSHING_SCREENING: number; // Utilization rate 0-100
  EARTH_MOVING: number;
  HAULING: number;
  AUXILIARY: number;
}

// Calculation per type:
// utilizationRate = (totalRunHours / totalAvailableHours) × 100
```

**Type Filter Dropdown**:
```css
.equipment-type-filter {
  width: 200px;
  height: 36px;
  margin-bottom: 12px;
}
```
- **Options**: "All Types" (default), individual type options (CRUSHING_SCREENING, EARTH_MOVING, etc.)
- **When filtered**: Show only selected type

**Tooltip Content**:
```
Date: Oct 31, 2025
─────────────────────────────
Crushing & Screening: 85.2%
  Run Hours: 204 / Available: 240
  Active Units: 3

Earth Moving: 72.5%
  Run Hours: 174 / Available: 240
  Active Units: 5

[More types...]
─────────────────────────────
Target: 80%
```

**Secondary View: Utilization Composition (100% Stacked Bar)** (Source: Lines 466-582):
- **Type**: Horizontal 100% Stacked Bar Chart
- **Purpose**: Summarize activity split over entire selected date range

**Recharts Implementation**:
```typescript
<BarChart
  data={equipmentCompositionData}
  layout="vertical"
  margin={{ left: 120 }}
>
  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
  <XAxis
    type="number"
    domain={[0, 100]}
    tickFormatter={(value) => `${value}%`}
  />
  <YAxis
    dataKey="unit"
    type="category"
    width={120}
    tickFormatter={formatUnitLabel}
  />
  <Tooltip content={<CompositionTooltip />} />
  <Legend verticalAlign="bottom" />

  <Bar dataKey="runTime" stackId="a" fill={SUCCESS_COLOR} name="Run Time" />
  <Bar dataKey="idleTime" stackId="a" fill={WARNING_COLOR} name="Idle Time" />
  <Bar dataKey="downtime" stackId="a" fill={DANGER_COLOR} name="Downtime" />
</BarChart>
```

**Visual Specifications**:
- **Bar Structure**: Orientation horizontal, bar height 32px, X-axis 0% to 100%, segments Run Time, Idle Time, Downtime
- **Segment Colors**: Run Time (Utilized) success color, Idle Time (Available but not used) warning color, Downtime (Maintenance/Breakdown) danger color
- **Segment Proportions**: Calculated from total hours over selected range, formula (segmentHours / totalAvailableHours) × 100
- **Y-Axis Labels**: Format "EQUIPMENT_DEF UNIT_ID", example "CRUSHER 01" "EXCAVATOR 03", font size 12px, truncate if too long

**Data Structure**:
```typescript
interface EquipmentCompositionData {
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
```

**Sort Options**:
```css
.composition-sort {
  width: 160px;
  height: 32px;
  position: absolute;
  top: 48px;
  right: 16px;
}
```
- **Options**: "Utilization (High to Low)" (default), "Utilization (Low to High)", "Downtime (High to Low)", "Alphabetical"

**Type Filter** (Same as trend view): Filters which equipment units are shown, dropdown above chart, updates composition bars instantly

**Tooltip Content**:
```
CRUSHER 01 (Crushing & Screening)
──────────────────────────────────
Run Time: 85.2% (204 hours)
Idle Time: 10.8% (26 hours)
Downtime: 4.0% (10 hours)
──────────────────────────────────
Total Available: 240 hours
Downtime Reasons:
  • Scheduled Maintenance (6h)
  • Belt Replacement (4h)
```

**Optional Enhancement: Heatmap View** (Source: Lines 584-590):
- **Status**: Phase 2 Feature (Q&A Line 89: Skipped "For now and forever")
- **Description**: Calendar heatmap visualization showing equipment utilization patterns over time
- **Full Specification**: See `DeskOps-Dashboard-Appendix.md` Section 1.1

#### Task 5.4: Utilization KPI Card

**File**: `components/dashboard/UtilizationKPICard.tsx`

**Source**: `DeskOps-Dashboard-P2.md` Section 6.5 (Lines 648-695)

**Dimensions**: 3 columns, 350px height
**Purpose**: At-a-glance metrics for Row 3

**Content Layout**:
```
┌─────────────────────────┐
│ Utilization Summary     │
├─────────────────────────┤
│ 82.5%                   │
│ Avg Equipment Util.     │
├─────────────────────────┤
│ 392 hrs                 │
│ Total Manpower Hours    │
├─────────────────────────┤
│ 90.7%                   │
│ Attendance Rate         │
├─────────────────────────┤
│ 3 units                 │
│ Equipment Downtime      │
└─────────────────────────┘
```

**Metric Structure** (Each):
- Value: 32px font size, bold
- Label: 13px, opacity 0.7
- Gap: 8px between value and label
- Padding: 16px per metric section

**Visual Enhancements**:
- Small sparklines next to values (optional)
- Trend indicators (up/down arrows)
- Color coding based on thresholds

---

**(Plan continues in Part 4...)**
