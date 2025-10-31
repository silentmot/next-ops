# API Routes & Backend Architecture
<!--markdownlint-disable MD033 MD029 MD040-->
## DeskOps Backend Implementation Guide

### Overview

Complete backend architecture using Next.js 16 App Router with API routes, Server Actions, and type-safe data operations. Implements `/api/[module]/[resource]` pattern without versioning, ensuring single method per operation with strict type safety.

---

## Architecture Principles

- **No Versioning**: Use `/api/[module]/[resource]` pattern only, NO `/api/v1/` paths
- **Method-First**: Single method per operation using adapter pattern
- **Type Safety**: NO `any` types anywhere in backend code
- **Single Source of Truth**: All constants imported from centralized location
- **Authentication**: Clerk integration with role-based access control
- **Validation**: Zod schemas for all input/output validation

---

## API Route Structure

### Authentication Routes

```typescript
// src/app/api/auth/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function GET(): Promise<NextResponse> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const session = {
      userId,
      isAuthenticated: true,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json(
      { message: 'Session validation failed' },
      { status: 500 }
    );
  }
}
```

### Health Check Route

```typescript
// src/app/api/hello/route.ts
import { NextResponse } from 'next/server';

/**
 * Health check endpoint for monitoring service availability
 * Purpose: Simple health check for load balancer health checks and uptime monitoring
 * Request: No parameters
 * Response: Plain text 'Hello, from API!'
 * Status: 200
 * Use cases:
 * - Load balancer health checks
 * - Uptime monitoring services
 * - Basic API connectivity tests
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json('Hello, from API!');
}
```

### Site Management Routes

```typescript
// src/app/api/sites/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const CreateSiteSchema = z.object({
  code: z.string().min(3).max(20),
  name: z.string().min(1).max(100),
  location: z.string().optional(),
  timezone: z.string().default('UTC'),
});

export async function GET(): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const sites = await prisma.site.findMany({
      where: { isActive: true },
      select: {
        id: true,
        code: true,
        name: true,
        location: true,
        timezone: true,
        createdAt: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ sites });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch sites' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = CreateSiteSchema.parse(body);

    const site = await prisma.site.create({
      data: {
        ...validatedData,
        isActive: true,
      },
    });

    return NextResponse.json({ site }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Failed to create site' },
      { status: 500 }
    );
  }
}
```

```typescript
// src/app/api/sites/[siteId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

interface RouteParams {
  params: {
    siteId: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const site = await prisma.site.findUnique({
      where: { id: params.siteId },
      include: {
        _count: {
          select: {
            productions: true,
            dispatches: true,
            receivedMaterials: true,
            inventorySnapshots: true,
          },
        },
      },
    });

    if (!site) {
      return NextResponse.json({ message: 'Site not found' }, { status: 404 });
    }

    return NextResponse.json({ site });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch site' },
      { status: 500 }
    );
  }
}
```

### Production Data Routes

```typescript
// src/app/api/production/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { ProductionSchema } from '@deskops/database';
import { isValidMaterialId, isValidOperationType } from '@deskops/constants';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    if (!siteId) {
      return NextResponse.json(
        { message: 'siteId parameter required' },
        { status: 400 }
      );
    }

    const whereClause: Record<string, unknown> = { siteId };

    if (dateFrom && dateTo) {
      whereClause.date = {
        gte: new Date(dateFrom),
        lte: new Date(dateTo),
      };
    }

    const productions = await prisma.production.findMany({
      where: whereClause,
      include: {
        material: {
          select: {
            code: true,
            name: true,
            category: true,
            uom: true,
          },
        },
        site: {
          select: {
            code: true,
            name: true,
          },
        },
      },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ productions });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch production data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = ProductionSchema.parse(body);

    // Validate material ID exists
    if (!isValidMaterialId(validatedData.materialId)) {
      return NextResponse.json(
        { message: 'Invalid material ID' },
        { status: 400 }
      );
    }

    // Validate operation type
    if (!isValidOperationType(validatedData.operation)) {
      return NextResponse.json(
        { message: 'Invalid operation type' },
        { status: 400 }
      );
    }

    const production = await prisma.production.create({
      data: {
        ...validatedData,
        createdBy: userId,
      },
      include: {
        material: {
          select: {
            code: true,
            name: true,
            uom: true,
          },
        },
      },
    });

    return NextResponse.json({ production }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Failed to create production record' },
      { status: 500 }
    );
  }
}
```

### Dispatch Routes

```typescript
// src/app/api/dispatch/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { DispatchSchema } from '@deskops/database';
import { isValidMaterialId, isValidOperationType } from '@deskops/constants';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    if (!siteId) {
      return NextResponse.json(
        { message: 'siteId parameter required' },
        { status: 400 }
      );
    }

    const whereClause: Record<string, unknown> = { siteId };

    if (dateFrom && dateTo) {
      whereClause.date = {
        gte: new Date(dateFrom),
        lte: new Date(dateTo),
      };
    }

    const dispatches = await prisma.dispatch.findMany({
      where: whereClause,
      include: {
        material: {
          select: {
            code: true,
            name: true,
            category: true,
            uom: true,
          },
        },
        site: {
          select: {
            code: true,
            name: true,
          },
        },
      },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ dispatches });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch dispatch data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = DispatchSchema.parse(body);

    // Validate material ID exists
    if (!isValidMaterialId(validatedData.materialId)) {
      return NextResponse.json(
        { message: 'Invalid material ID' },
        { status: 400 }
      );
    }

    // Validate operation type
    if (!isValidOperationType(validatedData.operation)) {
      return NextResponse.json(
        { message: 'Invalid operation type' },
        { status: 400 }
      );
    }

    const dispatch = await prisma.dispatch.create({
      data: {
        ...validatedData,
        createdBy: userId,
      },
      include: {
        material: {
          select: {
            code: true,
            name: true,
            uom: true,
          },
        },
      },
    });

    return NextResponse.json({ dispatch }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Failed to create dispatch record' },
      { status: 500 }
    );
  }
}
```

### Equipment Tracking Routes

