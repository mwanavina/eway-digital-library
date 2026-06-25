'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

type ResourceType = 'all' | 'past-papers' | 'journals' | 'dissertations' | 'course-outlines' | 'research-papers';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  resultsCount: number;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  currentFilters: {
    schoolId: string;
    departmentId: string;
    programId: string;
    courseId: string;
    levelId: string;
    year: string;
    semester: string;
    examType: string;
  };
  schools: any[];
  departments: any[];
  programs: any[];
  courses: any[];
  activeResourceType: ResourceType;
}

type ExpandedSection = 'school' | 'department' | 'program' | 'course' | 'year' | 'semester' | 'examType';

export interface FilterState {
  school: string;
  year: string;
  semester: string;
}

export function FilterDrawer({
  isOpen,
  onClose,
  resultsCount,
  onFilterChange,
  onClearFilters,
  currentFilters,
  schools,
  departments,
  programs,
  courses,
  activeResourceType,
}: FilterDrawerProps) {
  const [expandedSections, setExpandedSections] = useState<Record<ExpandedSection, boolean>>({
    school: true,
    department: false,
    program: false,
    course: false,
    year: false,
    semester: false,
    examType: false,
  });

  const filteredDepartments = currentFilters.schoolId
    ? departments.filter((d) => d.school_id === parseInt(currentFilters.schoolId))
    : [];

  const filteredPrograms = currentFilters.departmentId
    ? programs.filter((p) => p.department_id === parseInt(currentFilters.departmentId))
    : [];

  const filteredCourses = currentFilters.programId
    ? courses.filter((c) => c.program_id === parseInt(currentFilters.programId))
    : [];

  const toggleSection = (section: ExpandedSection) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const FilterSection = ({
    title,
    section,
    options,
    filterKey,
  }: {
    title: string;
    section: ExpandedSection;
    options: any[];
    filterKey: string;
  }) => (
    <div className="border-b border-gray-200">
      <button
        onClick={() => toggleSection(section)}
        className="w-full px-4 py-3 text-left font-medium text-gray-900 hover:bg-gray-50 flex justify-between items-center"
      >
        <span>{title}</span>
        <span className={`transition-transform ${expandedSections[section as keyof typeof expandedSections] ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {expandedSections[section as keyof typeof expandedSections] && (
        <div className="px-4 pb-3 space-y-2 max-h-60 overflow-y-auto bg-gray-50">
          {options.length === 0 ? (
            <p className="text-sm text-gray-500">No options available</p>
          ) : (
            options.map((option) => (
              <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={filterKey}
                  value={option.id}
                  checked={currentFilters[filterKey as keyof typeof currentFilters] == option.id}
                  onChange={(e) => onFilterChange(filterKey, e.target.value)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-sm text-gray-900">{option.name || option.code}</span>
              </label>
            ))
          )}
        </div>
      )}
    </div>
  );

  const getFilterTitle = () => {
    const titles: { [key in ResourceType]: string } = {
      'all': 'All Resources Filters',
      'past-papers': 'Past Papers Filters',
      'journals': 'Journals Filters',
      'dissertations': 'Dissertations Filters',
      'course-outlines': 'Course Outlines Filters',
      'research-papers': 'Research Papers Filters',
    };
    return titles[activeResourceType];
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 md:hidden max-h-[85vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-gray-200 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-900">{getFilterTitle()}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close filters"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filter Sections */}
        <div className="divide-y divide-gray-200 flex-1 overflow-y-auto min-h-0">
          <FilterSection 
            title={`School${schools.length > 0 ? ` (${schools.length})` : ''}`}
            section="school" 
            options={schools} 
            filterKey="schoolId" 
          />
          {currentFilters.schoolId && (
            <FilterSection
              title={`Department${filteredDepartments.length > 0 ? ` (${filteredDepartments.length})` : ''}`}
              section="department"
              options={filteredDepartments}
              filterKey="departmentId"
            />
          )}
          {currentFilters.departmentId && (
            <FilterSection 
              title={`Program${filteredPrograms.length > 0 ? ` (${filteredPrograms.length})` : ''}`}
              section="program" 
              options={filteredPrograms} 
              filterKey="programId" 
            />
          )}
          {currentFilters.programId && (
            <FilterSection 
              title={`Course${filteredCourses.length > 0 ? ` (${filteredCourses.length})` : ''}`}
              section="course" 
              options={filteredCourses} 
              filterKey="courseId" 
            />
          )}
          
          {/* Year Filter */}
          {(activeResourceType === 'all' || activeResourceType === 'past-papers') && (
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleSection('year')}
                className="w-full px-4 py-3 text-left font-medium text-gray-900 hover:bg-gray-50 flex justify-between items-center"
              >
                <span>YEAR</span>
                <span className={`transition-transform ${expandedSections.year ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {expandedSections.year && (
                <div className="px-4 pb-3 space-y-2 bg-gray-50 flex flex-wrap gap-2">
                  <button
                    onClick={() => onFilterChange('year', '')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      !currentFilters.year
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Any
                  </button>
                  {[2024, 2023, 2022, 2021].map((year) => (
                    <button
                      key={year}
                      onClick={() => onFilterChange('year', year.toString())}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        currentFilters.year === year.toString()
                          ? 'bg-blue-500 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Semester Filter */}
          {(activeResourceType === 'all' || activeResourceType === 'past-papers') && (
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleSection('semester')}
                className="w-full px-4 py-3 text-left font-medium text-gray-900 hover:bg-gray-50 flex justify-between items-center"
              >
                <span>SEMESTER</span>
                <span className={`transition-transform ${expandedSections.semester ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {expandedSections.semester && (
                <div className="px-4 pb-3 space-y-2 bg-gray-50 flex flex-wrap gap-2">
                  {['Sem 1', 'Sem 2'].map((sem, idx) => (
                    <button
                      key={idx}
                      onClick={() => onFilterChange('semester', (idx + 1).toString())}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        currentFilters.semester === (idx + 1).toString()
                          ? 'bg-blue-500 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {sem}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Exam Type Filter */}
          {activeResourceType === 'past-papers' && (
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleSection('examType')}
                className="w-full px-4 py-3 text-left font-medium text-gray-900 hover:bg-gray-50 flex justify-between items-center"
              >
                <span>EXAM TYPE</span>
                <span className={`transition-transform ${expandedSections.examType ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {expandedSections.examType && (
                <div className="px-4 pb-3 space-y-2 bg-gray-50 flex flex-wrap gap-2">
                  {['Midterm', 'Final', 'Quiz'].map((type) => (
                    <button
                      key={type}
                      onClick={() => onFilterChange('examType', type)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        currentFilters.examType === type
                          ? 'bg-blue-500 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 flex gap-3 p-4 border-t border-gray-200 bg-white z-10">
          <button
            onClick={onClearFilters}
            className="flex-1 px-4 py-3 rounded-lg font-semibold text-sm text-gray-900 border-2 border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-lg font-semibold text-sm text-white bg-[#1782C5] hover:bg-[#1470a8] transition-colors"
          >
            Show {resultsCount.toLocaleString()} results
          </button>
        </div>
      </div>
    </>
  );
}
