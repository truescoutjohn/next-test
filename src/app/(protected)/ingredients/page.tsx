import IngredientsTable from "../../../components/UI/tables/ingredients";
import IngredientForm from "../../../forms/ingredients.form";

const Ingredients = () => {
  return (
    <div className="max-w-[1024px] w-full mx-auto px-[24px] py-4">
      <IngredientForm />
      <IngredientsTable />
    </div>
  );
};

export default Ingredients;
