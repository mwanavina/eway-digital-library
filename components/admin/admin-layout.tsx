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
                  className="flex w-full items-center justify-center rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  aria-label={sidebarMinimized ? 'Expand sidebar' : 'Minimize sidebar'}
                >
                  {sidebarMinimized ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
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
              className="absolute left-4 top-20 z-30 rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-lg transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Open sidebar"
            >
              <ChevronRight size={18} />
            </button>
          )}

          {/* Close Sidebar Button (when open) */}
          {sidebarOpen && !sidebarMinimized && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute left-64 top-20 z-30 rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-lg transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Close sidebar"
            >
              <ChevronLeft size={18} />
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
