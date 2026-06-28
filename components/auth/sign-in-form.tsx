"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signIn } from "@/app/actions/auth";
import {
  signInSchema,
  type SignInSchema,
} from "@/lib/validations/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function SignInForm() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInSchema) {
    setError(null);
    setLoading(true);

    const formData = new FormData();

    formData.append("email", values.email);
    formData.append("password", values.password);

    const result = await signIn(formData);

    setLoading(false);

    if (!result.success) {
      const message = result.error;

      if (message.toLowerCase().includes("verify")) {
        router.push(
          `/check-email?email=${encodeURIComponent(values.email)}`
        );
        return;
      }

      setError(message);
      return;
    }

    const profileResponse = await fetch("/api/onboarding");

    if (profileResponse.ok) {
      const data = await profileResponse.json();

      router.push(
        data.profile?.onboardingCompleted
          ? "/"
          : "/onboarding"
      );
    } else {
      router.push("/onboarding");
    }

    router.refresh();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-wider">
                Email
              </FormLabel>

              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="h-11 bg-muted"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-wider">
                Password
              </FormLabel>

              <FormControl>
                <Input
                  type="password"
                  placeholder="Your password"
                  autoComplete="current-password"
                  className="h-11 bg-muted"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <p className="-mt-1 text-right text-xs">
          <Link
            href="/forgot-password"
            className="text-muted-foreground hover:text-primary"
          >
            Forgot password?
          </Link>
        </p>

        <Button
          type="submit"
          className="h-11 font-bold"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Log In"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-primary hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </Form>
  );
}