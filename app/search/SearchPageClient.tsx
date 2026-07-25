'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, X, FileText, Book, BookOpen, GraduationCap } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { PDFModal } from '@/components/pdf-modal';

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

interface SearchPageClientProps {
  initialQuery: string;
  initialResults: SearchDocument[];
}

export function SearchPageClient({ initialQuery, initialResults }: SearchPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedDocument, setSelectedDocument] = useState<SearchDocument | null>(null);

  const resourceTypes = useMemo(() => [
    { id: 'past-papers', label: 'Past Papers', icon: FileText, color: '#4A90E2', count: 548 },
    { id: 'journals', label: 'Journals', icon: Book, color: '#50C878', count: 214 },
    { id: 'dissertations', label: 'Dissertations', icon: BookOpen, color: '#9B59B6', count: 187 },
    { id: 'course-outlines', label: 'Course Outlines', icon: GraduationCap, color: '#F39C12', count: 299 },
  ], []);

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  const updateSearchUrl = (value: string) => {
    const nextValue = value.trim();
    const params = new URLSearchParams(searchParams.toString());

    if (nextValue) {
      params.set('q', nextValue);
    } else {
      params.delete('q');
    }

    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;

    window.history.replaceState({}, '', nextUrl);
    router.replace(nextUrl, { scroll: false });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateSearchUrl(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    updateSearchUrl('');
  };

  const activeQuery = searchQuery.trim();
  const hasActiveSearch = Boolean(activeQuery);
  const resultsHeading = hasActiveSearch ? `${initialResults.length.toLocaleString()} results for all resources` : 'Suggested files';
  const resultsSubtitle = hasActiveSearch ? `${initialResults.length} results for "${searchQuery}"` : 'Files picked for you';

  if (!activeQuery && initialResults.length === 0) {
    return (
      <>
        <Header onSearchClick={() => {}} />
        <main className="bg-background dark:bg-slate-950 min-h-screen pb-20">
          <div className="bg-gradient-to-b from-muted to-background dark:from-slate-900 dark:to-slate-950 p-4 sticky top-16 z-30 shadow-sm">
            <div className="flex items-center gap-2 bg-background dark:bg-slate-900 border-2 border-[#1782C5] rounded-lg px-3 py-2">
              <Search size={20} className="text-gray-600" />
              <input
                type="text"
                placeholder="Papers, journals, authors..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="flex-1 outline-none text-sm"
              />
            </div>
          </div>

          <div className="px-4 py-6 space-y-4 border-t border-gray-200">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Browse by Type</h2>
            <div className="grid grid-cols-2 gap-3">
              {resourceTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-[#1782C5] transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${type.color}20` }}>
                        <IconComponent size={20} style={{ color: type.color }} />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{type.label}</p>
                    <p className="text-xs text-gray-500 mt-1">{type.count} available</p>
                  </button>
                );
              })}
            </div>
          </div>
        </main>
        <BottomNav activeTab="search" />
      </>
    );
  }

  return (
    <>
      <Header onSearchClick={() => {}} />
      <main className="bg-background dark:bg-slate-950 min-h-screen pb-20">
        <div className="bg-gradient-to-b from-gray-50 to-white p-4 sticky top-16 z-30 shadow-sm">
          <div className="flex items-center gap-2 bg-background dark:bg-slate-900 border-2 border-[#1782C5] rounded-lg px-3 py-2 mb-3">
            <Search size={20} className="text-gray-600" />
            <input
              type="text"
              placeholder="Papers, journals, authors..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 outline-none text-sm"
            />
            {searchQuery && (
              <button onClick={clearSearch} className="p-1 hover:bg-gray-100 rounded">
                <X size={18} className="text-gray-500" />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between px-1">
            <div>
              <p className="text-sm font-semibold text-gray-900">{resultsHeading}</p>
              <p className="text-xs text-gray-600">{resultsSubtitle}</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-6">
          {initialResults.length > 0 ? (
            <div className="space-y-3">
              {initialResults.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocument(doc)}
                  className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-[#1782C5] hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-slate-100">{doc.title}</p>
                      <p className="mt-1 text-xs text-gray-600 dark:text-slate-400">
                        {doc.course_name} • {doc.course_code}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-slate-500">
                        {doc.school_name ?? 'School'} • {doc.department_name ?? 'Department'}
                      </p>
                    </div>
                    <div className="rounded-full bg-[#1782C5]/10 px-2.5 py-1 text-[11px] font-semibold text-[#1782C5]">
                      {doc.resource_type_name ?? 'Document'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-sm">No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </main>
      <BottomNav activeTab="search" />
      <PDFModal
        isOpen={Boolean(selectedDocument)}
        onClose={() => setSelectedDocument(null)}
        title={selectedDocument?.title ?? ''}
        pdfUrl={selectedDocument?.file_path ?? ''}
        documentId={selectedDocument?.id ?? 0}
        onDownload={async () => Promise.resolve()}
      />
    </>
  );
}
