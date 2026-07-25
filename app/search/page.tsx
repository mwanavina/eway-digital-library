'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, FileText, Book, BookOpen, GraduationCap } from 'lucide-react';
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

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchDocument[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<SearchDocument | null>(null);

  const resourceTypes = useMemo(() => [
    { id: 'past-papers', label: 'Past Papers', icon: FileText, color: '#4A90E2', count: 548 },
    { id: 'journals', label: 'Journals', icon: Book, color: '#50C878', count: 214 },
    { id: 'dissertations', label: 'Dissertations', icon: BookOpen, color: '#9B59B6', count: 187 },
    { id: 'course-outlines', label: 'Course Outlines', icon: GraduationCap, color: '#F39C12', count: 299 },
  ], []);

  useEffect(() => {
    const query = searchParams.get('q') ?? '';
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    let ignore = false;
    const controller = new AbortController();

    const runSearch = async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/documents?search=${encodeURIComponent(query)}`, {
          signal: controller.signal,
          cache: 'no-store',
        });
        const payload = await response.json();

        if (!ignore && payload.success) {
          setSearchResults(payload.data ?? []);
          setRecentSearches((prev) => {
            const next = [query, ...prev.filter((item) => item.toLowerCase() !== query.toLowerCase())];
            return next.slice(0, 6);
          });
        }
      } catch (error) {
        if (!ignore && (error as Error).name !== 'AbortError') {
          setSearchResults([]);
        }
      } finally {
        if (!ignore) {
          setIsSearching(false);
        }
      }
    };

    runSearch();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [searchParams]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    const params = new URLSearchParams(searchParams.toString());

    if (query.trim()) {
      params.set('q', query.trim());
    } else {
      params.delete('q');
    }

    router.replace(`/search?${params.toString()}`);
  };

  const handleRemoveRecent = (search: string) => {
    setRecentSearches((prev) => prev.filter((item) => item !== search));
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    router.replace(`/search?${params.toString()}`);
  };

  const activeQuery = searchQuery.trim();

  // Initial search state
  if (!activeQuery && searchResults.length === 0) {
    return (
      <>
        <Header onSearchClick={() => {}} />
        <main className="bg-background dark:bg-slate-950 min-h-screen pb-20">
          {/* Search Header */}
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

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="px-4 py-6 space-y-4">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Recent Searches</h2>
              <div className="space-y-2">
                {recentSearches.map((search) => (
                  <div key={search} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Search size={16} className="text-gray-500 flex-shrink-0" />
                      <button
                        onClick={() => handleSearch(search)}
                        className="text-sm text-gray-700 hover:text-[#1782C5] font-medium truncate text-left"
                      >
                        {search}
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveRecent(search)}
                      className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
                      aria-label="Remove search"
                    >
                      <X size={16} className="text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Browse by Type */}
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
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${type.color}20` }}
                      >
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

  // Search results state
  return (
    <>
      <Header onSearchClick={() => {}} />
      <main className="bg-background dark:bg-slate-950 min-h-screen pb-20">
        {/* Search Header with Results Count */}
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
              <p className="text-sm font-semibold text-gray-900">All ({searchResults.length})</p>
              <p className="text-xs text-gray-600">{searchResults.length} results for "{searchQuery}"</p>
            </div>
            <div className="flex gap-1">
              <button className="px-3 py-1 bg-[#1782C5] text-white text-xs font-semibold rounded-full">
                All ({searchResults.length})
              </button>
              <button className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded-full hover:bg-gray-300">
                Past Papers (2)
              </button>
              <button className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded-full hover:bg-gray-300">
                Journals (1)
              </button>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="px-4 py-6">
          {isSearching ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500">Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((doc) => (
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
