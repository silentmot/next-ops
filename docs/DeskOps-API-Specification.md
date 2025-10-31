# DeskOps API Specification
<!--markdownlint-disable-file-->

**Backend API contracts and data models for the DeskOps system.**

**Source**: Extracted from DeskOps-Dashboard.md (Lines 4765-4897)

---

## **1. CORE TYPE DEFINITIONS**

### 1.1 Manpower Types

**Source**: User-provided type specifications

```typescript
export type ManpowerRole =
  | "EQUIPMENT_DRIVER"
  | "CRUSHER_OPERATOR"
  | "MAINTENANCE_WORKER"
  | "LABORER"
  | "SECURITY";

export type ShiftType = "MORNING" | "AFTERNOON" | "NIGHT";
```

### 1.2 Equipment Types

```typescript
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
```

### 1.3 Material Types

```typescript
export type MaterialType =
  | "AGGREGATE_BASE"
  | "CRUSHED_CONCRETE"
  | "RECYCLED_ASPHALT"
  | "FINE_SAND"
  | "COARSE_AGGREGATE"
  | "MIXED_RUBBLE";
```

### 1.4 Transaction Types

```typescript
export type TransactionType =
  | "RECEIVED"
  | "DISPATCHED"
  | "PRODUCTION";

export type RecordStatus =
  | "ACTIVE"
  | "PENDING"
  | "COMPLETED"
  | "CANCELLED";

export type UOM = "TON" | "LOAD" | "HOUR" | "COUNT" | "PERCENT";
```

---

## **2. API ENDPOINT STRUCTURE**

### 2.1 Base Configuration

**Base URL**: `/api`
**Versioning**: None (source: GZANSP - forbidden versioned paths)
**Format**: `/api/[module]/[resource]`

### 2.2 Module Endpoints

**Metrics**:
- `/api/metrics/production-today` - Total production today KPI
- `/api/metrics/received-today` - Received materials today KPI
- `/api/metrics/dispatched-today` - Dispatched materials today KPI
- `/api/metrics/inventory-current` - Current inventory status KPI

**Charts**:
- `/api/charts/inventory-levels` - 30-day inventory by material
- `/api/charts/production-vs-target` - Production vs target comparison
- `/api/charts/manpower-attendance` - Manpower attendance tracking
- `/api/charts/equipment-utilization` - Equipment utilization metrics
- `/api/charts/flow-trend` - Received vs dispatched trend
- `/api/charts/recycling-rate` - Recycling rate over time

**Operational Data**:
- `/api/production` - Production records
- `/api/dispatch` - Dispatch records
- `/api/received` - Received materials
- `/api/equipment` - Equipment logs
- `/api/manpower` - Manpower attendance
- `/api/inventory` - Inventory snapshots
- `/api/sites` - Site information

**System**:
- `/api/export` - Export job management

---

## **3. COMMON QUERY PARAMETERS**

### 3.1 Filtering Parameters

```typescript
interface FilterParams {
  siteId?: string;              // Single site ID
  siteIds?: string[];           // Multiple site IDs
  startDate: string;            // ISO date string (required)
  endDate: string;              // ISO date string (required)
  materialType?: MaterialType[];
  status?: RecordStatus;
  shift?: ShiftType;
  equipmentType?: EquipmentType;
  role?: ManpowerRole;
}
```

### 3.2 Pagination Parameters

```typescript
interface PaginationParams {
  page: number;                 // Default: 1
  pageSize: number;             // Default: 25, Max: 100
  sortBy: string;               // Column name
  sortOrder: 'asc' | 'desc';    // Default: 'desc'
}
```

### 3.3 Example Request

```
GET /api/production?siteId=ALASLA-29&startDate=2025-10-01&endDate=2025-10-31&page=1&pageSize=25&sortBy=date&sortOrder=desc
```

---

## **4. COMMON RESPONSE STRUCTURES**

### 4.1 Success Response

