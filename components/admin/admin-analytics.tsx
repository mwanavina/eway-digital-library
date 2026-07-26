'use client';

import { useState, useEffect } from 'react';
import { Users, Layers, BarChart3 } from 'lucide-react';
import { fetchAdminStats, fetchUsersByLevel, fetchTopDocumentsByDownloads } from '@/app/actions/admin-users';

export function AdminAnalytics() {
  const [stats, setStats] = useState({ totalUsers: 0, totalDocuments: 0, totalDownloads: 0 });
  const [usersByLevel, setUsersByLevel] = useState<any[]>([]);
  const [topDocuments, setTopDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  async function loadAnalyticsData() {
    try {
      setLoading(true);
      const [statsRes, levelRes, docsRes] = await Promise.all([
        fetchAdminStats(),
        fetchUsersByLevel(),
        fetchTopDocumentsByDownloads(),
      ]);

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
      if (levelRes.success && levelRes.data) {
        setUsersByLevel(levelRes.data);
      }
      if (docsRes.success && docsRes.data) {
        setTopDocuments(docsRes.data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-slate-600 dark:text-slate-400">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Users</p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{stats.totalUsers}</p>
            </div>
            <Users className="h-10 w-10 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Papers</p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{stats.totalDocuments}</p>
            </div>
            <Layers className="h-10 w-10 text-purple-500 opacity-20" />
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Downloads</p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{stats.totalDownloads}</p>
            </div>
            <BarChart3 className="h-10 w-10 text-green-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Users by Level */}
      <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Users by Level</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">Level</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">Count</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {usersByLevel.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-slate-600 dark:text-slate-400">
                    No data available
                  </td>
                </tr>
              ) : (
                usersByLevel.map((item: any) => (
                  <tr key={item.levelNumber} className="border-b border-slate-200 dark:border-slate-800">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                      {item.level || 'Unassigned'} {item.levelNumber && `(Level ${item.levelNumber})`}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{item.count || 0}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {stats.totalUsers > 0 ? `${Math.round(((item.count || 0) / stats.totalUsers) * 100)}%` : '0%'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Documents by Downloads */}
      <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Top 20 Papers by Downloads</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">Level</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">Program</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">Department</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-600 dark:text-slate-400">Downloads</th>
              </tr>
            </thead>
            <tbody>
              {topDocuments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-slate-600 dark:text-slate-400">
                    No documents yet
                  </td>
                </tr>
              ) : (
                topDocuments.map((doc: any) => (
                  <tr key={doc.id} className="border-b border-slate-200 dark:border-slate-800">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                      <div className="max-w-xs truncate">{doc.title}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {doc.level || 'N/A'} {doc.levelNumber && `(${doc.levelNumber})`}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{doc.program || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{doc.department || 'N/A'}</td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {doc.downloadCount || 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
