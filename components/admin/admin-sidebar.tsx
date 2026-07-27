'use client';

import {
  UploadCloud,
  Database,
  LayoutGrid,
  FileText,
  Users,
  BarChart3,
  Building2,
  BookOpen,
  GraduationCap,
  Grid3x3,
  Tag,
} from 'lucide-react';
import { Tab, AdminTabConfig } from '@/components/admin/admin-types';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  activeTab: Tab;
  tabs: AdminTabConfig[];
  onTabChange: (tab: Tab) => void;
  onCreateClick: () => void;
  onDocumentsTabClick: () => void;
}

const iconMap: Record<Tab, React.ReactNode> = {
  upload: <UploadCloud size={18} />,
  documents: <FileText size={18} />,
  users: <Users size={18} />,
  analytics: <BarChart3 size={18} />,
  schools: <Building2 size={18} />,
  departments: <BookOpen size={18} />,
  programs: <GraduationCap size={18} />,
  courses: <Grid3x3 size={18} />,
  levels: <Tag size={18} />,
  'resource-types': <Tag size={18} />,
};

export function AdminSidebar({
  activeTab,
  tabs,
  onTabChange,
  onCreateClick,
  onDocumentsTabClick,
}: AdminSidebarProps) {
  const quickActionTabs = ['upload', 'documents'];
  const academicTabs = ['schools', 'departments', 'programs', 'courses', 'levels', 'resource-types'];
  const systemTabs = ['users', 'analytics'];

  return (
    <aside className="flex h-full flex-col">
      {/* Quick Actions */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Quick Actions</h3>
        <div className="mt-3 space-y-2">
          <button
            onClick={() => onTabChange('upload')}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200',
              activeTab === 'upload'
                ? 'bg-gradient-to-r from-[#1782C5] to-[#1F2557] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            )}
          >
            <UploadCloud size={18} className="shrink-0" />
            <span>Upload Documents</span>
          </button>
          <button
            onClick={() => {
              onTabChange('schools');
              onCreateClick();
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Database size={18} className="shrink-0" />
            <span>Add Structure</span>
          </button>
        </div>
      </div>

      {/* Academic Management */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Academic Management</h3>
        <div className="mt-3 space-y-1">
          {tabs
            .filter((tab) => academicTabs.includes(tab.id))
            .map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200',
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#1782C5] to-[#1F2557] text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                )}
              >
                <span className="shrink-0">{iconMap[tab.id]}</span>
                <span>{tab.label}</span>
              </button>
            ))}
        </div>
      </div>

      {/* System & Monitoring */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">System & Monitoring</h3>
        <div className="mt-3 space-y-1">
          {tabs
            .filter((tab) => systemTabs.includes(tab.id))
            .map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  if (tab.id === 'documents') {
                    onDocumentsTabClick();
                  }
                }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200',
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#1782C5] to-[#1F2557] text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                )}
              >
                <span className="shrink-0">{iconMap[tab.id]}</span>
                <span>{tab.label}</span>
              </button>
            ))}
        </div>
      </div>

      {/* Documents & Library */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Library</h3>
        <div className="mt-3 space-y-1">
          {tabs
            .filter((tab) => tab.id === 'documents')
            .map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  onDocumentsTabClick();
                }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200',
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#1782C5] to-[#1F2557] text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                )}
              >
                <span className="shrink-0">{iconMap[tab.id]}</span>
                <span>{tab.label}</span>
              </button>
            ))}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Footer Info */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Library Version</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">Admin Panel v2.0</p>
      </div>
    </aside>
  );
}
