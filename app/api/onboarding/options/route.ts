import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { departments, programs } from "@/lib/db/schema";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const schoolId = searchParams.get("schoolId");
  const departmentId = searchParams.get("departmentId");

  if (departmentId) {
    const rows = await db
      .select()
      .from(programs)
      .where(eq(programs.departmentId, Number(departmentId)))
      .orderBy(programs.name);
    return NextResponse.json({ programs: rows });
  }

  if (schoolId) {
    const rows = await db
      .select()
      .from(departments)
      .where(eq(departments.schoolId, Number(schoolId)))
      .orderBy(departments.name);
    return NextResponse.json({ departments: rows });
  }

  return NextResponse.json({ error: "Missing schoolId or departmentId" }, { status: 400 });
}
