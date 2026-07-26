import { eq } from 'drizzle-orm';
import { getServerSession } from '@/lib/server/session';
import { db } from '@/lib/db';
import { downloadLogs, documents } from '@/lib/db/schema';

export async function POST(request: Request) {
  try {
    const { documentId } = await request.json();

    if (!documentId) {
      return Response.json(
        { success: false, error: 'Document ID is required' },
        { status: 400 }
      );
    }

    const session = await getServerSession();
    const user = session?.user;

    if (!user?.id) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const normalizedDocumentId = Number(documentId);

    // Record the download in downloadLogs
    await db.insert(downloadLogs).values({
      documentId: normalizedDocumentId,
      userId: user.id,
      downloadedAt: new Date(),
    });

    // Update the download count on the document
    const currentDoc = await db
      .select({ downloadCount: documents.downloadCount })
      .from(documents)
      .where(eq(documents.id, normalizedDocumentId))
      .limit(1);

    if (currentDoc.length > 0) {
      const newCount = (currentDoc[0].downloadCount ?? 0) + 1;
      await db
        .update(documents)
        .set({ downloadCount: newCount })
        .where(eq(documents.id, normalizedDocumentId));
    }

    console.log('[v0] Download tracked for document:', documentId, 'by user:', user.id);

    return Response.json({ success: true });
  } catch (error) {
    console.error('[v0] Error tracking download:', error);
    return Response.json(
      { success: false, error: 'Failed to track download' },
      { status: 500 }
    );
  }
}
