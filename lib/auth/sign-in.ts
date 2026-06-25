"use client";

import { authClient } from "@/lib/auth-client";

export async function signIn(email: string, password: string) {
  return authClient.signIn.email({
    email,
    password,
    callbackURL: "/onboarding",
    rememberMe: true,
  });
}

export async function signOut() {
  return authClient.signOut();
}
