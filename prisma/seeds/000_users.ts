import prisma from "@/src/utils/prisma";
import { saltAndHashPassword } from "@/src/utils/password";
import { faker } from "@faker-js/faker";

const generateUsers = async (number: number) => {
  const password = await saltAndHashPassword("password123");
  const users = Array.from({ length: number }, () => ({
    email: faker.internet.email(),
    password,
  }));

  users.forEach(
    async (user) =>
      await prisma.user.create({
        data: { email: user.email, password: user.password },
      }),
  );
};

export default generateUsers;
