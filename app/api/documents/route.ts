import { getServerSession } from '@/lib/server/session';
import { getDocumentsForUser } from '@/lib/db/queries/documents';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const session = await getServerSession();
    const user = session?.user;

    const docs = await getDocumentsForUser({
      userId: user?.id,
      userRole: user?.role ?? undefined,
      search: searchParams.get('search') ?? undefined,
      schoolId: searchParams.get('schoolId') ?? undefined,
      departmentId: searchParams.get('departmentId') ?? undefined,
      programId: searchParams.get('programId') ?? undefined,
      courseId: searchParams.get('courseId') ?? undefined,
      levelId: searchParams.get('levelId') ?? undefined,
      year: searchParams.get('year') ?? undefined,
      semester: searchParams.get('semester') ?? undefined,
      examType: searchParams.get('examType') ?? undefined,
      resourceType: searchParams.get('resourceType') ?? undefined,
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: docs,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Error fetching documents:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to fetch documents',
      }),
      { status: 500 }
    );
  }
}
