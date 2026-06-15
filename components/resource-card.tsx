'use client';

import { useState } from 'react';
import { Download, FileText, ChevronRight, Share2 } from 'lucide-react';
import Link from 'next/link';
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
}: ResourceCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const isExternalPdf = filePath && (filePath.startsWith('http') || filePath.startsWith('https'));

  const handleCardClick = () => {
    if (isExternalPdf) {
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
      <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md dark:hover:shadow-slate-950 transition-all dark:bg-slate-900">
        {/* Card Background */}
        <div className="p-4 dark:bg-slate-800" style={{ backgroundColor: typeBackground }}>
          {/* Type Badge and Download Count */}
          <div className="flex items-start justify-between mb-3">
            <span
              className="px-2.5 py-1 text-xs font-semibold text-white rounded-full"
              style={{ backgroundColor: typeColor }}
            >
              {resourceType}
            </span>
            {downloadCount !== undefined && (
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {downloadCount} <span className="text-gray-500 dark:text-gray-600">↓</span>
              </span>
            )}
          </div>

          {/* Thumbnail Image Container */}
          <div className="mb-4 aspect-square bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 flex items-center justify-center">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white"
                style={{ backgroundColor: typeColor }}
              >
                <FileText size={48} className="opacity-80" />
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 mb-3">
            {title}
          </h3>

          {/* Course Code and Info */}
          <div className="text-center text-xs mb-4">
            <p className="font-semibold text-gray-900 dark:text-white">{courseCode}</p>
            <p className="text-gray-600 dark:text-gray-400 line-clamp-1">{courseName}</p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-700 dark:text-gray-300">
            <div className="bg-white bg-opacity-60 rounded p-2">
              <p className="text-gray-600 font-medium">School</p>
              <p className="text-gray-900 font-semibold line-clamp-1">{schoolName}</p>
            </div>
            <div className="bg-white bg-opacity-60 rounded p-2">
              <p className="text-gray-600 font-medium">Department</p>
              <p className="text-gray-900 font-semibold line-clamp-1">{departmentName}</p>
            </div>
          </div>

          {/* Type-Specific Info */}
          {resourceType === 'Past Papers' && year && (
            <div className="bg-white bg-opacity-60 rounded p-2 mb-4 text-xs">
              <p className="text-gray-600 font-medium">Exam Details</p>
              <p className="text-gray-900 font-semibold">{year} Sem {semester} - {examType}</p>
            </div>
          )}

          {['Journals', 'Research Papers'].includes(resourceType) && author && (
            <div className="bg-white bg-opacity-60 rounded p-2 mb-4 text-xs">
              <p className="text-gray-600 font-medium">Author</p>
              <p className="text-gray-900 font-semibold line-clamp-1">{author}</p>
            </div>
          )}

          {resourceType === 'Dissertations' && author && (
            <div className="bg-white bg-opacity-60 rounded p-2 mb-4 text-xs">
              <p className="text-gray-600 font-medium">Author</p>
              <p className="text-gray-900 font-semibold line-clamp-1">{author}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
          <div className="flex md:flex-col gap-2 items-stretch">
            {/* Mobile Row Layout - Icons Only for Get and Share */}
            <div className="flex md:hidden gap-2 w-full">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-shrink-0 flex items-center justify-center p-2.5 rounded-lg font-semibold text-white transition-all"
                style={{
                  backgroundColor: typeColor,
                  opacity: isDownloading ? 0.7 : 1,
                }}
                title={isDownloading ? 'Loading...' : 'Get'}
                aria-label="Get resource"
              >
                <Download size={18} />
              </button>
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex-shrink-0 flex items-center justify-center p-2.5 rounded-lg font-semibold transition-all border-2 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700"
                style={{ borderColor: typeColor }}
                title="Share resource"
                aria-label="Share resource"
              >
                <Share2 size={18} />
              </button>
              <Link
                href={`/document/${id}`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-semibold text-sm transition-all border-2 text-gray-900 dark:text-white dark:hover:bg-slate-700"
                style={{ borderColor: typeColor }}
              >
                Details
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Desktop Layout - Single Row */}
            <div className="hidden md:flex gap-2 w-full">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-semibold text-sm transition-all text-white"
                style={{
                  backgroundColor: typeColor,
                  opacity: isDownloading ? 0.7 : 1,
                }}
              >
                <Download size={16} />
                {isDownloading ? 'Loading...' : 'Get'}
              </button>
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-semibold text-sm transition-all border-2 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700"
                style={{ borderColor: typeColor }}
                aria-label="Share resource"
              >
                <Share2 size={16} />
                Share
              </button>
              <Link
                href={`/document/${id}`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-semibold text-sm transition-all border-2 text-gray-900 dark:text-white dark:hover:bg-slate-700"
                style={{ borderColor: typeColor }}
              >
                Details
                <ChevronRight size={16} />
              </Link>
            </div>
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
