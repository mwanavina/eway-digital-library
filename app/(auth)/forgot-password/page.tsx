import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <div className="space-y-3 text-center">
        <h1 className="text-xl font-semibold">Forgot password</h1>
        <p className="text-sm text-muted-foreground">
          Password reset is not configured yet. Contact your library administrator
          for help accessing your account.
        </p>
        <Button asChild variant="outline">
          <Link href="/sign-in">Back to Sign In</Link>
        </Button>
      </div>
    </AuthShell>
  );
}