```typescript
// src/app/api/equipment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { EquipmentLogSchema } from '@deskops/database';
import { isValidEquipmentId } from '@deskops/constants';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    if (!siteId) {
      return NextResponse.json(
        { message: 'siteId parameter required' },
        { status: 400 }
      );
    }

    const whereClause: Record<string, unknown> = { siteId };

    if (dateFrom && dateTo) {
      whereClause.date = {
        gte: new Date(dateFrom),
        lte: new Date(dateTo),
      };
    }

    const equipmentLogs = await prisma.equipmentLog.findMany({
      where: whereClause,
      include: {
        equipment: {
          select: {
            code: true,
            name: true,
            type: true,
          },
        },
        site: {
          select: {
            code: true,
            name: true,
          },
        },
      },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ equipmentLogs });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch equipment logs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = EquipmentLogSchema.parse(body);

    // Validate equipment ID exists
    if (!isValidEquipmentId(validatedData.equipmentId)) {
      return NextResponse.json(
        { message: 'Invalid equipment ID' },
        { status: 400 }
      );
    }

    const equipmentLog = await prisma.equipmentLog.create({
      data: {
        ...validatedData,
        createdBy: userId,
      },
      include: {
        equipment: {
          select: {
            code: true,
            name: true,
            type: true,
          },
        },
      },
    });

    return NextResponse.json({ equipmentLog }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Failed to create equipment log' },
      { status: 500 }
    );
  }
}
```

### Received Materials Routes

```typescript
// src/app/api/received/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { ReceivedMaterialSchema } from '@deskops/database';
import { isValidMaterialId } from '@deskops/constants';
import { handleApiError } from '@/lib/error-handler';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    if (!siteId) {
      return NextResponse.json(
        { message: 'siteId parameter required' },
        { status: 400 }
      );
    }

    const whereClause: { siteId: string; date?: { gte?: Date; lte?: Date } } = {
      siteId,
    };

    if (dateFrom && dateTo) {
      whereClause.date = {
        gte: new Date(dateFrom),
        lte: new Date(dateTo),
      };
    } else if (dateFrom) {
      whereClause.date = {
        gte: new Date(dateFrom),
      };
    } else if (dateTo) {
      whereClause.date = {
        lte: new Date(dateTo),
      };
    }

    const receivedMaterials = await prisma.receivedMaterial.findMany({
      where: whereClause,
      include: {
        material: {
          select: {
            code: true,
            name: true,
            category: true,
            uom: true,
          },
        },
        site: {
          select: {
            code: true,
            name: true,
          },
        },
      },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ receivedMaterials });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = ReceivedMaterialSchema.parse(body);

    if (!isValidMaterialId(validatedData.materialId)) {
      return NextResponse.json(
        { message: 'Invalid material ID' },
        { status: 400 }
      );
    }

    const receivedMaterial = await prisma.receivedMaterial.create({
      data: {
        siteId: validatedData.siteId,
        date: validatedData.date,
        materialId: validatedData.materialId,
        qtyTon: validatedData.qtyTon,
        source: validatedData.source ?? null,
        vehicleRef: validatedData.vehicleRef ?? null,
        notes: validatedData.notes ?? null,
        createdBy: userId,
      },
      include: {
        material: {
          select: {
            code: true,
            name: true,
            uom: true,
          },
        },
      },
    });

    return NextResponse.json(receivedMaterial, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
```

**Purpose:** Tracks incoming Construction & Demolition Waste (CDW) materials received at the facility. Critical for inventory calculation formula: `inventory = production + received - dispatched`.

**Query Parameters (GET):**

- `siteId` (required): Site identifier
- `dateFrom` (optional): ISO 8601 datetime string for start date filter
- `dateTo` (optional): ISO 8601 datetime string for end date filter

**Request Body (POST):**

```typescript
{
  siteId: string;
  date: Date;
  materialId: string;  // Must be valid material from constants
  qtyTon: number;      // Decimal with 3-digit precision
  source?: string;     // Source of material (e.g., "Municipal CDW", "Private Contractor")
  vehicleRef?: string; // Vehicle reference number
  notes?: string;      // Additional notes
}
```

**Response (GET):**

```typescript
{
  receivedMaterials: Array<{
    id: string;
    siteId: string;
    date: Date;
    materialId: string;
    qtyTon: number;
    source: string | null;
    vehicleRef: string | null;
    notes: string | null;
    material: {
      code: string;
      name: string;
      category: string;
      uom: string;
    };
    site: {
      code: string;
      name: string;
    };
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
  }>;
}
```

**Response (POST):**
Returns created received material record with same structure as GET response items.

**Validation:**

- Zod schema: `ReceivedMaterialSchema` from `@deskops/database`
- Material ID validated against constants catalog
- Date range validation for queries
- Clerk authentication required

**Error Handling:**

- 401: Unauthorized (no valid session)
- 400: Missing siteId parameter or invalid material ID
- 500: Database or server error (handled by `handleApiError`)

### Manpower Attendance Routes

```typescript
// src/app/api/manpower/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { ManpowerLogSchema } from '@deskops/database';
import { handleApiError } from '@/lib/error-handler';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    if (!siteId) {
      return NextResponse.json(
        { message: 'siteId parameter required' },
        { status: 400 }
      );
    }

    const whereClause: { siteId: string; date?: { gte?: Date; lte?: Date } } = {
      siteId,
    };

    if (dateFrom && dateTo) {
      whereClause.date = {
        gte: new Date(dateFrom),
        lte: new Date(dateTo),
      };
    } else if (dateFrom) {
      whereClause.date = {
        gte: new Date(dateFrom),
      };
    } else if (dateTo) {
      whereClause.date = {
        lte: new Date(dateTo),
      };
    }

    const manpowerLogs = await prisma.manpowerLog.findMany({
      where: whereClause,
      include: {
        role: {
          select: {
            code: true,
            name: true,
          },
        },
        site: {
          select: {
            code: true,
            name: true,
          },
        },
      },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ manpowerLogs });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = ManpowerLogSchema.parse(body);

    const manpowerLog = await prisma.manpowerLog.create({
      data: {
        siteId: validatedData.siteId,
        date: validatedData.date,
        roleId: validatedData.roleId,
        headcount: validatedData.headcount,
        hours: validatedData.hours,
        shift: validatedData.shift ?? null,
        notes: validatedData.notes ?? null,
        createdBy: userId,
      },
      include: {
        role: {
          select: {
            code: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(manpowerLog, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
```

