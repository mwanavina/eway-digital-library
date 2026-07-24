'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

type SectionKey = 'school' | 'department' | 'program' | 'course' | 'year' | 'semester';

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
  const [years, setYears] = useState<number[]>([]);
  const [semesters, setSemesters] = useState<number[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>({
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

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const response = await fetch('/api/filters');
        const data = await response.json();
        if (data.success) {
          setYears(data.years || data.data?.years || []);
          setSemesters(data.semesters || data.data?.semesters || []);
        }
      } catch (error) {
        console.error('[v0] Error loading filter metadata:', error);
      }
    };

    void loadMetadata();
  }, []);

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
    variant = 'radio',
  }: {
    title: string;
    section: SectionKey;
    options: any[];
    filterKey: string;
    variant?: 'radio' | 'pill';
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
          {options.length === 0 ? (
            <p className="text-sm text-gray-500 py-2">No options available</p>
          ) : variant === 'pill' ? (
            <div className="flex flex-wrap gap-2">
              {options.map((option) => {
                const optionValue = option.value ?? option.id ?? option.name;
                const label = option.label ?? option.name ?? option.code ?? 'Option';
                const isActive = filters[filterKey as keyof typeof filters] == optionValue;

                return (
                  <button
                    key={String(optionValue)}
                    onClick={() => onFilterChange(filterKey, String(optionValue))}
                    className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'border-[#1782C5] bg-[#1782C5] text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          ) : (
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
        
        <FilterSection
          title="Year"
          section="year"
          options={[
            { value: '', label: 'Any' },
            ...years.map((year) => ({ value: year.toString(), label: String(year) })),
          ]}
          filterKey="year"
          variant="pill"
        />

        <FilterSection
          title="Semester"
          section="semester"
          options={[
            { value: '', label: 'Any' },
            ...semesters.map((semester) => ({ value: semester.toString(), label: `Semester ${semester}` })),
          ]}
          filterKey="semester"
          variant="pill"
        />
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
