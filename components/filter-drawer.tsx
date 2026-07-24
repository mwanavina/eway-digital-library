'use client';

import { useEffect, useState } from 'react';
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

interface FilterDrawerInternalProps extends FilterDrawerProps {
  levels?: any[];
  years?: number[];
  semesters?: number[];
  examTypes?: string[];
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
  const [levels, setLevels] = useState<any[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [semesters, setSemesters] = useState<number[]>([]);
  const [examTypes, setExamTypes] = useState<string[]>([]);
  useEffect(() => {
    const loadFilterMeta = async () => {
      try {
        const response = await fetch('/api/filters');
        const data = await response.json();
        if (data.success) {
          setLevels(data.levels || data.data?.levels || []);
          setYears(data.years || data.data?.years || []);
          setSemesters(data.semesters || data.data?.semesters || []);
          setExamTypes(data.examTypes || data.data?.examTypes || []);
        }
      } catch (error) {
        console.error('[v0] Error loading filter metadata:', error);
      }
    };

    if (isOpen) {
      void loadFilterMeta();
    }
  }, [isOpen]);

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
    variant = 'radio',
  }: {
    title: string;
    section: ExpandedSection;
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
                const label = option.label ?? option.name ?? option.code ?? option.description ?? 'Option';
                const isActive = currentFilters[filterKey as keyof typeof currentFilters] == optionValue;

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
                    checked={currentFilters[filterKey as keyof typeof currentFilters] == (option.id ?? option.name)}
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
          )}

          {/* Semester Filter */}
          {(activeResourceType === 'all' || activeResourceType === 'past-papers') && (
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
          )}

          {/* Exam Type Filter */}
          {activeResourceType === 'past-papers' && (
            <FilterSection
              title="Exam Type"
              section="examType"
              options={[
                { value: '', label: 'Any' },
                ...examTypes.map((type) => ({ value: type, label: type })),
              ]}
              filterKey="examType"
              variant="pill"
            />
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
