import { PrismaClient } from "@prisma/client";
import type { Prisma } from "@prisma/client";

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

// Log queries in development only
if (enableQueryLog && isDev) {
  (prisma.$on as (
    event: "query",
    callback: (e: Prisma.QueryEvent) => void,
  ) => void)("query", (e: Prisma.QueryEvent) => {
    console.log(`Query: ${e.query}`);
    console.log(`Duration: ${e.duration}ms`);
  });
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
