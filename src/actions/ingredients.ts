"use server";

import { ZodError } from "zod";
import { ingredientsSchema } from "../schema/zod";
import prisma from "../utils/prisma";
import { NextRequest } from "next/server";

export const createIngredient = async (formData: FormData) => {
  try {
    console.log("formData", formData);
    const data = {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      unit: formData.get("unit") as string,
      pricePerUnit: formData.get("pricePerUnit")
        ? parseFloat(formData.get("pricePerUnit") as string)
        : null,
      description: formData.get("description") as string,
    };

    const validatedData = ingredientsSchema.parse(data);
    const ingredientsasd = await prisma.ingredient.create({
      data: {
        name: validatedData.name,
        category: validatedData.category,
        unit: validatedData.unit,
        pricePerUnit: validatedData.pricePerUnit,
        description: validatedData.description,
      },
    });

    return { success: true, ingredientsasd };
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return {
        error: error.issues
          .map((e: { message: string }) => e.message)
          .join(", "),
      };
    }

    console.error("Ошибка создания ингредиента:", error);
    return { error: "Ошибка при создании ингредиента" };
  }
};

export async function getIngredients(searchString: string) {
  try {
    const ingredients = await prisma.ingredient.findMany({
      where: {
        name: {
          contains: searchString,
          mode: "insensitive",
        },
      },
      take: 20,
    });
    return { success: true, ingredients };
  } catch (error) {
    console.error("Ошибка получения ингредиентов:", error);
    return { error: "Ошибка при получении ингредиентов" };
  }
}

export async function deleteIngredient(id: string) {
  try {
    const ingredient = await prisma.ingredient.delete({ where: { id } });
    return { success: true, ingredient };
  } catch (error) {
    console.error("Ошибка удаления ингредиента:", error);
    return { error: "Ошибка при удалении ингредиента" };
  }
}
