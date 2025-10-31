import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

export interface ApiError {
  message: string;
  code: string;
  details?: unknown;
}

export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error);

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

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return NextResponse.json(
          {
            message: "Unique constraint violation",
            code: "DUPLICATE_RECORD",
            details: error.meta,
          },
          { status: 409 },
        );
      case "P2025":
        return NextResponse.json(
          {
            message: "Record not found",
            code: "NOT_FOUND",
          },
          { status: 404 },
        );
      default:
        return NextResponse.json(
          {
            message: "Database error",
            code: "DATABASE_ERROR",
          },
          { status: 500 },
        );
    }
  }

  return NextResponse.json(
    {
      message: "Internal server error",
      code: "INTERNAL_ERROR",
    },
    { status: 500 },
  );
}
