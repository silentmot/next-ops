"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { isValidMaterialId, isValidOperationType } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { type DispatchInput, DispatchSchema } from "@/lib/schemas";

export async function createDispatch(data: DispatchInput): Promise<{
  success: boolean;
  dispatch?: unknown;
  message?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    const validatedData = DispatchSchema.parse(data);

    if (!isValidMaterialId(validatedData.materialId)) {
      return { success: false, message: "Invalid material ID" };
    }

    if (!isValidOperationType(validatedData.operation)) {
      return { success: false, message: "Invalid operation type" };
    }

    const dispatch = await prisma.dispatch.create({
      data: {
        ...validatedData,
        createdBy: userId,
      },
      include: {
        material: {
          select: {
            code: true,
            name: true,
            uom: true,
          },
        },
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/dispatch");

    return { success: true, dispatch };
  } catch (error) {
    console.error("Failed to create dispatch:", error);
    return { success: false, message: "Failed to create dispatch record" };
  }
}

export async function updateDispatch(
  id: string,
  data: Partial<DispatchInput>,
): Promise<{
  success: boolean;
  dispatch?: unknown;
  message?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    const dispatch = await prisma.dispatch.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        material: {
          select: {
            code: true,
            name: true,
            uom: true,
          },
        },
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/dispatch");

    return { success: true, dispatch };
  } catch (error) {
    console.error("Failed to update dispatch:", error);
    return { success: false, message: "Failed to update dispatch record" };
  }
}

export async function deleteDispatch(id: string): Promise<{
  success: boolean;
  message?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    await prisma.dispatch.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/dispatch");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete dispatch:", error);
    return { success: false, message: "Failed to delete dispatch record" };
  }
}
