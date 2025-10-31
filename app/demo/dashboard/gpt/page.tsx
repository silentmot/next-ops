import {
  DEFAULT_SITE_CODE,
  getEquipmentById,
  getEquipmentByType,
  getFinalMaterials,
  getMaterialById,
  ROLES,
} from "@lib/constants";
import { DesignTokens } from "@lib/DesignTokens";
import type { Prisma } from "@prisma/client";
import {
  BarChart3,
  Building2,
  Download,
  Factory,
  Gauge,
  Package,
  Search,
  Sparkles,
  Truck,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cache, type JSX } from "react";
import { ChartCard } from "@/components/ChartCard";
import {
  AreaChartComponent,
  type AreaChartData,
} from "@/components/Charts/AreaChartComponent";
import { BarChartComponent } from "@/components/Charts/BarChartComponent";
import { LineChartComponent } from "@/components/Charts/LineChartComponent";
import type { PieChartData } from "@/components/Charts/PieChartComponent";
import { PieChartComponent } from "@/components/Charts/PieChartComponent";
import { ScatterChartComponent } from "@/components/Charts/ScatterChartComponent";
import { GlassContainer } from "@/components/GlassContainer";
import { MetricCard } from "@/components/MetricCard";
import { Sidebar } from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { prisma } from "@/lib/db";
import { formatNumber, formatPercentage, toISODate } from "@/lib/utils";

interface SiteOption {
  id: string;
  code: string;
  name: string;
  location: string | null;
}

type MetricUnit = "TON" | "COUNT" | "HOUR" | "PERCENT";

interface MetricSummary {
  id: "production" | "received" | "dispatched" | "inventory" | "equipment";
  label: string;
  current: number;
  previous: number;
  change: number;
  unit: MetricUnit;
}

interface ProductionDataPoint {
  date: string;
  production: number;
  target: number;
  variance: number;
  variancePercent: number;
}

interface FlowDataPoint {
  date: string;
  received: number;
  dispatched: number;
  net: number;
}

interface RecyclingDataPoint {
  date: string;
  rate: number;
  target: number;
}

interface EquipmentScatterPoint {
  x: number;
  y: number;
  z: number;
  name: string;
}

interface DetailRow {
  label: string;
  value: string;
  subtext: string;
}

interface DashboardContext {
  sites: SiteOption[];
  selectedSite: SiteOption | null;
  startDate: Date;
  endDate: Date;
  metrics: MetricSummary[];
  inventoryTrend: AreaChartData[];
  productionSummary: ProductionDataPoint[];
  equipmentUtilization: EquipmentScatterPoint[];
  attendanceDistribution: PieChartData[];
  flowTrend: FlowDataPoint[];
  recyclingTrend: RecyclingDataPoint[];
  movementDetails: DetailRow[];
  equipmentDetails: DetailRow[];
  manpowerDetails: DetailRow[];
}

const decimalToNumber = (
  value: Prisma.Decimal | number | null | undefined,
): number => {
  if (value === null || value === undefined) {
    return 0;
  }

  if (typeof value === "number") {
    return value;
  }

  return Number(value);
};

const fetchSites = cache(async (): Promise<SiteOption[]> => {
  const records = await prisma.site.findMany({
    where: { isActive: true },
    orderBy: [{ code: "asc" }],
    select: { id: true, code: true, name: true, location: true },
  });

  return records.map((record) => ({
    id: record.id,
    code: record.code,
    name: record.name,
    location: record.location,
  }));
});

const calculatePercentageChange = (
  current: number,
  previous: number,
): number => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return ((current - previous) / previous) * 100;
};

const normalizeToStartOfDay = (date: Date): Date => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const parseDateParam = (value: string | string[] | undefined): Date | null => {
  if (typeof value !== "string") {
    return null;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return normalizeToStartOfDay(parsed);
};

const buildFallbackInventoryTrend = (endDate: Date): AreaChartData[] => {
  const days = 30;
  const finalMaterials = getFinalMaterials().slice(0, 4);
  const baseValues = [450, 320, 180, 240];

  return Array.from({ length: days }, (_, index) => {
    const day = new Date(endDate);
    day.setDate(day.getDate() - (days - index - 1));
    const entry: AreaChartData = { date: toISODate(day) };

    finalMaterials.forEach((material, materialIndex) => {
      const variation = Math.sin((index + materialIndex) * 0.35) * 40;
      entry[material.name] = Math.max(
        0,
        Math.round(baseValues[materialIndex] + variation),
      );
    });

    return entry;
  });
};

const buildFallbackProductionSummary = (
  startDate: Date,
  endDate: Date,
): ProductionDataPoint[] => {
  const rangeDays = Math.max(
    1,
    Math.round(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    ) + 1,
  );

  return Array.from({ length: rangeDays }, (_, index) => {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + index);
    const production = Math.round(720 + Math.sin(index * 0.6) * 85);
    const target: number = 700;
    const variance: number = production - target;
    const variancePercent: number =
      target === 0 ? 0 : (variance / Number(target)) * 100;

    return {
      date: toISODate(day),
      production,
      target,
      variance,
      variancePercent,
    };
  });
};

