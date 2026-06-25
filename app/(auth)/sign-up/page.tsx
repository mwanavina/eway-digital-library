import { AuthShell } from "@/components/auth/auth-shell";
import { AuthTabs } from "@/components/auth/auth-tabs";
import { SignUpForm } from "@/components/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <AuthShell>
      <AuthTabs />
      <SignUpForm />
    </AuthShell>
  );
}
