# Database Schema & Prisma Configuration

## DeskOps Construction & Demolition Recycling Facility Management

### Overview

Complete database schema design using Prisma ORM with PostgreSQL for the DeskOps application. This schema supports materials-based inventory tracking, production monitoring, dispatch management, equipment utilization, and manpower attendance.

---

## Schema Design Principles

- **3NF Normalization**: All entities properly normalized to eliminate data redundancy
- **Type Safety**: All fields use explicit TypeScript types, NO `any` types permitted
- **Single Source of Truth**: References centralized constants for materials, equipment, and roles
- **Audit Trail**: Created/updated timestamps on all entities
- **Site Isolation**: Multi-site support with proper data segregation

---

## Prisma Schema Configuration

### Environment Setup

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Core Configuration Tables

```prisma
model Site {
  id          String   @id @default(cuid())
  code        String   @unique // e.g., "ALASLA-29"
  name        String
  location    String?
  timezone    String   @default("UTC")
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  productions         Production[]
  dispatches          Dispatch[]
  receivedMaterials   ReceivedMaterial[]
  equipmentLogs       EquipmentLog[]
  manpowerLogs        ManpowerLog[]
  inventorySnapshots  InventorySnapshot[]
  exportAudits        ExportAudit[]

  @@map("sites")
}

model Material {
  id          String  @id // Maps to MATERIALS constant IDs
  code        String  @unique
  type        String
  name        String
  category    String  // MaterialCategory enum
  uom         String  // UOM enum
  isFinal     Boolean
  notes       String?
  isActive    Boolean @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  productions         Production[]
  dispatches          Dispatch[]
  receivedMaterials   ReceivedMaterial[]
  inventorySnapshots  InventorySnapshot[]

  @@map("materials")
}

model Equipment {
  id        String  @id // Maps to EQUIPMENT constant IDs
  code      String  @unique
  name      String
  type      String  // EquipmentType enum
  isActive  Boolean @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  equipmentLogs EquipmentLog[]

  @@map("equipment")
}

model ManpowerRole {
  id        String  @id
  code      String  @unique // Maps to ROLES constant codes
  name      String
  isActive  Boolean @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  manpowerLogs ManpowerLog[]

  @@map("manpower_roles")
}
```

### Operational Data Tables

```prisma
model Production {
  id          String   @id @default(cuid())
  siteId      String
  date        DateTime @db.Date
  shift       String?  // ShiftType enum
  materialId  String
  qtyTon      Decimal  @db.Decimal(12, 3)
  operation   String   // OperationType enum
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  createdBy   String?  // User ID from Clerk

  // Relations
  site     Site     @relation(fields: [siteId], references: [id], onDelete: Cascade)
  material Material @relation(fields: [materialId], references: [id])

  @@unique([siteId, date, materialId, operation])
  @@map("production")
}

model Dispatch {
  id          String   @id @default(cuid())
  siteId      String
  date        DateTime @db.Date
  materialId  String
  qtyTon      Decimal  @db.Decimal(12, 3)
  trips       Int?
  owner       String?
  reference   String?
  operation   String   // OperationType enum
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  createdBy   String?  // User ID from Clerk

  // Relations
  site     Site     @relation(fields: [siteId], references: [id], onDelete: Cascade)
  material Material @relation(fields: [materialId], references: [id])

  @@map("dispatches")
}

model ReceivedMaterial {
  id          String   @id @default(cuid())
  siteId      String
  date        DateTime @db.Date
  materialId  String
  qtyTon      Decimal  @db.Decimal(12, 3)
  source      String?
  vehicleRef  String?
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  createdBy   String?  // User ID from Clerk

  // Relations
  site     Site     @relation(fields: [siteId], references: [id], onDelete: Cascade)
  material Material @relation(fields: [materialId], references: [id])

  @@map("received_materials")
}

model EquipmentLog {
  id          String   @id @default(cuid())
  siteId      String
  date        DateTime @db.Date
  equipmentId String
  hours       Decimal  @db.Decimal(8, 2)
  count       Int      @default(0)
  shift       String?  // ShiftType enum
  status      String?  // EquipmentStatus enum
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  createdBy   String?  // User ID from Clerk

  // Relations
  site      Site      @relation(fields: [siteId], references: [id], onDelete: Cascade)
  equipment Equipment @relation(fields: [equipmentId], references: [id])

  @@unique([siteId, date, equipmentId, shift])
  @@map("equipment_logs")
}

model ManpowerLog {
  id          String   @id @default(cuid())
  siteId      String
  date        DateTime @db.Date
  roleId      String
  headcount   Int
  hours       Decimal  @db.Decimal(8, 2)
  shift       String?  // ShiftType enum
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  createdBy   String?  // User ID from Clerk

  // Relations
  site Site         @relation(fields: [siteId], references: [id], onDelete: Cascade)
  role ManpowerRole @relation(fields: [roleId], references: [id])

  @@unique([siteId, date, roleId, shift])
  @@map("manpower_logs")
}

model InventorySnapshot {
  id              String   @id @default(cuid())
  siteId          String
  date            DateTime @db.Date
  materialId      String
  openingTon      Decimal  @db.Decimal(12, 3)
  producedTon     Decimal  @db.Decimal(12, 3)
  receivedTon     Decimal  @db.Decimal(12, 3)
  dispatchedTon   Decimal  @db.Decimal(12, 3)
  adjustmentTon   Decimal  @db.Decimal(12, 3) @default(0)
  closingTon      Decimal  @db.Decimal(12, 3)
  isCalculated    Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  createdBy       String?  // User ID from Clerk

  // Relations
  site     Site     @relation(fields: [siteId], references: [id], onDelete: Cascade)
  material Material @relation(fields: [materialId], references: [id])

  @@unique([siteId, date, materialId])
  @@map("inventory_snapshots")
}
```

