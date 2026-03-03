"use server";

import { Unit, Category, Prisma } from "../generated/prisma/client";
import { IFilters } from "../types/filters";
import prisma from "../utils/prisma";

export async function getRecipes(
  amount: number,
  skip: number,
  filters?: IFilters,
) {
  try {
    if (!filters) {
      const recipes = await prisma.recipe.findMany({
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
        take: amount,
        skip,
        orderBy: { createdAt: "desc" },
      });
      return { success: true, recipes };
    }
    // 1. Создаем строго типизированный массив условий
    const andConditions: Prisma.RecipeWhereInput[] = [];
    // 2. Текстовый поиск
    if (filters.searchQuery && filters.searchQuery.trim() !== "") {
      andConditions.push({
        OR: [
          { name: { contains: filters.searchQuery, mode: "insensitive" } },
          {
            description: { contains: filters.searchQuery, mode: "insensitive" },
          },
        ],
      });
    }

    // 3. Даты (Критический момент!)
    if (filters.dateFrom || filters.dateTo) {
      const dateFilter: Prisma.DateTimeFilter<"Recipe"> = {};

      if (filters.dateFrom) {
        const start = new Date(filters.dateFrom);
        start.setHours(0, 0, 0, 0);
        dateFilter.gte = start;
      }

      if (filters.dateTo) {
        const end = new Date(filters.dateTo);
        end.setHours(23, 59, 59, 999);
        dateFilter.lte = end;
      }

      andConditions.push({ createdAt: dateFilter });
    }

    // 4. Юниты и Категории
    if (filters.unit || filters.category) {
      andConditions.push({
        ingredients: {
          some: {
            ingredient: {
              // Важно: проверяем наличие каждого поля отдельно внутри объекта
              ...(filters.unit && { unit: filters.unit as Unit }),
              ...(filters.category && {
                category: filters.category as Category,
              }),
            },
          },
        },
      });
    }

    // 5. Выполняем запрос с динамическим where
    const recipes = await prisma.recipe.findMany({
      where: andConditions.length > 0 ? { AND: andConditions } : {},
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
      take: amount,
      skip,
      orderBy: { createdAt: "desc" },
    });
    return { success: true, recipes };
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return { success: false, error: "Ошибка при загрузке рецептов" };
  }
}

export async function createRecipe(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const imageUrl = formData.get("imageUrl") as string | null;

    const ingredients = Array.from(formData.entries())
      .filter(([key]) => key.startsWith("ingredient_"))
      .map(([key, value]) => ({
        ingredientId: value as string,
        quantity: parseFloat(
          formData.get(`quantity_${key.split("_")[1]}`) as string,
        ),
      }));

    if (!name || ingredients.length === 0) {
      return {
        success: false,
        error: "Имя и хотя бы один ингредиент обязательны",
      };
    }

    const recipe = await prisma.recipe.create({
      data: {
        name,
        description,
        imageUrl,
        ingredients: {
          create: ingredients.map(({ ingredientId, quantity }) => ({
            ingredient: { connect: { id: ingredientId } },
            quantity,
          })),
        },
      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    return { success: true, recipe };
  } catch (error) {
    console.error("Error creating recipe:", error);
    return { success: false, error: "Ошибка при создании рецепта" };
  }
}

export async function updateRecipe(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const imageUrl = formData.get("imageUrl") as string | null;
    const ingredients = Array.from(formData.entries())
      .filter(([key]) => key.startsWith("ingredient_"))
      .map(([key, value]) => ({
        ingredientId: value as string,
        quantity: parseFloat(
          formData.get(`quantity_${key.split("_")[1]}`) as string,
        ),
      }));

    if (!name || ingredients.length === 0) {
      return {
        success: false,
        error: "Имя и хотя бы один ингредиент обязательны",
      };
    }

    const recipe = await prisma.recipe.update({
      where: { id },
      data: {
        name,
        description,
        imageUrl,
        ingredients: {
          deleteMany: {},
          create: ingredients.map(({ ingredientId, quantity }) => ({
            ingredient: { connect: { id: ingredientId } },
            quantity,
          })),
        },
      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    return { success: true, recipe };
  } catch (error) {
    console.error("Error updating recipe:", error);
    return { success: false, error: "Ошибка при обновлении рецепта" };
  }
}

export async function deleteRecipe(id: string) {
  try {
    await prisma.recipeIngredient.deleteMany({
      where: { recipeId: id },
    });

    await prisma.recipe.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return { success: false, error: "Ошибка при удалении рецепта" };
  }
}
