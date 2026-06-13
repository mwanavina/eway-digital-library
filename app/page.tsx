'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/header';
import { FilterSidebar } from '@/components/filter-sidebar';
import { DocumentCard } from '@/components/document-card';
import { ResourceCard } from '@/components/resource-card';
import { BottomNav } from '@/components/bottom-nav';
import { Spinner } from '@/components/ui/spinner';
import { Empty } from '@/components/ui/empty';
import { AllResourcesFilter } from '@/components/filters/all-resources-filter';
import { PastPapersFilter } from '@/components/filters/past-papers-filter';
import { JournalsFilter } from '@/components/filters/journals-filter';
import { DissertationsFilter } from '@/components/filters/dissertations-filter';
import { CourseOutlinesFilter } from '@/components/filters/course-outlines-filter';
import { FileText, BookOpen, Book, ClipboardList, Microscope, Menu } from 'lucide-react';

interface Document {
  id: number;
  title: string;
  course_code: string;
  course_name: string;
  year?: number;
  semester?: number;
  exam_type?: string;
  school_name: string;
  department_name: string;
  file_path: string;
  thumbnail_url?: string;
  download_count?: number;
  resource_type_id?: number;
  resource_type_name?: string;
  author?: string;
  publication_date?: string;
  abstract?: string;
}

type ResourceType = 'all' | 'past-papers' | 'journals' | 'dissertations' | 'course-outlines' | 'research-papers';

const RESOURCE_TYPES = [
  { id: 'all', name: 'All Resources', icon: FileText, color: '#6B7280' },
  { id: 'past-papers', name: 'Past Papers', icon: FileText, color: '#1782C5' },
  { id: 'journals', name: 'Journals', icon: BookOpen, color: '#1F2557' },
  { id: 'dissertations', name: 'Dissertations', icon: Book, color: '#8B5A8F' },
  { id: 'course-outlines', name: 'Course Outlines', icon: ClipboardList, color: '#F59E0B' },
  { id: 'research-papers', name: 'Research Papers', icon: Microscope, color: '#10B981' },
];

