'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from "@/lib/db";
import { schools } from "@/lib/db/schema";

type NewSchool = typeof schools.$inferInsert;

const schoolSchema = z.object({
  name: z.string().trim().min(2, 'School name must be at least 2 characters').max(100),
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
export async function createDepartment(name: string, schoolId: number) {
  try {
    return { success: true, data: { id: Math.random(), school_id: schoolId, name } };
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
export async function createProgram(name: string, departmentId: number) {
  try {
    return { success: true, data: { id: Math.random(), department_id: departmentId, name } };
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
export async function createCourse(code: string, name: string, programId: number) {
  try {
    return { success: true, data: { id: Math.random(), program_id: programId, code, name } };
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
export async function createLevel(levelNumber: number, description: string) {
  try {
    return { success: true, data: { id: Math.random(), level_number: levelNumber, description } };
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
