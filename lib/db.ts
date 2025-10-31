import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const isDev = process.env.NODE_ENV === "development";
const enableQueryLog = process.env.PRISMA_QUERY_LOG === "true" || isDev;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: enableQueryLog
      ? [
          { emit: "event", level: "query" },
          { emit: "stdout", level: "error" },
          { emit: "stdout", level: "warn" },
        ]
      : [
          { emit: "stdout", level: "error" },
          { emit: "stdout", level: "warn" },
        ],
  });

interface PrismaQueryEvent {
  query: string;
  duration: number;
  timestamp: Date;
  target: string;
}

// Log queries in development only
if (enableQueryLog && isDev) {
  prisma.$on("query", (e: PrismaQueryEvent) => {
    console.log(`Query: ${e.query}`);
    console.log(`Duration: ${e.duration}ms`);
  });
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
