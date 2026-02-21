// "use client";

// import RecipeForm from "@/src/forms/recipe.form";
// import { useRecipeStore } from "@/src/store/recipe.store";
// import { IRecipe } from "@/src/types/recipe";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";

// const EditRecipePage = () => {
//   const { id } = useParams<{ id: string }>();
//   const { recipes, isLoading, error } = useRecipeStore();
//   const [recipe, setRecipe] = useState<IRecipe | null>(null);
//   const [hasSearched, setHasSearched] = useState(false);

//   useEffect(() => {
//     if (recipes.length > 0 || error) {
//       const foundRecipe = recipes.find((r) => r.id === id);
//       setRecipe(foundRecipe || null);
//       setHasSearched(true);
//     }
//   }, [recipes, id, error]);

//   if (isLoading) return <p className="text-center">Загрузка...</p>;
//   if (error) return <p className="text-red-500 text-center">{error}</p>;

//   if (hasSearched && !recipe) {
//     return <p className="text-red-500 text-center">Рецепт не найден</p>;
//   }

//   if (recipe) {
//     return (
//       <div className="container mx-auto p-4">
//         <h1 className="text-3xl font-bold mb-4">
//           Редактировать рецепт: {recipe.name}
//         </h1>
//         <RecipeForm initialRecipe={recipe} />
//       </div>
//     );
//   }

//   return <p className="text-center">Загрузка...</p>;
// };

// export default EditRecipePage;
"use client";

import RecipeForm from "@/src/forms/recipe.form";
import { useRecipeStore } from "@/src/store/recipe.store";
import { useParams } from "next/navigation";
import { useMemo } from "react";

const EditRecipePage = () => {
  // Получаем ID из URL
  const params = useParams();
  const id = params?.id as string;

  // Достаем данные из Zustand (или другого стора)
  const { recipes, isLoading, error } = useRecipeStore();

  /**
   * ВЫЧИСЛЯЕМОЕ СОСТОЯНИЕ (Derived State)
   * Вместо useEffect и useState, мы находим рецепт прямо здесь.
   * useMemo необязателен, если список рецептов небольшой,
   * но полезен для оптимизации при огромных массивах.
   */
  const recipe = useMemo(() => {
    return recipes.find((r) => r.id === id) || null;
  }, [recipes, id]);

  // Логика отображения
  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <p className="animate-pulse">Загрузка данных...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-500 bg-red-50 p-4 rounded-md border border-red-200">
          Ошибка: {error}
        </p>
      </div>
    );
  }

  // Если загрузка завершена, а рецепт не найден
  if (!recipe) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-gray-500">Рецепт с ID `{id}` не найден.</p>
      </div>
    );
  }

  // Если всё хорошо — рендерим форму
  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Редактировать рецепт:{" "}
          <span className="text-blue-600">{recipe.name}</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">ID: {id}</p>
      </header>

      <div className="bg-white shadow-sm border rounded-lg p-6">
        <RecipeForm initialRecipe={recipe} />
      </div>
    </div>
  );
};

export default EditRecipePage;