### Export & Audit Tables

```prisma
model ExportJob {
  id            String   @id @default(cuid())
  siteId        String
  userId        String   // Clerk user ID
  module        String   // production, dispatch, etc.
  dateFrom      DateTime @db.Date
  dateTo        DateTime @db.Date
  granularity   String   @default("daily")
  format        String   // xlsx, pdf, csv
  status        String   @default("pending") // pending, processing, completed, failed
  progress      Int      @default(0)
  filePath      String?
  fileSize      Int?
  fileHash      String?
  errorMessage  String?
  downloadUrl   String?
  expiresAt     DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  site Site @relation(fields: [siteId], references: [id], onDelete: Cascade)

  @@map("export_jobs")
}

model ExportAudit {
  id              String   @id @default(cuid())
  jobId           String   @unique
  siteId          String
  userId          String   // Clerk user ID
  module          String
  filtersJson     String   // JSON serialized filters
  columnPreset    String?
  recordCount     Int
  fileSize        Int
  fileHash        String
  downloadCount   Int      @default(0)
  lastDownload    DateTime?
  createdAt       DateTime @default(now())

  // Relations
  site Site @relation(fields: [siteId], references: [id], onDelete: Cascade)
  job  ExportJob @relation(fields: [jobId], references: [id], onDelete: Cascade)

  @@map("export_audits")
}
```

---

## Database Initialization Scripts

### Seed Data Script

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import {
  MATERIALS,
  EQUIPMENT,
  ROLES,
  DEFAULT_SITE_CODE,
} from '@deskops/constants';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Starting database seed...');

  // Seed default site
  const defaultSite = await prisma.site.upsert({
    where: { code: DEFAULT_SITE_CODE },
    update: {},
    create: {
      code: DEFAULT_SITE_CODE,
      name: 'Al Asla Recycling Facility',
      location: 'Jeddah, Saudi Arabia',
      timezone: 'Asia/Riyadh',
      isActive: true,
    },
  });

  console.log('✅ Default site created:', defaultSite.code);

  // Seed materials
  for (const material of MATERIALS) {
    await prisma.material.upsert({
      where: { id: material.id },
      update: {
        code: material.code,
        type: material.type,
        name: material.name,
        category: material.category,
        uom: material.uom,
        isFinal: material.isFinal,
        notes: material.notes,
      },
      create: {
        id: material.id,
        code: material.code,
        type: material.type,
        name: material.name,
        category: material.category,
        uom: material.uom,
        isFinal: material.isFinal,
        notes: material.notes,
      },
    });
  }

  console.log(`✅ Seeded ${MATERIALS.length} materials`);

  // Seed equipment
  for (const equipment of EQUIPMENT) {
    await prisma.equipment.upsert({
      where: { id: equipment.id },
      update: {
        code: equipment.code,
        name: equipment.name,
        type: equipment.type,
      },
      create: {
        id: equipment.id,
        code: equipment.code,
        name: equipment.name,
        type: equipment.type,
      },
    });
  }

  console.log(`✅ Seeded ${EQUIPMENT.length} equipment items`);

  // Seed manpower roles
  for (const role of ROLES) {
    await prisma.manpowerRole.upsert({
      where: { code: role.code },
      update: {
        name: role.name,
      },
      create: {
        id: `ROLE_${role.code}`,
        code: role.code,
        name: role.name,
      },
    });
  }

  console.log(`✅ Seeded ${ROLES.length} manpower roles`);

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Migration Helpers

