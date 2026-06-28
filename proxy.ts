import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
	const session = await auth.api.getSession({
		headers: await headers()
	})
    // console.log("Proxy Middleware: Session:", session);
	// 1. Not logged in -> sign-in
	if (!session) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}

	const path = request.nextUrl.pathname;
	const isAdmin = session.user.role === "admin";

    // console.log("Proxy Middleware: Path:", path, "Is Admin:", isAdmin);

	// 2. Admin users accessing root or dashboard -> redirect to /admin
	if (isAdmin && (path === "/" || path.startsWith("/dashboard"))) {
		return NextResponse.redirect(new URL("/admin", request.url));
	}

	// 3. Non-admin users trying to access admin -> redirect to /dashboard
	if (!isAdmin && (path.startsWith("/admin") || path.startsWith("/api/admin"))) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	// 4. Allow access
	return NextResponse.next();
}

export const config = {
	matcher: [
		"/dashboard/:path*",
		"/admin/:path*",
		"/api/admin/:path*",
		"/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up|check-email|forgot-password|reset-password).*)",
	],
};