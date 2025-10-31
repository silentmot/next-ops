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

## **6. ROW 3: UTILIZATION METRICS**

**Source**: User-provided comprehensive specifications for Equipment and Manpower

### 6.1 Container Layout

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

### 6.2 Type Definitions (SSOT)

**Source**: User-provided type specifications

```typescript
// Core Type Definitions
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
```

### 6.3 Left Chart: Manpower Attendance Tracking

**Source**: User specification - "tracking present workers by role, their count, and their hours, as well as the absent count"

---

**📋 QUICK REFERENCE**

| Property | Value |
|----------|-------|
| **Chart Type** | Stacked Column Chart (Time-Series) |
| **Purpose** | Daily attendance tracking by role over date range |
| **Data Points** | Present count by role + Absent count |
| **Time Range** | Selected date range (default: last 7 days) |
| **Key Metrics** | Worker count, hours worked, attendance rate |
| **Interactions** | Role filter, shift toggle, tooltip details |
| **API Endpoint** | `/api/charts/manpower-attendance` |

---

#### Chart Type & Configuration

**Type**: Stacked Column Chart (Time-Series)
**Purpose**: Dynamic daily tracking over selected date range
**Rationale**: Shows trend over time, crucial for daily tracking

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

#### Visual Specifications

**Column Structure**:

- Total height: Total Scheduled Workforce
- Stack 1 (bottom): Present Workers Count (segmented by role)
- Stack 2 (top): Absent Workers Count
- Bar width: Auto (responsive to data density)
- Gap between bars: 8px

**Role Segmentation**:

- Each role gets a unique color (from design tokens)
- Color consistency across all charts
- Stack order: Alphabetical by role name

**Color Mapping** (General approach):

- EQUIPMENT_DRIVER: Color 1
- CRUSHER_OPERATOR: Color 2
- MAINTENANCE_WORKER: Color 3
- LABORER: Color 4
- SECURITY: Color 5
- ABSENT: Danger color (red tone)

#### Data Structure

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

#### Interactive Features

**Role Filter Dropdown**:

```css
.role-filter {
  width: 180px;
  height: 36px;
  margin-bottom: 12px;
  border-radius: 8px;
}
```

**Dropdown Options**:

- "All Roles" (default)
- Individual role options (EQUIPMENT_DRIVER, CRUSHER_OPERATOR, etc.)
- When filtered: Show only selected role + absent

**Shift Toggle**:

- Position: Next to role filter
- Options: All Shifts, Morning, Afternoon, Night
- Width: 140px
- Height: 36px

**Tooltip Content**:

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

#### Supporting KPI Card (Right Side)

**Position**: Adjacent to chart (in Row 3 right section)
**Dimensions**: 3 columns width, 350px height

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

**KPI Layout**:

- 3 stacked metrics
- Each: Value (24px) + label (12px)
- Gap: 16px between metrics
- Padding: 24px

#### Secondary View: Hours Worked Line Overlay

**Toggle**: Button to switch between "Count" and "Hours" view
**Implementation**: Adds a line series for total hours on right Y-axis

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

### 6.4 Middle Chart: Equipment Utilization Tracking

**Source**: User specification - "tracking equipment by type, its specific def, count, and hours"

---

**📋 QUICK REFERENCE**

| Property | Value |
|----------|-------|
| **Chart Type** | Dual-View: Trend (Line) / Composition (Stacked Bar) |
| **Purpose** | Track equipment utilization by type and unit |
| **View 1: Trend** | Multi-line chart showing utilization rate % over time |
| **View 2: Composition** | 100% stacked horizontal bars (Run/Idle/Downtime) |
| **Target Threshold** | 80% utilization (configurable) |
| **Interactions** | View toggle, type filter, sort options |
| **API Endpoint** | `/api/charts/equipment-utilization?view={trend\|composition}` |

**Note**: Heatmap view available in Appendix (Phase 2 feature)

---

#### Dual-View Architecture

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

**Buttons**:

- "Trend" (default active)
- "Composition"

---

#### Primary View: Utilization Trend Line Chart

**Type**: Multi-Line Chart with Area Fill
**Purpose**: Show utilization rate trend by equipment type

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

**Lines**:

- One line per Equipment Type (4 lines total)
- Type: Monotone (smooth curves)
- Stroke width: 2px
- Area fill: 20% opacity
- Dot size: 4px (normal), 6px (active)

**Target Threshold**:

- Type: Horizontal reference line
- Position: Y = 80% (or configured target)
- Style: Dashed, warning color
- Label: "Target" at right end

**Threshold Breach Indicators**:

- When utilization < target: Red zone shading
- Visual: Gradient fill below target line
- Opacity: 0.1

**Equipment Type Colors**:

- CRUSHING_SCREENING: Color 1
- EARTH_MOVING: Color 2
- HAULING: Color 3
- AUXILIARY: Color 4

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

**Options**:

- "All Types" (default)
- Individual type options (CRUSHING_SCREENING, EARTH_MOVING, etc.)
- When filtered: Show only selected type

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

---

#### Secondary View: Utilization Composition (100% Stacked Bar)

**Type**: Horizontal 100% Stacked Bar Chart
**Purpose**: Summarize activity split over entire selected date range

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

**Bar Structure**:

- Orientation: Horizontal
- Bar height: 32px
- X-axis: 0% to 100%
- Segments: Run Time, Idle Time, Downtime

**Segment Colors**:

- Run Time (Utilized): Success color
- Idle Time (Available but not used): Warning color
- Downtime (Maintenance/Breakdown): Danger color

**Segment Proportions**:

- Calculated from total hours over selected range
- Formula: (segmentHours / totalAvailableHours) × 100

**Y-Axis Labels**:

- Format: "EQUIPMENT_DEF UNIT_ID"
- Example: "CRUSHER 01", "EXCAVATOR 03"
- Font size: 12px
- Truncate if too long

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

**Sort Options**:

- "Utilization (High to Low)" (default)
- "Utilization (Low to High)"
- "Downtime (High to Low)"
- "Alphabetical"

**Type Filter** (Same as trend view):

- Filters which equipment units are shown
- Dropdown above chart
- Updates composition bars instantly

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

---

#### Optional Enhancement: Heatmap View

**Status**: Phase 2 Feature

**Description**: Calendar heatmap visualization showing equipment utilization patterns over time. Each cell represents one day for one equipment unit, with color intensity indicating utilization rate.

**Full Specification**: See `DeskOps-Dashboard-Appendix.md` Section 1.1

### 6.5 Right Section: Utilization KPI Card

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

**End of Core Dashboard Specification**

**Related Documents**:

- `DeskOps-Dashboard-P1.md` - Detailed dashboard specification Introduction and Row 1 and Row 2
- `DeskOps-Dashboard-P3.md` - Detailed dashboard specification Row 5 and Data Tables
- `DeskOps-Dashboard-Appendix.md` - Optional features, chart variations, interaction patterns, export details, table virtualization
- `DeskOps-API-Specification.md` - Backend API contracts, data models, endpoints, response structures
- `DeskOps-DB-Prisma.md` - Database schema and Prisma configuration