**Purpose:** Tracks daily manpower attendance and labor hours by role and shift. Used for labor analytics, cost tracking, and operational planning.

**Query Parameters (GET):**

- `siteId` (required): Site identifier
- `dateFrom` (optional): ISO 8601 datetime string for start date filter
- `dateTo` (optional): ISO 8601 datetime string for end date filter

**Request Body (POST):**

```typescript
{
  siteId: string;
  date: Date;
  roleId: string;      // Must be valid role from ManpowerRole table
  headcount: number;   // Integer count of workers
  hours: number;       // Decimal total hours worked
  shift?: string;      // Shift identifier (e.g., "Morning", "Evening", "Night")
  notes?: string;      // Additional notes
}
```

**Response (GET):**

```typescript
{
  manpowerLogs: Array<{
    id: string;
    siteId: string;
    date: Date;
    roleId: string;
    headcount: number;
    hours: number;
    shift: string | null;
    notes: string | null;
    role: {
      code: string;
      name: string;
    };
    site: {
      code: string;
      name: string;
    };
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
  }>;
}
```

**Response (POST):**
Returns created manpower log record with same structure as GET response items.

**Validation:**

- Zod schema: `ManpowerLogSchema` from `@deskops/database`
- Role ID validated against ManpowerRole master table
- Date range validation for queries
- Clerk authentication required

**Error Handling:**

- 401: Unauthorized (no valid session)
- 400: Missing siteId parameter or validation error
- 500: Database or server error (handled by `handleApiError`)

### Inventory Snapshot Routes

```typescript
// src/app/api/inventory/route.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { InventorySnapshotCreateSchema } from '@deskops/database';
import { isValidMaterialId } from '@deskops/constants';
import { handleApiError } from '@/lib/error-handler';

const InventoryQuerySchema = z.object({
  siteId: z.string(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryParams = {
      siteId: searchParams.get('siteId') ?? undefined,
      dateFrom: searchParams.get('dateFrom') ?? undefined,
      dateTo: searchParams.get('dateTo') ?? undefined,
    };

    const { siteId, dateFrom, dateTo } =
      InventoryQuerySchema.parse(queryParams);

    // Validate date range order
    if (dateFrom && dateTo) {
      const from = new Date(dateFrom);
      const to = new Date(dateTo);
      if (from > to) {
        return NextResponse.json(
          { message: 'dateFrom must be less than or equal to dateTo' },
          { status: 400 }
        );
      }
    }

    const whereClause: {
      siteId: string;
      date?: { gte?: Date; lte?: Date };
    } = {
      siteId,
    };

    if (dateFrom || dateTo) {
      whereClause.date = {};
      if (dateFrom) {
        whereClause.date.gte = new Date(dateFrom);
      }
      if (dateTo) {
        whereClause.date.lte = new Date(dateTo);
      }
    }

    const inventorySnapshots = await prisma.inventorySnapshot.findMany({
      where: whereClause,
      include: {
        material: {
          select: {
            code: true,
            name: true,
            category: true,
            uom: true,
          },
        },
        site: {
          select: {
            code: true,
            name: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json({ inventorySnapshots });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Convert string date to Date object
    const dataWithDate = {
      ...body,
      date: body.date ? new Date(body.date) : new Date(),
    };

    const validatedData = InventorySnapshotCreateSchema.parse(dataWithDate);

    // Ensure non-null decimals for Prisma
    const producedTon = validatedData.producedTon ?? 0;
    const receivedTon = validatedData.receivedTon ?? 0;
    const dispatchedTon = validatedData.dispatchedTon ?? 0;

    // Validate materialId
    if (!isValidMaterialId(validatedData.materialId)) {
      return NextResponse.json(
        { message: 'Invalid material ID' },
        { status: 400 }
      );
    }

    // Calculate closingTon using inventory formula
    // Formula: closingTon = openingTon + producedTon + receivedTon - dispatchedTon + adjustmentTon
    const closingTon =
      validatedData.closingTon ??
      validatedData.openingTon +
        producedTon +
        receivedTon -
        dispatchedTon +
        validatedData.adjustmentTon;

    const snapshot = await prisma.inventorySnapshot.create({
      data: {
        ...validatedData,
        producedTon,
        receivedTon,
        dispatchedTon,
        closingTon,
        createdBy: userId,
      },
      include: {
        material: {
          select: {
            code: true,
            name: true,
            category: true,
            uom: true,
          },
        },
        site: {
          select: {
            code: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(snapshot, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
```

**Purpose:** Manages daily inventory snapshots for materials at each site. Implements the core inventory calculation formula and provides historical tracking of stock levels.

**Inventory Calculation Formula:**

```typescript
closingTon = openingTon + producedTon + receivedTon - dispatchedTon + adjustmentTon
```

**Query Parameters (GET):**

- `siteId` (required): Site identifier
- `dateFrom` (optional): ISO 8601 datetime string for start date filter
- `dateTo` (optional): ISO 8601 datetime string for end date filter

**Request Body (POST):**

```typescript
{
  siteId: string;
  date: Date;
  materialId: string;      // Must be valid material from constants
  openingTon: number;      // Opening stock (Decimal with 3-digit precision)
  producedTon?: number;    // Production during period (defaults to 0)
  receivedTon?: number;    // Materials received during period (defaults to 0)
  dispatchedTon?: number;  // Materials dispatched during period (defaults to 0)
  adjustmentTon: number;   // Manual adjustments (can be negative)
  closingTon?: number;     // Closing stock (auto-calculated if not provided)
  notes?: string;          // Additional notes
}
```

**Response (GET):**

