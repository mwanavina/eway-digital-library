'use server';

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// SCHOOLS
export async function createSchool(name: string) {
  try {
    const result = await sql`
      INSERT INTO schools (name) VALUES (${name})
      RETURNING *
    `;
    return { success: true, data: result[0] };
  } catch (error) {
    console.error('[v0] Error creating school:', error);
    return { success: false, error: 'Failed to create school' };
  }
}

export async function updateSchool(id: number, name: string) {
  try {
    const result = await sql`
      UPDATE schools SET name = ${name} WHERE id = ${id}
      RETURNING *
    `;
    return { success: true, data: result[0] };
  } catch (error) {
    console.error('[v0] Error updating school:', error);
    return { success: false, error: 'Failed to update school' };
  }
}

export async function deleteSchool(id: number) {
  try {
    await sql`DELETE FROM schools WHERE id = ${id}`;
    return { success: true };
  } catch (error) {
    console.error('[v0] Error deleting school:', error);
    return { success: false, error: 'Failed to delete school' };
  }
}

// DEPARTMENTS
export async function createDepartment(name: string, schoolId: number) {
  try {
    const result = await sql`
      INSERT INTO departments (name, school_id) VALUES (${name}, ${schoolId})
      RETURNING *
    `;
    return { success: true, data: result[0] };
  } catch (error) {
    console.error('[v0] Error creating department:', error);
    return { success: false, error: 'Failed to create department' };
  }
}

export async function updateDepartment(id: number, name: string, schoolId: number) {
  try {
    const result = await sql`
      UPDATE departments SET name = ${name}, school_id = ${schoolId} WHERE id = ${id}
      RETURNING *
    `;
    return { success: true, data: result[0] };
  } catch (error) {
    console.error('[v0] Error updating department:', error);
    return { success: false, error: 'Failed to update department' };
  }
}

export async function deleteDepartment(id: number) {
  try {
    await sql`DELETE FROM departments WHERE id = ${id}`;
    return { success: true };
  } catch (error) {
    console.error('[v0] Error deleting department:', error);
    return { success: false, error: 'Failed to delete department' };
  }
}

// PROGRAMS
export async function createProgram(name: string, departmentId: number) {
  try {
    const result = await sql`
      INSERT INTO programs (name, department_id) VALUES (${name}, ${departmentId})
      RETURNING *
    `;
    return { success: true, data: result[0] };
  } catch (error) {
    console.error('[v0] Error creating program:', error);
    return { success: false, error: 'Failed to create program' };
  }
}

export async function updateProgram(id: number, name: string, departmentId: number) {
  try {
    const result = await sql`
      UPDATE programs SET name = ${name}, department_id = ${departmentId} WHERE id = ${id}
      RETURNING *
    `;
    return { success: true, data: result[0] };
  } catch (error) {
    console.error('[v0] Error updating program:', error);
    return { success: false, error: 'Failed to update program' };
  }
}

export async function deleteProgram(id: number) {
  try {
    await sql`DELETE FROM programs WHERE id = ${id}`;
    return { success: true };
  } catch (error) {
    console.error('[v0] Error deleting program:', error);
    return { success: false, error: 'Failed to delete program' };
  }
}

// COURSES
export async function createCourse(code: string, name: string, programId: number) {
  try {
    const result = await sql`
      INSERT INTO courses (code, name, program_id) VALUES (${code}, ${name}, ${programId})
      RETURNING *
    `;
    return { success: true, data: result[0] };
  } catch (error) {
    console.error('[v0] Error creating course:', error);
    return { success: false, error: 'Failed to create course' };
  }
}

export async function updateCourse(id: number, code: string, name: string, programId: number) {
  try {
    const result = await sql`
      UPDATE courses SET code = ${code}, name = ${name}, program_id = ${programId} WHERE id = ${id}
      RETURNING *
    `;
    return { success: true, data: result[0] };
  } catch (error) {
    console.error('[v0] Error updating course:', error);
    return { success: false, error: 'Failed to update course' };
  }
}

export async function deleteCourse(id: number) {
  try {
    await sql`DELETE FROM courses WHERE id = ${id}`;
    return { success: true };
  } catch (error) {
    console.error('[v0] Error deleting course:', error);
    return { success: false, error: 'Failed to delete course' };
  }
}

