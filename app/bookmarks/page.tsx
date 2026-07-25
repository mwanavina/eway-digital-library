'use client';

import { useEffect, useState } from 'react';
import { Bookmark, Download, Eye, Clock, MoreVertical } from 'lucide-react';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { DocumentCard } from '@/components/document-card';
import { authClient } from '@/lib/auth-client';

interface BookmarkDocument {
  id: number;
  title: string;
  course_code: string;
  course_name: string;
  year?: number | null;
  semester?: number | null;
  exam_type?: string | null;
  school_name?: string | null;
  department_name?: string | null;
  file_path?: string | null;
  thumbnail_url?: string | null;
  resource_type_name?: string | null;
  download_count?: number | null;
  bookmarked_at?: string | Date | null;
}

export default function BookmarksPage() {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'activity'>('bookmarks');
  const [bookmarkedDocs, setBookmarkedDocs] = useState<BookmarkDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    const loadBookmarks = async () => {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/documents/bookmarks');
        const data = await response.json();
        if (data.success) {
          setBookmarkedDocs(data.data || []);
        }
      } catch (error) {
        console.error('[v0] Error loading bookmarks:', error);
      } finally {
        setLoading(false);
      }
    };

    void loadBookmarks();
  }, [session?.user?.id]);

  const activityItems = [
    { id: 1, type: 'download', title: 'Downloaded bookmarked resources', time: 'Recently updated', icon: Download },
    { id: 2, type: 'view', title: 'Opened saved documents', time: 'Recently updated', icon: Eye },
    { id: 3, type: 'bookmark', title: 'Saved documents are synced with your account', time: 'Live', icon: Bookmark },
  ];

  const stats = [
    { label: 'Total Bookmarks', value: bookmarkedDocs.length.toString(), icon: Bookmark, color: '#1782C5' },
    { label: 'Downloads This Week', value: '0', icon: Download, color: '#50C878' },
    { label: 'Resources Viewed', value: '0', icon: Eye, color: '#F39C12' },
  ];

  return (
    <>
      <Header onSearchClick={() => {}} />
      <main className="bg-background dark:bg-slate-950 min-h-screen pb-20">
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
        <div className="flex gap-0 border-b border-gray-200 dark:border-slate-700 px-4 sticky top-16 z-20 bg-background dark:bg-slate-950">
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
            {loading ? (
              <div className="text-center py-12 text-sm text-gray-600">Loading your bookmarks...</div>
            ) : bookmarkedDocs.length > 0 ? (
              <>
                <p className="text-xs text-gray-600">You have {bookmarkedDocs.length} bookmarked resources</p>
                <div className="space-y-4">
                  {bookmarkedDocs.map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      id={doc.id}
                      title={doc.title}
                      courseName={doc.course_name}
                      courseCode={doc.course_code}
                      year={doc.year ?? 0}
                      semester={doc.semester ?? 0}
                      examType={doc.exam_type ?? ''}
                      schoolName={doc.school_name ?? 'Unknown'}
                      departmentName={doc.department_name ?? 'Unknown'}
                      filePath={doc.file_path ?? ''}
                      thumbnailUrl={doc.thumbnail_url ?? undefined}
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