```typescript
// scripts/migrate-and-seed.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function migrateAndSeed(): Promise<void> {
  try {
    console.log('🔄 Running Prisma migrations...');
    await execAsync('bunx prisma migrate deploy');

    console.log('🔄 Generating Prisma client...');
    await execAsync('bunx prisma generate');

    console.log('🔄 Running database seed...');
    await execAsync('bunx prisma db seed');

    console.log('✅ Migration and seed completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  migrateAndSeed();
}
```

---

## Database Configuration

### Environment Variables

```env
# .env.local
DATABASE_URL="postgresql://username:password@localhost:5432/deskops_dev?schema=public"
DIRECT_URL="postgresql://username:password@localhost:5432/deskops_dev?schema=public"
```

### Prisma Client Configuration

```typescript
// src/lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const isDev = process.env.NODE_ENV === 'development';
const enableQueryLog = process.env.PRISMA_QUERY_LOG === 'true' || isDev;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: enableQueryLog
      ? [
          { emit: 'event', level: 'query' },
          { emit: 'stdout', level: 'error' },
          { emit: 'stdout', level: 'warn' },
        ]
      : [
          { emit: 'stdout', level: 'error' },
          { emit: 'stdout', level: 'warn' },
        ],
  });

// Log queries in development only
if (enableQueryLog && isDev) {
  prisma.$on('query', (e) => {
    console.log('Query: ' + e.query);
    console.log('Duration: ' + e.duration + 'ms');
  });
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

---

## Validation & Type Safety

### Zod Schemas for Database Operations

```typescript
// packages/database/src/schemas/production.ts
import { z } from 'zod';
import { OperationType, ShiftType } from '@deskops/constants';

export const ProductionSchema = z.object({
  siteId: z.string().cuid(),
  date: z.date(),
  shift: z.enum(['MORNING', 'AFTERNOON', 'NIGHT']).optional(),
  materialId: z.string(),
  qtyTon: z.number().positive().max(999999.999),
  operation: z.enum(['CRU-PRO', 'CRU-DIS', 'CRU-OP', 'SEG-OP']),
  notes: z.string().max(500).optional(),
});

export const DispatchSchema = z.object({
  siteId: z.string().cuid(),
  date: z.date(),
  materialId: z.string(),
  qtyTon: z.number().positive().max(999999.999),
  trips: z.number().int().positive().optional(),
  owner: z.string().max(200).optional(),
  reference: z.string().max(100).optional(),
  operation: z.enum(['CRU-PRO', 'CRU-DIS', 'CRU-OP', 'SEG-OP']),
  notes: z.string().max(500).optional(),
});

export const ReceivedMaterialSchema = z.object({
  siteId: z.string().cuid(), // Required CUID for site reference
  date: z.date(), // Required date of material receipt
  materialId: z.string(), // Required material identifier, must be validated with isValidMaterialId
  qtyTon: z.number().positive().max(999999.999), // Required quantity in tons, must be positive, max 999,999.999
  source: z.string().max(200).optional(), // Optional source/supplier name, max 200 characters
  vehicleRef: z.string().max(100).optional(), // Optional vehicle reference/plate number, max 100 characters
  notes: z.string().max(500).optional(), // Optional notes, max 500 characters
});

