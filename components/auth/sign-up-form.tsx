"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signUp } from "@/app/actions/auth";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  signUpSchema,
  type SignUpSchema,
} from "@/lib/validations/auth";

export function SignUpForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignUpSchema) {
    setError(null);

    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);

    startTransition(async () => {
      const result = await signUp(formData);

      if (!result.success) {
        setError(result.error ?? "Unable to create account.");
        return;
      }

      router.push(`/check-email?email=${encodeURIComponent(result.email)}`);
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-wider">
                Full Name
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="Enter your full name"
                  autoComplete="name"
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-wider">
                Email
              </FormLabel>

              <FormControl>
                <Input
                  type="email"
                  placeholder="Use school email only..."
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
                  placeholder="Create a password"
                  autoComplete="new-password"
                  className="h-11 bg-muted"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isPending}
          className="h-11 font-bold"
        >
          {isPending ? "Creating account..." : "Sign Up"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-primary hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </Form>
  );
}