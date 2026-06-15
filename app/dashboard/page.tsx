'use client';

import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Download, Users, BookOpen, Award, Eye } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  // Sample data for charts
  const downloadTrends = [
    { month: 'Jan', downloads: 4000 },
    { month: 'Feb', downloads: 3000 },
    { month: 'Mar', downloads: 2000 },
    { month: 'Apr', downloads: 2780 },
    { month: 'May', downloads: 1890 },
    { month: 'Jun', downloads: 2390 },
  ];

  const resourceTypes = [
    { name: 'Past Papers', value: 450, color: '#0284C7' },
    { name: 'Journals', value: 280, color: '#06B6D4' },
    { name: 'Dissertations', value: 200, color: '#8B5CF6' },
    { name: 'Course Outlines', value: 320, color: '#EC4899' },
  ];

  const topResources = [
    { id: 1, title: 'Calculus I Mid-term Exam 2024', downloads: 450, views: 1250 },
    { id: 2, title: 'Physics II Final Exam 2023', downloads: 380, views: 920 },
    { id: 3, title: 'Chemistry Lab Report Guidelines', downloads: 320, views: 680 },
    { id: 4, title: 'Advanced Programming Concepts', downloads: 280, views: 640 },
  ];

  const stats = [
    {
      title: 'Total Downloads',
      value: '14.2K',
      change: '+12.5%',
      icon: Download,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Total Views',
      value: '42.8K',
      change: '+8.2%',
      icon: Eye,
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Active Users',
      value: '2,847',
      change: '+5.3%',
      icon: Users,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Resources',
      value: '1,250',
      change: '+3.1%',
      icon: BookOpen,
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-600 dark:text-orange-400',
    },
  ];

  return (
    <main className="flex-1 bg-gray-50 dark:bg-slate-950 pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-4 md:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back! Here's your library analytics overview.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={`${stat.bgColor} rounded-lg p-6 border border-gray-200 dark:border-slate-700`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                    <p className="text-green-600 dark:text-green-400 text-sm font-semibold mt-2">{stat.change}</p>
                  </div>
                  <div className={`${stat.iconColor} p-3 rounded-lg`}>
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Download Trends Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={20} />
                Download Trends
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Monthly download activity</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={downloadTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line type="monotone" dataKey="downloads" stroke="#0284C7" strokeWidth={2} dot={{ fill: '#0284C7' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Resource Distribution Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Resource Types</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Distribution by type</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={resourceTypes} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {resourceTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Resources */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Award size={20} />
              Top Resources
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Most downloaded and viewed resources</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Resource Title</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">Downloads</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">Views</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Action</th>
                </tr>
              </thead>
              <tbody>
                {topResources.map((resource) => (
                  <tr key={resource.id} className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-4 text-gray-900 dark:text-white font-medium">{resource.title}</td>
                    <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">{resource.downloads}</td>
                    <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">{resource.views}</td>
                    <td className="py-4 px-4 text-right">
                      <Link href={`/document/${resource.id}`} className="text-blue-600 dark:text-blue-400 hover:underline font-semibold text-sm">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/search" className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-lg mb-2">Browse Resources</h3>
            <p className="text-blue-100">Explore our collection of study materials</p>
          </Link>
          <Link href="/bookmarks" className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-lg mb-2">My Bookmarks</h3>
            <p className="text-purple-100">Access your saved resources</p>
          </Link>
          <Link href="/settings" className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-lg mb-2">Settings</h3>
            <p className="text-green-100">Manage your account preferences</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
