import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const schoolId = searchParams.get('schoolId');
    const departmentId = searchParams.get('departmentId');
    const courseId = searchParams.get('courseId');
    const year = searchParams.get('year');
    const semester = searchParams.get('semester');
    const examType = searchParams.get('examType');
    const searchQuery = searchParams.get('search');

    // Build WHERE conditions
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (schoolId) {
      conditions.push(`s.id = $${paramIndex++}`);
      params.push(parseInt(schoolId));
    }

    if (departmentId) {
      conditions.push(`dp.id = $${paramIndex++}`);
      params.push(parseInt(departmentId));
    }

    if (courseId) {
      conditions.push(`c.id = $${paramIndex++}`);
      params.push(parseInt(courseId));
    }

    if (year) {
      conditions.push(`d.year = $${paramIndex++}`);
      params.push(parseInt(year));
    }

    if (semester) {
      conditions.push(`d.semester = $${paramIndex++}`);
      params.push(parseInt(semester));
    }

    if (examType) {
      conditions.push(`d.exam_type = $${paramIndex++}`);
      params.push(examType);
    }

    if (searchQuery) {
      conditions.push(`(d.title ILIKE $${paramIndex} OR c.name ILIKE $${paramIndex} OR c.code ILIKE $${paramIndex + 1})`);
      const searchTerm = `%${searchQuery}%`;
      params.push(searchTerm);
      params.push(searchTerm);
      paramIndex += 2;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Query using only existing columns
    const query = `
      SELECT 
        d.id,
        d.title,
        d.year,
        d.semester,
        d.exam_type,
        d.file_path,
        d.thumbnail_url,
        d.download_count,
        d.created_at,
        c.code as course_code,
        c.name as course_name,
        p.name as program_name,
        dp.name as department_name,
        s.name as school_name,
        'Past Papers' as resource_type_name,
        NULL as author,
        NULL as publication_date,
        NULL as abstract
      FROM documents d
      JOIN courses c ON d.course_id = c.id
      JOIN programs p ON c.program_id = p.id
      JOIN departments dp ON p.department_id = dp.id
      JOIN schools s ON dp.school_id = s.id
      ${whereClause}
      ORDER BY d.created_at DESC
      LIMIT 100
    `;

    const results = await sql.query(query, params);

    return Response.json({
      success: true,
      data: results,
      count: results.length,
    });
  } catch (error) {
    console.error('[v0] Error fetching documents:', error);
    return Response.json({
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Failed to fetch documents',
    }, { status: 500 });
  }
}
