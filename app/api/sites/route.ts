import { auth } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { CreateSiteSchema } from "@/lib/schemas";

export async function GET(): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ sites });
  } catch (_error) {
    return NextResponse.json(
      { message: "Failed to fetch sites" },
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
          message: "Validation failed",
          code: "VALIDATION_ERROR",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Failed to create site" },
      { status: 500 },
    );
  }
}
