'use client';

import { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { PDFModal } from './pdf-modal';

interface DocumentCardProps {
  id: number;
  title: string;
  courseName: string;
  courseCode: string;
  year: number;
  semester: number;
  examType: string;
  schoolName: string;
  departmentName: string;
  filePath: string;
  thumbnailUrl?: string;
}

export function DocumentCard({
  id,
  title,
  courseName,
  courseCode,
  year,
  semester,
  examType,
  schoolName,
  departmentName,
  filePath,
  thumbnailUrl,
}: DocumentCardProps) {
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

  return (
    <>
      <div 
        onClick={handleCardClick}
        className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100 ${isExternalPdf ? 'cursor-pointer' : ''}`}
      >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1782C5] to-[#1F2557] p-4 text-white">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 bg-[#EDD899] rounded-lg flex items-center justify-center">
            <FileText size={24} className="text-[#1F2557]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-2">{title}</h3>
            <p className="text-xs text-gray-100 mt-1">
              {courseCode} • {courseName}
            </p>
          </div>
        </div>
      </div>

      {/* Thumbnail */}
      <div className="aspect-video bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-200 relative group overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1782C5] to-[#1F2557]">
            <div className="text-center text-white">
              <FileText size={32} className="mx-auto mb-2 opacity-80" />
              <p className="text-xs font-medium">PDF Document</p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="text-sm">
          <p className="text-gray-500 text-xs uppercase tracking-wide">School</p>
          <p className="text-gray-800 font-medium">{schoolName}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide">Department</p>
            <p className="text-gray-800 font-medium truncate">{departmentName}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide">Year</p>
            <p className="text-gray-800 font-medium">{year}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide">Semester</p>
            <p className="text-gray-800 font-medium">{semester}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide">Exam Type</p>
            <p className="text-gray-800 font-medium text-xs">{examType}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full flex items-center justify-center gap-2 bg-[#1782C5] text-white py-2 px-4 rounded-lg hover:bg-[#1F2557] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
        >
          <Download size={16} />
          {isDownloading ? 'Downloading...' : 'Download PDF'}
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