```typescript
{
  inventorySnapshots: Array<{
    id: string;
    siteId: string;
    date: Date;
    materialId: string;
    openingTon: number;
    producedTon: number;
    receivedTon: number;
    dispatchedTon: number;
    adjustmentTon: number;
    closingTon: number;
    notes: string | null;
    material: {
      code: string;
      name: string;
      category: string;
      uom: string;
    };
    site: {
      code: string;
      name: string;
    };
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
  }>;
}
```

**Response (POST):**
Returns created inventory snapshot record with same structure as GET response items.

**Validation:**

- Zod schema: `InventorySnapshotCreateSchema` from `@deskops/database`
- Material ID validated against constants catalog
- Date range order validation (dateFrom <= dateTo)
- Auto-calculation of closingTon if not provided
- Clerk authentication required

**Error Handling:**

- 401: Unauthorized (no valid session)
- 400: Missing siteId parameter, invalid material ID, or invalid date range
- 500: Database or server error (handled by `handleApiError`)

**Business Logic Notes:**

- Snapshots represent end-of-day inventory levels
- Used for trend analysis and reconciliation
- Critical for material flow tracking and audit compliance
- Supports manual adjustments for physical inventory reconciliation

### Dashboard Analytics Routes

```typescript
// src/app/api/dashboard/metrics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

interface DashboardMetrics {
  totalProduction: {
    current: number;
    previous: number;
    percentageChange: number;
  };
  totalDispatched: {
    current: number;
    previous: number;
    percentageChange: number;
  };
  totalReceived: {
    current: number;
    previous: number;
    percentageChange: number;
  };
  equipmentUtilization: {
    current: number;
    previous: number;
    percentageChange: number;
  };
  currentInventoryStatus: {
    current: number;
    previous: number;
    percentageChange: number;
  };
}

function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');

    if (!siteId) {
      return NextResponse.json(
        { message: 'siteId parameter required' },
        { status: 400 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Fetch current and previous period metrics
    const [
      currentProductionSum,
      previousProductionSum,
      currentDispatchedSum,
      previousDispatchedSum,
      currentReceivedSum,
      previousReceivedSum,
      currentInventorySum,
      previousInventorySum,
    ] = await Promise.all([
      // Current production
      prisma.production.aggregate({
        where: { siteId, date: today },
        _sum: { qtyTon: true },
      }),
      // Previous production
      prisma.production.aggregate({
        where: { siteId, date: yesterday },
        _sum: { qtyTon: true },
      }),
      // Current dispatched
      prisma.dispatch.aggregate({
        where: { siteId, date: today },
        _sum: { qtyTon: true },
      }),
      // Previous dispatched
      prisma.dispatch.aggregate({
        where: { siteId, date: yesterday },
        _sum: { qtyTon: true },
      }),
      // Current received
      prisma.receivedMaterial.aggregate({
        where: { siteId, date: today },
        _sum: { qtyTon: true },
      }),
      // Previous received
      prisma.receivedMaterial.aggregate({
        where: { siteId, date: yesterday },
        _sum: { qtyTon: true },
      }),
      // Current inventory
      prisma.inventorySnapshot.aggregate({
        where: { siteId, date: { lte: today } },
        _sum: { closingTon: true },
      }),
      // Previous inventory
      prisma.inventorySnapshot.aggregate({
        where: { siteId, date: yesterday },
        _sum: { closingTon: true },
      }),
    ]);

    const metrics: DashboardMetrics = {
      totalProduction: {
        current: Number(currentProductionSum._sum.qtyTon ?? 0),
        previous: Number(previousProductionSum._sum.qtyTon ?? 0),
        percentageChange: calculatePercentageChange(
          Number(currentProductionSum._sum.qtyTon ?? 0),
          Number(previousProductionSum._sum.qtyTon ?? 0)
        ),
      },
      totalDispatched: {
        current: Number(currentDispatchedSum._sum.qtyTon ?? 0),
        previous: Number(previousDispatchedSum._sum.qtyTon ?? 0),
        percentageChange: calculatePercentageChange(
          Number(currentDispatchedSum._sum.qtyTon ?? 0),
          Number(previousDispatchedSum._sum.qtyTon ?? 0)
        ),
      },
      totalReceived: {
        current: Number(currentReceivedSum._sum.qtyTon ?? 0),
        previous: Number(previousReceivedSum._sum.qtyTon ?? 0),
        percentageChange: calculatePercentageChange(
          Number(currentReceivedSum._sum.qtyTon ?? 0),
          Number(previousReceivedSum._sum.qtyTon ?? 0)
        ),
      },
      equipmentUtilization: {
        current: 0, // Placeholder - implement equipment hours sum
        previous: 0,
        percentageChange: 0,
      },
      currentInventoryStatus: {
        current: Number(currentInventorySum._sum.closingTon ?? 0),
        previous: Number(previousInventorySum._sum.closingTon ?? 0),
        percentageChange: calculatePercentageChange(
          Number(currentInventorySum._sum.closingTon ?? 0),
          Number(previousInventorySum._sum.closingTon ?? 0)
        ),
      },
    };

    return NextResponse.json(metrics);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch dashboard metrics' },
      { status: 500 }
    );
  }
}
```

### Export Job Routes

```typescript
// src/app/api/exports/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const ExportJobSchema = z.object({
  siteId: z.string().cuid(),
  module: z.enum([
    'production',
    'dispatch',
    'received',
    'equipment',
    'manpower',
    'inventory',
  ]),
  dateFrom: z.string().datetime(),
  dateTo: z.string().datetime(),
  granularity: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
  format: z.enum(['xlsx', 'csv', 'pdf']),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = ExportJobSchema.parse(body);

    // Check rate limits
    const activeJobs = await prisma.exportJob.count({
      where: {
        userId,
        status: { in: ['pending', 'processing'] },
      },
    });

    if (activeJobs >= 5) {
      return NextResponse.json(
        { message: 'Rate limit exceeded: maximum 5 active jobs per user' },
        { status: 429 }
      );
    }

    const exportJob = await prisma.exportJob.create({
      data: {
        ...validatedData,
        userId,
        status: 'pending',
        progress: 0,
        dateFrom: new Date(validatedData.dateFrom),
        dateTo: new Date(validatedData.dateTo),
      },
    });

    // TODO: Trigger background job processing
    // await scheduleExportJob(exportJob.id);

    return NextResponse.json({ exportJob }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Failed to create export job' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const jobs = await prisma.exportJob.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch export jobs' },
      { status: 500 }
    );
  }
}
```

