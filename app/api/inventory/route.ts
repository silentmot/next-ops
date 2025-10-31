import { auth } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isValidMaterialId } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { handleApiError } from "@/lib/error-handler";
import {
  InventoryQuerySchema,
  InventorySnapshotCreateSchema,
} from "@/lib/schemas";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryParams = {
      siteId: searchParams.get("siteId") ?? undefined,
      dateFrom: searchParams.get("dateFrom") ?? undefined,
      dateTo: searchParams.get("dateTo") ?? undefined,
    };

    const { siteId, dateFrom, dateTo } =
      InventoryQuerySchema.parse(queryParams);

    // Validate date range order
    if (dateFrom && dateTo) {
      const from = new Date(dateFrom);
      const to = new Date(dateTo);
      if (from > to) {
        return NextResponse.json(
          { message: "dateFrom must be less than or equal to dateTo" },
          { status: 400 },
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
        date: "desc",
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
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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
        { message: "Invalid material ID" },
        { status: 400 },
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
