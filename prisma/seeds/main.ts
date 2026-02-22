import prisma from "@/src/utils/prisma";
import generateUsers from "./000_users";
import generateIngredients from "./001_ingredients";

async function main() {
  try {
    await generateUsers(100);
    await generateIngredients(100);
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
