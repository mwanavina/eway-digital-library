'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, X, Sliders } from 'lucide-react';

interface SearchResult {
  id: number;
  title: string;
  course_code: string;
  course_name: string;
  school_name?: string | null;
  department_name?: string | null;
  resource_type_name?: string | null;
  file_path?: string | null;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchChange: (query: string) => void;
  onFilterClick: () => void;
  searchQuery: string;
}

export function SearchModal({
  isOpen,
  onClose,
  onSearchChange,
  onFilterClick,
  searchQuery,
}: SearchModalProps) {
  const [query, setQuery] = useState(searchQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (!isOpen) return;

    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    const runSearch = async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/documents?search=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
          cache: 'no-store',
        });
        const payload = await response.json();
        if (!controller.signal.aborted && payload.success) {
          setResults(payload.data ?? []);
        }
      } catch {
        setResults([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    };

    runSearch();
    return () => controller.abort();
  }, [isOpen, query]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearchChange(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearchChange('');
    setResults([]);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3">
          {/* Back Button */}
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft size={20} className="text-gray-900" />
          </button>

          {/* Search Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search papers, journals..."
              value={query}
              onChange={handleChange}
              autoFocus
              className="w-full px-4 py-2.5 bg-gray-100 text-gray-900 placeholder-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1782C5] focus:bg-white transition-all"
              autoComplete="off"
            />

            {/* Clear Button */}
            {query && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded transition-colors"
                aria-label="Clear search"
              >
                <X size={16} className="text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Button Below Search */}
      <div className="px-4 py-3 border-b border-gray-200">
        <button
          onClick={onFilterClick}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1782C5] text-white font-semibold text-sm rounded-lg hover:bg-[#1568a8] transition-colors"
        >
          <Sliders size={16} />
          Advanced Filters
        </button>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {isSearching ? (
          <div className="py-8 text-center text-sm text-gray-600">Searching...</div>
        ) : query.trim() ? (
          results.length > 0 ? (
            <div className="space-y-2">
              {results.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.file_path ?? '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-lg border border-gray-200 bg-white p-3 text-left shadow-sm transition hover:border-[#1782C5]"
                >
                  <p className="text-sm font-semibold text-gray-900">{doc.title}</p>
                  <p className="mt-1 text-xs text-gray-600">
                    {doc.course_name} • {doc.course_code}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {doc.school_name ?? 'School'} • {doc.department_name ?? 'Department'}
                  </p>
                </a>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-gray-600">No documents found</div>
          )
        ) : (
          <div className="py-8 text-center text-sm text-gray-600">Start typing to search for documents</div>
        )}
      </div>
    </div>
  );
}
