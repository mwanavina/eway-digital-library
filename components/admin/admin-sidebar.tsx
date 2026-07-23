'use client';

import { UploadCloud, Database, LayoutGrid } from 'lucide-react';
import { Tab, AdminTabConfig } from '@/components/admin/admin-types';

interface AdminSidebarProps {
  activeTab: Tab;
  tabs: AdminTabConfig[];
  onTabChange: (tab: Tab) => void;
  onCreateClick: () => void;
  onDocumentsTabClick: () => void;
}

export function AdminSidebar({
  activeTab,
  tabs,
  onTabChange,
  onCreateClick,
  onDocumentsTabClick,
}: AdminSidebarProps) {
  return (
    <aside className="w-full min-w-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Quick actions</p>
        <div className="mt-3 space-y-2">
          <button
            onClick={() => onTabChange('upload')}
            className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:border-[#1782C5] hover:bg-blue-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <UploadCloud size={16} className="shrink-0 text-[#1782C5]" />
            <span className="break-words">Upload documents</span>
          </button>
          <button
            onClick={() => {
              onTabChange('schools');
              onCreateClick();
            }}
            className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:border-[#1782C5] hover:bg-blue-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Database size={16} className="shrink-0 text-[#1782C5]" />
            <span className="break-words">Add academic structure</span>
          </button>
        </div>
      </div>

      <div className="min-w-0 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/70">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
          <LayoutGrid size={16} className="shrink-0 text-[#1782C5]" />
          <span className="break-words">Workspace modules</span>
        </div>
        <div className="mt-3 flex flex-col gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id);
                if (tab.id === 'documents') {
                  onDocumentsTabClick();
                }
              }}
              className={`rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#1782C5] text-white'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <span className="block break-words">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
