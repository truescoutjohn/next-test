import IngredientsTable from "../../../components/UI/tables/ingredients";
import IngredientForm from "../../../forms/ingredients.form";

const Ingredients = () => {
  return (
    <div>
      <IngredientForm />
      <IngredientsTable />
    </div>
  );
};

export default Ingredients;
