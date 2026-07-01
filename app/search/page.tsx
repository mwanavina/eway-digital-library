'use client';

import { useState } from 'react';
import { Search, X, FileText, Book, BookOpen, GraduationCap } from 'lucide-react';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { DocumentCard } from '@/components/document-card';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState([
    'Database systems',
    'Network security 2023',
    'Calculus I midterm',
  ]);

  // Mock documents for demo
  const mockDocuments = [
    {
      id: 1,
      title: 'Database Systems',
      courseName: 'Data Management',
      courseCode: 'IT304',
      year: 2024,
      semester: 1,
      examType: 'End-semester',
      schoolName: 'School of ICT',
      departmentName: 'Computer Science',
      filePath: '/sample.pdf',
    },
    {
      id: 2,
      title: 'Database Systems Mid-semester 2023',
      courseName: 'Data Management',
      courseCode: 'IT304',
      year: 2023,
      semester: 1,
      examType: 'Mid-semester',
      schoolName: 'School of ICT',
      departmentName: 'Computer Science',
      filePath: '/sample.pdf',
    },
    {
      id: 3,
      title: 'NoSQL vs Relational Database Systems',
      courseName: 'Advanced Databases',
      courseCode: 'IT405',
      year: 2024,
      semester: 2,
      examType: 'Journal',
      schoolName: 'School of ICT',
      departmentName: 'Computer Science',
      filePath: '/sample.pdf',
    },
    {
      id: 4,
      title: 'IT304 Course Outline — Database...',
      courseName: 'Data Management',
      courseCode: 'IT304',
      year: 2024,
      semester: 2,
      examType: 'Course Outline',
      schoolName: 'School of ICT',
      departmentName: 'Computer Science',
      filePath: '/sample.pdf',
    },
  ];

  const resourceTypes = [
    { id: 'past-papers', label: 'Past Papers', icon: FileText, color: '#4A90E2', count: 548 },
    { id: 'journals', label: 'Journals', icon: Book, color: '#50C878', count: 214 },
    { id: 'dissertations', label: 'Dissertations', icon: BookOpen, color: '#9B59B6', count: 187 },
    { id: 'course-outlines', label: 'Course Outlines', icon: GraduationCap, color: '#F39C12', count: 299 },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setIsSearching(true);
      // Simulate search delay
      setTimeout(() => {
        setSearchResults(mockDocuments);
        setIsSearching(false);
        // Add to recent searches if not already there
        if (!recentSearches.includes(query)) {
          setRecentSearches([query, ...recentSearches.slice(0, 4)]);
        }
      }, 300);
    } else {
      setSearchResults([]);
    }
  };

  const handleRemoveRecent = (search: string) => {
    setRecentSearches(recentSearches.filter((s) => s !== search));
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  // Initial search state
  if (!searchQuery && searchResults.length === 0) {
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

        {/* Results Grid */}
        <div className="px-4 py-6">
          {isSearching ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500">Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid gap-4">
              {searchResults.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  id={doc.id}
                  title={doc.title}
                  courseName={doc.courseName}
                  courseCode={doc.courseCode}
                  year={doc.year}
                  semester={doc.semester}
                  examType={doc.examType}
                  schoolName={doc.schoolName}
                  departmentName={doc.departmentName}
                  filePath={doc.filePath}
                />
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
    </>
  );
}
