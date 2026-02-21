import { number, object, string } from "zod";
import { z } from "zod";

export const signInSchema = object({
  email: string().min(1, "Email is required").email("Invalid Email"),

  password: string()
    .min(1, "Password is required")
    .min(6, "Password must be more than 6 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const ingredientsSchema = object({
  name: string().min(1, "Название обязательно"),
  category: z.enum([
    "VEGETABLES",
    "FRUITS",
    "MEAT",
    "DAIRY",
    "SPICES",
    "OTHER",
  ]),
  unit: z.enum(["GRAMS", "KILOGRAMS", "LITERS", "MILLILETERS", "PIECES"]),
  pricePerUnit: number("Цена должна быть числом")
    .min(0, "Цена должна быть положительной")
    .nullable(),
  description: z.string().optional(),
});
