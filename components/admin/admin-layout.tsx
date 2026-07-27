'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  content: React.ReactNode;
}

export function AdminLayout({ sidebar, header, content }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);

  return (
    <div className="flex h-screen flex-col bg-slate-50 dark:bg-slate-950">
      {/* Top Header */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {header}
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <div
            className={cn(
              'border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-800 dark:bg-slate-900',
              sidebarMinimized ? 'w-20' : 'w-64'
            )}
          >
            <div className="flex h-full flex-col">
              {/* Sidebar Content */}
              <div className={cn('flex-1 overflow-y-auto', sidebarMinimized ? 'px-2 py-4' : 'px-4 py-6')}>
                {sidebarMinimized ? (
                  <div className="space-y-2">{/* Minimized icon buttons will go here */}</div>
                ) : (
                  sidebar
                )}
              </div>

              {/* Sidebar Footer with Toggle */}
              <div className="border-t border-slate-200 p-3 dark:border-slate-800">
                <button
                  onClick={() => setSidebarMinimized(!sidebarMinimized)}
                  className="flex w-full items-center justify-center rounded-lg bg-slate-50 p-2.5 text-slate-700 transition-colors hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  aria-label={sidebarMinimized ? 'Expand sidebar' : 'Minimize sidebar'}
                  title={sidebarMinimized ? 'Expand sidebar' : 'Minimize sidebar'}
                >
                  {sidebarMinimized ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Toggle Sidebar Button (when closed) */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="absolute left-4 top-20 z-30 rounded-lg border border-slate-300 bg-white p-2.5 text-slate-700 shadow-md transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              aria-label="Open sidebar"
              title="Open sidebar"
            >
              <ChevronRight size={20} />
            </button>
          )}

          {/* Close Sidebar Button (when open) */}
          {sidebarOpen && !sidebarMinimized && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute left-64 top-20 z-30 rounded-lg border border-slate-300 bg-white p-2.5 text-slate-700 shadow-md transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              aria-label="Close sidebar"
              title="Close sidebar"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{content}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
