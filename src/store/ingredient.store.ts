import { create } from "zustand";
import { IIngredient } from "../types/ingredients";
import {
  createIngredient,
  deleteIngredient,
  getIngredients,
} from "../actions/ingredients";

interface IngredientState {
  ingredients: IIngredient[];
  isLoading: boolean;
  error: string | null;
  loadIngredients: (searchString: string) => Promise<void>;
  addIngredient: (formData: FormData) => Promise<void>;
  removeIngredient: (id: string) => Promise<void>;
}

export const useIngredientStore = create<IngredientState>((set) => ({
  ingredients: [],
  isLoading: false,
  error: null,
  loadIngredients: async (searchString: string = "") => {
    set({ isLoading: true, error: null });
    try {
      const response = await getIngredients(searchString);

      if (response.success) {
        set({ ingredients: response.ingredients, isLoading: false });
      } else {
        set({ error: response.error, isLoading: false });
      }
    } catch {
      set({ error: "Ошибка при загрузке ингредиентов", isLoading: false });
    }
  },
  addIngredient: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await createIngredient(formData);

      if (response.success) {
        set((state) => ({
          ingredients: [...state.ingredients, response.ingredientsasd],
          isloading: false,
        }));
      } else {
        set({ error: response.error, isLoading: false });
      }
    } catch {
      set({ error: "Ошибка при добавлении ингредиента", isLoading: false });
    }
  },
  removeIngredient: async (id: string) => {
    // Реализуйте логику удаления ингредиента, используя deleteIngredient
    set({ isLoading: true, error: null });

    try {
      const response = await deleteIngredient(id);

      if (response.success) {
        set((state) => ({
          ingredients: state.ingredients.filter(
            (ingredient) => ingredient.id !== id,
          ),
          isLoading: false,
        }));
      } else {
        set({ error: response.error, isLoading: false });
      }
    } catch {
      set({ error: "Ошибка при удалении ингредиента", isLoading: false });
    }
  },
}));
