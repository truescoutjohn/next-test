"use client";
// Все твои импорты: Zustand, InView, RecipeItem...
import { Skeleton } from "@heroui/react";

import { useRecipeStore } from "../../../store/recipe.store";
import { Button } from "@heroui/react";
import Link from "next/link";
import { useEffect, useCallback, useState } from "react";
import { useInView } from "react-intersection-observer";
import RecipeList from "./recipes";
import { IRecipe } from "@/src/types/recipe";
import RecipeCard from "../../common/recipe-card";
import { motion } from "framer-motion";

export default function RecipeFeed({
  initialRecipes,
}: {
  initialRecipes: IRecipe[];
}) {
  const { recipes, isLoading, loadRecipes } = useRecipeStore();
  const [skip, setSkip] = useState(initialRecipes.length); // Начинаем со смещения
  const [hasMore, setHasMore] = useState(initialRecipes.length >= 6);

  // Инициализируем стор серверными данными ОДИН раз
  useEffect(() => {
    if (useRecipeStore.getState().recipes.length === 0) {
      useRecipeStore.setState({ recipes: initialRecipes });
    }
  }, [initialRecipes]);

  const { ref, inView } = useInView({ threshold: 0.1, rootMargin: "200px" });

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadRecipes(6, skip).then((res) => {
        if (!res || res.length < 6) setHasMore(false);
        setSkip((prev) => prev + 6);
      });
    }
  }, [inView, hasMore, isLoading, skip]);

  const allRecipes = recipes.length > 0 ? recipes : initialRecipes;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {allRecipes.map((recipe, index) => (
        <motion.div
          key={recipe.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,

            delay: index * 0.1,
          }}
        >
          <RecipeCard recipe={recipe} index={index} />
        </motion.div>
      ))}
      {hasMore && <div ref={ref} className="h-10 w-full" />}
    </div>
  );
}