export type ReceivedMaterialInput = z.infer<typeof ReceivedMaterialSchema>;

/**
 * Usage Example:
 *
 * import { ReceivedMaterialSchema, ReceivedMaterialInput } from '@deskops/database';
 * import { prisma } from '@/lib/db';
 *
 * const data: unknown = req.body;
 * const validatedData = ReceivedMaterialSchema.parse(data); // Validates and throws if invalid
 *
 * const receivedMaterial = await prisma.receivedMaterial.create({
 *   data: validatedData
 * });
 *
 * Note: This schema is used by both:
 * - API route: apps/web/src/app/api/received/route.ts
 * - Server action: apps/web/src/app/actions/received.ts
 *
 * Cross-reference: ReceivedMaterial Prisma model (lines 160-178) includes additional
 * auto-generated fields (id, createdAt, updatedAt, createdBy) not part of input schema.
 */

export const EquipmentLogSchema = z.object({
  siteId: z.string().cuid(),
  date: z.date(),
  equipmentId: z.string(),
  hours: z.number().min(0).max(24),
  count: z.number().int().min(0).max(100),
  shift: z.enum(['MORNING', 'AFTERNOON', 'NIGHT']).optional(),
  status: z
    .enum(['OPERATIONAL', 'MAINTENANCE', 'BREAKDOWN', 'IDLE'])
    .optional(),
  notes: z.string().max(500).optional(),
});

export const ManpowerLogSchema = z.object({
  siteId: z.string().cuid(),
  date: z.date(),
  roleId: z.string(),
  headcount: z.number().int().min(0).max(500),
  hours: z.number().min(0).max(24),
  shift: z.enum(['MORNING', 'AFTERNOON', 'NIGHT']).optional(),
  notes: z.string().max(500).optional(),
});

export type ProductionInput = z.infer<typeof ProductionSchema>;
export type DispatchInput = z.infer<typeof DispatchSchema>;
export type EquipmentLogInput = z.infer<typeof EquipmentLogSchema>;
export type ManpowerLogInput = z.infer<typeof ManpowerLogSchema>;

// Export all schemas from packages/database/src/index.ts
// export * from './schemas/production';
// export * from './schemas/dispatch';
// export * from './schemas/equipment';
// export * from './schemas/manpower';
```

---

## Query Optimization

### Indexes for Performance

```sql
-- Additional indexes for common queries
CREATE INDEX CONCURRENTLY idx_production_site_date ON production(site_id, date DESC);
CREATE INDEX CONCURRENTLY idx_production_material_date ON production(material_id, date DESC);
CREATE INDEX CONCURRENTLY idx_dispatch_site_date ON dispatches(site_id, date DESC);
CREATE INDEX CONCURRENTLY idx_inventory_site_date ON inventory_snapshots(site_id, date DESC);
CREATE INDEX CONCURRENTLY idx_equipment_logs_site_date ON equipment_logs(site_id, date DESC);
CREATE INDEX CONCURRENTLY idx_manpower_logs_site_date ON manpower_logs(site_id, date DESC);

-- Composite indexes for dashboard queries
CREATE INDEX CONCURRENTLY idx_production_dashboard ON production(site_id, date DESC, material_id) INCLUDE (qty_ton);
CREATE INDEX CONCURRENTLY idx_dispatch_dashboard ON dispatches(site_id, date DESC, material_id) INCLUDE (qty_ton);
```

### Database Connection Pooling

```typescript
// src/lib/db-pool.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export { pool };
```

---

## Summary

This database schema provides:

- **Complete data model** for DeskOps application
- **Type-safe operations** with Prisma and Zod validation
- **Performance optimization** through proper indexing
- **Data integrity** via constraints and relationships
- **Audit capabilities** for export operations
- **Multi-site support** with proper data isolation
- **Single source of truth** integration with centralized constants

**Next Steps**:

1. Run migrations: `bunx prisma migrate dev`
2. Generate client: `bunx prisma generate`
3. Seed database: `bunx prisma db seed`
4. Verify with Prisma Studio: `bunx prisma studio`