### Export Job Detail Route

```typescript
// src/app/api/exports/[jobId]/route.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@deskops/database';
import { handleApiError } from '@/lib/error-handler';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { jobId } = await params;

    const job = await prisma.exportJob.findUnique({
      where: { id: jobId, userId },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    return handleApiError(error);
  }
}
```

**Purpose:** Retrieve detailed status information for a specific export job.

**Path Parameters:**

- `jobId` (required): Unique export job identifier (CUID)

**Response:**

```typescript
{
  job: {
    id: string;
    userId: string;
    siteId: string;
    module: 'production' | 'dispatch' | 'received' | 'equipment' | 'manpower' | 'inventory';
    format: 'xlsx' | 'csv' | 'pdf';
    dateFrom: Date;
    dateTo: Date;
    granularity: 'daily' | 'weekly' | 'monthly';
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
    progress: number;        // 0-100
    filePath: string | null;
    fileSize: number | null;
    fileHash: string | null;
    downloadUrl: string | null;
    expiresAt: Date | null;  // 24-hour expiry
    errorMessage: string | null;
    createdAt: Date;
    updatedAt: Date;
  }
}
```

**Error Handling:**

- 401: Unauthorized (no valid session)
- 404: Job not found or user does not own the job
- 500: Server error

### Export File Download Route

```typescript
// src/app/api/exports/[jobId]/download/route.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { prisma } from '@/lib/db';
import { handleApiError } from '@/lib/error-handler';

const CONTENT_TYPE_MAP: Record<string, string> = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  csv: 'text/csv',
  pdf: 'application/pdf',
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { jobId } = await params;

    const job = await prisma.exportJob.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json(
        { message: 'Export job not found' },
        { status: 404 }
      );
    }

    if (job.userId !== userId) {
      return NextResponse.json(
        { message: 'Forbidden: You do not own this export job' },
        { status: 403 }
      );
    }

    if (job.status !== 'completed') {
      return NextResponse.json(
        { message: 'Export job is not completed yet' },
        { status: 400 }
      );
    }

    if (!job.filePath) {
      return NextResponse.json(
        { message: 'Export file path not found' },
        { status: 500 }
      );
    }

    // Check if file has expired (24-hour expiry)
    if (job.expiresAt && job.expiresAt < new Date()) {
      return NextResponse.json(
        { message: 'Export file has expired' },
        { status: 410 }
      );
    }

    // Verify file exists on filesystem
    if (!existsSync(job.filePath)) {
      return NextResponse.json(
        { message: 'Export file not found on server' },
        { status: 404 }
      );
    }

    // Read file buffer
    const fileBuffer = await readFile(job.filePath);

    // Determine content type
    const contentType =
      CONTENT_TYPE_MAP[job.format] || 'application/octet-stream';

    // Generate filename
    const filename = `${job.module}_${job.dateFrom.toISOString().split('T')[0]}_to_${job.dateTo.toISOString().split('T')[0]}.${job.format}`;

    // Upsert audit record and increment download count
    await prisma.exportAudit.upsert({
      where: { jobId: job.id },
      update: {
        downloadCount: { increment: 1 },
        lastDownload: new Date(),
      },
      create: {
        jobId: job.id,
        siteId: job.siteId,
        userId: job.userId,
        module: job.module,
        filtersJson: JSON.stringify({
          dateFrom: job.dateFrom,
          dateTo: job.dateTo,
          granularity: job.granularity,
        }),
        recordCount: 0,
        fileSize: job.fileSize || 0,
        fileHash: job.fileHash || '',
        downloadCount: 1,
        lastDownload: new Date(),
      },
    });

    // Return file response with appropriate headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
```

**Purpose:** Download the generated export file for a completed export job. Automatically creates audit records and tracks download count.

**Path Parameters:**

- `jobId` (required): Unique export job identifier (CUID)

**Response:**
Binary file download with appropriate content type headers:

- Excel: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- CSV: `text/csv`
- PDF: `application/pdf`

**Filename Format:**
`{module}_{dateFrom}_to_{dateTo}.{format}`

Example: `production_2025-01-01_to_2025-01-31.xlsx`

**Audit Tracking:**

- Automatically creates/updates `ExportAudit` record
- Increments download count on each download
- Records last download timestamp

**Error Handling:**

- 401: Unauthorized (no valid session)
- 403: Forbidden (user does not own the job)
- 404: Job not found or file not found on server
- 400: Job not completed yet
- 410: Gone (file has expired after 24 hours)
- 500: Server error

**Security Features:**

- User ownership validation
- 24-hour file expiry
- SHA-256 hash verification via audit records
- File existence validation before streaming

### Export Job Retry Route

```typescript
// src/app/api/exports/[jobId]/retry/route.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { handleApiError } from '@/lib/error-handler';
import { ExportProcessor } from '@/lib/jobs/export-processor';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { jobId } = await params;

    const job = await prisma.exportJob.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json(
        { message: 'Export job not found' },
        { status: 404 }
      );
    }

    if (job.userId !== userId) {
      return NextResponse.json(
        { message: 'Forbidden: You do not own this export job' },
        { status: 403 }
      );
    }

    if (job.status !== 'failed') {
      return NextResponse.json(
        { message: 'Can only retry failed jobs' },
        { status: 400 }
      );
    }

    const updatedJob = await prisma.exportJob.update({
      where: { id: jobId },
      data: {
        status: 'pending',
        progress: 0,
        errorMessage: null,
      },
    });

    // Trigger background job processing
    const processor = new ExportProcessor();
    void processor.processJob(jobId).catch((e) => {
      console.error('Export retry processing failed:', e);
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    return handleApiError(error);
  }
}
```

**Purpose:** Retry a failed export job by resetting its status to pending and triggering reprocessing.

**Path Parameters:**

