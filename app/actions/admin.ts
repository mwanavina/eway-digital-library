'use server';

import { revalidatePath } from 'next/cache';
import { asc, desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from "@/lib/db";
import { schools, departments, programs, courses, levels, documents, resourceTypes } from "@/lib/db/schema";

type NewSchool = typeof schools.$inferInsert;

type NewDepartment = typeof departments.$inferInsert;
type NewProgram = typeof programs.$inferInsert;
type NewCourse = typeof courses.$inferInsert;
type NewLevel = typeof levels.$inferInsert;

const schoolSchema = z.object({
  name: z.string().trim().min(2, 'School name must be at least 2 characters').max(100),
});

const departmentSchema = z.object({
  name: z.string().trim().min(2, 'Department name must be at least 2 characters').max(100),
  schoolId: z.coerce.number().int().positive('Please select a valid school'),
});

const programSchema = z.object({
  name: z.string().trim().min(2, 'Program name must be at least 2 characters').max(100),
  departmentId: z.coerce.number().int().positive('Please select a valid department'),
});

const courseSchema = z.object({
  code: z.string().trim().min(2, 'Course code must be at least 2 characters').max(20),
  name: z.string().trim().min(2, 'Course name must be at least 2 characters').max(100),
  programId: z.coerce.number().int().positive('Please select a valid program'),
});

const levelSchema = z.object({
  levelNumber: z.coerce.number().int().positive('Level number must be a positive number'),
  description: z.string().trim().min(2, 'Description must be at least 2 characters').max(200),
});

const resourceTypeSchema = z.object({
  name: z.string().trim().min(2, 'Resource type name must be at least 2 characters').max(100),
  description: z.string().trim().min(2, 'Description must be at least 2 characters').max(200),
});

// Mock admin actions for demonstration - would connect to database in production

export async function createSchool(input: string | { name: string }) {
  const parsed = typeof input === 'string' ? { name: input } : input;
  const result = schoolSchema.safeParse(parsed);

  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? 'Invalid school data' };
  }

  try {
    const [createdSchool] = await db.insert(schools).values({ name: result.data.name }).returning({
      id: schools.id,
      name: schools.name,
      createdAt: schools.createdAt,
    });

    revalidatePath('/admin');
    return { success: true, data: createdSchool };
  } catch (error) {
    console.error('Error creating school:', error);
    return { success: false, error: 'Failed to create school' };
  }
}

export async function updateSchool(id: number, name: string) {
  try {
    const [updatedSchool] = await db.update(schools)
      .set({ name })
      .where(eq(schools.id, id))
      .returning({ id: schools.id, name: schools.name, createdAt: schools.createdAt });

    revalidatePath('/admin');
    return { success: true, data: updatedSchool };
  } catch (error) {
    console.error('Error updating school:', error);
    return { success: false, error: 'Failed to update school' };
  }
}

export async function deleteSchool(id: number) {
  try {
    await db.delete(schools).where(eq(schools.id, id));
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error deleting school:', error);
    return { success: false, error: 'Failed to delete school' };
  }
}

// DEPARTMENTS
export async function createDepartment(input: string | { name: string; schoolId: number }) {
  const parsed = typeof input === 'string' ? { name: input, schoolId: 0 } : input;
  const result = departmentSchema.safeParse(parsed);

  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? 'Invalid department data' };
  }

  try {
    const [createdDepartment] = await db.insert(departments).values({
      name: result.data.name,
      schoolId: result.data.schoolId,
    }).returning({
      id: departments.id,
      name: departments.name,
      schoolId: departments.schoolId,
      createdAt: departments.createdAt,
    });

    revalidatePath('/admin');
    return { success: true, data: createdDepartment };
  } catch (error) {
    console.error('Error creating department:', error);
    return { success: false, error: 'Failed to create department' };
  }
}

export async function updateDepartment(id: number, name: string, schoolId: number) {
  try {
    const [updatedDepartment] = await db.update(departments)
      .set({ name, schoolId })
      .where(eq(departments.id, id))
      .returning({ id: departments.id, name: departments.name, schoolId: departments.schoolId, createdAt: departments.createdAt });

    revalidatePath('/admin');
    return { success: true, data: updatedDepartment };
  } catch (error) {
    console.error('Error updating department:', error);
    return { success: false, error: 'Failed to update department' };
  }
}

export async function deleteDepartment(id: number) {
  try {
    await db.delete(departments).where(eq(departments.id, id));
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error deleting department:', error);
    return { success: false, error: 'Failed to delete department' };
  }
}

// PROGRAMS
export async function createProgram(input: string | { name: string; departmentId: number }) {
  const parsed = typeof input === 'string' ? { name: input, departmentId: 0 } : input;
  const result = programSchema.safeParse(parsed);

  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? 'Invalid program data' };
  }

  try {
    const [createdProgram] = await db.insert(programs).values({
      name: result.data.name,
      departmentId: result.data.departmentId,
    }).returning({
      id: programs.id,
      name: programs.name,
      departmentId: programs.departmentId,
      createdAt: programs.createdAt,
    });

    revalidatePath('/admin');
    return { success: true, data: createdProgram };
  } catch (error) {
    console.error('Error creating program:', error);
    return { success: false, error: 'Failed to create program' };
  }
}

