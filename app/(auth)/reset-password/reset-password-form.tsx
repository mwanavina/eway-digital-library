"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("This reset link is invalid or has expired.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const response = await authClient.resetPassword({
      newPassword: password,
      token,
    });

    setLoading(false);

    const payload =
      response && typeof response === "object" && "data" in response
        ? response.data
        : response;

    const isSuccess =
      !!payload &&
      typeof payload === "object" &&
      payload !== null &&
      "status" in payload &&
      payload.status === true;

    if (!isSuccess) {
      setError("We couldn’t reset your password. Please request a new link.");
      return;
    }

    setMessage("Password reset successfully. Redirecting to sign in...");
    window.setTimeout(() => router.push("/sign-in"), 1500);
  };

  if (!token) {
    return (
      <AuthShell>
        <div className="space-y-3 text-center">
          <h1 className="text-xl font-semibold">Reset password</h1>
          <p className="text-sm text-muted-foreground">
            This reset link is invalid or has expired. Please request a new one.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/forgot-password">Request new link</Link>
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold">Reset password</h1>
          <p className="text-sm text-muted-foreground">
            Choose a new password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-left">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            required
            className="h-11 bg-muted"
          />

          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            className="h-11 bg-muted"
          />

          <Button type="submit" className="h-11 w-full" disabled={loading}>
            {loading ? "Resetting..." : "Reset password"}
          </Button>
        </form>

        {message ? (
          <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
        ) : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button asChild variant="outline" className="w-full">
          <Link href="/sign-in">Back to Sign In</Link>
        </Button>
      </div>
    </AuthShell>
  );
}
