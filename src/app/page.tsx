import { getRecipes } from "@/src/actions/recipe";
import RecipeFeed from "../components/UI/feed/recipes";
import { Button } from "@heroui/button";
import Link from "next/link";

export default async function Home() {
  const result = await getRecipes(6, 0);
  const initialRecipes = result.success ? result.recipes : [];

  return (
    <main className="max-w-[1024px] mx-auto px-6">
      <div className="flex justify-center mb-4">
        <Link href="/recipes/new">
          <Button color="primary">Добавить рецепт</Button>
        </Link>
      </div>

      <RecipeFeed initialRecipes={initialRecipes ?? []} />
    </main>
  );
}