// LEVELS
export async function createLevel(levelNumber: number, description: string) {
  try {
    const result = await sql`
      INSERT INTO levels (level_number, description) VALUES (${levelNumber}, ${description})
      RETURNING *
    `;
    return { success: true, data: result[0] };
  } catch (error) {
    console.error('[v0] Error creating level:', error);
    return { success: false, error: 'Failed to create level' };
  }
}

export async function updateLevel(id: number, levelNumber: number, description: string) {
  try {
    const result = await sql`
      UPDATE levels SET level_number = ${levelNumber}, description = ${description} WHERE id = ${id}
      RETURNING *
    `;
    return { success: true, data: result[0] };
  } catch (error) {
    console.error('[v0] Error updating level:', error);
    return { success: false, error: 'Failed to update level' };
  }
}

export async function deleteLevel(id: number) {
  try {
    await sql`DELETE FROM levels WHERE id = ${id}`;
    return { success: true };
  } catch (error) {
    console.error('[v0] Error deleting level:', error);
    return { success: false, error: 'Failed to delete level' };
  }
}

// FETCH ALL DATA
export async function fetchAllSchools() {
  try {
    const result = await sql`SELECT * FROM schools ORDER BY name ASC`;
    return { success: true, data: result };
  } catch (error) {
    console.error('[v0] Error fetching schools:', error);
    return { success: false, data: [] };
  }
}

export async function fetchAllDepartments() {
  try {
    const result = await sql`
      SELECT d.*, s.name as school_name 
      FROM departments d
      JOIN schools s ON d.school_id = s.id
      ORDER BY s.name, d.name
    `;
    return { success: true, data: result };
  } catch (error) {
    console.error('[v0] Error fetching departments:', error);
    return { success: false, data: [] };
  }
}

export async function fetchAllPrograms() {
  try {
    const result = await sql`
      SELECT p.*, d.name as department_name, s.name as school_name
      FROM programs p
      JOIN departments d ON p.department_id = d.id
      JOIN schools s ON d.school_id = s.id
      ORDER BY s.name, d.name, p.name
    `;
    return { success: true, data: result };
  } catch (error) {
    console.error('[v0] Error fetching programs:', error);
    return { success: false, data: [] };
  }
}

export async function fetchAllCourses() {
  try {
    const result = await sql`
      SELECT c.*, p.name as program_name, d.name as department_name, s.name as school_name
      FROM courses c
      JOIN programs p ON c.program_id = p.id
      JOIN departments d ON p.department_id = d.id
      JOIN schools s ON d.school_id = s.id
      ORDER BY s.name, d.name, p.name, c.name
    `;
    return { success: true, data: result };
  } catch (error) {
    console.error('[v0] Error fetching courses:', error);
    return { success: false, data: [] };
  }
}

export async function fetchAllLevels() {
  try {
    const result = await sql`SELECT * FROM levels ORDER BY level_number ASC`;
    return { success: true, data: result };
  } catch (error) {
    console.error('[v0] Error fetching levels:', error);
    return { success: false, data: [] };
  }
}

// DOCUMENTS
export async function fetchAllDocuments() {
  try {
    const result = await sql`
      SELECT 
        d.id,
        d.title,
        d.year,
        d.semester,
        d.exam_type,
        d.upload_status,
        d.error_message,
        d.thumbnail_url,
        d.resource_type_id,
        d.author,
        d.publication_date,
        d.created_at,
        c.code as course_code,
        c.name as course_name,
        p.name as program_name,
        dp.name as department_name,
        s.name as school_name,
        rt.name as resource_type_name
      FROM documents d
      JOIN courses c ON d.course_id = c.id
      JOIN programs p ON c.program_id = p.id
      JOIN departments dp ON p.department_id = dp.id
      JOIN schools s ON dp.school_id = s.id
      LEFT JOIN resource_types rt ON d.resource_type_id = rt.id
      ORDER BY d.created_at DESC
    `;
    return { success: true, data: result };
  } catch (error) {
    console.error('[v0] Error fetching documents:', error);
    return { success: false, data: [] };
  }
}

// RESOURCE TYPES
export async function fetchAllResourceTypes() {
  try {
    const result = await sql`SELECT * FROM resource_types ORDER BY id ASC`;
    return { success: true, data: result };
  } catch (error) {
    console.error('[v0] Error fetching resource types:', error);
    return { success: false, data: [] };
  }
}
