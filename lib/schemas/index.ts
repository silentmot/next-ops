import { z } from "zod";
import { EQUIPMENT_STATUSES, SHIFT_TYPES } from "@/lib/constants";

// ============================================================================
// Production Schemas
// ============================================================================

export const ProductionSchema = z.object({
  siteId: z.string().cuid(),
  date: z.date(),
  shift: z.enum(SHIFT_TYPES).optional(),
  materialId: z.string(),
  qtyTon: z.number().positive().max(999999.999),
  operation: z.enum(["CRU-PRO", "CRU-DIS", "CRU-OP", "SEG-OP"]),
  notes: z.string().max(500).optional(),
});

export type ProductionInput = z.infer<typeof ProductionSchema>;

// ============================================================================
// Dispatch Schemas
// ============================================================================

export const DispatchSchema = z.object({
  siteId: z.string().cuid(),
  date: z.date(),
  materialId: z.string(),
  qtyTon: z.number().positive().max(999999.999),
  trips: z.number().int().positive().optional(),
  owner: z.string().max(200).optional(),
  reference: z.string().max(100).optional(),
  operation: z.enum(["CRU-PRO", "CRU-DIS", "CRU-OP", "SEG-OP"]),
  notes: z.string().max(500).optional(),
});

export type DispatchInput = z.infer<typeof DispatchSchema>;

// ============================================================================
// Received Material Schemas
// ============================================================================

export const ReceivedMaterialSchema = z.object({
  siteId: z.string().cuid(),
  date: z.date(),
  materialId: z.string(),
  qtyTon: z.number().positive().max(999999.999),
  source: z.string().max(200).optional(),
  vehicleRef: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
});

export type ReceivedMaterialInput = z.infer<typeof ReceivedMaterialSchema>;

// ============================================================================
// Equipment Log Schemas
// ============================================================================

export const EquipmentLogSchema = z.object({
  siteId: z.string().cuid(),
  date: z.date(),
  equipmentId: z.string(),
  hours: z.number().min(0).max(24),
  count: z.number().int().min(0).max(100),
  shift: z.enum(SHIFT_TYPES).optional(),
  status: z.enum(EQUIPMENT_STATUSES).optional(),
  notes: z.string().max(500).optional(),
});

export type EquipmentLogInput = z.infer<typeof EquipmentLogSchema>;

// ============================================================================
// Manpower Log Schemas
// ============================================================================

export const ManpowerLogSchema = z.object({
  siteId: z.string().cuid(),
  date: z.date(),
  roleId: z.string(),
  headcount: z.number().int().min(0).max(500),
  hours: z.number().min(0).max(24),
  shift: z.enum(SHIFT_TYPES).optional(),
  notes: z.string().max(500).optional(),
});

export type ManpowerLogInput = z.infer<typeof ManpowerLogSchema>;

// ============================================================================
// Inventory Snapshot Schemas
// ============================================================================

export const InventorySnapshotCreateSchema = z.object({
  siteId: z.string().cuid(),
  date: z.date(),
  materialId: z.string(),
  openingTon: z.number().min(0).max(999999.999),
  producedTon: z.number().min(0).max(999999.999).optional(),
  receivedTon: z.number().min(0).max(999999.999).optional(),
  dispatchedTon: z.number().min(0).max(999999.999).optional(),
  adjustmentTon: z.number().min(-999999.999).max(999999.999).default(0),
  closingTon: z.number().min(0).max(999999.999).optional(),
  isCalculated: z.boolean().default(false),
  notes: z.string().max(500).optional(),
});

export type InventorySnapshotInput = z.infer<
  typeof InventorySnapshotCreateSchema
>;

// ============================================================================
// Site Management Schemas
// ============================================================================

export const CreateSiteSchema = z.object({
  code: z.string().min(3).max(20),
  name: z.string().min(1).max(100),
  location: z.string().optional(),
  timezone: z.string().default("UTC"),
});

export type CreateSiteInput = z.infer<typeof CreateSiteSchema>;

// ============================================================================
// Export Job Schemas
// ============================================================================

export const ExportJobSchema = z.object({
  siteId: z.string().cuid(),
  module: z.enum([
    "production",
    "dispatch",
    "received",
    "equipment",
    "manpower",
    "inventory",
  ]),
  dateFrom: z.string().datetime(),
  dateTo: z.string().datetime(),
  granularity: z.enum(["daily", "weekly", "monthly"]).default("daily"),
  format: z.enum(["xlsx", "csv", "pdf"]),
});

export type ExportJobInput = z.infer<typeof ExportJobSchema>;

// ============================================================================
// Query Parameter Schemas
// ============================================================================

export const InventoryQuerySchema = z.object({
  siteId: z.string(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});

export const ProgressQuerySchema = z.object({
  jobIds: z.string().transform((val) => val.split(",")),
});