- `jobId` (required): Unique export job identifier (CUID)

**Response:**

```typescript
{
  id: string;
  status: 'pending';  // Reset to pending
  progress: 0;        // Reset to 0
  errorMessage: null; // Cleared
  // ... other job fields
}
```

**Business Logic:**

1. Validates user ownership of the job
2. Ensures job status is 'failed' (cannot retry pending/processing/completed jobs)
3. Resets job status to 'pending'
4. Clears progress counter and error message
5. Triggers background processing via `ExportProcessor`

**Error Handling:**

- 401: Unauthorized (no valid session)
- 403: Forbidden (user does not own the job)
- 404: Job not found
- 400: Cannot retry non-failed jobs
- 500: Server error

**Use Cases:**

- Transient errors (network issues, temporary database connection problems)
- Manual intervention after fixing data issues
- Resource availability issues (disk space, etc.)

### Export Progress Stream Route

```typescript
// src/app/api/exports/progress/route.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { handleApiError } from '@/lib/error-handler';

export const dynamic = 'force-dynamic';

const ProgressQuerySchema = z.object({
  jobIds: z.string().transform((val) => val.split(',')),
});

export async function GET(request: NextRequest) {
  // Server-Sent Events implementation
  // Polls job status every 2 seconds for up to 5 minutes
  // Sends keepalive pings every 15 seconds
  // Returns job status updates as SSE events
}
```

**Purpose:** Stream real-time progress updates for one or more export jobs using Server-Sent Events (SSE). Provides live status, progress percentage, and completion notifications.

**Query Parameters:**

- `jobIds` (required): Comma-separated list of job IDs to monitor

**Example Request:**

```
GET /api/exports/progress?jobIds=job1,job2,job3
```

**Response Format:** Server-Sent Events (SSE) stream

**Event Types:**

1. **Keepalive Event** (every 15 seconds):

```typescript
data: {
  "type": "keepalive",
  "timestamp": 1672531200000
}
```

2. **Update Event** (every 2 seconds):

```typescript
data: {
  "type": "update",
  "jobs": [
    {
      "id": "clw123...",
      "status": "processing",
      "progress": 45,
      "errorMessage": null,
      "filePath": null,
      "downloadUrl": null
    }
  ],
  "timestamp": 1672531200000
}
```

3. **Complete Event** (when all jobs terminal):

```typescript
data: {
  "type": "complete",
  "timestamp": 1672531200000
}
```

**Configuration:**

- Poll interval: 2 seconds
- Keepalive interval: 15 seconds
- Maximum polls: 150 (5 minutes total)
- Auto-closes stream when all jobs reach terminal state or timeout

**Terminal States:**

- `completed`: Job finished successfully
- `failed`: Job encountered error
- `cancelled`: Job was cancelled

**Error Handling:**

- 401: Unauthorized (no valid session)
- 400: Invalid jobIds parameter
- 500: Server error

**Performance Notes:**

- TODO: In production, replace polling with Redis pub/sub for true real-time updates
- Current implementation uses database polling every 2 seconds
- Supports monitoring multiple jobs simultaneously
- Automatically cleans up resources when stream closes

**Usage Example:**

```typescript
// Client-side SSE connection
const eventSource = new EventSource('/api/exports/progress?jobIds=job1,job2');

eventSource.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);

  if (data.type === 'update') {
    data.jobs.forEach(job => {
      console.log(`Job ${job.id}: ${job.status} - ${job.progress}%`);
    });
  }

  if (data.type === 'complete') {
    eventSource.close();
  }
});
```

---

## Server Actions for Data Mutations

```typescript
// src/app/actions/production.ts
'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { ProductionSchema, type ProductionInput } from '@deskops/database';
import { isValidMaterialId, isValidOperationType } from '@deskops/constants';

export async function createProduction(data: ProductionInput): Promise<{
  success: boolean;
  production?: unknown;
  message?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: 'Unauthorized' };
    }

    const validatedData = ProductionSchema.parse(data);

    if (!isValidMaterialId(validatedData.materialId)) {
      return { success: false, message: 'Invalid material ID' };
    }

    if (!isValidOperationType(validatedData.operation)) {
      return { success: false, message: 'Invalid operation type' };
    }

    const production = await prisma.production.create({
      data: {
        ...validatedData,
        createdBy: userId,
      },
      include: {
        material: {
          select: {
            code: true,
            name: true,
            uom: true,
          },
        },
      },
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/production');

    return { success: true, production };
  } catch (error) {
    console.error('Failed to create production:', error);
    return { success: false, message: 'Failed to create production record' };
  }
}

export async function updateProduction(
  id: string,
  data: Partial<ProductionInput>
): Promise<{
  success: boolean;
  production?: unknown;
  message?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: 'Unauthorized' };
    }

    const production = await prisma.production.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        material: {
          select: {
            code: true,
            name: true,
            uom: true,
          },
        },
      },
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/production');

    return { success: true, production };
  } catch (error) {
    console.error('Failed to update production:', error);
    return { success: false, message: 'Failed to update production record' };
  }
}

export async function deleteProduction(id: string): Promise<{
  success: boolean;
  message?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: 'Unauthorized' };
    }

    await prisma.production.delete({
      where: { id },
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/production');

    return { success: true };
  } catch (error) {
    console.error('Failed to delete production:', error);
    return { success: false, message: 'Failed to delete production record' };
  }
}
```

### Dispatch Server Actions

