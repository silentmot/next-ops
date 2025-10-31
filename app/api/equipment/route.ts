import { auth } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { isValidEquipmentId } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { EquipmentLogSchema } from "@/lib/schemas";

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
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ equipmentLogs });
  } catch (_error) {
    return NextResponse.json(
      { message: "Failed to fetch equipment logs" },
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
    const validatedData = EquipmentLogSchema.parse(body);

    // Validate equipment ID exists
    if (!isValidEquipmentId(validatedData.equipmentId)) {
      return NextResponse.json(
        { message: "Invalid equipment ID" },
        { status: 400 },
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
          message: "Validation failed",
          code: "VALIDATION_ERROR",
          details: error.issues,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Failed to create equipment log" },
      { status: 500 },
    );
  }
}
