"use client";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useInView } from "react-intersection-observer";
import { useAuthStore } from "../store/auth.store";
import { useIngredientStore } from "../store/ingredient.store";
import { useRecipeStore } from "../store/recipe.store";

interface IProps {
  children: React.ReactNode;
}

const AppLoader = ({ children }: IProps) => {
  const { data: session, status } = useSession();
  const { setAuthState, isAuth } = useAuthStore();
  const { loadIngredients } = useIngredientStore();
  const { recipes, loadRecipes, isLoading } = useRecipeStore();
  console.log(isLoading);
  const [skip, setSkip] = useState(0);
  // const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    setAuthState(status, session);
  }, [status, session]);

  useEffect(() => {
    if (isAuth) {
      loadIngredients("");
    }
  }, [isAuth]);

  const fetchRecipes = useCallback(async () => {
    if (isLoading || !hasMore) return;

    // setLoading(true);
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
      // setLoading(false);
    }
  }, [skip, hasMore, loadRecipes]);

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      fetchRecipes();
    }
  }, [inView]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">{children}</main>
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
    </div>
  );
};

export default AppLoader;
