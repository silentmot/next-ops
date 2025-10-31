# DeskOps System Constants - Centralized Configuration

## System Overview

**Purpose**: This document defines all centralized constants, configurations, and standardized values used across the DeskOps application. All modules MUST reference these centralized definitions to ensure consistency.

**Critical Requirement**:

- ⚠️ **DO NOT DUPLICATE** these constants in individual modules
- ⚠️ **ALWAYS IMPORT** from the centralized constants file
- ⚠️ **UPDATE HERE FIRST** before changing any system-wide configurations
- ⚠️ **NO VERSIONING** in API endpoints - use `/api/[module]/[resource]` pattern only
- ⚠️ **DO NOT USE `any`** in type annotations, assertions, generics, or anywhere in the codebase.
- ⚠️ **ANY CODE CONTAINING `any`** will be considered incomplete and must be refactored before acceptance.

---

## **1. Unit of Measure types**

```typescript
/**
 * Unit of Measure types
 * Source: Document index 9 - "export type UOM"
 */
export type UOM = 'TON' | 'LOAD' | 'HOUR' | 'COUNT' | 'PERCENT';
```

**Usage Example:**

```typescript
import { UOM } from '@/lib/constants';

const isMaterial = material.UOM === 'TON';
```

## **2. Material, Operation, Equipment, Role, and User Types**

````typescript
export type MaterialCategory =
  | "AGGREGATES"
  | "PROCESSED_BASE"
  | "FINE"
  | "SPECIALTY"
  | "RAW_FEED";

/**
 * Operation types for production and dispatch
 * Source: Document index 9 - "export type OperationType"
 */
export type OperationType = "CRU-PRO" | "CRU-DIS" | "CRU-OP" | "SEG-OP";

/**
 * Equipment categories
 * Source: Document index 9 - "export type EquipmentType"
 */
export type EquipmentType =
  "CRUSHING_SCREENING"
  "EARTH_MOVING"
  "HAULING"
  "AUXILIARY"

/**
 * Role codes for manpower
 * Source: Document index 9 - "export type RoleCode"
 */
export type ManpowerRole =
  | "EQUIPMENT_DRIVER"
  | "CRUSHER_OPERATOR"
  | "MAINTENANCE_WORKER"
  | "LABORER"
  | "SECURITY";

/**
 * Type alias for backward compatibility
 * Use ManpowerRole consistently throughout the codebase
 */
export type RoleCode = ManpowerRole;

/**
 * User roles for authentication
 * Source: Document index 9 - "export enum UserRole"
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

/**
 * Shift types for production and manpower scheduling
 */
export type ShiftType = "MORNING" | "AFTERNOON" | "NIGHT";

/**
 * Equipment status types
 */
export type EquipmentStatus = "OPERATIONAL" | "MAINTENANCE" | "BREAKDOWN" | "IDLE";

## Exported Constant Arrays for Validation

These readonly constant arrays are used in Zod schemas and runtime validation throughout the application. They provide both compile-time type safety and runtime validation capabilities.

### SHIFT_TYPES

```typescript
export const SHIFT_TYPES = ['MORNING', 'AFTERNOON', 'NIGHT'] as const;
````

**Purpose**: Readonly array used in Zod enum validation (z.enum(SHIFT_TYPES)) in ProductionSchema, EquipmentLogSchema, and ManpowerLogSchema. Provides compile-time type safety and runtime validation.

**Usage Example**:

```typescript
import { SHIFT_TYPES } from '@deskops/constants';

// In Zod schema
const schema = z.object({
  shift: z.enum(SHIFT_TYPES).optional(),
});

// In UI component (dropdown options)
const shiftOptions = SHIFT_TYPES.map((shift) => ({
  value: shift,
  label: shift.charAt(0) + shift.slice(1).toLowerCase(),
}));

// In filter logic
const isValidShift = (value: string): boolean =>
  SHIFT_TYPES.includes(value as (typeof SHIFT_TYPES)[number]);
```

### EQUIPMENT_STATUSES

```typescript
export const EQUIPMENT_STATUSES = [
  'OPERATIONAL',
  'MAINTENANCE',
  'BREAKDOWN',
  'IDLE',
] as const;
```

**Purpose**: Readonly array used in Zod enum validation (z.enum(EQUIPMENT_STATUSES)) in EquipmentLogSchema. Provides type-safe status validation for equipment tracking.

**Usage Example**:

```typescript
import { EQUIPMENT_STATUSES } from '@deskops/constants';

