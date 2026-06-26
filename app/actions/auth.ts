"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function signUp(formData: FormData) {
	try {
		const email = String(formData.get("email") ?? "").trim();
		const password = String(formData.get("password") ?? "").trim();
		const name = String(formData.get("name") ?? "").trim();

		if (!email || !password || !name) {
			return { success: false as const, error: "Please fill in all fields." };
		}

		await auth.api.signUpEmail({
			body: {
				email,
				password,
				name,
			},
			headers: await headers(),
		});

		return { success: true as const, email };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unable to create account.";
		return { success: false as const, error: message };
	}
}

export async function signIn(formData: FormData) {
	try {
		await auth.api.signInEmail({
			body: {
				email: String(formData.get("email") ?? "").trim(),
				password: String(formData.get("password") ?? "").trim(),
			},
			headers: await headers(),
		});

		return { success: true as const };
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unable to sign in.";
		return { success: false as const, error: message };
	}
}

export async function signOut() {
    try {
        await auth.api.signOut({
            headers: await headers(),
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to sign out.";
        return { success: false as const, error: message };
    }
}