```typescript
interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    totalCount?: number;
    totalPages?: number;
  };
  timestamp: string;            // ISO timestamp
}
```

**Example**:

```json
{
  "data": [
    {
      "id": "prod-001",
      "date": "2025-10-31",
      "quantity": 1234.56,
      "materialType": "AGGREGATE_BASE"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 25,
    "totalCount": 234,
    "totalPages": 10
  },
  "timestamp": "2025-10-31T12:00:00Z"
}
```

### 4.2 Error Response

```typescript
interface ApiError {
  error: {
    code: string;               // Error code (e.g., "INVALID_DATE_RANGE")
    message: string;            // Human-readable message
    details?: Record<string, unknown>; // Additional context
  };
  timestamp: string;
}
```

**Example**:

```json
{
  "error": {
    "code": "INVALID_DATE_RANGE",
    "message": "End date must be after start date",
    "details": {
      "startDate": "2025-10-31",
      "endDate": "2025-10-01"
    }
  },
  "timestamp": "2025-10-31T12:00:00Z"
}
```

---

## **5. METRIC ENDPOINTS**

### 5.1 Production Today

**Endpoint**: `GET /api/metrics/production-today`

**Query Parameters**:
- `siteId` (required): string

**Response**:

```typescript
interface ProductionTodayMetric {
  value: number;                // Current value in TON
  previousValue: number;        // Yesterday's value
  change: number;               // Percentage change
  trend: 'up' | 'down' | 'stable';
  sparkline: number[];          // Last 7 days
}
```

### 5.2 Received Today

**Endpoint**: `GET /api/metrics/received-today`

**Query Parameters**:
- `siteId` (required): string

**Response**: Same structure as ProductionTodayMetric

### 5.3 Dispatched Today

**Endpoint**: `GET /api/metrics/dispatched-today`

**Query Parameters**:
- `siteId` (required): string

**Response**: Same structure as ProductionTodayMetric

### 5.4 Current Inventory

**Endpoint**: `GET /api/metrics/inventory-current`

**Query Parameters**:
- `siteId` (required): string

**Response**:

```typescript
interface InventoryCurrentMetric {
  value: number;
  previousValue: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  sparkline: number[];
  breakdown: {
    opening: number;
    production: number;
    received: number;
    dispatched: number;
  };
}
```

---

## **6. CHART DATA ENDPOINTS**

### 6.1 Inventory Levels

**Endpoint**: `GET /api/charts/inventory-levels`

**Query Parameters**:
- `siteId` (required): string
- `startDate` (required): string (ISO date)
- `endDate` (required): string (ISO date)

**Response**:

```typescript
interface InventoryLevelsData {
  data: Array<{
    date: string;
    [materialType: string]: number | string;
  }>;
  materials: string[];          // List of material types
}
```

### 6.2 Production vs Target

**Endpoint**: `GET /api/charts/production-vs-target`

**Query Parameters**:
- `siteId` (required): string
- `startDate` (required): string
- `endDate` (required): string

**Response**:

```typescript
interface ProductionVsTargetData {
  data: Array<{
    date: string;
    production: number;
    target: number;
    variance: number;
    variancePercent: number;
  }>;
}
```

### 6.3 Manpower Attendance

**Endpoint**: `GET /api/charts/manpower-attendance`

**Query Parameters**:
- `siteId` (required): string
- `startDate` (required): string
- `endDate` (required): string
- `shift` (optional): ShiftType

**Response**:

```typescript
interface ManpowerAttendanceData {
  data: Array<{
    date: string;
    shift: ShiftType;
    present: {
      [role in ManpowerRole]: number;
    };
    presentHours: {
      [role in ManpowerRole]: number;
    };
    absent: number;
    totalScheduled: number;
    attendanceRate: number;
  }>;
}
```

### 6.4 Equipment Utilization

**Endpoint**: `GET /api/charts/equipment-utilization`

**Query Parameters**:
- `siteId` (required): string
- `startDate` (required): string
- `endDate` (required): string
- `view`: 'trend' | 'composition'

