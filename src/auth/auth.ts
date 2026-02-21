import NextAuth from "next-auth";
import { ZodError } from "zod";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getUserFromDb } from "../utils/user";
import { signInSchema } from "../schema/zod";
import bcryptjs from "bcryptjs";
import prisma from "../utils/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email и пароль обязательны");
          }

          const { email, password } =
            await signInSchema.parseAsync(credentials);

          // logic to verify if the user exists
          const user = await getUserFromDb(email);

          if (!user) {
            throw new Error("Неверный ввод данных");
          }

          const isPasswordValid = await bcryptjs.compare(
            password,
            user.password,
          );

          if (!isPasswordValid) {
            throw new Error("Неверный ввод данных");
          }

          return { id: user.id, email: user.email };
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null;
          }
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 3600,
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
});
