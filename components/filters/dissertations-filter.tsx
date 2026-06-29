'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

type SectionKey = 'school' | 'department' | 'program' | 'course';

interface DissertationsFilterProps {
  schools: any[];
  departments: any[];
  programs: any[];
  courses: any[];
  filters: {
    schoolId: string;
    departmentId: string;
    programId: string;
    courseId: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function DissertationsFilter({
  schools,
  departments,
  programs,
  courses,
  filters,
  onFilterChange,
  onClearFilters,
  isOpen,
  onClose,
}: DissertationsFilterProps) {
  const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>({
    school: true,
    department: false,
    program: false,
    course: false,
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

  const toggleSection = (section: SectionKey) => {
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
    section: SectionKey;
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
          {options.map((option) => (
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
          ))}
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
      <div className="sticky top-0 flex items-center justify-between p-4 bg-indigo-50 lg:hidden z-40 border-b border-indigo-200">
        <h2 className="font-bold text-gray-800">Dissertations Filters</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          aria-label="Close filters"
        >
          <X size={20} />
        </button>
      </div>

      <div className="hidden lg:block p-4 bg-indigo-50 border-b border-indigo-200 flex-shrink-0">
        <h2 className="font-bold text-gray-800">Dissertations & Theses</h2>
        <p className="text-xs text-gray-900 mt-1">Browse student research</p>
      </div>

      <div className="divide-y divide-gray-200 flex-1 overflow-y-auto min-h-0">
        <FilterSection title="School" section="school" options={schools} filterKey="schoolId" />
        {filters.schoolId && (
          <FilterSection
            title="Department"
            section="department"
            options={filteredDepartments}
            filterKey="departmentId"
          />
        )}
        {filters.departmentId && (
          <FilterSection title="Program" section="program" options={filteredPrograms} filterKey="programId" />
        )}
        {filters.programId && (
          <FilterSection title="Course" section="course" options={filteredCourses} filterKey="courseId" />
        )}
      </div>

      <div className="sticky bottom-0 p-4 bg-white border-t border-gray-200 flex-shrink-0">
        <button
          onClick={onClearFilters}
          className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </aside>
  );
}
