"use client";

import { getIngredients } from "@/src/actions/ingredients";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { IIngredient } from "@/src/types/ingredients";

interface IngredientSelectProps {
  name: string;
  value: string;
  onChange: (id: string) => void;
}

const IngredientSelect = ({ name, value, onChange }: IngredientSelectProps) => {
  const [filterText, setFilterText] = useState("");
  const [ingredients, setIngredients] = useState<IIngredient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const inputChangeHandler = (val: string) => {
    setIsLoading(true);
    setFilterText(val);

    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(async () => {
      const result = await getIngredients(val);
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

  useEffect(() => {
    if (!value) return;
    const current = ingredients.find((ing) => ing.id === value);
    if (current) {
      setFilterText(current.name);
    }
  }, [value, ingredients]);

  return (
    <>
      <Autocomplete
        items={ingredients}
        isLoading={isLoading}
        inputValue={filterText}
        onInputChange={inputChangeHandler}
        selectedKey={value || undefined}
        onSelectionChange={(key) => {
          const id = key ? String(key) : "";
          onChange(id);
          const current = ingredients.find((ing) => ing.id === id);
          if (current) {
            setFilterText(current.name);
          }
        }}
        placeholder="Поиск ингредиентов"
        aria-label="Поиск ингредиентов"
        size="md"
        variant="flat"
        classNames={{
          base: "max-w-full",
          listbox: "h-10 min-h-10 bg-default-100",
        }}
      >
        {(item) => (
          <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
        )}
      </Autocomplete>
      <input type="hidden" name={name} value={value} />
    </>
  );
};

export default IngredientSelect;
