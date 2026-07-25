import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bookmarks } from '@/lib/db/schema';
import { getServerSession } from '@/lib/server/session';
import { and, eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    const user = session?.user;

    if (!user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { documentId } = await request.json();

    if (!documentId) {
      return NextResponse.json({ success: false, error: 'Document id is required' }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(bookmarks)
      .where(and(eq(bookmarks.userId, user.id), eq(bookmarks.documentId, Number(documentId))))
      .limit(1);

    if (existing.length > 0) {
      await db.delete(bookmarks).where(and(eq(bookmarks.userId, user.id), eq(bookmarks.documentId, Number(documentId))));
      return NextResponse.json({ success: true, bookmarked: false });
    }

    await db.insert(bookmarks).values({
      userId: user.id,
      documentId: Number(documentId),
    });

    return NextResponse.json({ success: true, bookmarked: true });
  } catch (error) {
    console.error('[v0] Error toggling bookmark:', error);
    return NextResponse.json({ success: false, error: 'Failed to toggle bookmark' }, { status: 500 });
  }
}