**Response (Trend View)**:

```typescript
interface EquipmentUtilizationTrend {
  data: Array<{
    date: string;
    CRUSHING_SCREENING: number;
    EARTH_MOVING: number;
    HAULING: number;
    AUXILIARY: number;
  }>;
  targetRate: number;
}
```

**Response (Composition View)**:

```typescript
interface EquipmentUtilizationComposition {
  data: Array<{
    unit: string;
    def: EquipmentDef;
    type: EquipmentType;
    runTime: number;
    idleTime: number;
    downtime: number;
    runHours: number;
    idleHours: number;
    downtimeHours: number;
    totalAvailableHours: number;
    downtimeReasons?: string[];
  }>;
}
```

### 6.5 Flow Trend

**Endpoint**: `GET /api/charts/flow-trend`

**Query Parameters**:
- `siteId` (required): string
- `startDate` (required): string
- `endDate` (required): string

**Response**:

```typescript
interface FlowTrendData {
  data: Array<{
    date: string;
    received: number;
    dispatched: number;
    net: number;
    receivedCount: number;
    dispatchCount: number;
  }>;
}
```

### 6.6 Recycling Rate

**Endpoint**: `GET /api/charts/recycling-rate`

**Query Parameters**:
- `siteId` (required): string
- `startDate` (required): string
- `endDate` (required): string

**Response**:

```typescript
interface RecyclingRateData {
  data: Array<{
    date: string;
    rate: number;
    recycledMaterial: number;
    totalReceived: number;
    targetRate: number;
    variance: number;
  }>;
}
```

---

## **7. OPERATIONAL DATA ENDPOINTS**

### 7.1 Production Records

**Endpoint**: `GET /api/production`

**Query Parameters**: FilterParams + PaginationParams

**Response**:

```typescript
interface ProductionRecord {
  id: string;
  date: string;
  siteId: string;
  materialType: MaterialType;
  quantity: number;
  uom: UOM;
  shift: ShiftType;
  status: RecordStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

type ProductionResponse = ApiResponse<ProductionRecord[]>;
```

### 7.2 Dispatch Records

**Endpoint**: `GET /api/dispatch`

**Query Parameters**: FilterParams + PaginationParams

**Response**:

```typescript
interface DispatchRecord {
  id: string;
  date: string;
  siteId: string;
  materialType: MaterialType;
  quantity: number;
  uom: UOM;
  destination: string;
  vehicleId?: string;
  status: RecordStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

type DispatchResponse = ApiResponse<DispatchRecord[]>;
```

### 7.3 Received Materials

**Endpoint**: `GET /api/received`

**Query Parameters**: FilterParams + PaginationParams

**Response**:

```typescript
interface ReceivedRecord {
  id: string;
  date: string;
  siteId: string;
  materialType: MaterialType;
  quantity: number;
  uom: UOM;
  source: string;
  vehicleId?: string;
  status: RecordStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

type ReceivedResponse = ApiResponse<ReceivedRecord[]>;
```

### 7.4 Equipment Logs

**Endpoint**: `GET /api/equipment`

**Query Parameters**: FilterParams + PaginationParams

**Response**:

```typescript
interface EquipmentLog {
  id: string;
  date: string;
  siteId: string;
  equipmentId: string;
  def: EquipmentDef;
  type: EquipmentType;
  shift: ShiftType;
  runHours: number;
  idleHours: number;
  downtimeHours: number;
  utilizationRate: number;
  status: RecordStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

type EquipmentResponse = ApiResponse<EquipmentLog[]>;
```

### 7.5 Manpower Attendance

**Endpoint**: `GET /api/manpower`

**Query Parameters**: FilterParams + PaginationParams

**Response**:

```typescript
interface ManpowerRecord {
  id: string;
  date: string;
  siteId: string;
  shift: ShiftType;
  role: ManpowerRole;
  presentCount: number;
  absentCount: number;
  totalHours: number;
  attendanceRate: number;
  status: RecordStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

type ManpowerResponse = ApiResponse<ManpowerRecord[]>;
```

