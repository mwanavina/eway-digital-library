'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from "@/lib/db";
import { schools, departments, programs, courses, levels } from "@/lib/db/schema";

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
    return { success: true, data: { id, name } };
  } catch (error) {
    console.error('Error updating school:', error);
    return { success: false, error: 'Failed to update school' };
  }
}

export async function deleteSchool(id: number) {
  try {
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

export async function updateDepartment(id: number, name: string) {
  try {
    return { success: true, data: { id, name } };
  } catch (error) {
    console.error('Error updating department:', error);
    return { success: false, error: 'Failed to update department' };
  }
}

export async function deleteDepartment(id: number) {
  try {
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

export async function updateProgram(id: number, name: string) {
  try {
    return { success: true, data: { id, name } };
  } catch (error) {
    console.error('Error updating program:', error);
    return { success: false, error: 'Failed to update program' };
  }
}

export async function deleteProgram(id: number) {
  try {
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

export async function updateCourse(id: number, code: string, name: string) {
  try {
    return { success: true, data: { id, code, name } };
  } catch (error) {
    console.error('Error updating course:', error);
    return { success: false, error: 'Failed to update course' };
  }
}

export async function deleteCourse(id: number) {
  try {
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

export async function updateLevel(id: number, name: string) {
  try {
    return { success: true, data: { id, name } };
  } catch (error) {
    console.error('Error updating level:', error);
    return { success: false, error: 'Failed to update level' };
  }
}

export async function deleteLevel(id: number) {
  try {
    return { success: true };
  } catch (error) {
    console.error('Error deleting level:', error);
    return { success: false, error: 'Failed to delete level' };
  }
}

// FETCH ALL
export async function fetchAllSchools() {
  try {
    return { success: true, data: [{ id: 1, name: 'School of Science' }] };
  } catch (error) {
    console.error('Error fetching schools:', error);
    return { success: false, error: 'Failed to fetch schools' };
  }
}

export async function fetchAllDepartments() {
  try {
    return { success: true, data: [{ id: 1, school_id: 1, name: 'Mathematics' }] };
  } catch (error) {
    console.error('Error fetching departments:', error);
    return { success: false, error: 'Failed to fetch departments' };
  }
}

export async function fetchAllPrograms() {
  try {
    return { success: true, data: [{ id: 1, department_id: 1, name: 'BSc Mathematics' }] };
  } catch (error) {
    console.error('Error fetching programs:', error);
    return { success: false, error: 'Failed to fetch programs' };
  }
}

export async function fetchAllCourses() {
  try {
    return { success: true, data: [{ id: 1, program_id: 1, code: 'MATH101', name: 'Calculus I' }] };
  } catch (error) {
    console.error('Error fetching courses:', error);
    return { success: false, error: 'Failed to fetch courses' };
  }
}

export async function fetchAllLevels() {
  try {
    return { success: true, data: [{ id: 1, name: 'Level 100' }] };
  } catch (error) {
    console.error('Error fetching levels:', error);
    return { success: false, error: 'Failed to fetch levels' };
  }
}

export async function fetchAllDocuments() {
  try {
    return { success: true, data: [{ id: 1, title: 'Sample Document' }] };
  } catch (error) {
    console.error('Error fetching documents:', error);
    return { success: false, error: 'Failed to fetch documents' };
  }
}

export async function fetchAllResourceTypes() {
  try {
    return { success: true, data: [{ id: 1, name: 'Past Papers' }] };
  } catch (error) {
    console.error('Error fetching resource types:', error);
    return { success: false, error: 'Failed to fetch resource types' };
  }
}
