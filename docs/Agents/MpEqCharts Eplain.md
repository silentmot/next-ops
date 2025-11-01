# It's straightforward. Equipment and manpower are both indicators of attendance

Check my recommendation below and please, if you have a better and more comprehensive idea, don't hesitate to speak your mind.

## Manpower Attendance Tracking

You are tracking **present workers** by {role}, their **count**, and their **hours**, as well as the **absent count**.

### Chart: Stacked Column Chart (Time-Series)

This chart type is best for dynamic daily tracking over a selected range.

| Data Point | Chart Representation | Rationale |
| :--- | :--- | :--- |
| **X-Axis** | **Date/Shift** | Shows the **trend** over time, crucial for daily tracking. |
| **Y-Axis** | **Worker Count** (or Hours) | Provides the absolute volume of attendance/absence. |
| **Series Stack 1** | **Present Workers Count** (by {role}) | The primary operational metric. |
| **Series Stack 2** | **Absent Workers Count** | Clearly shows the deficit or gap in staffing. |

**Layout and Perspective:**

* Use a **Stacked Column Chart** where each column represents a day/shift in the selected range. The total height of the column is the **Total Scheduled Workforce**.
* The column is segmented into: **Present Count** (bottom, positive) and **Absent Count** (top, often colored red/gray).
* **Filtering:** Use a **Role Selector** to filter the chart to a specific ManpowerRole (e.g., "CRUSHER/OPERATOR") or view the total workforce.
* **Hours:** The hours should be displayed in a supporting KPI card or within the tooltip for the Present segment, as mixing count and hours on the primary axis can be confusing.

---

## ⚙️ Equipment Utilization Tracking

You are tracking equipment by {type}, its specific {def}, **count** (number of units), and **hours** (utilization).

### Chart: Dual View - Utilization Line and Summary Bar

For equipment, both the **trend** and the **composition** of utilization are important.

#### 1. Utilization Trend (Primary View)

* **Chart Type:** **Line Chart**
* **X-Axis:** **Date/Shift** (from the date selector)
* **Y-Axis:** **Utilization Rate (%)** (UOM = 'PERCENT')
**Layout and Perspective:**
* This chart plots the **Utilization Rate** (e.g., Run_Hours / Available_Hours) over the selected time range.
* Each line represents a key equipment group EquipmentType e.g., "CRUSHING\_SCREENING").
* This quickly reveals if utilization is falling below targets or spiking unsustainably.

#### 2. Utilization Composition (Summary View)

* **Chart Type:** **100% Stacked Bar Chart**
* **X-Axis:** **0% to 100%**
* **Y-Axis:** **Equipment Definition** EquipmentDef e.g., "CRUSHER 01", "CRUSHER 02")
**Layout and Perspective:**
* This chart summarizes the activity split over the **entire selected date range**.
* Segments for each bar include: **Run Time** (Utilized), **Idle Time**, **Downtime** (Maintenance/Breakdown).
* **Filtering:** Use a **Type Selector** to filter the chart to a specific EquipmentType (e.g., "HAULING") or view all equipment. The count (number of units) is implicit here, as each bar represents one unit or an aggregate of units of the same definition.
This dual-view approach (Trend + Composition) provides a comprehensive look at equipment operations.*
