"use client";

import { CATEGORY_OPTIONS, UNIT_OPTIONS } from "../constants/select-options";
import { Input, Select, SelectItem, Button, Form } from "@heroui/react";
import { SearchIcon, FilterIcon } from "lucide-react";
import { useRecipeStore } from "../store/recipe.store";

export default function FilterPanel() {
  const { filters, setFilters, loadRecipes } = useRecipeStore();

  const submitHandler = () => {
    loadRecipes(6, 0);
  };

  return (
    <Form
      className="sticky top-[69px] z-100 w-full max-w-[1024px] mb-12 p-6 bg-primary-100 rounded-2xl shadow-medium "
      onSubmit={(e) => {
        e.preventDefault();
        submitHandler();
      }}
    >
      <Input
        isClearable
        fullWidth
        classNames={{
          inputWrapper: "h-12",
        }}
        placeholder="Поиск рецептов..."
        startContent={<SearchIcon className="text-default-400" size={20} />}
        type="search"
        value={filters.searchQuery ?? ""}
        onChange={(event) => setFilters("searchQuery", event.target.value)}
        onClear={() => setFilters("searchQuery", "")}
      />

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Date from"
          labelPlacement="outside"
          placeholder="ДД.ММ.ГГГГ"
          type="date"
          value={filters.dateFrom ?? ""}
          onChange={(event) => setFilters("dateFrom", event.target.value)}
        />

        <Input
          label="Date to"
          labelPlacement="outside"
          placeholder="ДД.ММ.ГГГГ"
          type="date"
          value={filters.dateTo ?? ""}
          onChange={(event) => setFilters("dateTo", event.target.value)}
        />

        <Select
          label="Units"
          labelPlacement="outside"
          placeholder="Все единицы измерения"
          items={Array.from(UNIT_OPTIONS)}
          selectedKeys={filters.unit ? [filters.unit] : []}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            setFilters("unit", value || "");
          }}
        >
          {UNIT_OPTIONS.map((unit) => (
            <SelectItem key={unit.value} textValue={unit.label}>
              {unit.label}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Category"
          labelPlacement="outside"
          placeholder="Все категории"
          items={Array.from(CATEGORY_OPTIONS)}
          selectedKeys={new Set(filters.category ? [filters.category] : [])}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            setFilters("category", value || "");
          }}
        >
          {CATEGORY_OPTIONS.map((category) => (
            <SelectItem key={category.value} textValue={category.label}>
              {category.label}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div className="flex justify-end mt-2">
        <Button
          color="primary"
          startContent={<FilterIcon size={18} />}
          type="submit"
        >
          Применить фильтры
        </Button>
      </div>
    </Form>
  );
}
