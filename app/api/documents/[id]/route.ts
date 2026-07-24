import { getServerSession } from '@/lib/server/session';
import { db } from '@/lib/db';
import { courses, departments, documents, levels, programs, resourceTypes, schools, userProfiles } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    const documentId = Number.parseInt(id, 10);

    if (!id || Number.isNaN(documentId)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid document ID',
        }),
        { status: 400 }
      );
    }

    const session = await getServerSession();
    const user = session?.user;

    const profileRows = user?.id
      ? await db
          .select({ levelId: userProfiles.levelId })
          .from(userProfiles)
          .where(eq(userProfiles.userId, user.id))
          .limit(1)
      : [];

    const userLevelId = profileRows[0]?.levelId ?? null;
    const isAdmin = user?.role === 'admin';

    const rows = await db
      .select({
        id: documents.id,
        title: documents.title,
        course_code: courses.code,
        course_name: courses.name,
        year: documents.year,
        semester: documents.semester,
        exam_type: documents.examType,
        school_name: schools.name,
        department_name: departments.name,
        file_path: documents.filePath,
        download_count: documents.downloadCount,
        resource_type_name: resourceTypes.name,
        author: sql<string | null>`NULL`,
        publication_date: sql<string | null>`NULL`,
        abstract: sql<string | null>`NULL`,
        level_id: documents.levelId,
      })
      .from(documents)
      .leftJoin(courses, eq(documents.courseId, courses.id))
      .leftJoin(programs, eq(courses.programId, programs.id))
      .leftJoin(departments, eq(programs.departmentId, departments.id))
      .leftJoin(schools, eq(departments.schoolId, schools.id))
      .leftJoin(resourceTypes, eq(documents.resourceTypeId, resourceTypes.id))
      .leftJoin(levels, eq(documents.levelId, levels.id))
      .where(eq(documents.id, documentId))
      .limit(1);

    const document = rows[0];

    if (!document) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Document not found',
        }),
        { status: 404 }
      );
    }

    if (!isAdmin && userLevelId !== null && document.level_id !== userLevelId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Document not found',
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: document,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Error fetching document:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to fetch document',
      }),
      { status: 500 }
    );
  }
}
