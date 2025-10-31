import { auth } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { isValidMaterialId, isValidOperationType } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { ProductionSchema } from "@/lib/schemas";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get("siteId");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    if (!siteId) {
      return NextResponse.json(
        { message: "siteId parameter required" },
        { status: 400 },
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
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ productions });
  } catch (_error) {
    return NextResponse.json(
      { message: "Failed to fetch production data" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = ProductionSchema.parse(body);

    // Validate material ID exists
    if (!isValidMaterialId(validatedData.materialId)) {
      return NextResponse.json(
        { message: "Invalid material ID" },
        { status: 400 },
      );
    }

    // Validate operation type
    if (!isValidOperationType(validatedData.operation)) {
      return NextResponse.json(
        { message: "Invalid operation type" },
        { status: 400 },
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
          message: "Validation failed",
          code: "VALIDATION_ERROR",
          details: error.issues,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Failed to create production record" },
      { status: 500 },
    );
  }
}
