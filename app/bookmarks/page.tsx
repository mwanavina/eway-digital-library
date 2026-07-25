import { redirect } from 'next/navigation';
import { Bookmark } from 'lucide-react';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { getServerSession } from '@/lib/server/session';
import { getBookmarksForUser } from '@/lib/db/queries/bookmarks';
import { BookmarksPageClient } from './BookmarksPageClient';

interface BookmarkDocument {
  id: number;
  title: string;
  course_code: string;
  course_name: string;
  year?: number | null;
  semester?: number | null;
  exam_type?: string | null;
  school_name?: string | null;
  department_name?: string | null;
  file_path?: string | null;
  thumbnail_url?: string | null;
  resource_type_name?: string | null;
  download_count?: number | null;
  bookmarked_at?: string | Date | null;
}

export default async function BookmarksPage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    redirect('/sign-in');
  }

  const bookmarkedDocs = await getBookmarksForUser({
    userId: user.id,
    userRole: user.role ?? undefined,
  });

  return (
    <>
      <Header onSearchClick={() => {}} />
      <BookmarksPageClient bookmarks={bookmarkedDocs as BookmarkDocument[]} />
      <BottomNav activeTab="bookmarks" />
    </>
  );
}
