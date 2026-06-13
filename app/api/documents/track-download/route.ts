import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  try {
    const { documentId } = await request.json();

    if (!documentId) {
      return Response.json(
        { success: false, error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Increment download count
    await sql`
      UPDATE documents 
      SET download_count = COALESCE(download_count, 0) + 1
      WHERE id = ${documentId}
    `;

    console.log('[v0] Download tracked for document:', documentId);

    return Response.json({ success: true });
  } catch (error) {
    console.error('[v0] Error tracking download:', error);
    return Response.json(
      { success: false, error: 'Failed to track download' },
      { status: 500 }
    );
  }
}
