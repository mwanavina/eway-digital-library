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
        className="w-full px-4 py-3 text-left font-semibold text-gray-900 hover:bg-gray-50 flex justify-between items-center"
      >
        <span className="uppercase tracking-wide text-[11px] sm:text-xs">{title}</span>
        <span className={`transition-transform ${expandedSections[section as keyof typeof expandedSections] ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {expandedSections[section as keyof typeof expandedSections] && (
        <div className="px-4 pb-3 bg-gray-50/70">
          <div className="space-y-2 max-h-60 overflow-y-auto py-1">
            {options.map((option) => (
              <label key={String(option.id ?? option.name)} className="flex items-center gap-2 cursor-pointer rounded-lg px-2 py-1.5 hover:bg-white/70">
                <input
                  type="radio"
                  name={filterKey}
                  value={option.id ?? option.name}
                  checked={filters[filterKey as keyof typeof filters] == (option.id ?? option.name)}
                  onChange={(e) => onFilterChange(filterKey, e.target.value)}
                  className="h-4 w-4 cursor-pointer accent-[#1782C5]"
                />
                <span className="text-sm text-gray-900">{option.name || option.code || option.label}</span>
              </label>
            ))}
          </div>
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

      <div className="hidden lg:block p-4 bg-indigo-50 border-b border-indigo-200 shrink-0">
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

      <div className="sticky bottom-0 p-4 bg-white border-t border-gray-200 shrink-0">
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
