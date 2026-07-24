import { asc, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import {
  courses,
  departments,
  documents,
  levels,
  programs,
  resourceTypes,
  schools,
} from '@/lib/db/schema';

function parseId(value: string | null) {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const schoolId = parseId(searchParams.get('schoolId'));
  const departmentId = parseId(searchParams.get('departmentId'));
  const programId = parseId(searchParams.get('programId'));

  try {
    switch (type) {
      case 'schools': {
        const rows = await db
          .select({ id: schools.id, name: schools.name })
          .from(schools)
          .orderBy(asc(schools.name));

        return Response.json({ success: true, data: rows });
      }

      case 'departments': {
        const query = db
          .select({ id: departments.id, school_id: departments.schoolId, name: departments.name })
          .from(departments)
          .orderBy(asc(departments.name));

        const rows = schoolId !== null
          ? await query.where(eq(departments.schoolId, schoolId))
          : await query;

        return Response.json({ success: true, data: rows });
      }

      case 'programs': {
        const query = db
          .select({ id: programs.id, department_id: programs.departmentId, name: programs.name })
          .from(programs)
          .orderBy(asc(programs.name));

        const rows = departmentId !== null
          ? await query.where(eq(programs.departmentId, departmentId))
          : await query;

        return Response.json({ success: true, data: rows });
      }

      case 'courses': {
        const query = db
          .select({ id: courses.id, program_id: courses.programId, name: courses.name, code: courses.code })
          .from(courses)
          .orderBy(asc(courses.name));

        const rows = programId !== null
          ? await query.where(eq(courses.programId, programId))
          : await query;

        return Response.json({ success: true, data: rows });
      }

      case 'levels': {
        const rows = await db
          .select({ id: levels.id, level_number: levels.levelNumber, description: levels.description })
          .from(levels)
          .orderBy(asc(levels.levelNumber));

        return Response.json({ success: true, data: rows });
      }

      case 'years': {
        const rows = await db
          .selectDistinct({ year: documents.year })
          .from(documents)
          .where(sql`${documents.year} IS NOT NULL`)
          .orderBy(asc(documents.year));

        const years = rows.map((row) => row.year).filter((year): year is number => year !== null);
        return Response.json({ success: true, data: years });
      }

      case 'semesters': {
        const rows = await db
          .selectDistinct({ semester: documents.semester })
          .from(documents)
          .where(sql`${documents.semester} IS NOT NULL`)
          .orderBy(asc(documents.semester));

        const semesters = rows.map((row) => row.semester).filter((semester): semester is number => semester !== null);
        return Response.json({ success: true, data: semesters });
      }

      case 'examTypes': {
        const rows = await db
          .selectDistinct({ name: documents.examType })
          .from(documents)
          .where(sql`${documents.examType} IS NOT NULL`)
          .orderBy(asc(documents.examType));

        const examTypes = rows.map((row) => row.name).filter((name): name is string => Boolean(name));
        return Response.json({ success: true, data: examTypes });
      }

      case 'resourceTypes': {
        const rows = await db
          .select({ id: resourceTypes.id, name: resourceTypes.name, slug: resourceTypes.slug })
          .from(resourceTypes)
          .orderBy(asc(resourceTypes.name));

        return Response.json({ success: true, data: rows });
      }

      default: {
        const [schoolsData, departmentsData, programsData, coursesData, levelsData, yearsData, semestersData, examTypesData, resourceTypesData] = await Promise.all([
          db.select({ id: schools.id, name: schools.name }).from(schools).orderBy(asc(schools.name)),
          db.select({ id: departments.id, school_id: departments.schoolId, name: departments.name }).from(departments).orderBy(asc(departments.name)),
          db.select({ id: programs.id, department_id: programs.departmentId, name: programs.name }).from(programs).orderBy(asc(programs.name)),
          db.select({ id: courses.id, program_id: courses.programId, name: courses.name, code: courses.code }).from(courses).orderBy(asc(courses.name)),
          db.select({ id: levels.id, level_number: levels.levelNumber, description: levels.description }).from(levels).orderBy(asc(levels.levelNumber)),
          db.selectDistinct({ year: documents.year }).from(documents).where(sql`${documents.year} IS NOT NULL`).orderBy(asc(documents.year)),
          db.selectDistinct({ semester: documents.semester }).from(documents).where(sql`${documents.semester} IS NOT NULL`).orderBy(asc(documents.semester)),
          db.selectDistinct({ name: documents.examType }).from(documents).where(sql`${documents.examType} IS NOT NULL`).orderBy(asc(documents.examType)),
          db.select({ id: resourceTypes.id, name: resourceTypes.name, slug: resourceTypes.slug }).from(resourceTypes).orderBy(asc(resourceTypes.name)),
        ]);

        return Response.json({
          success: true,
          schools: schoolsData,
          departments: departmentsData,
          programs: programsData,
          courses: coursesData,
          levels: levelsData,
          years: yearsData.map((row) => row.year).filter((year): year is number => year !== null),
          semesters: semestersData.map((row) => row.semester).filter((semester): semester is number => semester !== null),
          examTypes: examTypesData.map((row) => row.name).filter((name): name is string => Boolean(name)),
          resourceTypes: resourceTypesData,
        });
      }
    }
  } catch (error) {
    console.error('[v0] Error fetching filters:', error);
    return Response.json({
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Failed to fetch filters',
    });
  }
}
