'use client';

import { useState, Suspense } from 'react';
import { X, Download, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

interface PDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pdfUrl: string;
  documentId: number;
  onDownload?: (documentId: number) => Promise<void>;
}

export function PDFModal({ isOpen, onClose, title, pdfUrl, documentId, onDownload }: PDFModalProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const [scale, setScale] = useState(1);

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

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const goToPreviousPage = () => {
    setPageNumber(Math.max(pageNumber - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(Math.min(pageNumber + 1, numPages));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-[95vw] sm:max-w-4xl max-h-[98vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-[#1782C5] to-[#1F2557]">
          <div className="flex-1 min-w-0">
            <h2 className="text-sm sm:text-base font-semibold text-white truncate">{title}</h2>
          </div>
          <div className="flex items-center gap-2">
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

        {/* PDF Viewer Container */}
        <div className="flex-1 overflow-hidden bg-gray-900 flex flex-col">
          {/* PDF Content */}
          <div className="flex-1 overflow-auto flex items-center justify-center bg-gray-900 p-2 sm:p-4">
            <Suspense
              fallback={
                <div className="flex flex-col items-center justify-center gap-3">
                  <Loader className="w-8 h-8 animate-spin text-white" />
                  <p className="text-white text-sm">Loading PDF...</p>
                </div>
              }
            >
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Loader className="w-8 h-8 animate-spin text-white" />
                    <p className="text-white text-sm">Loading PDF...</p>
                  </div>
                }
                error={
                  <div className="text-center text-red-400">
                    <p className="mb-4">Failed to load PDF</p>
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white underline hover:no-underline"
                    >
                      Open in new tab
                    </a>
                  </div>
                }
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  renderTextLayer
                  renderAnnotationLayer
                  className="bg-white"
                  width={Math.min(600, window.innerWidth - 40)}
                />
              </Document>
            </Suspense>
          </div>

          {/* Navigation Footer */}
          {numPages > 0 && (
            <div className="bg-gray-800 border-t border-gray-700 px-3 sm:px-6 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-2 sm:gap-4">
              <button
                onClick={goToPreviousPage}
                disabled={pageNumber <= 1}
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm"
              >
                <ChevronLeft size={18} />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <div className="text-white text-xs sm:text-sm font-medium">
                Page <span className="font-bold">{pageNumber}</span> of <span className="font-bold">{numPages}</span>
              </div>

              <button
                onClick={goToNextPage}
                disabled={pageNumber >= numPages}
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
