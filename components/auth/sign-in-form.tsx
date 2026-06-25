"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth/sign-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await signIn(email, password);
    setLoading(false);

    if (signInError) {
      const message = signInError.message ?? "Could not sign in. Please try again.";
      if (message.toLowerCase().includes("verify")) {
        router.push(`/check-email?email=${encodeURIComponent(email)}`);
        return;
      }
      setError(message);
      return;
    }

    const profileResponse = await fetch("/api/onboarding");
    if (profileResponse.ok) {
      const data = await profileResponse.json();
      router.push(data.profile?.onboardingCompleted ? "/" : "/onboarding");
    } else {
      router.push("/onboarding");
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signin-email" className="text-xs uppercase tracking-wider">
          Email
        </Label>
        <Input
          id="signin-email"
          type="email"
          placeholder="Your school email…"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 bg-muted"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signin-password" className="text-xs uppercase tracking-wider">
          Password
        </Label>
        <Input
          id="signin-password"
          type="password"
          placeholder="Your password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-11 bg-muted"
        />
      </div>

      <p className="-mt-1 text-right text-xs">
        <Link href="/forgot-password" className="text-muted-foreground hover:text-primary">
          Forgot password?
        </Link>
      </p>

      <Button type="submit" className="h-11 font-bold" disabled={loading}>
        {loading ? "Signing in…" : "Log In"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-semibold text-primary hover:underline">
          Sign Up
        </Link>
      </p>
    </form>
  );
}