---

## **8. INVENTORY CALCULATION**

### 8.1 Formula (SSOT)

**Source**: DeskOps-Dashboard.md inventory specification

```typescript
const calculateClosingInventory = (data: {
  opening: number;
  production: number;
  received: number;
  dispatched: number;
}): number => {
  return data.opening + data.production + data.received - data.dispatched;
};
```

### 8.2 Prerequisites

**All required before trigger**:

1. Opening inventory recorded
2. Daily production logged
3. Received materials logged
4. Dispatched materials logged

**Trigger Condition**: All 4 inputs recorded for current date
**Action**: Calculate and store closing inventory snapshot

### 8.3 Inventory Snapshot Endpoint

**Endpoint**: `GET /api/inventory`

**Query Parameters**:
- `siteId` (required): string
- `date` (required): string (ISO date)

**Response**:

```typescript
interface InventorySnapshot {
  id: string;
  date: string;
  siteId: string;
  materialType: MaterialType;
  opening: number;
  production: number;
  received: number;
  dispatched: number;
  closing: number;              // Calculated value
  uom: UOM;
  createdAt: string;
  updatedAt: string;
}

type InventoryResponse = ApiResponse<InventorySnapshot[]>;
```

---

## **9. EXPORT ENDPOINTS**

### 9.1 Create Export Job

**Endpoint**: `POST /api/export`

**Request Body**:

```typescript
interface ExportRequest {
  format: 'xlsx' | 'pdf' | 'csv' | 'pbix';
  module: string;
  filters: {
    siteId?: string | string[];
    dateRange: { start: string; end: string };
    materialTypes?: string[];
    [key: string]: unknown;
  };
  granularity?: 'daily' | 'weekly' | 'monthly';
  columns: string[];
  grouping?: string;
  layout?: 'portrait' | 'landscape';
}
```

**Response**:

```typescript
interface ExportJobResponse {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  estimatedTimeMs: number;
  createdAt: string;
}
```

### 9.2 Check Export Status

**Endpoint**: `GET /api/export/{jobId}/status`

**Response**:

```typescript
interface ExportStatusResponse {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;             // 0-100
  downloadUrl?: string;         // When completed
  error?: string;               // When failed
}
```

### 9.3 Download Export

**Endpoint**: `GET /api/export/{jobId}/download`

**Response**: File stream with appropriate headers

**Headers**:
- `Content-Type`: Based on format
- `Content-Disposition`: `attachment; filename="{filename}"`

---

## **10. ERROR CODES**

### 10.1 Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_DATE_RANGE` | 400 | End date must be after start date |
| `MISSING_REQUIRED_PARAM` | 400 | Required parameter missing |
| `INVALID_SITE_ID` | 400 | Site ID not found |
| `INVALID_PAGE_SIZE` | 400 | Page size exceeds maximum (100) |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `EXPORT_JOB_FAILED` | 500 | Export job processing failed |
| `INTERNAL_ERROR` | 500 | Internal server error |

---

## **11. RATE LIMITING**

**Configuration**:
- Rate limit: 100 requests per minute per user
- Burst limit: 20 requests per second
- Response header: `X-RateLimit-Remaining`

**Rate Limit Exceeded Response**:

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "details": {
      "retryAfter": 60
    }
  },
  "timestamp": "2025-10-31T12:00:00Z"
}
```

---

## **12. AUTHENTICATION**

**Method**: Clerk-based authentication
**Token**: Provided via Clerk SDK
**Header**: `Authorization: Bearer {token}`

**Unauthorized Response**:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  },
  "timestamp": "2025-10-31T12:00:00Z"
}
```

---

**End of API Specification**

**Related Documents**:
- DeskOps-Dashboard.md (Frontend specification)
- DeskOps-Dashboard-Appendix.md (Additional features)
- DeskOps-DB-Prisma.md (Database schema)
