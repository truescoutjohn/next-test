"use client";

import RecipeForm from "@/src/forms/recipe.form";

const NewRecipePage = () => {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Добавить новый рецепт</h1>
      <RecipeForm />
    </div>
  );
};

export default NewRecipePage;
