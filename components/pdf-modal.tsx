'use client';

import { useState } from 'react';
import { X, Download } from 'lucide-react';

interface PDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pdfUrl: string;
  documentId: number;
  onDownload?: (documentId: number) => Promise<void>;
}

export function PDFModal({ isOpen, onClose, title, pdfUrl, documentId, onDownload }: PDFModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      if (onDownload) {
        await onDownload(documentId);
      }

      const response = await fetch(pdfUrl);
      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('[v0] Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Full Screen PDF Modal */}
      <div className="fixed inset-0 z-50 flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-[#1782C5] to-[#1F2557] flex-shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-sm sm:text-base font-semibold text-white truncate">{title}</h2>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-[#EDD899] text-[#1F2557] rounded hover:bg-opacity-90 transition-colors disabled:opacity-50 text-xs sm:text-sm font-medium"
              title="Download PDF"
            >
              <Download size={16} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X size={18} className="text-white" />
            </button>
          </div>
        </div>

        {/* PDF Viewer Container - Full Screen with Scroll Support */}
        <div className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center">
          <div className="w-full h-full flex items-center justify-center min-h-screen md:min-h-full">
            <embed
              src={pdfUrl}
              type="application/pdf"
              className="w-full h-full"
              title={title}
            />
          </div>
        </div>
      </div>
    </>
  );
}
