import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user, userProfiles } from "@/lib/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userId = String(body.userId ?? "").trim();
    const name = String(body.name ?? "").trim();
    const role = String(body.role ?? "user").trim();
    const email = String(body.email ?? "").trim();

    if (!userId || !name) {
      return NextResponse.json({ error: "Missing user data" }, { status: 400 });
    }

    await db.update(user).set({ name, role }).where(eq(user.id, userId));

    const [existingProfile] = await db
      .select({ id: userProfiles.id })
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    if (existingProfile) {
      await db
        .update(userProfiles)
        .set({ onboardingCompleted: false })
        .where(eq(userProfiles.userId, userId));
    } else {
      await db.insert(userProfiles).values({
        userId,
        onboardingCompleted: false,
      });
    }

    return NextResponse.json({ ok: true, email });
  } catch (error) {
    console.error("Signup profile update failed", error);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
