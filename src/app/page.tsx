import { getRecipes } from "@/src/actions/recipe";
import RecipeFeed from "../components/UI/feed/recipes";
import FilterPanel from "../forms/filters-panel.form";

export default async function Home() {
  const result = await getRecipes(6, 0);
  const initialRecipes = result.success ? result.recipes : [];

  return (
    <main className="w-full max-w-[1024px] mx-auto px-6">
      <FilterPanel />
      <RecipeFeed initialRecipes={initialRecipes ?? []} />
    </main>
  );
}
