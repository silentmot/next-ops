"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { ManpowerLogSchema } from "@/lib/schemas";

export async function createManpowerLog(data: unknown): Promise<{
  success: boolean;
  data?: unknown;
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedData = ManpowerLogSchema.parse(data);

    const manpowerLog = await prisma.manpowerLog.create({
      data: {
        ...validatedData,
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

    revalidatePath("/dashboard");
    revalidatePath("/manpower");

    return { success: true, data: manpowerLog };
  } catch (error) {
    console.error("Failed to create manpower log:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create manpower log",
    };
  }
}

export async function updateManpowerLog(
  id: string,
  data: unknown,
): Promise<{
  success: boolean;
  data?: unknown;
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedData = ManpowerLogSchema.parse(data);

    const manpowerLog = await prisma.manpowerLog.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date(),
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

    revalidatePath("/dashboard");
    revalidatePath("/manpower");

    return { success: true, data: manpowerLog };
  } catch (error) {
    console.error("Failed to update manpower log:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update manpower log",
    };
  }
}

export async function deleteManpowerLog(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.manpowerLog.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    revalidatePath("/manpower");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete manpower log:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete manpower log",
    };
  }
}
