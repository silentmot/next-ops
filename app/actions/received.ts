"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { isValidMaterialId } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { ReceivedMaterialSchema } from "@/lib/schemas";

interface ReceivedMaterial {
  id: string;
  siteId: string;
  date: Date;
  materialId: string;
  qtyTon: number;
  source?: string;
  vehicleRef?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  material: {
    code: string;
    name: string;
    category: string;
  };
}

export async function createReceivedMaterial(data: unknown): Promise<{
  success: boolean;
  data?: ReceivedMaterial;
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedData = ReceivedMaterialSchema.parse(data);

    if (!isValidMaterialId(validatedData.materialId)) {
      return { success: false, error: "Invalid material ID" };
    }

    const receivedMaterial = await prisma.receivedMaterial.create({
      data: {
        ...validatedData,
        createdBy: userId,
      },
      include: {
        material: {
          select: {
            code: true,
            name: true,
            category: true,
          },
        },
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/received");

    return {
      success: true,
      data: {
        ...receivedMaterial,
        qtyTon:
          typeof receivedMaterial.qtyTon === "object" &&
          typeof receivedMaterial.qtyTon.toNumber === "function"
            ? receivedMaterial.qtyTon.toNumber()
            : receivedMaterial.qtyTon,
      } as ReceivedMaterial,
    };
  } catch (error) {
    console.error("Failed to create received material:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create received material record",
    };
  }
}

export async function updateReceivedMaterial(
  id: string,
  data: unknown,
): Promise<{
  success: boolean;
  data?: ReceivedMaterial;
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedData = ReceivedMaterialSchema.parse(data);

    if (
      validatedData.materialId &&
      !isValidMaterialId(validatedData.materialId)
    ) {
      return { success: false, error: "Invalid material ID" };
    }

    const receivedMaterial = await prisma.receivedMaterial.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
      include: {
        material: {
          select: {
            code: true,
            name: true,
            category: true,
          },
        },
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/received");

    return {
      success: true,
      data: receivedMaterial as unknown as ReceivedMaterial
    };
  } catch (error) {
    console.error("Failed to update received material:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update received material record",
    };
  }
}

export async function deleteReceivedMaterial(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.receivedMaterial.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    revalidatePath("/received");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete received material:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete received material record",
    };
  }
}
