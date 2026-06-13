import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || '');

export async function GET() {
  try {
    // Fetch all filter options
    const [schools, departments, programs, courses] = await Promise.all([
      sql`SELECT id, name FROM schools ORDER BY name ASC`,
      sql`SELECT id, name, school_id FROM departments ORDER BY name ASC`,
      sql`SELECT id, name, department_id FROM programs ORDER BY name ASC`,
      sql`SELECT id, name, code, program_id FROM courses ORDER BY name ASC`,
    ]);

    return Response.json({
      success: true,
      schools: schools || [],
      departments: departments || [],
      programs: programs || [],
      courses: courses || [],
    });
  } catch (error) {
    console.error('[v0] Error fetching filters:', error);
    return Response.json({
      success: false,
      schools: [],
      departments: [],
      programs: [],
      courses: [],
      error: error instanceof Error ? error.message : 'Failed to fetch filters',
    });
  }
}
