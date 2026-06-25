'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface FilterOption {
  id?: number;
  name?: string;
  description?: string;
  school_id?: number;
  department_id?: number;
  program_id?: number;
  level_number?: number;
  code?: string;
}

type FilterSectionKey = 'school' | 'department' | 'program' | 'course' | 'year';

interface FilterSidebarProps {
  onFiltersChange: (filters: Record<string, any>) => void;
  onClearFilters?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function FilterSidebar({ onFiltersChange, onClearFilters, isOpen = true, onClose }: FilterSidebarProps) {
  const [schools, setSchools] = useState<FilterOption[]>([]);
  const [departments, setDepartments] = useState<FilterOption[]>([]);
  const [programs, setPrograms] = useState<FilterOption[]>([]);
  const [courses, setCourses] = useState<FilterOption[]>([]);
  const [levels, setLevels] = useState<FilterOption[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [semesters, setSemesters] = useState<number[]>([]);
  const [examTypes, setExamTypes] = useState<string[]>([]);

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

  const [expandedSections, setExpandedSections] = useState<Record<FilterSectionKey, boolean>>({
    school: true,
    department: true,
    course: true,
    year: true,
  });

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      const [schoolRes, yearRes, semesterRes, examRes, levelRes] = await Promise.all([
        fetch('/api/filters?type=schools'),
        fetch('/api/filters?type=years'),
        fetch('/api/filters?type=semesters'),
        fetch('/api/filters?type=examTypes'),
        fetch('/api/filters?type=levels'),
      ]);

      const [schoolData, yearData, semesterData, examData, levelData] = await Promise.all([
        schoolRes.json(),
        yearRes.json(),
        semesterRes.json(),
        examRes.json(),
        levelRes.json(),
      ]);

      setSchools(schoolData.data || []);
      setYears(yearData.data || []);
      setSemesters(semesterData.data || []);
      setExamTypes(examData.data || []);
      setLevels(levelData.data || []);
    } catch (error) {
      console.error('[v0] Error fetching filters:', error);
    }
  };

  const handleFilterChange = async (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Fetch dependent filters
    if (key === 'schoolId' && value) {
      const res = await fetch(`/api/filters?type=departments&schoolId=${value}`);
      const data = await res.json();
      setDepartments(data.data || []);
      setPrograms([]);
      setCourses([]);
      newFilters.departmentId = '';
      newFilters.programId = '';
      newFilters.courseId = '';
    }

    if (key === 'departmentId' && value) {
      const res = await fetch(`/api/filters?type=programs&departmentId=${value}`);
      const data = await res.json();
      setPrograms(data.data || []);
      setCourses([]);
      newFilters.programId = '';
      newFilters.courseId = '';
    }

    if (key === 'programId' && value) {
      const res = await fetch(`/api/filters?type=courses&programId=${value}`);
      const data = await res.json();
      setCourses(data.data || []);
      newFilters.courseId = '';
    }

    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleSection = (section: FilterSectionKey) => {
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
    showCode,
  }: {
    title: string;
    section: FilterSectionKey;
    options: FilterOption[];
    filterKey: string;
    showCode?: boolean;
  }) => (
    <div className="border-b border-gray-200">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between py-3 px-4 hover:bg-gray-50 transition-colors"
      >
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <ChevronDown
          size={18}
          className={`transition-transform ${expandedSections[section] ? 'rotate-180' : ''}`}
        />
      </button>

      {expandedSections[section] && (
        <div className="px-4 pb-3 space-y-2 max-h-60 overflow-y-auto">
          {options.map((option) => {
            const displayName = option.name || option.description || `Level ${option.level_number}`;
            const optionId = option.id || option.name || option.description;
            return (
              <label key={optionId} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name={filterKey}
                  value={optionId}
                  checked={filters[filterKey as keyof typeof filters] == optionId}
                  onChange={(e) => handleFilterChange(filterKey, e.target.value)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {showCode ? `${option.code} - ${displayName}` : displayName}
                </span>
              </label>
            );
          })}
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
      <div className="sticky top-0 flex items-center justify-between p-4 bg-[#EDD899] lg:hidden z-40">
        <h2 className="font-bold text-gray-800">Filters</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          aria-label="Close filters"
        >
          <X size={20} />
        </button>
      </div>

      <div className="hidden lg:block p-4 bg-[#EDD899] border-b border-gray-200 flex-shrink-0">
        <h2 className="font-bold text-gray-800">Filters</h2>
      </div>

      <div className="divide-y divide-gray-200 flex-1 overflow-y-auto min-h-0">
        <FilterSection
          title="School"
          section="school"
          options={schools}
          filterKey="schoolId"
        />
        {departments.length > 0 && (
          <FilterSection
            title="Department"
            section="department"
            options={departments}
            filterKey="departmentId"
          />
        )}
        {programs.length > 0 && (
          <FilterSection
            title="Program"
            section="program"
            options={programs}
            filterKey="programId"
          />
        )}
        {courses.length > 0 && (
          <FilterSection
            title="Course"
            section="course"
            options={courses}
            filterKey="courseId"
            showCode
          />
        )}
        {levels.length > 0 && (
          <FilterSection
            title="Level"
            section="level"
            options={levels.map((level) => ({
              id: level.id,
              name: `Level ${level.level_number}`,
              description: level.description,
            }))}
            filterKey="levelId"
          />
        )}
        {years.length > 0 && (
          <FilterSection
            title="Year"
            section="year"
            options={years.map((y) => ({ id: y, name: String(y) }))}
            filterKey="year"
          />
        )}
        {semesters.length > 0 && (
          <FilterSection
            title="Semester"
            section="semester"
            options={semesters.map((s) => ({ id: s, name: `Semester ${s}` }))}
            filterKey="semester"
          />
        )}
        {examTypes.length > 0 && (
          <FilterSection
            title="Exam Type"
            section="examType"
            options={examTypes.map((e) => ({ name: e }))}
            filterKey="examType"
          />
        )}
      </div>

      {/* Clear Filters Button */}
      <div className="sticky bottom-0 p-4 bg-white border-t border-gray-200 flex-shrink-0">
        <button
          onClick={onClearFilters}
          className="w-full py-2 px-4 bg-[#1F2557] text-white rounded-lg hover:bg-opacity-90 transition-all font-medium"
        >
          Clear All Filters
        </button>
      </div>
    </aside>
  );
}
