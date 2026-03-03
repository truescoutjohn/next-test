"use server";
import prisma from "../utils/prisma";

export const applyFiltersAction = async (formData: FormData) => {
  try {
    const searchQuery = formData.get("searchQuery") as string;
    const recipes = await prisma.recipe.findMany({
      where: {
        name: {
          contains: searchQuery,
          mode: "insensitive",
        },
        description: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
    });

    return { success: true, recipes };
  } catch (e) {
    return { success: false, errors: e };
  }
};
