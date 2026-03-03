"use client";

import { useRecipeStore } from "../../../store/recipe.store";
import { useEffect, useRef, useEffectEvent, useState } from "react";
import { useInView } from "react-intersection-observer";
import { IRecipe } from "@/src/types/recipe";
import RecipeCard from "../../common/recipe-card";
import { motion } from "framer-motion";
import { Spinner } from "@heroui/react";

export default function RecipeFeed({
  initialRecipes,
}: {
  initialRecipes: IRecipe[];
}) {
  const IMAGE_PER_PAGE = 6;
  const IMAGE_PER_PAGE_MOBILE = 4;
  const MOBILE_SCREEN_WIDTH = 768;
  const { recipes, isLoading, loadRecipes } = useRecipeStore();
  const [skip, setSkip] = useState(initialRecipes.length);
  const [hasMore, setHasMore] = useState(
    initialRecipes.length >= IMAGE_PER_PAGE,
  );
  const [initialLoadCount, setInitialLoadCount] = useState(IMAGE_PER_PAGE);
  const isFetching = useRef(false);

  useEffect(() => {
    if (useRecipeStore.getState().recipes.length === 0) {
      useRecipeStore.setState({ recipes: initialRecipes });
    }
  }, [initialRecipes]);

  const { ref, inView } = useInView({ threshold: 0.1, rootMargin: "800px" });

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      isFetching.current = true;
      loadRecipes(IMAGE_PER_PAGE, skip).then((res) => {
        if (!res || res.length < IMAGE_PER_PAGE) setHasMore(false);
        setSkip((prev) => prev + IMAGE_PER_PAGE);
        isFetching.current = false;
      });
    }
  }, [inView, hasMore, isLoading, skip]);

  const updateInitialLoadCount = useEffectEvent((number: number) => {
    setInitialLoadCount(number);
  });

  useEffect(() => {
    const isMobile = window.innerWidth < MOBILE_SCREEN_WIDTH;
    updateInitialLoadCount(isMobile ? IMAGE_PER_PAGE_MOBILE : IMAGE_PER_PAGE);
  }, []);

  const allRecipes = recipes.length > 0 ? recipes : initialRecipes;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allRecipes.map((recipe, index) => (
          <motion.div
            key={recipe.id}
            initial={index < initialLoadCount ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,

              delay: index * 0.1,
            }}
          >
            <RecipeCard recipe={recipe} isPriority={index < initialLoadCount} />
          </motion.div>
        ))}
        {isLoading && (
          <>
            <div className="h-[480px] w-full bg-gray-100 animate-pulse rounded-xl" />
            <div className="h-[480px] w-full bg-gray-100 animate-pulse rounded-xl" />
            <div className="h-[480px] w-full bg-gray-100 animate-pulse rounded-xl" />
            <div className="h-[480px] w-full bg-gray-100 animate-pulse rounded-xl" />
          </>
        )}
      </div>
      {hasMore && (
        <div ref={ref} className="w-full py-10 flex justify-center ">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2">
              <Spinner size="lg" color="primary" labelColor="primary" />
              <span className="text-gray-500 text-sm">
                Загружаем вкусняшки...
              </span>
            </div>
          ) : (
            <div className="h-10" />
          )}
        </div>
      )}
    </>
  );
}
