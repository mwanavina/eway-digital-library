'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

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
      // Track the download via callback
      if (onDownload) {
        await onDownload(documentId);
      }

      // Fetch the PDF as a blob
      const response = await fetch(pdfUrl);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-[95vw] max-h-[98vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 border-b border-gray-200 bg-gradient-to-r from-[#1782C5] to-[#1F2557]">
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-white truncate">{title}</h2>
            {/* <p className="text-[11px] text-gray-100 mt-1">PDF Preview</p> */}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X size={18} className="text-white" />
          </button>
        </div>

        {/* PDF Container */}
        <div className="flex-1 overflow-hidden bg-gray-900 p-3">
          <div className="w-full h-full rounded-lg overflow-hidden border border-slate-700 bg-white shadow-sm">
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
              className="w-full h-full min-h-[80vh] border-0"
              title={title}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
