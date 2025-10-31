import { auth } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handleApiError } from "@/lib/error-handler";
import { ManpowerLogSchema } from "@/lib/schemas";

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
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
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
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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
