"use client";

import { getIngredients } from "@/src/actions/ingredients";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { IIngredient } from "@/src/types/ingredients";

const IngredientSelect = () => {
  const [filterText, setFilterText] = useState("");
  const [ingredients, setIngredients] = useState<IIngredient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);
  console.log(filterText);
  const inputChangeHandler = (value: string) => {
    setIsLoading(true);
    setFilterText(value);

    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(async () => {
      const result = await getIngredients(value);
      setIngredients(result.ingredients || []);
      setIsLoading(false);
    }, 300);
  };

  useEffect(() => {
    (async () => {
      const result = await getIngredients("");
      setIngredients(result.ingredients || []);
    })();
  }, []);

  return (
    <Autocomplete
      items={ingredients}
      isLoading={isLoading}
      inputValue={filterText}
      onInputChange={inputChangeHandler}
      placeholder="Поиск ингредиентов"
      aria-label="Поиск ингредиентов"
      size="md"
      variant="flat"
      classNames={{
        base: "max-w-full",
        listbox: "h-10 min-h-10 bg-default-100",
      }}
    >
      {(item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
    </Autocomplete>
  );
};

export default IngredientSelect;
