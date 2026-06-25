import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import {
  departments,
  levels,
  programs,
  schools,
  user,
  userProfiles,
} from "@/lib/db/schema";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [profile] = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, session.user.id))
    .limit(1);

  const [schoolRows, levelRows] = await Promise.all([
    db.select().from(schools).orderBy(schools.name),
    db.select().from(levels).orderBy(levels.levelNumber),
  ]);

  return NextResponse.json({
    profile: profile ?? null,
    schools: schoolRows,
    levels: levelRows,
  });
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const fullName = String(body.fullName ?? "").trim();
  const schoolId = Number(body.schoolId);
  const departmentId = Number(body.departmentId);
  const programId = Number(body.programId);
  const levelId = Number(body.levelId);

  if (!fullName || !schoolId || !departmentId || !programId || !levelId) {
    return NextResponse.json(
      { error: "Please complete all required fields." },
      { status: 400 },
    );
  }

  await db
    .update(user)
    .set({ name: fullName })
    .where(eq(user.id, session.user.id));

  const [existing] = await db
    .select({ id: userProfiles.id })
    .from(userProfiles)
    .where(eq(userProfiles.userId, session.user.id))
    .limit(1);

  const profileData = {
    fullName,
    schoolId,
    departmentId,
    programId,
    levelId,
    onboardingCompleted: true,
  };

  if (existing) {
    await db
      .update(userProfiles)
      .set(profileData)
      .where(eq(userProfiles.userId, session.user.id));
  } else {
    await db.insert(userProfiles).values({
      userId: session.user.id,
      ...profileData,
    });
  }

  return NextResponse.json({ success: true });
}
