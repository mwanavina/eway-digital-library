"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { signInSchema, signUpSchema } from "@/lib/validations/auth";

export async function signUp(formData: FormData) {
  try {
    const parsed = signUpSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      return {
        success: false as const,
        error: parsed.error.issues[0]?.message ?? "Invalid form data.",
      };
    }

    const { name, email, password } = parsed.data;

    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
      headers: await headers(),
    });

    return {
      success: true as const,
      email,
    };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Unable to create account.",
    };
  }
}

export async function signIn(formData: FormData) {
  try {
    const parsed = signInSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      return {
        success: false as const,
        error: parsed.error.issues[0]?.message ?? "Invalid form data.",
      };
    }

    const { email, password } = parsed.data;

    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(),
    });

    return {
      success: true as const,
    };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Unable to sign in.",
    };
  }
}

export async function signOut() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });

    return {
      success: true as const,
    };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Unable to sign out.",
    };
  }
}