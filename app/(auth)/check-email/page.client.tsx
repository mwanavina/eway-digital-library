"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { resendVerificationEmail } from "@/lib/auth/sign-up";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CheckEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleResend() {
    if (!email) {
      setError("Enter your email on the sign-up page first.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    const { error: resendError } = await resendVerificationEmail(email);
    setLoading(false);

    if (resendError) {
      setError(resendError.message ?? "Could not resend verification email.");
      return;
    }

    setMessage("Verification email sent. Check your inbox.");
  }

  return (
    <AuthShell>
      <div className="space-y-4 text-center">
        <h1 className="text-xl font-semibold text-foreground">Check your email</h1>
        <p className="text-sm text-muted-foreground">
          We sent a verification link{email ? ` to ${email}` : ""}. Open it to activate
          your account, then sign in to complete your profile.
        </p>

        {message && (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleResend}
            disabled={loading || !email}
          >
            {loading ? "Sending…" : "Resend verification email"}
          </Button>
          <Button asChild>
            <Link href="/sign-in">Go to Sign In</Link>
          </Button>
        </div>
      </div>
    </AuthShell>
  );
}
