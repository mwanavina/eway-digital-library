"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/app/actions/auth"; // Update this path
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function SignUpForm() {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);

	// You can keep controlled inputs or switch to uncontrolled
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);

		const formData = new FormData(event.currentTarget);

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
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			{error && (
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="signup-full-name" className="text-xs uppercase tracking-wider">
					Full Name
				</Label>
				<Input
					id="signup-full-name"
					name="name"
					type="text"
					placeholder="Enter your full name"
					autoComplete="name"
					required
					value={fullName}
					onChange={(e) => setFullName(e.target.value)}
					className="h-11 bg-muted"
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="signup-email" className="text-xs uppercase tracking-wider">
					Email
				</Label>
				<Input
					id="signup-email"
					name="email"
					type="email"
					placeholder="Use school email only…"
					autoComplete="email"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="h-11 bg-muted"
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="signup-password" className="text-xs uppercase tracking-wider">
					Password
				</Label>
				<Input
					id="signup-password"
					name="password"
					type="password"
					placeholder="Create a password (min. 8 characters)"
					autoComplete="new-password"
					minLength={8}
					required
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="h-11 bg-muted"
				/>
			</div>

			<Button type="submit" className="h-11 font-bold" disabled={isPending}>
				{isPending ? "Creating account…" : "Sign Up"}
			</Button>

			<p className="text-center text-sm text-muted-foreground">
				Already have an account?{' '}
				<Link href="/sign-in" className="font-semibold text-primary hover:underline">
					Log in
				</Link>
			</p>
		</form>
	);
}