const buildFallbackFlowTrend = (
  startDate: Date,
  endDate: Date,
): FlowDataPoint[] => {
  const rangeDays = Math.max(
    1,
    Math.round(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    ) + 1,
  );

  return Array.from({ length: rangeDays }, (_, index) => {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + index);
    const received = Math.round(120 + index * 6 + Math.sin(index * 0.4) * 18);
    const dispatched = Math.round(100 + index * 5 + Math.cos(index * 0.5) * 16);

    return {
      date: toISODate(day),
      received,
      dispatched,
      net: received - dispatched,
    };
  });
};

const buildFallbackRecyclingTrend = (endDate: Date): RecyclingDataPoint[] => {
  const days = 14;

  return Array.from({ length: days }, (_, index) => {
    const day = new Date(endDate);
    day.setDate(endDate.getDate() - (days - index - 1));
    const rate = Math.round((65 + Math.sin(index * 0.5) * 12) * 100) / 100;

    return {
      date: toISODate(day),
      rate,
      target: 72,
    };
  });
};

const buildFallbackEquipmentUtilization = (): EquipmentScatterPoint[] => {
  const crushingEquipment = getEquipmentByType("CRUSHING_SCREENING");

  return crushingEquipment.map((equipment, index) => {
    const hours = 6 + index * 1.4 + Math.cos(index * 0.8) * 1.6;
    const efficiency = 70 + index * 6;

    return {
      x: Math.round(hours * 100) / 100,
      y: Math.min(100, Math.round(efficiency)),
      z: (index + 1) * 20,
      name: equipment.name,
    };
  });
};

const buildFallbackAttendanceDistribution = (): PieChartData[] => {
  const capacity = ROLES.length * 10;
  const present = Math.round(capacity * 0.88);
  const absent = Math.max(capacity - present, 0);

  return [
    {
      name: "Present",
      value: present,
      fill: DesignTokens.theme.dark.status.success,
    },
    {
      name: "Unavailable",
      value: absent,
      fill: DesignTokens.theme.dark.status.critical,
    },
  ];
};