export default function Home() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeResourceType, setActiveResourceType] = useState<ResourceType>('all');
  const [schools, setSchools] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    schoolId: '',
    departmentId: '',
    programId: '',
    courseId: '',
    levelId: '',
    year: '',
    semester: '',
    examType: '',
  });

  // Fetch documents based on current filters and search
  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      // Add resource type filter
      if (activeResourceType !== 'all') {
        const typeMap: { [key: string]: string } = {
          'past-papers': 'Past Papers',
          'journals': 'Journals',
          'dissertations': 'Dissertations',
          'course-outlines': 'Course Outlines',
          'research-papers': 'Research Papers',
        };
        params.append('resourceType', typeMap[activeResourceType]);
      }

      // Add other filters
      if (filters.schoolId) params.append('schoolId', filters.schoolId);
      if (filters.departmentId) params.append('departmentId', filters.departmentId);
      if (filters.courseId) params.append('courseId', filters.courseId);
      if (filters.year) params.append('year', filters.year);
      if (filters.semester) params.append('semester', filters.semester);
      if (filters.examType) params.append('examType', filters.examType);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/documents?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setDocuments(data.data);
      }
    } catch (error) {
      console.error('[v0] Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery, activeResourceType]);

  // Fetch documents on mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Fetch filter options on mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch('/api/filters');
        const data = await response.json();
        if (data.success) {
          setSchools(data.schools || []);
          setDepartments(data.departments || []);
          setPrograms(data.programs || []);
          setCourses(data.courses || []);
        }
      } catch (error) {
        console.error('[v0] Error fetching filter options:', error);
      }
    };
    fetchFilterOptions();
  }, []);

  // Handle resource type change - reset filters
  const handleResourceTypeChange = (newType: ResourceType) => {
    setActiveResourceType(newType);
    setFilters({
      schoolId: '',
      departmentId: '',
      programId: '',
      courseId: '',
      levelId: '',
      year: '',
      semester: '',
      examType: '',
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      schoolId: '',
      departmentId: '',
      programId: '',
      courseId: '',
      levelId: '',
      year: '',
      semester: '',
      examType: '',
    });
  };

  // Fetch documents when filters or search change (with debounce)
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery || Object.values(filters).some((v) => v !== '') || activeResourceType !== 'all') {
        fetchDocuments();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [filters, searchQuery, fetchDocuments, activeResourceType]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // Calculate active filter count
  const activeFilterCount = Object.values(filters).filter((v) => v !== '').length + (searchQuery ? 1 : 0);



  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header 
        onSearchChange={handleSearchChange} 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        activeFilterCount={activeFilterCount}
      />
      {/* Bottom Nav - Mobile Only */}
      <div className="lg:hidden">
        <BottomNav activeTab="browse" />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Filter Sidebar - Desktop Only */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-gray-200 bg-white overflow-y-auto">
          {activeResourceType === 'all' && (
            <AllResourcesFilter
              schools={schools}
              departments={departments}
              programs={programs}
              courses={courses}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              isOpen={true}
              onClose={() => {}}
              resultsCount={documents.length}
            />
          )}
          {activeResourceType === 'past-papers' && (
            <PastPapersFilter
              schools={schools}
              departments={departments}
              programs={programs}
              courses={courses}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              isOpen={true}
              onClose={() => {}}
              resultsCount={documents.length}
            />
          )}
          {(activeResourceType === 'journals' || activeResourceType === 'research-papers') && (
            <JournalsFilter
              schools={schools}
              departments={departments}
              programs={programs}
              courses={courses}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              isOpen={true}
              onClose={() => {}}
              resultsCount={documents.length}
            />
          )}
          {activeResourceType === 'dissertations' && (
            <DissertationsFilter
              schools={schools}
              departments={departments}
              programs={programs}
              courses={courses}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              isOpen={true}
              onClose={() => {}}
              resultsCount={documents.length}
            />
          )}
          {activeResourceType === 'course-outlines' && (
            <CourseOutlinesFilter
              schools={schools}
              departments={departments}
              programs={programs}
              courses={courses}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              isOpen={true}
              onClose={() => {}}
              resultsCount={documents.length}
            />
          )}
        </aside>

        {/* Mobile Filter Sidebar */}
        {sidebarOpen && (
          <>
            {activeResourceType === 'all' && (
              <AllResourcesFilter
                schools={schools}
                departments={departments}
                programs={programs}
                courses={courses}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                resultsCount={documents.length}
              />
            )}
            {activeResourceType === 'past-papers' && (
              <PastPapersFilter
                schools={schools}
                departments={departments}
                programs={programs}
                courses={courses}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                resultsCount={documents.length}
              />
            )}
            {(activeResourceType === 'journals' || activeResourceType === 'research-papers') && (
              <JournalsFilter
                schools={schools}
                departments={departments}
                programs={programs}
                courses={courses}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                resultsCount={documents.length}
              />
            )}
            {activeResourceType === 'dissertations' && (
              <DissertationsFilter
                schools={schools}
                departments={departments}
                programs={programs}
                courses={courses}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                resultsCount={documents.length}
              />
            )}
            {activeResourceType === 'course-outlines' && (
              <CourseOutlinesFilter
                schools={schools}
                departments={departments}
                programs={programs}
                courses={courses}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                resultsCount={documents.length}
              />
            )}
          </>
        )}

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto bg-white pb-20 lg:pb-0">
          <div className="p-4 md:p-6">
            {/* Resource Type Pills - Horizontal Scroll */}
            <div className="mb-4 lg:mb-6 flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              {RESOURCE_TYPES.map((type) => {
                const isActive = activeResourceType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => handleResourceTypeChange(type.id as ResourceType)}
                    className={`flex-shrink-0 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-medium transition-all ${
                      isActive
                        ? 'text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    style={isActive ? { backgroundColor: type.color } : {}}
                  >
                    {type.name}
                  </button>
                );
              })}
            </div>

            {/* Results Header with Sort */}
            <div className="mb-4 lg:mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="text-gray-700 text-xs lg:text-sm font-medium">
                  {documents.length.toLocaleString()} results for {searchQuery ? `"${searchQuery}"` : 'all resources'}
                </p>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <select className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 bg-white">
                  <option>Sort by</option>
                  <option>Most downloaded</option>
                  <option>Newest</option>
                  <option>Oldest</option>
                </select>
                <select className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 bg-white">
                  <option>Most downloaded</option>
                  <option>Least downloaded</option>
                </select>
              </div>
            </div>

            {/* Documents Grid - 1 Column on Mobile, 2 on Desktop */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Spinner />
              </div>
            ) : documents.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {documents.map((doc) => (
                  <ResourceCard
                    key={doc.id}
                    id={doc.id}
                    title={doc.title}
                    resourceType={doc.resource_type_name || 'Past Papers'}
                    courseName={doc.course_name}
                    courseCode={doc.course_code}
                    departmentName={doc.department_name}
                    schoolName={doc.school_name}
                    filePath={doc.file_path}
                    thumbnailUrl={doc.thumbnail_url}
                    author={doc.author}
                    publicationDate={doc.publication_date}
                    abstract={doc.abstract}
                    year={doc.year}
                    semester={doc.semester}
                    examType={doc.exam_type}
                    downloadCount={doc.download_count}
                  />
                ))}
              </div>
            ) : (
              <Empty
                title="No documents found"
                description="Try adjusting your filters or search query"
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
