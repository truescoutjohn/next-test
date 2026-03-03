"use client";

import { CATEGORY_OPTIONS, UNIT_OPTIONS } from "../constants/select-options";
import { Input, Select, SelectItem, Button, Form } from "@heroui/react";
import { SearchIcon, FilterIcon } from "lucide-react";
import { useRecipeStore } from "../store/recipe.store";

// interface FormData {
//   searchQuery: string;
//   dateFrom: string;
//   dateTo: string;
//   unit: string;
//   category: string;
// }

export default function FilterPanel() {
  const { filters, setFilters, loadRecipes } = useRecipeStore();
  // const [formData, setFormData] = useState<FormData>({
  //   searchQuery: "",
  //   dateFrom: "",
  //   dateTo: "",
  //   unit: "",
  //   category: "",
  // });

  const submitHandler = () => {
    // setFilters("searchQuery", formData.searchQuery);
    // setFilters("dateFrom", formData.dateFrom);
    // setFilters("dateTo", formData.dateTo);
    // setFilters("unit", formData.unit);
    // setFilters("category", formData.category);
    console.log(filters);
    loadRecipes(6, 0);
  };

  return (
    <Form
      className="w-full max-w-[1024px] mb-12 p-6 bg-content rounded-2xl shadow-medium "
      action={submitHandler}
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
          placeholder={
            UNIT_OPTIONS.find((u) => u.value === filters.unit)?.label ||
            "Все единицы измерения"
          }
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            setFilters("unit", value);
          }}
          selectedKeys={filters.unit ? [filters.unit] : []}
        >
          {UNIT_OPTIONS.map((unit) => (
            <SelectItem key={unit.value}>{unit.label}</SelectItem>
          ))}
        </Select>

        <Select
          label="Category"
          labelPlacement="outside"
          placeholder={filters.category ? filters.category : "Все категории"}
          onChange={(event) => setFilters("category", event.target.value)}
          selectedKeys={filters.category ? [filters.category] : []}
        >
          {CATEGORY_OPTIONS.map((category) => (
            <SelectItem key={category.value}>{category.label}</SelectItem>
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
