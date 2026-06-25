import { AuthShell } from "@/components/auth/auth-shell";
import { AuthTabs } from "@/components/auth/auth-tabs";
import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <AuthShell>
      <AuthTabs />
      <SignInForm />
    </AuthShell>
  );
}
