import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/server/session';
import { getBookmarksForUser } from '@/lib/db/queries/bookmarks';

export async function GET() {
  try {
    const session = await getServerSession();
    const user = session?.user;

    if (!user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const docs = await getBookmarksForUser({
      userId: user.id,
      userRole: user.role ?? undefined,
    });

    return NextResponse.json({ success: true, data: docs });
  } catch (error) {
    console.error('[v0] Error fetching bookmarks:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch bookmarks' }, { status: 500 });
  }
}
