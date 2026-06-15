'use client';

import { useState } from 'react';
import { Bookmark, Download, Eye, Clock, Flame, TrendingUp, MoreVertical } from 'lucide-react';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { DocumentCard } from '@/components/document-card';

export default function BookmarksPage() {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'activity'>('bookmarks');

  // Mock bookmarked documents
  const bookmarkedDocs = [
    {
      id: 1,
      title: 'IT304 Database Systems',
      courseName: 'Data Management',
      courseCode: 'IT304',
      year: 2024,
      semester: 1,
      examType: 'End-semester',
      schoolName: 'School of ICT',
      departmentName: 'Computer Science',
      filePath: '/sample.pdf',
      bookmarkedDate: '3 days ago',
    },
    {
      id: 2,
      title: 'Network Security Fundamentals',
      courseName: 'Network Security',
      courseCode: 'IT320',
      year: 2024,
      semester: 1,
      examType: 'Past Paper',
      schoolName: 'School of ICT',
      departmentName: 'Computer Science',
      filePath: '/sample.pdf',
      bookmarkedDate: '1 week ago',
    },
    {
      id: 3,
      title: 'Calculus I Midterm Exam',
      courseName: 'Mathematics I',
      courseCode: 'MATH101',
      year: 2024,
      semester: 1,
      examType: 'Midterm',
      schoolName: 'School of Science',
      departmentName: 'Mathematics',
      filePath: '/sample.pdf',
      bookmarkedDate: '2 weeks ago',
    },
  ];

  // Mock activity data
  const activityItems = [
    { id: 1, type: 'download', title: 'Downloaded IT304 Database Systems', time: 'Today, 2:30 PM', icon: Download },
    { id: 2, type: 'view', title: 'Viewed Network Security Fundamentals', time: 'Today, 1:15 PM', icon: Eye },
    { id: 3, type: 'bookmark', title: 'Bookmarked Calculus I Midterm Exam', time: 'Yesterday, 4:45 PM', icon: Bookmark },
    { id: 4, type: 'download', title: 'Downloaded Applied Calculus in Engineering', time: 'Yesterday, 3:20 PM', icon: Download },
    { id: 5, type: 'view', title: 'Viewed Numerical Methods Dissertation', time: '2 days ago, 11:00 AM', icon: Eye },
    { id: 6, type: 'bookmark', title: 'Bookmarked Database Systems Journal', time: '3 days ago, 5:30 PM', icon: Bookmark },
  ];

  // Mock statistics
  const stats = [
    { label: 'Total Bookmarks', value: '23', icon: Bookmark, color: '#1782C5' },
    { label: 'Downloads This Week', value: '8', icon: Download, color: '#50C878' },
    { label: 'Resources Viewed', value: '45', icon: Eye, color: '#F39C12' },
  ];

  return (
    <>
      <Header onSearchClick={() => {}} />
      <main className="bg-white min-h-screen pb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1782C5] to-[#1F2557] text-white p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#EDD899] rounded-full flex items-center justify-center">
              <Bookmark size={24} className="text-[#1F2557]" />
            </div>
            <div>
              <h1 className="text-xl font-bold">My Bookmarks</h1>
              <p className="text-sm text-gray-200">Save and organize resources</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2">
            {stats.map((stat, idx) => {
              const IconComponent = stat.icon;
              return (
                <div key={idx} className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
                  <IconComponent size={20} className="mx-auto mb-1" style={{ color: stat.color }} />
                  <p className="text-xs font-semibold">{stat.value}</p>
                  <p className="text-xs text-gray-200">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-gray-200 px-4 sticky top-16 z-20 bg-white">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex-1 py-4 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'bookmarks'
                ? 'text-[#1782C5] border-[#1782C5]'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Bookmark size={16} />
              Bookmarks
            </div>
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex-1 py-4 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'activity'
                ? 'text-[#1782C5] border-[#1782C5]'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Clock size={16} />
              Activity
            </div>
          </button>
        </div>

        {/* Bookmarks Tab */}
        {activeTab === 'bookmarks' && (
          <div className="px-4 py-6 space-y-4">
            {bookmarkedDocs.length > 0 ? (
              <>
                <p className="text-xs text-gray-600">You have {bookmarkedDocs.length} bookmarked resources</p>
                <div className="space-y-4">
                  {bookmarkedDocs.map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      id={doc.id}
                      title={doc.title}
                      courseName={doc.courseName}
                      courseCode={doc.courseCode}
                      year={doc.year}
                      semester={doc.semester}
                      examType={doc.examType}
                      schoolName={doc.schoolName}
                      departmentName={doc.departmentName}
                      filePath={doc.filePath}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Bookmark size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 text-sm">No bookmarked resources yet</p>
              </div>
            )}
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="px-4 py-6">
            <div className="space-y-3">
              {activityItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div
                      className="p-2 rounded-full flex-shrink-0 mt-1"
                      style={{
                        backgroundColor:
                          item.type === 'download'
                            ? '#4CAF5020'
                            : item.type === 'view'
                            ? '#2196F320'
                            : '#FF9C0020',
                      }}
                    >
                      <IconComponent
                        size={16}
                        style={{
                          color:
                            item.type === 'download'
                              ? '#4CAF50'
                              : item.type === 'view'
                              ? '#2196F3'
                              : '#FF9C00',
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                    </div>
                    <button className="p-1 hover:bg-gray-200 rounded flex-shrink-0">
                      <MoreVertical size={16} className="text-gray-500" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Load More */}
            <button className="w-full mt-6 py-2 px-4 border border-[#1782C5] text-[#1782C5] rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors">
              Load More Activity
            </button>
          </div>
        )}
      </main>
      <BottomNav activeTab="bookmarks" />
    </>
  );
}
