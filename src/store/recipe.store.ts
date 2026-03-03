import {
  createRecipe,
  deleteRecipe,
  getRecipes,
  updateRecipe,
} from "../actions/recipe";
import { IFilters } from "../types/filters";
import { IRecipe } from "../types/recipe";
import { create } from "zustand";

interface IActionResult {
  success: boolean;
  recipe?: IRecipe;
  error?: string;
}

interface IRecipeState {
  recipes: IRecipe[];
  filters: IFilters;
  isLoading: boolean;
  error: string | null;
  setFilters: (key: string, value: string) => void;
  loadRecipes: (amount: number, skip: number) => Promise<IRecipe[] | null>;
  addRecipe: (formData: FormData) => Promise<IActionResult>;
  updateRecipe: (id: string, formData: FormData) => Promise<IActionResult>;
  removeRecipe: (id: string) => Promise<void>;
}

export const useRecipeStore = create<IRecipeState>((set, get) => ({
  recipes: [],
  filters: {
    searchQuery: "",
    dateFrom: "",
    dateTo: "",
    unit: "",
    category: "",
  },
  isLoading: false,
  error: null,
  setFilters: (key: string, value: string) => {
    set((prev) => ({ filters: { ...prev.filters, [key]: value } }));
    // get().loadRecipes(6, 0);
  },
  loadRecipes: async (take: number, skip: number) => {
    if (get().isLoading) return null;

    const { filters } = get();
    console.log(filters);
    set({ isLoading: true });

    try {
      const result = await getRecipes(take, skip, filters);
      const newRecipes = result.recipes || [];

      set((state) => {
        if (skip === 0) {
          return { recipes: newRecipes, isLoading: false };
        }

        const existingIds = new Set(state.recipes.map((r) => r.id));
        const filteredNew = newRecipes.filter((r) => !existingIds.has(r.id));

        return {
          recipes: [...state.recipes, ...filteredNew],
          isLoading: false,
        };
      });

      return newRecipes;
    } catch (error) {
      console.error("Error loading recipes:", error);
      set({ error: "Ошибка при загрузке", isLoading: false });
      return null;
    }
  },
  addRecipe: async (formData: FormData) => {
    set({ error: null });

    try {
      const result = await createRecipe(formData);
      if (result.success) {
        set((state) => ({
          recipes: [...state.recipes, result.recipe!],
          isLoading: false,
        }));
        return { success: true, recipe: result.recipe };
      } else {
        set({ error: result.error, isLoading: false });
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("error", error);
      set({ error: "Ошибка при добавлении рецепта", isLoading: false });
      return { success: false, error: "Ошибка при добавлении рецепта" };
    }
  },
  updateRecipe: async (id: string, formData: FormData) => {
    set({ error: null });

    try {
      const result = await updateRecipe(id, formData);
      if (result.success) {
        set((state) => ({
          recipes: state.recipes.map((recipe) =>
            recipe.id === id ? result.recipe! : recipe,
          ),
          isLoading: false,
        }));
        return { success: true, recipe: result.recipe };
      } else {
        set({ error: result.error, isLoading: false });
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("error", error);
      set({ error: "Ошибка при обновлении рецепта", isLoading: false });
      return { success: false, error: "Ошибка при обновлении рецепта" };
    }
  },
  removeRecipe: async (id: string) => {
    set({ error: null });

    try {
      const result = await deleteRecipe(id);

      if (result.success) {
        set((state) => ({
          recipes: state.recipes.filter((recipe) => recipe.id !== id),
          isLoading: false,
        }));
      } else {
        set({ error: result.error, isLoading: false });
      }
    } catch (error) {
      console.error("error", error);
      set({ error: "Ошибка при удалении рецепта", isLoading: false });
    }
  },
}));
