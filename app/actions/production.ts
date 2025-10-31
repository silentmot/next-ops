"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { isValidMaterialId, isValidOperationType } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { type ProductionInput, ProductionSchema } from "@/lib/schemas";

export async function createProduction(data: ProductionInput): Promise<{
  success: boolean;
  production?: unknown;
  message?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    const validatedData = ProductionSchema.parse(data);

    if (!isValidMaterialId(validatedData.materialId)) {
      return { success: false, message: "Invalid material ID" };
    }

    if (!isValidOperationType(validatedData.operation)) {
      return { success: false, message: "Invalid operation type" };
    }

    const production = await prisma.production.create({
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
    revalidatePath("/dashboard/production");

    return { success: true, production };
  } catch (error) {
    console.error("Failed to create production:", error);
    return { success: false, message: "Failed to create production record" };
  }
}

export async function updateProduction(
  id: string,
  data: Partial<ProductionInput>,
): Promise<{
  success: boolean;
  production?: unknown;
  message?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    const production = await prisma.production.update({
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
    revalidatePath("/dashboard/production");

    return { success: true, production };
  } catch (error) {
    console.error("Failed to update production:", error);
    return { success: false, message: "Failed to update production record" };
  }
}

export async function deleteProduction(id: string): Promise<{
  success: boolean;
  message?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    await prisma.production.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/production");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete production:", error);
    return { success: false, message: "Failed to delete production record" };
  }
}
