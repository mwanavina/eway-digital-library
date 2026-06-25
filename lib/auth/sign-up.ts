"use client";

import { authClient } from "@/lib/auth-client";

function nameFromEmail(email: string) {
  const local = email.split("@")[0] ?? "Student";
  return local.replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getDefaultRole(email: string) {
  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return adminEmails.includes(email.toLowerCase()) ? "admin" : "user";
}

export async function signUp(email: string, password: string, fullName?: string) {
  const name = fullName?.trim() || nameFromEmail(email);
  const response = await authClient.signUp.email({
    email,
    password,
    name,
    callbackURL: "/sign-in",
  });

  if (!response.error && response.data?.user?.id) {
    const role = getDefaultRole(email);
    await fetch("/api/auth/signup-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: response.data.user.id, name, role, email }),
    });
  }

  return response;
}

export async function resendVerificationEmail(email: string) {
  return authClient.sendVerificationEmail({
    email,
    callbackURL: "/sign-in",
  });
}