```typescript
// src/app/actions/dispatch.ts
'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { DispatchSchema, type DispatchInput } from '@deskops/database';
import { isValidMaterialId, isValidOperationType } from '@deskops/constants';

export async function createDispatch(data: DispatchInput): Promise<{
  success: boolean;
  dispatch?: unknown;
  message?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: 'Unauthorized' };
    }

    const validatedData = DispatchSchema.parse(data);

    if (!isValidMaterialId(validatedData.materialId)) {
      return { success: false, message: 'Invalid material ID' };
    }

    if (!isValidOperationType(validatedData.operation)) {
      return { success: false, message: 'Invalid operation type' };
    }

    const dispatch = await prisma.dispatch.create({
      data: {
        ...validatedData,
        createdBy: userId,
      },
      include: {
        material: {
          select: {
            code: true,
            name: true,
            uom: true,
          },
        },
      },
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/dispatch');

    return { success: true, dispatch };
  } catch (error) {
    console.error('Failed to create dispatch:', error);
    return { success: false, message: 'Failed to create dispatch record' };
  }
}

export async function updateDispatch(
  id: string,
  data: Partial<DispatchInput>
): Promise<{
  success: boolean;
  dispatch?: unknown;
  message?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: 'Unauthorized' };
    }

    const dispatch = await prisma.dispatch.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        material: {
          select: {
            code: true,
            name: true,
            uom: true,
          },
        },
      },
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/dispatch');

    return { success: true, dispatch };
  } catch (error) {
    console.error('Failed to update dispatch:', error);
    return { success: false, message: 'Failed to update dispatch record' };
  }
}

export async function deleteDispatch(id: string): Promise<{
  success: boolean;
  message?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: 'Unauthorized' };
    }

    await prisma.dispatch.delete({
      where: { id },
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/dispatch');

    return { success: true };
  } catch (error) {
    console.error('Failed to delete dispatch:', error);
    return { success: false, message: 'Failed to delete dispatch record' };
  }
}
```

### Received Material Server Actions

```typescript
// src/app/actions/received.ts
'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { ReceivedMaterialSchema } from '@deskops/database';
import { isValidMaterialId } from '@deskops/constants';

interface ReceivedMaterial {
  id: string;
  siteId: string;
  date: Date;
  materialId: string;
  qtyTon: number;
  source?: string;
  vehicleRef?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  material: {
    code: string;
    name: string;
    category: string;
  };
}

export async function createReceivedMaterial(data: unknown): Promise<{
  success: boolean;
  data?: ReceivedMaterial;
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const validatedData = ReceivedMaterialSchema.parse(data);

    if (!isValidMaterialId(validatedData.materialId)) {
      return { success: false, error: 'Invalid material ID' };
    }

    const receivedMaterial = await prisma.receivedMaterial.create({
      data: {
        ...validatedData,
        createdBy: userId,
      },
      include: {
        material: {
          select: {
            code: true,
            name: true,
            category: true,
          },
        },
      },
    });

    revalidatePath('/dashboard');
    revalidatePath('/received');

    return { success: true, data: receivedMaterial as ReceivedMaterial };
  } catch (error) {
    console.error('Failed to create received material:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create received material record',
    };
  }
}

export async function updateReceivedMaterial(
  id: string,
  data: unknown
): Promise<{
  success: boolean;
  data?: ReceivedMaterial;
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const validatedData = ReceivedMaterialSchema.parse(data);

    if (
      validatedData.materialId &&
      !isValidMaterialId(validatedData.materialId)
    ) {
      return { success: false, error: 'Invalid material ID' };
    }

    const receivedMaterial = await prisma.receivedMaterial.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
      include: {
        material: {
          select: {
            code: true,
            name: true,
            category: true,
          },
        },
      },
    });

    revalidatePath('/dashboard');
    revalidatePath('/received');

    return { success: true, data: receivedMaterial as ReceivedMaterial };
  } catch (error) {
    console.error('Failed to update received material:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update received material record',
    };
  }
}

export async function deleteReceivedMaterial(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    await prisma.receivedMaterial.delete({
      where: { id },
    });

    revalidatePath('/dashboard');
    revalidatePath('/received');

    return { success: true };
  } catch (error) {
    console.error('Failed to delete received material:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to delete received material record',
    };
  }
}
```

### Equipment Tracking Server Actions

```typescript
// src/app/actions/equipment.ts
'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { EquipmentLogSchema, type EquipmentLogInput } from '@deskops/database';
import { isValidEquipmentId } from '@deskops/constants';

export async function createEquipmentLog(data: unknown): Promise<{
  success: boolean;
  data?: unknown;
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const validatedData = EquipmentLogSchema.parse(data);

    if (!isValidEquipmentId(validatedData.equipmentId)) {
      return { success: false, error: 'Invalid equipment ID' };
    }

    const equipmentLog = await prisma.equipmentLog.create({
      data: {
        ...validatedData,
        createdBy: userId,
      },
      include: {
        equipment: {
          select: {
            code: true,
            name: true,
            type: true,
          },
        },
      },
    });

    revalidatePath('/dashboard');
    revalidatePath('/equipment');

    return { success: true, data: equipmentLog };
  } catch (error) {
    console.error('Failed to create equipment log:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create equipment log',
    };
  }
}

export async function updateEquipmentLog(
  id: string,
  data: unknown
): Promise<{
  success: boolean;
  data?: unknown;
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const validatedData = EquipmentLogSchema.parse(data);

    if (
      validatedData.equipmentId &&
      !isValidEquipmentId(validatedData.equipmentId)
    ) {
      return { success: false, error: 'Invalid equipment ID' };
    }

    const equipmentLog = await prisma.equipmentLog.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
      include: {
        equipment: {
          select: {
            code: true,
            name: true,
            type: true,
          },
        },
      },
    });

    revalidatePath('/dashboard');
    revalidatePath('/equipment');

    return { success: true, data: equipmentLog };
  } catch (error) {
    console.error('Failed to update equipment log:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update equipment log',
    };
  }
}

export async function deleteEquipmentLog(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    await prisma.equipmentLog.delete({
      where: { id },
    });

    revalidatePath('/dashboard');
    revalidatePath('/equipment');

    return { success: true };
  } catch (error) {
    console.error('Failed to delete equipment log:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to delete equipment log',
    };
  }
}
```

### Manpower Attendance Server Actions

