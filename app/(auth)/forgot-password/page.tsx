"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const redirectTo = `${window.location.origin}/reset-password`;

    const response = await authClient.requestPasswordReset({
      email,
      redirectTo,
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
      setError("We couldn’t send a reset link. Please try again.");
      return;
    }

    setMessage("Check your email for password reset instructions.");
    setEmail("");
  };

  return (
    <AuthShell>
      <div className="space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold">Forgot password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we’ll send you a secure link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-left">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="h-11 bg-muted"
          />

          <Button type="submit" className="h-11 w-full" disabled={loading}>
            {loading ? "Sending..." : "Send reset link"}
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
