import { z } from "zod";

export const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters.")
    .max(100, "Full name is too long."),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Password is too long."),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),

  password: z
    .string()
    .min(1, "Password is required."),
});

export type SignInSchema = z.infer<typeof signInSchema>;