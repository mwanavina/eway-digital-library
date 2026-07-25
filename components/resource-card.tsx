'use client';

import { useState, useTransition } from 'react';
import { Download, FileText, ChevronRight, Share2, MoreHorizontal, Bookmark as BookmarkIcon } from 'lucide-react';
import Link from 'next/link';
import { toggleBookmark } from '@/app/actions/documents';
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
  initialBookmarked?: boolean;
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
  initialBookmarked = false,
}: ResourceCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();

  const handleCardClick = () => {
    if (filePath) {
      setIsModalOpen(true);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDownloading(true);
    try {
      // Track the download via API
      fetch('/api/documents/track-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: id }),
      }).catch(err => console.error('[v0] Error tracking download:', err));

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
      await fetch('/api/documents/track-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId }),
      });
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

  const typeColor = typeColors[resourceType] || '#1782C5';
  const typeBackground = typeBackgrounds[resourceType] || '#E3F2FD';

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
        <div className="p-3 dark:bg-slate-800" style={{ backgroundColor: typeBackground }}>
          {/* Type Badge and Overflow Menu */}
          <div className="relative mb-2 flex items-start justify-between">
            <span
              className="px-2 py-1 text-[11px] font-semibold text-white rounded-full"
              style={{ backgroundColor: typeColor }}
            >
              {resourceType}
            </span>
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
                    setIsMenuOpen(false);
                    const optimisticValue = !isBookmarked;
                    setIsBookmarked(optimisticValue);
                    startTransition(async () => {
                      const result = await toggleBookmark(id);
                      if (!result.success) {
                        setIsBookmarked(isBookmarked);
                      }
                    });
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
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-2">
            {title}
          </h3>

          {/* Course Code and Info */}
          <div className="flex items-center justify-center gap-1 text-[11px] mb-0 text-center">
            <p className="font-semibold text-gray-900 dark:text-white">{courseCode}</p>
            <span className="text-gray-400 dark:text-gray-500">•</span>
            <p className="truncate text-gray-600 dark:text-gray-400">{courseName}</p>
          </div>

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
