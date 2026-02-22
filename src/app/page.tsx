"use client";

import { Skeleton } from "@heroui/react";
import { motion } from "framer-motion";
import RecipeCard from "../components/common/recipe-card";
import { useRecipeStore } from "../store/recipe.store";
import { Button } from "@heroui/react";
import Link from "next/link";

export default function Home() {
  const { recipes, isLoading, error } = useRecipeStore();

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
              <Skeleton key={index} className="rounded-lg">
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
                <RecipeCard recipe={recipe} />
              </motion.div>
            ))}
      </div>
    </>
  );
}
