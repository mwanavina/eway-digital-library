'use client';

import { useState } from 'react';
import { Download, FileText, Calendar, User } from 'lucide-react';
import { PDFModal } from './pdf-modal';

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

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-100 ${
          isExternalPdf ? 'cursor-pointer' : ''
        }`}
        style={{ backgroundColor: typeBackground }}
      >
        {/* Header with Resource Type Badge */}
        <div className="px-4 pt-3 flex items-start justify-between">
          <span
            className="px-3 py-1 text-xs font-semibold text-white rounded-full"
            style={{ backgroundColor: typeColor }}
          >
            {resourceType}
          </span>
          {downloadCount !== undefined && (
            <span className="text-xs text-gray-500">
              {downloadCount} downloads
            </span>
          )}
        </div>

        {/* Title */}
        <div className="px-4 pt-2 pb-2">
          <h3 className="font-bold text-gray-900 line-clamp-2 text-sm">
            {title}
          </h3>
        </div>

        {/* Thumbnail */}
        <div className="aspect-video bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 relative group overflow-hidden rounded-lg mx-4">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-white"
              style={{ backgroundColor: typeColor }}
            >
              <FileText size={32} className="opacity-80" />
            </div>
          )}
        </div>

        {/* Type-Specific Metadata */}
        <div className="px-4 py-3 space-y-2">
          {/* Course Info - Common to all */}
          <div className="text-xs text-gray-600">
            <p className="font-medium text-gray-900">{courseCode}</p>
            <p className="text-gray-600 line-clamp-1">{courseName}</p>
            <p className="text-gray-500 text-xs">{departmentName} • {schoolName}</p>
          </div>

          {/* Journals/Research Papers specific */}
          {['Journals', 'Research Papers'].includes(resourceType) && (
            <div className="space-y-1 pt-2 border-t border-gray-200">
              {author && (
                <div className="flex items-center gap-2 text-xs text-gray-700">
                  <User size={14} />
                  <span className="line-clamp-1">{author}</span>
                </div>
              )}
              {publicationDate && (
                <div className="flex items-center gap-2 text-xs text-gray-700">
                  <Calendar size={14} />
                  <span>{new Date(publicationDate).toLocaleDateString()}</span>
                </div>
              )}
              {abstract && (
                <div className="text-xs text-gray-600 line-clamp-2 mt-2 italic">
                  {abstract}
                </div>
              )}
            </div>
          )}

          {/* Dissertations specific */}
          {resourceType === 'Dissertations' && (
            <div className="space-y-1 pt-2 border-t border-gray-200">
              {author && (
                <div className="flex items-center gap-2 text-xs text-gray-700">
                  <User size={14} />
                  <span>By {author}</span>
                </div>
              )}
              {year && (
                <div className="flex items-center gap-2 text-xs text-gray-700">
                  <Calendar size={14} />
                  <span>Submitted {year}</span>
                </div>
              )}
            </div>
          )}

          {/* Past Papers specific */}
          {resourceType === 'Past Papers' && (
            <div className="space-y-1 pt-2 border-t border-gray-200">
              {year && (
                <div className="flex items-center gap-2 text-xs text-gray-700">
                  <Calendar size={14} />
                  <span>{year} Sem {semester} - {examType}</span>
                </div>
              )}
            </div>
          )}

          {/* Course Outlines specific */}
          {resourceType === 'Course Outlines' && (
            <div className="space-y-1 pt-2 border-t border-gray-200">
              {year && (
                <div className="flex items-center gap-2 text-xs text-gray-700">
                  <Calendar size={14} />
                  <span>Academic Year {year}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with Download Button */}
        <div className="px-4 py-3">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium text-sm transition-all border-2"
            style={{
              backgroundColor: 'transparent',
              color: typeColor,
              borderColor: typeColor,
              opacity: isDownloading ? 0.7 : 1,
            }}
          >
            <Download size={16} />
            {isDownloading ? 'Downloading...' : 'Get'}
          </button>
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
    </>
  );
}
