"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { isValidEquipmentId } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { EquipmentLogSchema } from "@/lib/schemas";

export async function createEquipmentLog(data: unknown): Promise<{
  success: boolean;
  data?: unknown;
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedData = EquipmentLogSchema.parse(data);

    if (!isValidEquipmentId(validatedData.equipmentId)) {
      return { success: false, error: "Invalid equipment ID" };
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

    revalidatePath("/dashboard");
    revalidatePath("/equipment");

    return { success: true, data: equipmentLog };
  } catch (error) {
    console.error("Failed to create equipment log:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create equipment log",
    };
  }
}

export async function updateEquipmentLog(
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

    const validatedData = EquipmentLogSchema.parse(data);

    if (
      validatedData.equipmentId &&
      !isValidEquipmentId(validatedData.equipmentId)
    ) {
      return { success: false, error: "Invalid equipment ID" };
    }

    const equipmentLog = await prisma.equipmentLog.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date(),
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

    revalidatePath("/dashboard");
    revalidatePath("/equipment");

    return { success: true, data: equipmentLog };
  } catch (error) {
    console.error("Failed to update equipment log:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update equipment log",
    };
  }
}

export async function deleteEquipmentLog(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.equipmentLog.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    revalidatePath("/equipment");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete equipment log:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete equipment log",
    };
  }
}
