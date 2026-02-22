import { Category, Unit } from "@/src/generated/prisma";
import prisma from "@/src/utils/prisma";
import { faker } from "@faker-js/faker";
export interface IIngredient {
  id: string;
  name: string;
  category: string;
  unit: string;
  pricePerUnit: number | null;
  description: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const generateIngredients = async (number: number) => {
  const ingredients = Array.from({ length: number }, () => ({
    name: faker.food.ingredient(),
    category: faker.helpers.arrayElement([
      Category.VEGETABLES,
      Category.FRUITS,
      Category.DAIRY,
      Category.MEAT,
      Category.SPICES,
    ]),
    unit: faker.helpers.arrayElement([
      Unit.GRAMS,
      Unit.LITERS,
      Unit.MILLILETERS,
      Unit.PIECES,
      Unit.KILOGRAMS,
    ]),
    pricePerUnit: faker.number.float({ min: 0.5, max: 50, fractionDigits: 2 }),
    description: faker.commerce.productDescription(), // Или faker.lorem.sentence()
    createdAt: faker.date.past(),
    updatedAt: new Date(),
  }));

  ingredients.forEach(
    async (ingredient) =>
      await prisma.ingredient.create({
        data: { ...ingredient },
      }),
  );
};

export default generateIngredients;