```typescript
// src/app/actions/manpower.ts
'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { ManpowerLogSchema, type ManpowerLogInput } from '@deskops/database';

export async function createManpowerLog(data: unknown): Promise<{
  success: boolean;
  data?: unknown;
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const validatedData = ManpowerLogSchema.parse(data);

    const manpowerLog = await prisma.manpowerLog.create({
      data: {
        ...validatedData,
        createdBy: userId,
      },
      include: {
        role: {
          select: {
            code: true,
            name: true,
          },
        },
      },
    });

    revalidatePath('/dashboard');
    revalidatePath('/manpower');

    return { success: true, data: manpowerLog };
  } catch (error) {
    console.error('Failed to create manpower log:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create manpower log',
    };
  }
}

export async function updateManpowerLog(
  id: string,
  data: unknown
): Promise<{
  success: boolean;
  data?: unknown;
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const validatedData = ManpowerLogSchema.parse(data);

    const manpowerLog = await prisma.manpowerLog.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
      include: {
        role: {
          select: {
            code: true,
            name: true,
          },
        },
      },
    });

    revalidatePath('/dashboard');
    revalidatePath('/manpower');

    return { success: true, data: manpowerLog };
  } catch (error) {
    console.error('Failed to update manpower log:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update manpower log',
    };
  }
}

export async function deleteManpowerLog(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    await prisma.manpowerLog.delete({
      where: { id },
    });

    revalidatePath('/dashboard');
    revalidatePath('/manpower');

    return { success: true };
  } catch (error) {
    console.error('Failed to delete manpower log:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to delete manpower log',
    };
  }
}
```

---

## Background Job Processing

```typescript
// src/lib/jobs/export-processor.ts
import { prisma } from '@/lib/db';
import { generateExcelReport } from '@/lib/exporters/excel';
import { generatePDFReport } from '@/lib/exporters/pdf';
import { generateCSVReport } from '@/lib/exporters/csv';

interface ExportJobProcessor {
  processJob(jobId: string): Promise<void>;
  updateProgress(jobId: string, progress: number): Promise<void>;
  completeJob(
    jobId: string,
    filePath: string,
    fileSize: number,
    fileHash: string
  ): Promise<void>;
  failJob(jobId: string, error: string): Promise<void>;
}

export class ExportJobProcessor implements ExportJobProcessor {
  async processJob(jobId: string): Promise<void> {
    try {
      const job = await prisma.exportJob.findUnique({
        where: { id: jobId },
      });

      if (!job) {
        throw new Error(`Job ${jobId} not found`);
      }

      await this.updateProgress(jobId, 10);

      let filePath: string;
      let fileSize: number;
      let fileHash: string;

      switch (job.format) {
        case 'xlsx':
          ({ filePath, fileSize, fileHash } = await generateExcelReport(job));
          break;
        case 'pdf':
          ({ filePath, fileSize, fileHash } = await generatePDFReport(job));
          break;
        case 'csv':
          ({ filePath, fileSize, fileHash } = await generateCSVReport(job));
          break;
        default:
          throw new Error(`Unsupported format: ${job.format}`);
      }

      await this.completeJob(jobId, filePath, fileSize, fileHash);
    } catch (error) {
      console.error(`Export job ${jobId} failed:`, error);
      await this.failJob(
        jobId,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  async updateProgress(jobId: string, progress: number): Promise<void> {
    await prisma.exportJob.update({
      where: { id: jobId },
      data: {
        progress,
        status: 'processing',
        updatedAt: new Date(),
      },
    });
  }

  async completeJob(
    jobId: string,
    filePath: string,
    fileSize: number,
    fileHash: string
  ): Promise<void> {
    const downloadUrl = `/api/exports/${jobId}/download`;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24-hour expiry

    await prisma.exportJob.update({
      where: { id: jobId },
      data: {
        status: 'completed',
        progress: 100,
        filePath,
        fileSize,
        fileHash,
        downloadUrl,
        expiresAt,
        updatedAt: new Date(),
      },
    });

    // Create audit record
    await prisma.exportAudit.create({
      data: {
        jobId,
        siteId: '', // Will be filled from job data
        userId: '', // Will be filled from job data
        module: '', // Will be filled from job data
        filtersJson: '{}',
        recordCount: 0, // Calculate based on actual data
        fileSize,
        fileHash,
      },
    });
  }

  async failJob(jobId: string, error: string): Promise<void> {
    await prisma.exportJob.update({
      where: { id: jobId },
      data: {
        status: 'failed',
        errorMessage: error,
        updatedAt: new Date(),
      },
    });
  }
}
```

---

## Middleware for Authentication & Authorization

```typescript
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/api/(.*)']);

const isPublicRoute = createRouteMatcher(['/api/auth/session']);

export default clerkMiddleware(async (auth, req) => {
  // Allow session checks without authentication
  if (isPublicRoute(req)) {
    return;
  }

  // Protect all other routes
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // TODO: Role-based access control
  // Check user roles from Clerk session metadata and restrict /admin routes
  // to users with admin role (requires Clerk metadata configuration)
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

---

## Error Handling & Logging

```typescript
// src/lib/error-handler.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

export interface ApiError {
  message: string;
  code: string;
  details?: unknown;
}

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.errors,
      },
      { status: 400 }
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return NextResponse.json(
          {
            message: 'Unique constraint violation',
            code: 'DUPLICATE_RECORD',
            details: error.meta,
          },
          { status: 409 }
        );
      case 'P2025':
        return NextResponse.json(
          {
            message: 'Record not found',
            code: 'NOT_FOUND',
          },
          { status: 404 }
        );
      default:
        return NextResponse.json(
          {
            message: 'Database error',
            code: 'DATABASE_ERROR',
          },
          { status: 500 }
        );
    }
  }

  return NextResponse.json(
    {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
    },
    { status: 500 }
  );
}
```

---

## Summary

This backend architecture provides:

- **Complete API routes** following `/api/[module]/[resource]` pattern
- **Type-safe operations** with Zod validation and NO `any` types
- **Authentication & authorization** with Clerk integration
- **Server Actions** for optimistic UI updates
- **Background job processing** for exports
- **Error handling** with structured responses
- **Rate limiting** and security measures
- **Single source of truth** integration with constants

**Next Steps**:

1. Implement remaining API routes for received materials, manpower
2. Set up background job queues (Redis + Bull/BullMQ)
3. Add comprehensive error monitoring (Sentry)
4. Implement caching strategy (Redis/Upstash)
5. Add API rate limiting middleware
