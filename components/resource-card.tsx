'use client';

import { useEffect, useState, useTransition } from 'react';
import { useTheme } from 'next-themes';
import { Download, FileText, ChevronRight, Share2, MoreHorizontal, Bookmark as BookmarkIcon } from 'lucide-react';
import Link from 'next/link';
import { toggleBookmark, trackDownload } from '@/app/actions/documents';
import { formatFileSize } from '@/lib/utils';
import { PDFModal } from './pdf-modal';
import { ShareModal } from './share-modal';

interface ResourceCardProps {
  id: number;
  title: string;
  resourceType: string;
  courseName: string;
  courseCode: string;
  departmentName: string;
  schoolName: string;
  filePath: string;
  thumbnailUrl?: string;
  author?: string;
  publicationDate?: string;
  abstract?: string;
  year?: number;
  semester?: number;
  examType?: string;
  downloadCount?: number;
  fileSize?: number | null;
  initialBookmarked?: boolean;
  onBookmarkChange?: (bookmarked: boolean) => void;
}

export function ResourceCard({
  id,
  title,
  resourceType,
  courseName,
  courseCode,
  departmentName,
  schoolName,
  filePath,
  thumbnailUrl,
  author,
  publicationDate,
  abstract,
  year,
  semester,
  examType,
  downloadCount,
  fileSize,
  initialBookmarked = false,
  onBookmarkChange,
}: ResourceCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCardClick = () => {
    if (filePath) {
      setIsModalOpen(true);
    }
  };

  const handleToggleBookmark = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    const optimisticValue = !isBookmarked;
    setIsBookmarked(optimisticValue);
    setIsMenuOpen(false);

    startTransition(async () => {
      const result = await toggleBookmark(id);
      if (!result.success) {
        setIsBookmarked(!optimisticValue);
        return;
      }

      onBookmarkChange?.(result.bookmarked ?? optimisticValue);
    });
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDownloading(true);
    try {
      // Track the download via server action
      trackDownload(id).catch(err => console.error('[v0] Error tracking download:', err));

      // Fetch the PDF as a blob
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const blob = await response.blob();

      // Create a blob URL and trigger download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      console.log('[v0] PDF downloaded:', title);
    } catch (error) {
      console.error('[v0] Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const trackDownloadCallback = async (documentId: number) => {
    try {
      await trackDownload(documentId);
    } catch (error) {
      console.error('[v0] Error tracking download:', error);
    }
  };

  // Get type-specific colors and styling
  const typeColors: { [key: string]: string } = {
    'Past Papers': '#1782C5',
    'Journals': '#1F2557',
    'Dissertations': '#8B5A8F',
    'Course Outlines': '#F59E0B',
    'Research Papers': '#10B981',
  };

  const typeBackgrounds: { [key: string]: string } = {
    'Past Papers': '#E3F2FD',
    'Journals': '#F3E5F5',
    'Dissertations': '#F3E5F5',
    'Course Outlines': '#FEF3C7',
    'Research Papers': '#D1FAE5',
  };

  const typeDarkBackgrounds: { [key: string]: string } = {
    'Past Papers': '#1e3a5f',
    'Journals': '#2a1f3d',
    'Dissertations': '#2a1f3d',
    'Course Outlines': '#3d2e0f',
    'Research Papers': '#0f3d2e',
  };

  const typeColor = typeColors[resourceType] || '#1782C5';
  const typeBackground = typeBackgrounds[resourceType] || '#E3F2FD';
  const typeDarkBackground = typeDarkBackgrounds[resourceType] || '#1e293b';

  const currentTheme = mounted ? (theme === 'system' ? resolvedTheme : theme) : 'light';
  const isDark = currentTheme === 'dark';
  const cardBackground = isDark ? typeDarkBackground : typeBackground;
  const formattedFileSize = formatFileSize(fileSize);
  const courseAlreadyInTitle = Boolean(courseName && title.toLowerCase().includes(courseName.toLowerCase()));

  // Mobile-optimized card with large icon display
  return (
    <>
      <div
        className="rounded-xl overflow-hidden border border-gray-200/80 dark:border-slate-700 shadow-sm hover:shadow-md dark:hover:shadow-slate-950 transition-all dark:bg-slate-900 cursor-pointer"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleCardClick();
          }
        }}
      >
        {/* Card Background */}
        <div className="p-3" style={{ backgroundColor: cardBackground }}>
          {/* Type Badge and Overflow Menu */}
          <div className="relative mb-2 flex items-start justify-between gap-2">
            <span
              className="px-2 py-1 text-[11px] font-semibold text-white rounded-full"
              style={{ backgroundColor: typeColor }}
            >
              {resourceType}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleToggleBookmark}
                className={`rounded-full border p-1.5 shadow-sm transition ${
                  isBookmarked
                    ? 'border-red-200 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400'
                    : 'border-white/50 bg-white/80 text-gray-700 hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200'
                }`}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
              >
                <BookmarkIcon size={16} className={isBookmarked ? 'fill-current' : ''} />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsMenuOpen((prev) => !prev);
                }}
                className="rounded-full border border-white/50 bg-white/80 p-1.5 text-gray-700 shadow-sm transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
                aria-label="Open actions"
              >
                <MoreHorizontal size={16} />
              </button>
            </div>
            {isMenuOpen && (
              <div className="absolute right-0 top-9 z-10 w-40 rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsMenuOpen(false);
                    handleDownload(event);
                  }}
                  disabled={isDownloading}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <Download size={16} />
                  {isDownloading ? 'Loading...' : 'Download'}
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsMenuOpen(false);
                    setIsShareModalOpen(true);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <Share2 size={16} />
                  Share
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleToggleBookmark(event);
                  }}
                  disabled={isPending}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <BookmarkIcon size={16} />
                  {isPending ? 'Working...' : isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                </button>
                <Link
                  href={`/document/${id}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <ChevronRight size={16} />
                  Details
                </Link>
              </div>
            )}
          </div>

          {/* Thumbnail Image Container */}
          <div className="mb-3 aspect-5/3 bg-linear-to-b from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 rounded-lg overflow-hidden border border-gray-200/70 dark:border-slate-700 flex items-center justify-center">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={title}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white"
                style={{ backgroundColor: typeColor }}
              >
                <FileText size={36} className="opacity-80" />
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 dark:text-slate-50 text-sm line-clamp-2 mb-2">
            {title}
          </h3>

          {/* Course Code and Info */}
          <div className="flex items-center justify-center gap-1 text-[11px] mb-0 text-center">
            {courseCode && <p className="font-semibold text-gray-900 dark:text-white">{courseCode}</p>}
            {!courseAlreadyInTitle && courseName && (
              <>
                <span className="text-gray-400 dark:text-slate-300">•</span>
                <p className="truncate text-gray-600 dark:text-slate-200">{courseName}</p>
              </>
            )}
          </div>

          {formattedFileSize && (
            <p className="mt-1 text-center text-[10px] font-medium text-gray-500 dark:text-slate-400">
              {formattedFileSize}
            </p>
          )}

        </div>

      </div>

      {/* PDF Modal */}
      <PDFModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        pdfUrl={filePath}
        documentId={id}
        onDownload={trackDownloadCallback}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={title}
        resourceId={id}
      />
    </>
  );
}
