'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface AllResourcesFilterProps {
  schools: any[];
  departments: any[];
  programs: any[];
  courses: any[];
  filters: {
    schoolId: string;
    departmentId: string;
    programId: string;
    courseId: string;
    levelId: string;
    year: string;
    semester: string;
    examType: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function AllResourcesFilter({
  schools,
  departments,
  programs,
  courses,
  filters,
  onFilterChange,
  onClearFilters,
  isOpen,
  onClose,
}: AllResourcesFilterProps) {
  const [expandedSections, setExpandedSections] = useState({
    school: true,
    department: false,
    program: false,
    course: false,
    year: false,
    semester: false,
  });

  const filteredDepartments = filters.schoolId
    ? departments.filter((d) => d.school_id === parseInt(filters.schoolId))
    : [];

  const filteredPrograms = filters.departmentId
    ? programs.filter((p) => p.department_id === parseInt(filters.departmentId))
    : [];

  const filteredCourses = filters.programId
    ? courses.filter((c) => c.program_id === parseInt(filters.programId))
    : [];

  const toggleSection = (section: string) => {
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
    section: string;
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
                  checked={filters[filterKey as keyof typeof filters] == option.id}
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

  return (
    <aside
      className={`fixed inset-0 lg:relative lg:inset-auto bg-white transition-all duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } lg:translate-x-0 lg:w-64 lg:border-r lg:border-gray-200 z-30 flex flex-col lg:max-h-[calc(100vh-64px)]`}
    >
      <div className="sticky top-0 flex items-center justify-between p-4 bg-gray-50 lg:hidden z-40 border-b border-gray-200">
        <h2 className="font-bold text-gray-800">All Resources Filters</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          aria-label="Close filters"
        >
          <X size={20} />
        </button>
      </div>

      <div className="hidden lg:block p-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
        <h2 className="font-bold text-gray-800">Filter Resources</h2>
        <p className="text-xs text-gray-900 mt-1">Browse all available materials</p>
      </div>

      <div className="divide-y divide-gray-200 flex-1 overflow-y-auto min-h-0">
        <FilterSection 
          title={`School${schools.length > 0 ? ` (${schools.length})` : ''}`}
          section="school" 
          options={schools} 
          filterKey="schoolId" 
        />
        {filters.schoolId && (
          <FilterSection
            title={`Department${filteredDepartments.length > 0 ? ` (${filteredDepartments.length})` : ''}`}
            section="department"
            options={filteredDepartments}
            filterKey="departmentId"
          />
        )}
        {filters.departmentId && (
          <FilterSection 
            title={`Program${filteredPrograms.length > 0 ? ` (${filteredPrograms.length})` : ''}`}
            section="program" 
            options={filteredPrograms} 
            filterKey="programId" 
          />
        )}
        {filters.programId && (
          <FilterSection 
            title={`Course${filteredCourses.length > 0 ? ` (${filteredCourses.length})` : ''}`}
            section="course" 
            options={filteredCourses} 
            filterKey="courseId" 
          />
        )}
        
        {/* Year Filter with Toggle Buttons */}
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
                  !filters.year
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
                    filters.year === year.toString()
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

        {/* Semester Filter with Toggle Buttons */}
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
                    filters.semester === (idx + 1).toString()
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
      </div>

      <div className="sticky bottom-0 p-4 bg-white border-t border-gray-200 flex-shrink-0">
        <button
          onClick={onClearFilters}
          className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </aside>
  );
}
