import { auth } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get("siteId");

    if (!siteId) {
      return NextResponse.json(
        { message: "siteId parameter required" },
        { status: 400 },
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
          Number(previousProductionSum._sum.qtyTon ?? 0),
        ),
      },
      totalDispatched: {
        current: Number(currentDispatchedSum._sum.qtyTon ?? 0),
        previous: Number(previousDispatchedSum._sum.qtyTon ?? 0),
        percentageChange: calculatePercentageChange(
          Number(currentDispatchedSum._sum.qtyTon ?? 0),
          Number(previousDispatchedSum._sum.qtyTon ?? 0),
        ),
      },
      totalReceived: {
        current: Number(currentReceivedSum._sum.qtyTon ?? 0),
        previous: Number(previousReceivedSum._sum.qtyTon ?? 0),
        percentageChange: calculatePercentageChange(
          Number(currentReceivedSum._sum.qtyTon ?? 0),
          Number(previousReceivedSum._sum.qtyTon ?? 0),
        ),
      },
      equipmentUtilization: {
        current: 0, // TODO: Implement equipment hours sum
        previous: 0,
        percentageChange: 0,
      },
      currentInventoryStatus: {
        current: Number(currentInventorySum._sum.closingTon ?? 0),
        previous: Number(previousInventorySum._sum.closingTon ?? 0),
        percentageChange: calculatePercentageChange(
          Number(currentInventorySum._sum.closingTon ?? 0),
          Number(previousInventorySum._sum.closingTon ?? 0),
        ),
      },
    };

    return NextResponse.json(metrics);
  } catch (_error) {
    return NextResponse.json(
      { message: "Failed to fetch dashboard metrics" },
      { status: 500 },
    );
  }
}
