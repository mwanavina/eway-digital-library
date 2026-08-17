'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  isMinimized?: boolean;
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
  isMinimized = false,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const quickActionTabs = ['upload', 'documents'];
  const academicTabs = ['schools', 'departments', 'programs', 'courses', 'levels', 'resource-types'];
  const systemTabs = ['users', 'analytics'];
  const isUploadActive = activeTab === 'upload' || pathname === '/admin/upload';
  const isDocumentsActive = pathname === '/admin/documents' || (pathname !== '/admin' && activeTab === 'documents');

  // Minimized view with icon buttons
  if (isMinimized) {
    return (
      <aside className="flex h-full flex-col items-center gap-2">
        {/* Quick Actions */}
        <Link
          href="/admin/upload"
          className={cn(
            'rounded-lg p-2.5 transition-all duration-200 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
            isUploadActive && 'bg-linear-to-r from-[#1782C5] to-[#1F2557] text-white shadow-md'
          )}
          title="Upload Documents"
        >
          <UploadCloud size={20} />
        </Link>
        <Link
          href="/admin/documents"
          className={cn(
            'rounded-lg p-2.5 transition-all duration-200 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
            isDocumentsActive && 'bg-linear-to-r from-[#1782C5] to-[#1F2557] text-white shadow-md'
          )}
          title="Manage Documents"
        >
          <FileText size={20} />
        </Link>
        <button
          onClick={() => {
            onTabChange('schools');
            onCreateClick();
          }}
          className={cn(
            'rounded-lg p-2.5 transition-all duration-200',
            activeTab === 'schools'
              ? 'bg-linear-to-r from-[#1782C5] to-[#1F2557] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
          )}
          title="Add Structure"
        >
          <Database size={20} />
        </button>

        <div className="my-1 h-px w-6 bg-slate-200 dark:bg-slate-700" />

        {/* Academic Management Icons */}
        {tabs
          .filter((tab) => academicTabs.includes(tab.id))
          .map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'rounded-lg p-2.5 transition-all duration-200',
                activeTab === tab.id
                  ? 'bg-linear-to-r from-[#1782C5] to-[#1F2557] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              )}
              title={tab.label}
            >
              {iconMap[tab.id]}
            </button>
          ))}

        <div className="my-1 h-px w-6 bg-slate-200 dark:bg-slate-700" />

        {/* System & Monitoring Icons */}
        {tabs
          .filter((tab) => systemTabs.includes(tab.id))
          .map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'rounded-lg p-2.5 transition-all duration-200',
                activeTab === tab.id
                  ? 'bg-linear-to-r from-[#1782C5] to-[#1F2557] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              )}
              title={tab.label}
            >
              {iconMap[tab.id]}
            </button>
          ))}

        {/* Spacer */}
        <div className="flex-1" />
      </aside>
    );
  }

  return (
    <aside className="flex h-full flex-col">
      {/* Quick Actions */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Quick Actions</h3>
        <div className="mt-3 space-y-2">
          <Link
            href="/admin"
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
              pathname === '/admin' && 'bg-linear-to-r from-[#1782C5] to-[#1F2557] text-white shadow-md'
            )}
          >
            <LayoutGrid size={18} className="shrink-0" />
            <span>Admin Home</span>
          </Link>
          <Link
            href="/admin/upload"
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
              isUploadActive && 'bg-linear-to-r from-[#1782C5] to-[#1F2557] text-white shadow-md'
            )}
          >
            <UploadCloud size={18} className="shrink-0" />
            <span>Upload Documents</span>
          </Link>
          <Link
            href="/admin/documents"
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
              isDocumentsActive && 'bg-linear-to-r from-[#1782C5] to-[#1F2557] text-white shadow-md'
            )}
          >
            <FileText size={18} className="shrink-0" />
            <span>Manage Documents</span>
          </Link>
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
                    ? 'bg-linear-to-r from-[#1782C5] to-[#1F2557] text-white shadow-md'
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
                    ? 'bg-linear-to-r from-[#1782C5] to-[#1F2557] text-white shadow-md'
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
      {pathname !== '/admin' && (
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
                    isDocumentsActive
                      ? 'bg-linear-to-r from-[#1782C5] to-[#1F2557] text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  )}
                >
                  <span className="shrink-0">{iconMap[tab.id]}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Footer Info */}
      {/* <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Library Version</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">Admin Panel v2.0</p>
      </div> */}
    </aside>
  );
}
