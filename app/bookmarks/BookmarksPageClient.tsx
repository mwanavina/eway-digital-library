'use client';

import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { DocumentCard } from '@/components/document-card';

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

interface BookmarksPageClientProps {
  bookmarks: BookmarkDocument[];
}

export function BookmarksPageClient({ bookmarks }: BookmarksPageClientProps) {
  const [items, setItems] = useState(bookmarks);

  const handleRemoveBookmark = (documentId: number) => {
    setItems((current) => current.filter((item) => item.id !== documentId));
  };

  return (
    <main className="min-h-screen bg-background pb-20 dark:bg-slate-950">
      <section className="border-b border-gray-200/80 bg-white/80 px-4 py-6 dark:border-slate-800 dark:bg-slate-950/80 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1782C5]/10">
              <Bookmark size={24} className="text-[#1782C5]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">My Bookmarks</h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Keep your saved resources handy and easy to revisit.
              </p>
            </div>
          </div>

          <div className="rounded-full border border-[#1782C5]/20 bg-[#1782C5]/10 px-3 py-2 text-sm font-medium text-[#1782C5] dark:border-[#1782C5]/30 dark:bg-[#1782C5]/15">
            {items.length} saved {items.length === 1 ? 'resource' : 'resources'}
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {items.length > 0 ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {items.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  id={doc.id}
                  title={doc.title}
                  courseName={doc.course_name}
                  courseCode={doc.course_code}
                  year={doc.year ?? 0}
                  semester={doc.semester ?? 0}
                  examType={doc.exam_type ?? ''}
                  schoolName={doc.school_name ?? 'Unknown'}
                  departmentName={doc.department_name ?? 'Unknown'}
                  filePath={doc.file_path ?? ''}
                  thumbnailUrl={doc.thumbnail_url ?? undefined}
                  showRemoveBookmark
                  onRemove={handleRemoveBookmark}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 py-16 text-center dark:border-slate-700 dark:bg-slate-900/60">
              <Bookmark size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">No bookmarked resources yet</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Save items from the library to see them here.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