const getDashboardContext = async (
  searchParams: Record<string, string | string[] | undefined>,
): Promise<DashboardContext> => {
  const sites = await fetchSites();
  const requestedSiteCode =
    typeof searchParams.site === "string" ? searchParams.site : undefined;
  const selectedSite =
    sites.find((site) => site.code === requestedSiteCode) ??
    sites.find((site) => site.code === DEFAULT_SITE_CODE) ??
    sites[0] ??
    null;

  if (!selectedSite) {
    return {
      sites,
      selectedSite: null,
      startDate: normalizeToStartOfDay(new Date()),
      endDate: normalizeToStartOfDay(new Date()),
      metrics: [],
      inventoryTrend: buildFallbackInventoryTrend(new Date()),
      productionSummary: buildFallbackProductionSummary(
        normalizeToStartOfDay(new Date()),
        normalizeToStartOfDay(new Date()),
      ),
      equipmentUtilization: buildFallbackEquipmentUtilization(),
      attendanceDistribution: buildFallbackAttendanceDistribution(),
      flowTrend: buildFallbackFlowTrend(
        normalizeToStartOfDay(new Date()),
        normalizeToStartOfDay(new Date()),
      ),
      recyclingTrend: buildFallbackRecyclingTrend(new Date()),
      movementDetails: [],
      equipmentDetails: [],
      manpowerDetails: [],
    };
  }

  const requestedStart = parseDateParam(searchParams.start);
  const requestedEnd = parseDateParam(searchParams.end);

  const defaultEnd = normalizeToStartOfDay(new Date());
  const defaultStart = normalizeToStartOfDay(new Date(defaultEnd));
  defaultStart.setDate(defaultEnd.getDate() - 6);

  const endDate = requestedEnd ?? defaultEnd;
  const startDate =
    requestedStart && requestedStart <= endDate ? requestedStart : defaultStart;
  const rangeDays = Math.max(
    1,
    Math.round(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    ) + 1,
  );

  const previousEnd = new Date(startDate);
  previousEnd.setDate(startDate.getDate() - 1);
  const previousStart = new Date(previousEnd);
  previousStart.setDate(previousEnd.getDate() - (rangeDays - 1));

  const [
    productionAggregate,
    previousProductionAggregate,
    receivedAggregate,
    previousReceivedAggregate,
    dispatchedAggregate,
    previousDispatchedAggregate,
    inventoryAggregate,
    previousInventoryAggregate,
    equipmentAggregate,
    previousEquipmentAggregate,
    inventorySnapshots,
    productionGroups,
    previousProductionGroups,
    dispatchGroups,
    receivedGroups,
    recyclingSnapshots,
    equipmentLogs,
    manpowerLogs,
  ] = await Promise.all([
    prisma.production.aggregate({
      where: {
        siteId: selectedSite.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: { qtyTon: true },
    }),
    prisma.production.aggregate({
      where: {
        siteId: selectedSite.id,
        date: {
          gte: previousStart,
          lte: previousEnd,
        },
      },
      _sum: { qtyTon: true },
    }),
    prisma.receivedMaterial.aggregate({
      where: {
        siteId: selectedSite.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: { qtyTon: true },
    }),
    prisma.receivedMaterial.aggregate({
      where: {
        siteId: selectedSite.id,
        date: {
          gte: previousStart,
          lte: previousEnd,
        },
      },
      _sum: { qtyTon: true },
    }),
    prisma.dispatch.aggregate({
      where: {
        siteId: selectedSite.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: { qtyTon: true },
    }),
    prisma.dispatch.aggregate({
      where: {
        siteId: selectedSite.id,
        date: {
          gte: previousStart,
          lte: previousEnd,
        },
      },
      _sum: { qtyTon: true },
    }),
    prisma.inventorySnapshot.aggregate({
      where: {
        siteId: selectedSite.id,
        date: {
          lte: endDate,
        },
      },
      _sum: { closingTon: true },
    }),
    prisma.inventorySnapshot.aggregate({
      where: {
        siteId: selectedSite.id,
        date: {
          lte: previousEnd,
        },
      },
      _sum: { closingTon: true },
    }),
    prisma.equipmentLog.aggregate({
      where: {
        siteId: selectedSite.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: { hours: true },
    }),
    prisma.equipmentLog.aggregate({
      where: {
        siteId: selectedSite.id,
        date: {
          gte: previousStart,
          lte: previousEnd,
        },
      },
      _sum: { hours: true },
    }),
    prisma.inventorySnapshot.findMany({
      where: {
        siteId: selectedSite.id,
        date: {
          gte: new Date(endDate.getTime() - 29 * 24 * 60 * 60 * 1000),
          lte: endDate,
        },
      },
      orderBy: { date: "asc" },
    }),
    prisma.production.groupBy({
      by: ["date"],
      where: {
        siteId: selectedSite.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: { qtyTon: true },
      orderBy: { date: "asc" },
    }),
    prisma.production.groupBy({
      by: ["date"],
      where: {
        siteId: selectedSite.id,
        date: {
          gte: previousStart,
          lte: previousEnd,
        },
      },
      _sum: { qtyTon: true },
    }),
    prisma.dispatch.groupBy({
      by: ["date"],
      where: {
        siteId: selectedSite.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: { qtyTon: true },
      orderBy: { date: "asc" },
    }),
    prisma.receivedMaterial.groupBy({
      by: ["date"],
      where: {
        siteId: selectedSite.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: { qtyTon: true },
      orderBy: { date: "asc" },
    }),
    prisma.inventorySnapshot.findMany({
      where: {
        siteId: selectedSite.id,
        date: {
          gte: new Date(endDate.getTime() - 13 * 24 * 60 * 60 * 1000),
          lte: endDate,
        },
      },
      select: {
        date: true,
        producedTon: true,
        receivedTon: true,
        dispatchedTon: true,
      },
      orderBy: { date: "asc" },
    }),
    prisma.equipmentLog.findMany({
      where: {
        siteId: selectedSite.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        equipmentId: true,
        hours: true,
        count: true,
      },
    }),
    prisma.manpowerLog.findMany({
      where: {
        siteId: selectedSite.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        roleId: true,
        headcount: true,
      },
    }),
  ]);

  const productionCurrent = decimalToNumber(productionAggregate._sum.qtyTon);
  const productionPrevious = decimalToNumber(
    previousProductionAggregate._sum.qtyTon,
  );
  const receivedCurrent = decimalToNumber(receivedAggregate._sum.qtyTon);
  const receivedPrevious = decimalToNumber(
    previousReceivedAggregate._sum.qtyTon,
  );
  const dispatchedCurrent = decimalToNumber(dispatchedAggregate._sum.qtyTon);
  const dispatchedPrevious = decimalToNumber(
    previousDispatchedAggregate._sum.qtyTon,
  );
  const inventoryCurrent = decimalToNumber(inventoryAggregate._sum.closingTon);
  const inventoryPrevious = decimalToNumber(
    previousInventoryAggregate._sum.closingTon,
  );
  const equipmentCurrent = decimalToNumber(equipmentAggregate._sum.hours);
  const equipmentPrevious = decimalToNumber(
    previousEquipmentAggregate._sum.hours,
  );

  const metrics: MetricSummary[] = [
    {
      id: "production",
      label: "Production",
      current: productionCurrent,
      previous: productionPrevious,
      change: calculatePercentageChange(productionCurrent, productionPrevious),
      unit: "TON",
    },
    {
      id: "received",
      label: "Received",
      current: receivedCurrent,
      previous: receivedPrevious,
      change: calculatePercentageChange(receivedCurrent, receivedPrevious),
      unit: "TON",
    },
    {
      id: "dispatched",
      label: "Dispatched",
      current: dispatchedCurrent,
      previous: dispatchedPrevious,
      change: calculatePercentageChange(dispatchedCurrent, dispatchedPrevious),
      unit: "TON",
    },
    {
      id: "inventory",
      label: "Inventory",
      current: inventoryCurrent,
      previous: inventoryPrevious,
      change: calculatePercentageChange(inventoryCurrent, inventoryPrevious),
      unit: "TON",
    },
    {
      id: "equipment",
      label: "Equipment Hours",
      current: equipmentCurrent,
      previous: equipmentPrevious,
      change: calculatePercentageChange(equipmentCurrent, equipmentPrevious),
      unit: "HOUR",
    },
  ];

  const inventoryTrend: AreaChartData[] = inventorySnapshots.length
    ? (() => {
        const grouped = new Map<string, AreaChartData>();
        inventorySnapshots.forEach((snapshot) => {
          const dateKey = toISODate(snapshot.date);
          const entry = grouped.get(dateKey) ?? { date: dateKey };
          const material = getMaterialById(snapshot.materialId);
          const materialLabel = material?.name ?? snapshot.materialId;
          entry[materialLabel] = decimalToNumber(snapshot.closingTon);
          grouped.set(dateKey, entry);
        });
        return Array.from(grouped.values());
      })()
    : buildFallbackInventoryTrend(endDate);

  const previousAverageTarget = previousProductionGroups.length
    ? previousProductionGroups.reduce(
        (total, item) => total + decimalToNumber(item._sum.qtyTon),
        0,
      ) / previousProductionGroups.length
    : 0;

  const productionSummary: ProductionDataPoint[] = productionGroups.length
    ? productionGroups.map((item) => {
        const production = decimalToNumber(item._sum.qtyTon);
        const target =
          previousAverageTarget > 0 ? previousAverageTarget : production;
        const variance = production - target;
        const variancePercent = target === 0 ? 0 : (variance / target) * 100;

        return {
          date: toISODate(item.date),
          production,
          target,
          variance,
          variancePercent,
        };
      })
    : buildFallbackProductionSummary(startDate, endDate);

  const flowTrend: FlowDataPoint[] = (() => {
    if (!dispatchGroups.length && !receivedGroups.length) {
      return buildFallbackFlowTrend(startDate, endDate);
    }

    const merged = new Map<string, FlowDataPoint>();

    receivedGroups.forEach((group) => {
      const dateKey = toISODate(group.date);
      const existing = merged.get(dateKey) ?? {
        date: dateKey,
        received: 0,
        dispatched: 0,
        net: 0,
      };
      existing.received = decimalToNumber(group._sum.qtyTon);
      existing.net = existing.received - existing.dispatched;
      merged.set(dateKey, existing);
    });

    dispatchGroups.forEach((group) => {
      const dateKey = toISODate(group.date);
      const existing = merged.get(dateKey) ?? {
        date: dateKey,
        received: 0,
        dispatched: 0,
        net: 0,
      };
      existing.dispatched = decimalToNumber(group._sum.qtyTon);
      existing.net = existing.received - existing.dispatched;
      merged.set(dateKey, existing);
    });

    return Array.from(merged.values()).sort((a, b) =>
      a.date < b.date ? -1 : 1,
    );
  })();

  const recyclingTrend: RecyclingDataPoint[] = recyclingSnapshots.length
    ? recyclingSnapshots.map((snapshot) => {
        const produced = decimalToNumber(snapshot.producedTon);
        const received = decimalToNumber(snapshot.receivedTon);
        const dispatched = decimalToNumber(snapshot.dispatchedTon);
        const baseline = produced + received;
        const rate = baseline === 0 ? 0 : (dispatched / baseline) * 100;

        return {
          date: toISODate(snapshot.date),
          rate: Math.round(rate * 100) / 100,
          target: 72,
        };
      })
    : buildFallbackRecyclingTrend(endDate);

  const equipmentUtilization: EquipmentScatterPoint[] = equipmentLogs.length
    ? (() => {
        const grouped = new Map<string, { hours: number; count: number }>();
        equipmentLogs.forEach((log) => {
          const current = grouped.get(log.equipmentId) ?? {
            hours: 0,
            count: 0,
          };
          current.hours += decimalToNumber(log.hours);
          current.count += log.count;
          grouped.set(log.equipmentId, current);
        });

        return Array.from(grouped.entries()).map(
          ([equipmentId, stats], index) => {
            const equipment = getEquipmentById(equipmentId);
            const label = equipment?.name ?? equipmentId;
            const averageCount = stats.count === 0 ? 1 : stats.count;
            const efficiency = Math.min(
              100,
              (stats.hours / (averageCount * rangeDays * 8)) * 100,
            );

            return {
              x: Math.round((stats.hours / rangeDays) * 100) / 100,
              y: Math.round(efficiency * 100) / 100,
              z: (index + 1) * 24,
              name: label,
            };
          },
        );
      })()
    : buildFallbackEquipmentUtilization();

  const attendanceDistribution: PieChartData[] = manpowerLogs.length
    ? (() => {
        const totalPresent = manpowerLogs.reduce(
          (total, log) => total + log.headcount,
          0,
        );
        const capacity = totalPresent + ROLES.length;
        const absent = Math.max(capacity - totalPresent, 0);

        return [
          {
            name: "Present",
            value: totalPresent,
            fill: DesignTokens.theme.dark.status.success,
          },
          {
            name: "Available Capacity",
            value: absent,
            fill: DesignTokens.theme.dark.status.warning,
          },
        ];
      })()
    : buildFallbackAttendanceDistribution();

  const movementDetails: DetailRow[] = productionSummary
    .slice(-3)
    .map((item) => ({
      label: item.date,
      value: `${formatNumber(item.production, 0)} TON`,
      subtext: `Target ${formatNumber(item.target, 0)} TON`,
    }));

  const equipmentDetails: DetailRow[] = equipmentUtilization
    .slice(0, 3)
    .map((item) => ({
      label: item.name,
      value: `${formatNumber(item.x, 2)} hours/day`,
      subtext: `Efficiency ${formatPercentage(item.y, 1)}`,
    }));

  const manpowerDetails: DetailRow[] = attendanceDistribution.map((slice) => ({
    label: slice.name,
    value: formatNumber(slice.value, 0),
    subtext: slice.name === "Present" ? "Active workforce" : "Capacity buffer",
  }));

  return {
    sites,
    selectedSite,
    startDate,
    endDate,
    metrics,
    inventoryTrend,
    productionSummary,
    equipmentUtilization,
    attendanceDistribution,
    flowTrend,
    recyclingTrend,
    movementDetails,
    equipmentDetails,
    manpowerDetails,
  };
};

export const metadata: Metadata = {
  title: "DeskOps Dashboard Demo — UI/UX Artistic Agent",
  description:
    "Server-rendered DeskOps dashboard demo using SSOT data sources.",
};

interface DashboardPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const context = await getDashboardContext(searchParams);

  if (!context.selectedSite) {
    redirect("/demo/dashboard");
  }

  const { selectedSite, sites, startDate, endDate } = context;

  const metricsIconMap: Record<MetricSummary["id"], JSX.Element> = {
    production: (
      <Factory
        size={24}
        style={{ color: DesignTokens.theme.dark.accent.emerald.from }}
        aria-hidden="true"
      />
    ),
    received: (
      <Package
        size={24}
        style={{ color: DesignTokens.theme.dark.accent.violet.from }}
        aria-hidden="true"
      />
    ),
    dispatched: (
      <Truck
        size={24}
        style={{ color: DesignTokens.theme.dark.accent.orange.from }}
        aria-hidden="true"
      />
    ),
    inventory: (
      <BarChart3
        size={24}
        style={{ color: DesignTokens.theme.dark.status.info }}
        aria-hidden="true"
      />
    ),
    equipment: (
      <Gauge
        size={24}
        style={{ color: DesignTokens.theme.dark.status.success }}
        aria-hidden="true"
      />
    ),
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: DesignTokens.theme.dark.background.primary,
        color: DesignTokens.theme.dark.text.primary,
        fontFamily: DesignTokens.typography.fontFamily.sans,
      }}
    >
      <div className="flex min-h-screen">
        <aside
          className="hidden xl:block sticky top-0 h-screen"
          style={{
            width: "240px",
            padding: DesignTokens.spacing["5"],
          }}
        >
          <Sidebar
            items={[
              {
                id: "dashboard",
                label: "Dashboard",
                icon: <Sparkles size={18} />,
              },
              {
                id: "production",
                label: "Production",
                icon: <Factory size={18} />,
              },
              { id: "dispatch", label: "Dispatch", icon: <Truck size={18} /> },
              {
                id: "received",
                label: "Received",
                icon: <Package size={18} />,
              },
              { id: "manpower", label: "Manpower", icon: <Users size={18} /> },
            ]}
            activeItem="dashboard"
            className="h-full"
          />
        </aside>

        <main
          className="flex-1"
          style={{
            padding: DesignTokens.spacing["6"],
            marginLeft: "0",
          }}
        >
          <GlassContainer
            variant="md"
            className="mb-8"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: DesignTokens.spacing["4"],
              position: "sticky",
              top: DesignTokens.spacing["4"],
              zIndex: DesignTokens.zIndex.sticky,
            }}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div
                style={{
                  display: "flex",
                  gap: DesignTokens.spacing["3"],
                  alignItems: "center",
                }}
              >
                <Building2
                  size={28}
                  style={{ color: DesignTokens.theme.dark.status.success }}
                  aria-hidden="true"
                />
                <div>
                  <h1
                    style={{
                      fontSize: DesignTokens.typography.fontSize["3xl"],
                      fontWeight: DesignTokens.typography.fontWeight.bold,
                      letterSpacing:
                        DesignTokens.typography.letterSpacing.tight,
                    }}
                  >
                    DeskOps Operations Dashboard
                  </h1>
                  <p
                    style={{
                      color: DesignTokens.theme.dark.text.secondary,
                      fontSize: DesignTokens.typography.fontSize.base,
                    }}
                  >
                    Unified production, logistics, and workforce overview for{" "}
                    {selectedSite.code}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ThemeToggle />
                <div
                  className="rounded-full px-4 py-2"
                  style={{
                    background: DesignTokens.glassOpacity.light,
                    border: `1px solid ${DesignTokens.borderOpacity.light}`,
                    fontSize: DesignTokens.typography.fontSize.sm,
                    color: DesignTokens.theme.dark.text.secondary,
                  }}
                  aria-live="polite"
                >
                  Range: {toISODate(startDate)} – {toISODate(endDate)}
                </div>
              </div>
            </div>

            <form
              method="get"
              className="grid gap-4 md:grid-cols-3"
              style={{
                alignItems: "center",
              }}
            >
              <label
                className="flex flex-col gap-2"
                style={{ color: DesignTokens.theme.dark.text.secondary }}
              >
                <span
                  className="text-sm"
                  style={{
                    fontWeight: DesignTokens.typography.fontWeight.medium,
                  }}
                >
                  Site
                </span>
                <select
                  name="site"
                  defaultValue={selectedSite.code}
                  className="rounded-lg"
                  style={{
                    height: "40px",
                    padding: `0 ${DesignTokens.spacing["4"]}`,
                    background: DesignTokens.glassOpacity.light,
                    border: `1px solid ${DesignTokens.borderOpacity.light}`,
                    color: DesignTokens.theme.dark.text.primary,
                  }}
                  aria-label="Select site"
                >
                  {sites.map((site) => (
                    <option key={site.id} value={site.code}>
                      {site.code} — {site.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label
                  className="flex flex-col gap-2"
                  style={{ color: DesignTokens.theme.dark.text.secondary }}
                >
                  <span
                    className="text-sm"
                    style={{
                      fontWeight: DesignTokens.typography.fontWeight.medium,
                    }}
                  >
                    Start
                  </span>
                  <input
                    type="date"
                    name="start"
                    defaultValue={toISODate(startDate)}
                    style={{
                      height: "40px",
                      padding: `0 ${DesignTokens.spacing["3"]}`,
                      background: DesignTokens.glassOpacity.light,
                      border: `1px solid ${DesignTokens.borderOpacity.light}`,
                      color: DesignTokens.theme.dark.text.primary,
                    }}
                    aria-label="Start date"
                  />
                </label>

                <label
                  className="flex flex-col gap-2"
                  style={{ color: DesignTokens.theme.dark.text.secondary }}
                >
                  <span
                    className="text-sm"
                    style={{
                      fontWeight: DesignTokens.typography.fontWeight.medium,
                    }}
                  >
                    End
                  </span>
                  <input
                    type="date"
                    name="end"
                    defaultValue={toISODate(endDate)}
                    style={{
                      height: "40px",
                      padding: `0 ${DesignTokens.spacing["3"]}`,
                      background: DesignTokens.glassOpacity.light,
                      border: `1px solid ${DesignTokens.borderOpacity.light}`,
                      color: DesignTokens.theme.dark.text.primary,
                    }}
                    aria-label="End date"
                  />
                </label>
              </div>

              <div className="grid grid-cols-[1fr_auto] gap-3">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: DesignTokens.spacing["3"],
                    background: DesignTokens.glassOpacity.light,
                    border: `1px solid ${DesignTokens.borderOpacity.light}`,
                    borderRadius: DesignTokens.borderRadius.lg,
                    padding: `0 ${DesignTokens.spacing["4"]}`,
                  }}
                >
                  <Search size={18} aria-hidden="true" />
                  <input
                    type="search"
                    name="query"
                    placeholder="Search modules"
                    aria-label="Search"
                    style={{
                      background: "transparent",
                      border: "none",
                      color: DesignTokens.theme.dark.text.primary,
                      outline: "none",
                      width: "100%",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-md"
                  style={{
                    height: "40px",
                    padding: `0 ${DesignTokens.spacing["4"]}`,
                    background: DesignTokens.gradient.primary.css,
                    color: DesignTokens.theme.dark.text.interactive,
                    fontWeight: DesignTokens.typography.fontWeight.semibold,
                    border: "none",
                  }}
                >
                  Apply
                </button>
              </div>
            </form>
          </GlassContainer>

          <section
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
            aria-label="Key metrics"
          >
            {context.metrics.map((metric, index) => (
              <MetricCard
                key={metric.id}
                label={metric.label}
                value={`${formatNumber(metric.current, metric.unit === "HOUR" ? 1 : 0)} ${metric.unit}`}
                change={Number(metric.change.toFixed(2))}
                icon={metricsIconMap[metric.id]}
                index={index}
                gradientType={
                  index === 0
                    ? "primary"
                    : index === 1
                      ? "secondary"
                      : index === 2
                        ? "tertiary"
                        : "rainbow"
                }
              />
            ))}
          </section>

          <div
            className="grid gap-6 xl:grid-cols-12"
            style={{ marginTop: DesignTokens.spacing["8"] }}
          >
            <div className="xl:col-span-7">
              <ChartCard
                title="Inventory Levels"
                description="Stacked trend of closing tonnage by material"
                height="lg"
              >
                <AreaChartComponent
                  data={context.inventoryTrend}
                  areas={(() => {
                    const sample = context.inventoryTrend[0] ?? { date: "" };
                    return Object.keys(sample)
                      .filter((key) => key !== "date")
                      .map((key, idx) => {
                        const palette = [
                          {
                            fill: DesignTokens.theme.dark.accent.emerald.from,
                            stroke: DesignTokens.theme.dark.accent.emerald.to,
                          },
                          {
                            fill: DesignTokens.theme.dark.accent.violet.from,
                            stroke: DesignTokens.theme.dark.accent.violet.to,
                          },
                          {
                            fill: DesignTokens.theme.dark.accent.orange.from,
                            stroke: DesignTokens.theme.dark.accent.orange.to,
                          },
                          {
                            fill: DesignTokens.theme.dark.status.info,
                            stroke: DesignTokens.theme.dark.status.success,
                          },
                        ];
                        const color = palette[idx % palette.length];
                        return {
                          dataKey: key,
                          name: key,
                          fill: color.fill,
                          stroke: color.stroke,
                        };
                      });
                  })()}
                  stacked
                  height={380}
                />
              </ChartCard>
            </div>

            <div className="xl:col-span-5">
              <ChartCard
                title="Production vs Target"
                description="Daily output with target baseline"
                height="lg"
              >
                <BarChartComponent
                  data={context.productionSummary.map((item) => ({
                    name: item.date,
                    production: item.production,
                    target: item.target,
                  }))}
                  bars={[
                    {
                      dataKey: "production",
                      name: "Production",
                      fill: DesignTokens.theme.dark.accent.emerald.from,
                    },
                    {
                      dataKey: "target",
                      name: "Target",
                      fill: DesignTokens.theme.dark.text.tertiary,
                    },
                  ]}
                  layout="vertical"
                  height={380}
                />
              </ChartCard>
            </div>

            <div className="xl:col-span-5">
              <ChartCard
                title="Equipment Utilization"
                description="Average daily hours vs efficiency"
                height="md"
              >
                <ScatterChartComponent
                  scatters={[
                    {
                      name: "Utilization",
                      data: context.equipmentUtilization,
                      fill: DesignTokens.theme.dark.accent.emerald.from,
                    },
                  ]}
                  xAxisLabel="Hours"
                  yAxisLabel="Efficiency %"
                  height={320}
                />
              </ChartCard>
            </div>

            <div className="xl:col-span-4">
              <ChartCard
                title="Manpower Attendance"
                description="Present workforce vs available capacity"
                height="md"
              >
                <PieChartComponent
                  data={context.attendanceDistribution}
                  height={320}
                  innerRadius={70}
                  showLabels
                />
              </ChartCard>
            </div>

            <div className="xl:col-span-3" />

            <div className="xl:col-span-7">
              <ChartCard
                title="Received vs Dispatched"
                description="Material flow comparison"
                height="lg"
              >
                <BarChartComponent
                  data={context.flowTrend.map((item) => ({
                    name: item.date,
                    received: item.received,
                    dispatched: item.dispatched,
                  }))}
                  bars={[
                    {
                      dataKey: "received",
                      name: "Received",
                      fill: DesignTokens.theme.dark.status.success,
                    },
                    {
                      dataKey: "dispatched",
                      name: "Dispatched",
                      fill: DesignTokens.theme.dark.accent.orange.from,
                    },
                  ]}
                  layout="horizontal"
                  height={360}
                />
              </ChartCard>
            </div>

            <div className="xl:col-span-5">
              <ChartCard
                title="Recycling Ratio"
                description="Recovered tonnage compared to intake"
                height="lg"
              >
                <LineChartComponent
                  data={context.recyclingTrend.map((item) => ({
                    date: item.date,
                    rate: item.rate,
                    target: item.target,
                  }))}
                  lines={[
                    {
                      dataKey: "rate",
                      name: "Recycling Rate",
                      color: DesignTokens.theme.dark.status.success,
                      strokeWidth: 3,
                    },
                    {
                      dataKey: "target",
                      name: "Target",
                      color: DesignTokens.theme.dark.text.tertiary,
                      strokeWidth: 2,
                    },
                  ]}
                  height={360}
                />
              </ChartCard>
            </div>

            <div className="xl:col-span-12">
              <GlassContainer glassIntensity="light" className="min-h-[320px]">
                <div
                  className="flex flex-col gap-6"
                  style={{ color: DesignTokens.theme.dark.text.secondary }}
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2
                        style={{
                          fontSize: DesignTokens.typography.fontSize["2xl"],
                          fontWeight:
                            DesignTokens.typography.fontWeight.semibold,
                          color: DesignTokens.theme.dark.text.primary,
                        }}
                      >
                        Operational Highlights
                      </h2>
                      <p
                        style={{
                          fontSize: DesignTokens.typography.fontSize.sm,
                        }}
                      >
                        Key extracts for materials, equipment, and workforce
                        modules
                      </p>
                    </div>
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-md"
                      style={{
                        padding: `${DesignTokens.spacing["2"]} ${DesignTokens.spacing["4"]}`,
                        background: DesignTokens.glassOpacity.light,
                        border: `1px solid ${DesignTokens.borderOpacity.light}`,
                        color: DesignTokens.theme.dark.text.primary,
                        fontSize: DesignTokens.typography.fontSize.sm,
                      }}
                    >
                      <Download size={18} aria-hidden="true" />
                      Export Snapshot
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <h3
                        style={{
                          fontSize: DesignTokens.typography.fontSize.lg,
                          fontWeight:
                            DesignTokens.typography.fontWeight.semibold,
                          color: DesignTokens.theme.dark.text.primary,
                          marginBottom: DesignTokens.spacing["3"],
                        }}
                      >
                        Material Movements
                      </h3>
                      <ul className="flex flex-col gap-3">
                        {context.movementDetails.map((item) => (
                          <li key={item.label}>
                            <p
                              style={{
                                fontWeight:
                                  DesignTokens.typography.fontWeight.medium,
                              }}
                            >
                              {item.label}
                            </p>
                            <p>{item.value}</p>
                            <p
                              style={{
                                opacity: 0.7,
                                fontSize: DesignTokens.typography.fontSize.xs,
                              }}
                            >
                              {item.subtext}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3
                        style={{
                          fontSize: DesignTokens.typography.fontSize.lg,
                          fontWeight:
                            DesignTokens.typography.fontWeight.semibold,
                          color: DesignTokens.theme.dark.text.primary,
                          marginBottom: DesignTokens.spacing["3"],
                        }}
                      >
                        Equipment Pulse
                      </h3>
                      <ul className="flex flex-col gap-3">
                        {context.equipmentDetails.map((item) => (
                          <li key={item.label}>
                            <p
                              style={{
                                fontWeight:
                                  DesignTokens.typography.fontWeight.medium,
                              }}
                            >
                              {item.label}
                            </p>
                            <p>{item.value}</p>
                            <p
                              style={{
                                opacity: 0.7,
                                fontSize: DesignTokens.typography.fontSize.xs,
                              }}
                            >
                              {item.subtext}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3
                        style={{
                          fontSize: DesignTokens.typography.fontSize.lg,
                          fontWeight:
                            DesignTokens.typography.fontWeight.semibold,
                          color: DesignTokens.theme.dark.text.primary,
                          marginBottom: DesignTokens.spacing["3"],
                        }}
                      >
                        Manpower Overview
                      </h3>
                      <ul className="flex flex-col gap-3">
                        {context.manpowerDetails.map((item) => (
                          <li key={item.label}>
                            <p
                              style={{
                                fontWeight:
                                  DesignTokens.typography.fontWeight.medium,
                              }}
                            >
                              {item.label}
                            </p>
                            <p>{item.value}</p>
                            <p
                              style={{
                                opacity: 0.7,
                                fontSize: DesignTokens.typography.fontSize.xs,
                              }}
                            >
                              {item.subtext}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </GlassContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
