'use client';

import { Activity, BookOpen, FileText, BarChart3, Trash2, Upload, Users } from 'lucide-react';
import type { AdminActivity } from '@/components/admin/admin-types';

interface AdminOverviewProps {
  documentsCount: number;
  coursesCount: number;
  schoolsCount: number;
  programsCount: number;
  academicUnitCount: number;
  activities: AdminActivity[];
}

export function AdminOverview({
  documentsCount,
  coursesCount,
  schoolsCount,
  programsCount,
  academicUnitCount,
  activities,
}: AdminOverviewProps) {
  return (
    <>
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Welcome back! Here&apos;s an overview of your library.</p>
      </div>

      {/* Main Stats Grid */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Documents</p>
              <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{documentsCount}</p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">Library resources</p>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-3 dark:from-blue-950/40 dark:to-blue-900/40">
              <FileText size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Courses</p>
              <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{coursesCount}</p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">Active courses</p>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 p-3 dark:from-purple-950/40 dark:to-purple-900/40">
              <BookOpen size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Programs</p>
              <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{programsCount}</p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">Study programs</p>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 p-3 dark:from-emerald-950/40 dark:to-emerald-900/40">
              <BarChart3 size={24} className="text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Academic Units</p>
              <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{academicUnitCount}</p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">Schools & departments</p>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 p-3 dark:from-amber-950/40 dark:to-amber-900/40">
              <Users size={24} className="text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Schools</p>
              <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{schoolsCount}</p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">Institutions</p>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-red-50 to-red-100 p-3 dark:from-red-950/40 dark:to-red-900/40">
              <Users size={24} className="text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">Recent admin activity</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">The latest actions taken in the library workspace.</p>
          </div>
          <div className="rounded-full bg-slate-100 p-2 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <Activity size={18} />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {activities.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              No recent admin activity yet.
            </div>
          ) : (
            activities.slice(0, 6).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/40">
                <div className="mt-0.5 rounded-lg bg-white p-2 shadow-sm dark:bg-slate-900">
                  {activity.action === 'deleted' ? (
                    <Trash2 size={16} className="text-red-500" />
                  ) : activity.action === 'uploaded' ? (
                    <Upload size={16} className="text-blue-500" />
                  ) : (
                    <Activity size={16} className="text-emerald-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{activity.title}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {activity.entity} • {activity.timestamp}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