export async function updateProgram(id: number, name: string, departmentId: number) {
  try {
    const [updatedProgram] = await db.update(programs)
      .set({ name, departmentId })
      .where(eq(programs.id, id))
      .returning({ id: programs.id, name: programs.name, departmentId: programs.departmentId, createdAt: programs.createdAt });

    revalidatePath('/admin');
    return { success: true, data: updatedProgram };
  } catch (error) {
    console.error('Error updating program:', error);
    return { success: false, error: 'Failed to update program' };
  }
}

export async function deleteProgram(id: number) {
  try {
    await db.delete(programs).where(eq(programs.id, id));
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error deleting program:', error);
    return { success: false, error: 'Failed to delete program' };
  }
}

// COURSES
export async function createCourse(input: string | { code: string; name: string; programId: number }) {
  const parsed = typeof input === 'string' ? { code: input, name: input, programId: 0 } : input;
  const result = courseSchema.safeParse(parsed);

  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? 'Invalid course data' };
  }

  try {
    const [createdCourse] = await db.insert(courses).values({
      code: result.data.code,
      name: result.data.name,
      programId: result.data.programId,
    }).returning({
      id: courses.id,
      code: courses.code,
      name: courses.name,
      programId: courses.programId,
      createdAt: courses.createdAt,
    });

    revalidatePath('/admin');
    return { success: true, data: createdCourse };
  } catch (error) {
    console.error('Error creating course:', error);
    return { success: false, error: 'Failed to create course' };
  }
}

export async function updateCourse(id: number, code: string, name: string, programId: number) {
  try {
    const [updatedCourse] = await db.update(courses)
      .set({ code, name, programId })
      .where(eq(courses.id, id))
      .returning({ id: courses.id, code: courses.code, name: courses.name, programId: courses.programId, createdAt: courses.createdAt });

    revalidatePath('/admin');
    return { success: true, data: updatedCourse };
  } catch (error) {
    console.error('Error updating course:', error);
    return { success: false, error: 'Failed to update course' };
  }
}

export async function deleteCourse(id: number) {
  try {
    await db.delete(courses).where(eq(courses.id, id));
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error deleting course:', error);
    return { success: false, error: 'Failed to delete course' };
  }
}

// LEVELS
export async function createLevel(input: number | { levelNumber: number; description: string }) {
  const parsed = typeof input === 'number' ? { levelNumber: input, description: '' } : input;
  const result = levelSchema.safeParse(parsed);

  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? 'Invalid level data' };
  }

  try {
    const [createdLevel] = await db.insert(levels).values({
      levelNumber: result.data.levelNumber,
      description: result.data.description,
    }).returning({
      id: levels.id,
      levelNumber: levels.levelNumber,
      description: levels.description,
      createdAt: levels.createdAt,
    });

    revalidatePath('/admin');
    return { success: true, data: createdLevel };
  } catch (error) {
    console.error('Error creating level:', error);
    return { success: false, error: 'Failed to create level' };
  }
}

export async function updateLevel(id: number, levelNumber: number, description: string) {
  try {
    const [updatedLevel] = await db.update(levels)
      .set({ levelNumber, description })
      .where(eq(levels.id, id))
      .returning({ id: levels.id, levelNumber: levels.levelNumber, description: levels.description, createdAt: levels.createdAt });

    revalidatePath('/admin');
    return { success: true, data: updatedLevel };
  } catch (error) {
    console.error('Error updating level:', error);
    return { success: false, error: 'Failed to update level' };
  }
}

export async function deleteLevel(id: number) {
  try {
    await db.delete(levels).where(eq(levels.id, id));
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error deleting level:', error);
    return { success: false, error: 'Failed to delete level' };
  }
}

export async function createResourceType(input: string | { name: string; description?: string }) {
  const parsed = typeof input === 'string' ? { name: input, description: '' } : input;
  const result = resourceTypeSchema.safeParse(parsed);

  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? 'Invalid resource type data' };
  }

  const slug = result.data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  try {
    const [createdResourceType] = await db.insert(resourceTypes).values({
      name: result.data.name,
      slug,
      description: result.data.description,
    }).returning({
      id: resourceTypes.id,
      name: resourceTypes.name,
      slug: resourceTypes.slug,
      description: resourceTypes.description,
      createdAt: resourceTypes.createdAt,
    });

    revalidatePath('/admin');
    return { success: true, data: createdResourceType };
  } catch (error) {
    console.error('Error creating resource type:', error);
    return { success: false, error: 'Failed to create resource type' };
  }
}

