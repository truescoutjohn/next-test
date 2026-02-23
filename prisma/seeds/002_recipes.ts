import prisma from "@/src/utils/prisma";
import { faker } from "@faker-js/faker";

const generateRecipes = async (number: number) => {
  const allIngredients = await prisma.ingredient.findMany();

  const getRandomIngredients = (amount: number) => {
    return allIngredients.sort(() => 0.5 - Math.random()).slice(0, amount);
  };

  const recipes = Array.from({ length: number }).map(() => {
    const randomCount = Math.floor(Math.random() * 6) + 3;

    return {
      name: faker.food.dish(),
      description: faker.lorem.paragraph(),
      imageUrl: faker.image.url(),
      ingredients: getRandomIngredients(randomCount).map((ingredient) => ({
        ...ingredient,
        quantity: faker.number.float({ min: 0.1, max: 10, multipleOf: 0.1 }),
      })),
    };
  });

  recipes.forEach(
    async (recipe) =>
      await prisma.recipe.create({
        data: {
          name: recipe.name,
          description: recipe.description,
          imageUrl: recipe.imageUrl,
          ingredients: {
            create: recipe.ingredients.map((item) => ({
              quantity: item.quantity,
              ingredient: {
                connect: { id: item.id },
              },
            })),
          },
        },
      }),
  );
};

export default generateRecipes;
