"use client";

import { useRecipeStore } from "../../../store/recipe.store";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { IRecipe } from "@/src/types/recipe";
import RecipeCard from "../../common/recipe-card";
import { motion } from "framer-motion";

export default function RecipeFeed({
  initialRecipes,
}: {
  initialRecipes: IRecipe[];
}) {
  const { recipes, isLoading, loadRecipes } = useRecipeStore();
  const [skip, setSkip] = useState(initialRecipes.length);
  const [hasMore, setHasMore] = useState(initialRecipes.length >= 6);
  const MOBILE_SCREEN_WIDTH = 768;
  const IMAGE_PER_PAGE = 6;
  const IMAGE_PER_PAGE_MOBILE = 4;
  const isMobile = window.innerWidth < MOBILE_SCREEN_WIDTH;
  const initialLoadCount = isMobile ? IMAGE_PER_PAGE_MOBILE : IMAGE_PER_PAGE;

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
          <RecipeCard recipe={recipe} isPriority={index < initialLoadCount} />
        </motion.div>
      ))}
      {hasMore && <div ref={ref} className="h-10 w-full" />}
    </div>
  );
}
