'use client';

import { Plus } from 'lucide-react';
import { AdminTable } from '@/components/admin/admin-table';
import { AdminUploadForm } from '@/components/admin/upload-form';
import { AdminDocumentList } from '@/components/admin/document-list';
import { Tab, AdminItem } from '@/components/admin/admin-types';

interface AdminContentProps {
  activeTab: Tab;
  schools: AdminItem[];
  departments: AdminItem[];
  programs: AdminItem[];
  courses: AdminItem[];
  levels: AdminItem[];
  documents: AdminItem[];
  loading: boolean;
  onCreateClick: () => void;
  onEdit: (item: AdminItem) => void;
  onDelete: (item: AdminItem) => void;
  onUploadSuccess: () => void;
}

export function AdminContent({
  activeTab,
  schools,
  departments,
  programs,
  courses,
  levels,
  documents,
  loading,
  onCreateClick,
  onEdit,
  onDelete,
  onUploadSuccess,
}: AdminContentProps) {
  const activeSectionTitles: Record<Tab, { title: string; subtitle: string; actionLabel: string }> = {
    upload: {
      title: 'Upload documents',
      subtitle: 'Add new papers, journals, and other academic resources to the library.',
      actionLabel: 'Upload documents',
    },
    documents: {
      title: 'All documents',
      subtitle: 'Review and manage every uploaded resource in one place.',
      actionLabel: 'Upload documents',
    },
    schools: {
      title: 'Schools',
      subtitle: 'Create and manage the schools that power the platform.',
      actionLabel: 'Add school',
    },
    departments: {
      title: 'Departments',
      subtitle: 'Keep departments aligned with the right school.',
      actionLabel: 'Add department',
    },
    programs: {
      title: 'Programs',
      subtitle: 'Manage the academic programs students can browse.',
      actionLabel: 'Add program',
    },
    courses: {
      title: 'Courses',
      subtitle: 'Organize the course catalog and their program links.',
      actionLabel: 'Add course',
    },
    levels: {
      title: 'Levels',
      subtitle: 'Define the student progression levels used across the platform.',
      actionLabel: 'Add level',
    },
  };

  const activeMeta = activeSectionTitles[activeTab];

  return (
    <div className="min-w-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Workspace controls</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Move between management areas and keep the library organized.</p>
        </div>
        <div className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          Live workspace
        </div>
      </div>

      <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6">
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{activeMeta.title}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{activeMeta.subtitle}</p>
            </div>
            <AdminUploadForm
              schools={schools}
              departments={departments}
              programs={programs}
              courses={courses}
              levels={levels}
              onSuccess={onUploadSuccess}
            />
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{activeMeta.title}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{activeMeta.subtitle}</p>
            </div>
            <AdminDocumentList documents={documents} onDelete={onUploadSuccess} />
          </div>
        )}

        {(activeTab === 'schools' || activeTab === 'departments' || activeTab === 'programs' || activeTab === 'courses' || activeTab === 'levels') && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{activeMeta.title}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{activeMeta.subtitle}</p>
              </div>
              <button
                onClick={onCreateClick}
                className="flex items-center gap-2 rounded-lg bg-[#1782C5] px-4 py-2 text-white transition-colors hover:bg-[#1F2557]"
              >
                <Plus size={18} />
                {activeMeta.actionLabel}
              </button>
            </div>
            <AdminTable
              columns={
                activeTab === 'schools'
                  ? [{ key: 'name', label: 'Name' }]
                  : activeTab === 'departments'
                  ? [
                      { key: 'name', label: 'Department' },
                      { key: 'school_name', label: 'School' },
                    ]
                  : activeTab === 'programs'
                  ? [
                      { key: 'name', label: 'Program' },
                      { key: 'department_name', label: 'Department' },
                      { key: 'school_name', label: 'School' },
                    ]
                  : activeTab === 'courses'
                  ? [
                      { key: 'code', label: 'Code' },
                      { key: 'name', label: 'Course' },
                      { key: 'program_name', label: 'Program' },
                    ]
                  : [{ key: 'level_number', label: 'Level' }, { key: 'description', label: 'Description' }]
              }
              data={
                activeTab === 'schools'
                  ? schools
                  : activeTab === 'departments'
                  ? departments
                  : activeTab === 'programs'
                  ? programs
                  : activeTab === 'courses'
                  ? courses
                  : levels
              }
              onEdit={onEdit}
              onDelete={onDelete}
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
