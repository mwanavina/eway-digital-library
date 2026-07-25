import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/server/session';
import { getDocumentsForUser } from '@/lib/db/queries/documents';
import { SearchPageClient } from './SearchPageClient';

interface SearchDocument {
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
}

interface SearchPageProps {
  searchParams?: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    redirect('/sign-in');
  }

  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.q?.trim() ?? '';

  const documents = query
    ? await getDocumentsForUser({
        userId: user.id,
        userRole: user.role ?? undefined,
        search: query,
      })
    : [];

  return (
    <Suspense fallback={null}>
      <SearchPageClient initialQuery={query} initialResults={documents as SearchDocument[]} />
    </Suspense>
  );
}
