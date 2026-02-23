"use client";

import { Skeleton } from "@heroui/react";
import { motion } from "framer-motion";
import RecipeCard from "../components/common/recipe-card";
import { useRecipeStore } from "../store/recipe.store";
import { Button } from "@heroui/react";
import Link from "next/link";
import { useEffect, useCallback, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function Home() {
  const { recipes, isLoading, error, loadRecipes } = useRecipeStore();
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  const fetchRecipes = useCallback(async () => {
    if (isLoading || !hasMore) return;

    try {
      const take = 6;
      const newRecipes = await loadRecipes(take, skip);

      if (newRecipes && newRecipes.length < take) {
        setHasMore(false);
      }

      setSkip((prev) => prev + take);
    } catch (error) {
      console.error("Ошибка при загрузке рецептов:", error);
    } finally {
    }
  }, [skip, hasMore, loadRecipes]);

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      fetchRecipes();
    }
  }, [inView]);

  return (
    <>
      <div className="flex w-full justify-center items-center mb-4">
        <Link href="/recipes/new">
          <Button color="primary">Добавить рецепт</Button>
        </Link>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="max-w-[1024px] w-full mx-auto px-[24px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="rounded-lg h-[480px]">
                <div className="h-64 w-full" />
              </Skeleton>
            ))
          : recipes.map((recipe, index) => (
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
      </div>
      {hasMore && (
        <div ref={ref} className="w-full">
          {isLoading && (
            <div className="flex items-center gap-2">
              <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
            </div>
          )}
        </div>
      )}

      {!hasMore && recipes.length > 0 && (
        <div className="py-10 text-center text-gray-400">
          Вы посмотрели все доступные рецепты 👨‍🍳
        </div>
      )}
    </>
  );
}
