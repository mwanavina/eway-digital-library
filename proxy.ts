import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	const path = request.nextUrl.pathname;
	const isAuthRoute =
		path.startsWith("/sign-in") ||
		path.startsWith("/sign-up") ||
		path.startsWith("/check-email") ||
		path.startsWith("/forgot-password") ||
		path.startsWith("/reset-password");

	if (session) {
		const isAdmin = session.user.role === "admin";

		if (isAuthRoute) {
			return NextResponse.redirect(new URL(isAdmin ? "/admin" : "/", request.url));
		}

		// Admin users can browse the public home page, but dashboard routes still go to the admin workspace.
		if (isAdmin && path === "/") {
			return NextResponse.next();
		}

		if (isAdmin && path.startsWith("/dashboard")) {
			return NextResponse.redirect(new URL("/admin", request.url));
		}

		// Non-admin users trying to access admin -> redirect to /dashboard
		if (!isAdmin && (path.startsWith("/admin") || path.startsWith("/api/admin"))) {
			return NextResponse.redirect(new URL("/dashboard", request.url));
		}

		return NextResponse.next();
	}

	// Unauthenticated users should only be redirected away from protected routes.
	if (isAuthRoute) {
		return NextResponse.next();
	}

	return NextResponse.redirect(new URL("/sign-in", request.url));
}

export const config = {
	matcher: [
		"/dashboard/:path*",
		"/admin/:path*",
		"/api/admin/:path*",
		"/sign-in",
		"/sign-up",
		"/check-email/:path*",
		"/forgot-password",
		"/reset-password/:path*",
		"/((?!api|_next/static|_next/image|favicon.ico|.*\.(?:png|jpg|jpeg|svg|ico|webp|gif|css|js|json|txt|woff2?|woff|ttf|eot)).*)",
	],
};