export async function updateResourceType(id: number, name: string, description: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  try {
    const [updatedResourceType] = await db.update(resourceTypes)
      .set({ name, slug, description })
      .where(eq(resourceTypes.id, id))
      .returning({ id: resourceTypes.id, name: resourceTypes.name, slug: resourceTypes.slug, description: resourceTypes.description, createdAt: resourceTypes.createdAt });

    revalidatePath('/admin');
    return { success: true, data: updatedResourceType };
  } catch (error) {
    console.error('Error updating resource type:', error);
    return { success: false, error: 'Failed to update resource type' };
  }
}

export async function deleteResourceType(id: number) {
  try {
    await db.delete(resourceTypes).where(eq(resourceTypes.id, id));
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error deleting resource type:', error);
    return { success: false, error: 'Failed to delete resource type' };
  }
}

// FETCH ALL
export async function fetchAllSchools() {
  try {
    const rows = await db.select({
      id: schools.id,
      name: schools.name,
      createdAt: schools.createdAt,
    }).from(schools).orderBy(asc(schools.name));

    return { success: true, data: rows };
  } catch (error) {
    console.error('Error fetching schools:', error);
    return { success: false, error: 'Failed to fetch schools' };
  }
}

export async function fetchAllDepartments() {
  try {
    const rows = await db.select({
      id: departments.id,
      name: departments.name,
      schoolId: departments.schoolId,
      school_name: schools.name,
      createdAt: departments.createdAt,
    }).from(departments)
      .leftJoin(schools, eq(departments.schoolId, schools.id))
      .orderBy(asc(departments.name));

    return { success: true, data: rows };
  } catch (error) {
    console.error('Error fetching departments:', error);
    return { success: false, error: 'Failed to fetch departments' };
  }
}

export async function fetchAllPrograms() {
  try {
    const rows = await db.select({
      id: programs.id,
      name: programs.name,
      departmentId: programs.departmentId,
      department_name: departments.name,
      school_name: schools.name,
      createdAt: programs.createdAt,
    }).from(programs)
      .leftJoin(departments, eq(programs.departmentId, departments.id))
      .leftJoin(schools, eq(departments.schoolId, schools.id))
      .orderBy(asc(programs.name));

    return { success: true, data: rows };
  } catch (error) {
    console.error('Error fetching programs:', error);
    return { success: false, error: 'Failed to fetch programs' };
  }
}

export async function fetchAllCourses() {
  try {
    const rows = await db.select({
      id: courses.id,
      code: courses.code,
      name: courses.name,
      programId: courses.programId,
      program_name: programs.name,
      createdAt: courses.createdAt,
    }).from(courses)
      .leftJoin(programs, eq(courses.programId, programs.id))
      .orderBy(asc(courses.name));

    return { success: true, data: rows };
  } catch (error) {
    console.error('Error fetching courses:', error);
    return { success: false, error: 'Failed to fetch courses' };
  }
}

export async function fetchAllLevels() {
  try {
    const rows = await db.select({
      id: levels.id,
      level_number: levels.levelNumber,
      description: levels.description,
      createdAt: levels.createdAt,
    }).from(levels).orderBy(asc(levels.levelNumber));

    return { success: true, data: rows };
  } catch (error) {
    console.error('Error fetching levels:', error);
    return { success: false, error: 'Failed to fetch levels' };
  }
}

export async function fetchAllDocuments() {
  try {
    const rows = await db.select({
      id: documents.id,
      title: documents.title,
      course_code: courses.code,
      course_name: courses.name,
      program_name: programs.name,
      department_name: departments.name,
      school_name: schools.name,
      year: documents.year,
      semester: documents.semester,
      exam_type: documents.examType,
      upload_status: documents.uploadStatus,
      thumbnail_url: documents.thumbnailUrl,
      file_url: documents.filePath,
      created_at: documents.createdAt,
    }).from(documents)
      .leftJoin(courses, eq(documents.courseId, courses.id))
      .leftJoin(programs, eq(courses.programId, programs.id))
      .leftJoin(departments, eq(programs.departmentId, departments.id))
      .leftJoin(schools, eq(departments.schoolId, schools.id))
      .orderBy(desc(documents.createdAt));

    return { success: true, data: rows };
  } catch (error) {
    console.error('Error fetching documents:', error);
    return { success: false, error: 'Failed to fetch documents' };
  }
}

export async function fetchAllResourceTypes() {
  try {
    const rows = await db.select({
      id: resourceTypes.id,
      name: resourceTypes.name,
      slug: resourceTypes.slug,
      description: resourceTypes.description,
      createdAt: resourceTypes.createdAt,
    }).from(resourceTypes).orderBy(asc(resourceTypes.name));

    if (rows.length === 0) {
      const fallbackTypes = [
        { id: 1, name: 'Past Papers', slug: 'past-papers', description: 'Past examination papers' },
        { id: 2, name: 'Course Outlines', slug: 'course-outlines', description: 'Course outlines and study guides' },
        { id: 3, name: 'Syllabi', slug: 'syllabi', description: 'Syllabus and academic plans' },
      ];

      return { success: true, data: fallbackTypes };
    }

    return { success: true, data: rows };
  } catch (error) {
    console.error('Error fetching resource types:', error);
    return { success: false, error: 'Failed to fetch resource types' };
  }
}