// In Zod schema
const schema = z.object({
  status: z.enum(EQUIPMENT_STATUSES).optional()
});

// In UI component (status badge)
const statusColors = {
  OPERATIONAL: 'green',
  MAINTENANCE: 'yellow',
  BREAKDOWN: 'red',
  IDLE: 'gray'
} as const;

const StatusBadge = ({ status }: { status: typeof EQUIPMENT_STATUSES[number] }) => (
  <Badge color={statusColors[status]}>{status}</Badge>
);

// In custom validation
const validateEquipmentStatus = (status: unknown): status is typeof EQUIPMENT_STATUSES[number] => {
  return typeof status === 'string' && EQUIPMENT_STATUSES.includes(status as typeof EQUIPMENT_STATUSES[number]);
};
```

**Difference between Type Definitions and Const Arrays**:

- **Type definitions** (ShiftType, EquipmentStatus): Used for TypeScript type annotations at compile-time
- **Const arrays** (SHIFT_TYPES, EQUIPMENT_STATUSES): Used for runtime validation and Zod schemas
- Both are derived from the same source of truth to ensure consistency

**Cross-reference**: See usage in Zod schemas:

- ProductionSchema (DeskOps-DB-Prisma.md line 516): `shift: z.enum(SHIFT_TYPES).optional()`
- EquipmentLogSchema (DeskOps-DB-Prisma.md line 538): `status: z.enum(EQUIPMENT_STATUSES).optional()`

/\*\*

- Scalar types for dataset fields
- Source: Document index 9 - "export type ScalarType"
  \*/
  export type ScalarType = "string" | "number" | "date" | "percent";

// =============================================================================
// MATERIAL DEFINITIONS (Source: Document index 9)
// =============================================================================

/\*\*

- Material definition interface
- Source: Document index 9 - "export interface MaterialDef"
  \*/
  export interface MaterialDef {
  id: string; // e.g., "MAT001"
  code: string; // e.g., "AGG-G1"
  type: string; // e.g., "AGG"
  name: string; // e.g., "G1"
  category: MaterialCategory;
  uom: UOM; // default UOM for all production/dispatch entries
  isFinal: boolean; // true when sellable product
  notes?: string;
  }

/\*\*

- Complete material catalog
- Source: Document index 9 - "export const MATERIALS: MaterialDef[]"
  \*/
  export const MATERIALS: MaterialDef[] = [
  // AGGREGATES (final products - 9 materials)
  { id: "MAT001", code: "AGG-G1", type: "AGG", name: "G1", category: "AGGREGATES", uom: "TON", isFinal: true },
  { id: "MAT002", code: "AGG-3/4", type: "AGG", name: "3/4", category: "AGGREGATES", uom: "TON", isFinal: true },
  { id: "MAT003", code: "AGG-3/8", type: "AGG", name: "3/8", category: "AGGREGATES", uom: "TON", isFinal: true },
  { id: "MAT004", code: "AGG-S1", type: "AGG", name: "S1", category: "AGGREGATES", uom: "TON", isFinal: true },
  { id: "MAT005", code: "AGG-APBC", type: "AGG", name: "APBC", category: "AGGREGATES", uom: "TON", isFinal: true },
  { id: "MAT006", code: "AGG-FILLING", type: "AGG", name: "FILLING MATERIAL", category: "AGGREGATES", uom: "TON", isFinal: true },
  { id: "MAT007", code: "AGG-RIPRAP", type: "AGG", name: "RIPRAP", category: "AGGREGATES", uom: "TON", isFinal: true },
  { id: "MAT008", code: "AGG-4INCH", type: "AGG", name: "4 INCH", category: "AGGREGATES", uom: "TON", isFinal: true },
  { id: "MAT009", code: "AGG-6INCH", type: "AGG", name: "6 INCH", category: "AGGREGATES", uom: "TON", isFinal: true },

// FINE (final products - 2 materials)
{ id: "MAT010", code: "FINE-WASHED", type: "FINE", name: "WASHED SAND", category: "FINE", uom: "TON", isFinal: true },
{ id: "MAT011", code: "FINE-NATURAL", type: "FINE", name: "NATURAL SAND", category: "FINE", uom: "TON", isFinal: true },

// SPECIALTY (final products - 1 material)
{ id: "MAT012", code: "SPEC-BEDDING", type: "SPEC", name: "BEDDING SAND", category: "SPECIALTY", uom: "TON", isFinal: true },

// PROCESSED BASE (final products - 2 materials)
{ id: "MAT013", code: "BASE-CRUSHED", type: "BASE", name: "CRUSHED BASE", category: "PROCESSED_BASE", uom: "TON", isFinal: true },
{ id: "MAT014", code: "BASE-RECYCLED", type: "BASE", name: "RECYCLED BASE", category: "PROCESSED_BASE", uom: "TON", isFinal: true },

// RAW FEED (not sellable - intermediate materials - 3 materials)
{ id: "MAT015", code: "RAW-CONCRETE", type: "RAW", name: "CONCRETE DEBRIS", category: "RAW_FEED", uom: "LOAD", isFinal: false, notes: "Input material for crushing" },
{ id: "MAT016", code: "RAW-MIXED", type: "RAW", name: "MIXED C&D DEBRIS", category: "RAW_FEED", uom: "LOAD", isFinal: false, notes: "Mixed construction and demolition waste" },
{ id: "MAT017", code: "RAW-ASPHALT", type: "RAW", name: "ASPHALT DEBRIS", category: "RAW_FEED", uom: "LOAD", isFinal: false, notes: "Asphalt waste for processing" },
];

/\*\*

- Canonical ordering for UI and exports
- Source: Document index 9 - "export const MATERIAL_ORDER: string[]"
  \*/
  export const MATERIAL_ORDER: string[] = [
  "MAT001",
  "MAT002",
  "MAT003",
  "MAT004",
  "MAT005",
  "MAT006",
  "MAT007",
  "MAT008",
  "MAT009",
  "MAT010",
  "MAT011",
  "MAT012",
  "MAT013",
  "MAT014",
  "MAT015",
  "MAT016",
  "MAT017",
  ];

// =============================================================================
// OPERATION TYPES (Source: Document index 9)
// =============================================================================

/\*\*

- Operation type definitions
- Source: Document index 9 - "export const OPERATION_TYPES"
  \*/
  export const OPERATION_TYPES: Record<OperationType, { label: string }> = {
  "CRU-PRO": { label: "Crusher Production" },
  "CRU-DIS": { label: "Crusher Dispatch" },
  "CRU-OP": { label: "Crusher Operation" },
  "SEG-OP": { label: "Segregation / Acceptance" },
  };

// =============================================================================
// MANPOWER ROLES (Source: Document index 9)
// =============================================================================

/\*\*

- Role definition interface
- Source: Document index 9 - "export interface RoleDef"
  \*/
  export interface RoleDef {
  code: ManpowerRole;
  name: string;
  }

/\*\*

- Role definitions
- Source: Document index 9 - "export const ROLES: RoleDef[]"
  \*/
  export const ROLES: RoleDef[] = [
  { code: "EQUIPMENT_DRIVER", name: "Equipment Driver" },
  { code: "CRUSHER_OPERATOR", name: "Crusher Operator" },
  { code: "MAINTENANCE_WORKER", name: "Maintenance Worker" },
  { code: "LABORER", name: "Laborer" },
  ];

// =============================================================================
// EQUIPMENT DEFINITIONS (Source: Document index 9)
// =============================================================================

/\*\*

- Equipment definition interface
- Source: Document index 9 - "export interface EquipmentDef"
  \*/
  export interface EquipmentDef {
  id: string;
  code: string;
  name: string;
  type: EquipmentType;
  }

/\*\*

- Equipment catalog
- Source: Document index 9 - "export const EQUIPMENT: EquipmentDef[]"
  \*/
  export const EQUIPMENT: EquipmentDef[] = [
  { id: "EQ001", code: "CRUSHER-01", name: "Jaw Crusher #1", type: "CRUSHING_SCREENING" },
  { id: "EQ002", code: "CRUSHER-02", name: "Cone Crusher #1", type: "CRUSHING_SCREENING" },
  { id: "EQ003", code: "SCREEN-01", name: "Vibrating Screen #1", type: "CRUSHING_SCREENING" },
  { id: "EQ004", code: "EXCAVATOR-01", name: "Excavator CAT320", type: "EARTH_MOVING" },
  { id: "EQ005", code: "EXCAVATOR-02", name: "Excavator PC200", type: "EARTH_MOVING" },
  { id: "EQ006", code: "LOADER-01", name: "Wheel Loader L120", type: "EARTH_MOVING" },
  { id: "EQ007", code: "DUMPTRUCK-01", name: "Dump Truck 6W", type: "HAULING" },
  { id: "EQ008", code: "DUMPTRUCK-02", name: "Dump Truck 10W", type: "HAULING" },
  { id: "EQ009", code: "GENERATOR-01", name: "Generator 500kVA", type: "AUXILIARY" },
  ];

// =============================================================================
// DATASET STRUCTURES (Source: Document index 9)
// =============================================================================

/\*\*

- Dataset field definitions for all modules
- Source: Document index 9 - "export const DATASETS"
  \*/
  export const DATASETS = {
  production: {
  fields: [
  { field: "date", type: "date" as const },
  { field: "siteCode", type: "string" as const },
  { field: "materialId",type: "string" as const },
  { field: "qty", type: "number" as const, uom: "TON" as UOM },
  { field: "operation", type: "string" as const }, // OperationType
  ],
  },
  dispatchTx: {
  fields: [
  { field: "date", type: "date" as const },
  { field: "siteCode", type: "string" as const },
  { field: "materialId",type: "string" as const },
  { field: "qty", type: "number" as const, uom: "TON" as UOM },
  { field: "trips", type: "number" as const },
  { field: "operation", type: "string" as const },
  ],
  },
  equipment: {
  fields: [
  { field: "date", type: "date" as const },
  { field: "siteCode", type: "string" as const },
  { field: "equipmentId", type: "string" as const },
  { field: "hours", type: "number" as const, uom: "HOUR" as UOM },
  { field: "count", type: "number" as const, uom: "COUNT" as UOM },
  ],
  },
  manpower: {
  fields: [
  { field: "date", type: "date" as const },
  { field: "siteCode", type: "string" as const },
  { field: "roleCode", type: "string" as const }, // RoleCode
  { field: "hours", type: "number" as const, uom: "HOUR" as UOM }, // total hours worked (attendance)
  { field: "headcount",type: "number" as const, uom: "COUNT" as UOM },
  ],
  },
  inventorySnapshot: {
  fields: [
  { field: "date", type: "date" as const },
  { field: "siteCode", type: "string" as const },
  { field: "materialId", type: "string" as const },
  { field: "openingTon", type: "number" as const, uom: "TON" as UOM },
  { field: "producedTon", type: "number" as const, uom: "TON" as UOM },
  { field: "dispatchedTon", type: "number" as const, uom: "TON" as UOM },
  { field: "adjustmentTon", type: "number" as const, uom: "TON" as UOM },
  { field: "closingTon", type: "number" as const, uom: "TON" as UOM },
  ],
  },
  } as const;

// =============================================================================
// EXPORT HEADERS (Source: Document index 9)
// =============================================================================

/\*\*

- Export column headers for each dataset
- Source: Document index 9 - "export const EXPORT_HEADERS"
  \*/
  export const EXPORT_HEADERS = {
  production: ["date", "siteCode", "materialId", "material", "qtyTon"],
  dispatchTx: ["date", "siteCode", "materialId", "material", "qtyTon", "trips"],
  equipment: ["date", "siteCode", "equipmentId", "equipment", "hours", "count"],
  manpower: ["date", "siteCode", "roleCode", "role", "headcount"],
  inventorySnapshot: [
  "date",
  "siteCode",
  "materialId",
  "material",
  "openingTon",
  "producedTon",
  "dispatchedTon",
  "adjustmentTon",
  "closingTon",
  ],
  } as const;

// =============================================================================
// DEFAULTS AND VALIDATION (Source: Document index 9)
// =============================================================================

/\*\*

- Default site code
- Source: Document index 9 - "export const DEFAULT_SITE_CODE"
  \*/
  export const DEFAULT_SITE_CODE = "ALASLA-29";

/\*\*

- Decimal precision by UOM
- Source: Document index 9 - "export const DECIMAL_PRECISION"
  \*/
  export const DECIMAL_PRECISION = {
  TON: 3,
  LOAD: 0,
  HOUR: 2,
  COUNT: 0,
  PERCENT: 2
  } as const;

/\*\*

- Error codes for validation
- Source: Document index 9 - "export const ERROR_CODES"
  \*/
  export const ERROR_CODES = {
  UNKNOWN_MATERIAL_ID: "E-MAT-ID",
  UNKNOWN_EQUIPMENT_ID: "E-EQ-ID",
  UNKNOWN_ROLE_CODE: "E-ROLE-CODE",
  INVALID_DATE: "E-DATE",
  INVALID_NUMBER: "E-NUM",
  } as const;

// =============================================================================
// LOOKUP HELPER FUNCTIONS
// =============================================================================

/\*\*

- Get material by ID
- @param id Material ID
- @returns Material definition or undefined
  \*/
  export function getMaterialById(id: string): MaterialDef | undefined {
  return MATERIALS.find((m) => m.id === id);
  }

/\*\*

- Get material by code
- @param code Material code
- @returns Material definition or undefined
  \*/
  export function getMaterialByCode(code: string): MaterialDef | undefined {
  return MATERIALS.find((m) => m.code === code);
  }

/\*\*

- Get materials by category
- @param category Material category
- @returns Array of material definitions
  \*/
  export function getMaterialsByCategory(
  category: MaterialCategory
  ): MaterialDef[] {
  return MATERIALS.filter((m) => m.category === category);
  }

/\*\*

- Get final (sellable) materials only
- @returns Array of final material definitions
  \*/
  export function getFinalMaterials(): MaterialDef[] {
  return MATERIALS.filter((m) => m.isFinal);
  }

/\*\*

- Get materials in canonical order
- @returns Array of materials sorted by MATERIAL_ORDER
  \*/
  export function getMaterialsInOrder(): MaterialDef[] {
  return MATERIAL_ORDER.map((id) => getMaterialById(id)).filter(
  (m): m is MaterialDef => m !== undefined
  );
  }

/\*\*

- Get equipment by ID
- @param id Equipment ID
- @returns Equipment definition or undefined
  \*/
  export function getEquipmentById(id: string): EquipmentDef | undefined {
  return EQUIPMENT.find((e) => e.id === id);
  }

/\*\*

- Get equipment by code
- @param code Equipment code
- @returns Equipment definition or undefined
  \*/
  export function getEquipmentByCode(code: string): EquipmentDef | undefined {
  return EQUIPMENT.find((e) => e.code === code);
  }

/\*\*

- Get equipment by type
- @param type Equipment type
- @returns Array of equipment definitions
  \*/
  export function getEquipmentByType(
  type: EquipmentType
  ): EquipmentDef[] {
  return EQUIPMENT.filter((e) => e.type === type);
  }

/\*\*

- Get role by code
- @param code Role code (ManpowerRole)
- @returns Role definition or undefined
  \*/
  export function getRoleByCode(code: ManpowerRole): RoleDef | undefined {
  return ROLES.find((r) => r.code === code);
  }

/\*\*

- Validate material ID exists
- @param id Material ID to validate
- @returns true if valid, false otherwise
  \*/
  export function isValidMaterialId(id: string): boolean {
  return MATERIALS.some((m) => m.id === id);
  }

/\*\*

- Validate equipment ID exists
- @param id Equipment ID to validate
- @returns true if valid, false otherwise
  \*/
  export function isValidEquipmentId(id: string): boolean {
  return EQUIPMENT.some((e) => e.id === id);
  }

/\*\*

- Validate role code exists
- @param code Role code to validate
- @returns true if valid, false otherwise
  \*/
  export function isValidRoleCode(code: string): boolean {
  return ROLES.some((r) => r.code === code);
  }

/\*\*

- Validate operation type
- @param op Operation type to validate
- @returns true if valid, false otherwise
  \*/
  export function isValidOperationType(op: string): op is OperationType {
  return Object.prototype.hasOwnProperty.call(OPERATION_TYPES, op);
  }

/\*\*

- Format number with precision based on UOM
- @param value Number to format
- @param uom Unit of measure
- @returns Formatted string
  \*/
  export function formatWithPrecision(value: number, uom: UOM): string {
  const precision = DECIMAL_PRECISION[uom];
  return value.toFixed(precision);
  }

// =============================================================================
// TYPE GUARDS
// =============================================================================

/\*\*

- Check if value is valid UOM
  \*/
  export function isUOM(value: string): value is UOM {
  return ["TON", "LOAD", "HOUR", "COUNT", "PERCENT"].includes(value);
  }

/\*\*

- Check if value is valid MaterialCategory
  \*/
  export function isMaterialCategory(
  value: string
  ): value is MaterialCategory {
  return ["AGGREGATES", "PROCESSED_BASE", "FINE", "SPECIALTY", "RAW_FEED"].includes(value);
  }

/\*\*

- Check if value is valid EquipmentType
  \*/
  export function isEquipmentType(
  value: string
  ): value is EquipmentType {
  return ["CRUSHING_SCREENING", "EARTH_MOVING", "HAULING", "AUXILIARY"].includes(value);
  }
