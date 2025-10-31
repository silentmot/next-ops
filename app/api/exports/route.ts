import { auth } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { ExportJobSchema } from "@/lib/schemas";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = ExportJobSchema.parse(body);

    // Check rate limits
    const activeJobs = await prisma.exportJob.count({
      where: {
        userId,
        status: { in: ["pending", "processing"] },
      },
    });

    if (activeJobs >= 5) {
      return NextResponse.json(
        { message: "Rate limit exceeded: maximum 5 active jobs per user" },
        { status: 429 },
      );
    }

    const exportJob = await prisma.exportJob.create({
      data: {
        ...validatedData,
        userId,
        status: "pending",
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
          message: "Validation failed",
          code: "VALIDATION_ERROR",
          details: error.issues,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Failed to create export job" },
      { status: 500 },
    );
  }
}

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const jobs = await prisma.exportJob.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ jobs });
  } catch (_error) {
    return NextResponse.json(
      { message: "Failed to fetch export jobs" },
      { status: 500 },
    );
  }
}
