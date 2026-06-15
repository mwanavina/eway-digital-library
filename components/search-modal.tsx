'use client';

import { useState } from 'react';
import { ArrowLeft, X, Sliders } from 'lucide-react';

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

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearchChange(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearchChange('');
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

      {/* Empty State */}
      <div className="p-6 text-center">
        <p className="text-gray-600 text-sm">
          {query ? 'Type to search' : 'Start typing to search for documents'}
        </p>
      </div>
    </div>
  );
}
