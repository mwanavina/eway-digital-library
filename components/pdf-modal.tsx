'use client';

import { useEffect, useRef, useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Download, ExternalLink, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';

interface PDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pdfUrl: string;
  documentId: number;
  onDownload?: (documentId: number) => Promise<void>;
}

const loadPdfJs = async () => {
  if (typeof window === 'undefined') {
    throw new Error('PDF.js can only run in the browser');
  }

  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';
  return pdfjsLib;
};

export function PDFModal({ isOpen, onClose, title, pdfUrl, documentId, onDownload }: PDFModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pageCanvasRefs = useRef<Record<number, HTMLCanvasElement | null>>({});
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [scale, setScale] = useState(1.2);
  const [viewMode] = useState<'continuous' | 'page'>('continuous');

  const renderPageToCanvas = async (
    doc: any,
    pageIndex: number,
    currentScale: number,
    canvas: HTMLCanvasElement | null,
  ) => {
    if (!canvas) {
      return;
    }

    const page = await doc.getPage(pageIndex);
    const viewport = page.getViewport({ scale: currentScale });
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Failed to get canvas context');
    }

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(viewport.width * dpr);
    canvas.height = Math.floor(viewport.height * dpr);
    canvas.style.width = `${Math.floor(viewport.width)}px`;
    canvas.style.height = `${Math.floor(viewport.height)}px`;

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: context,
      viewport,
    }).promise;
  };

  useEffect(() => {
    if (!isOpen || !pdfUrl) {
      return;
    }

    let isCancelled = false;

    const initialisePdf = async () => {
      try {
        setIsLoading(true);
        setError('');
        setPageNumber(1);
        setScale(1.2);

        const pdfjsLib = await loadPdfJs();
        const doc = await pdfjsLib.getDocument({ url: pdfUrl }).promise;

        if (isCancelled) {
          return;
        }

        setPdfDoc(doc);
        setPageCount(doc.numPages || 0);
      } catch (err) {
        console.error('[v0] Error loading PDF viewer:', err);
        if (!isCancelled) {
          setError('The PDF could not be opened in the built-in viewer. You can still open it in a new tab.');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    initialisePdf();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, pdfUrl]);

  useEffect(() => {
    if (!pdfDoc || !isOpen) {
      return;
    }

    let isCancelled = false;

    const renderCurrentPage = async () => {
      try {
        setError('');

        if (viewMode === 'continuous') {
          const pagePromises = Array.from({ length: pageCount }, (_, index) => {
            const pageIndex = index + 1;
            const canvas = pageCanvasRefs.current[pageIndex];
            return renderPageToCanvas(pdfDoc, pageIndex, scale, canvas);
          });

          await Promise.all(pagePromises);
        } else {
          await renderPageToCanvas(pdfDoc, pageNumber, scale, canvasRef.current);
        }

        if (isCancelled) {
          return;
        }
      } catch (err) {
        console.error('[v0] Error rendering PDF page:', err);
        if (!isCancelled) {
          setError('The PDF could not be rendered on this device. You can still open it externally.');
        }
      }
    };

    renderCurrentPage();

    return () => {
      isCancelled = true;
    };
  }, [pdfDoc, pageNumber, pageCount, scale, viewMode, isOpen]);

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
    } catch (err) {
      console.error('[v0] Error downloading PDF:', err);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleOpenInNewTab = () => {
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  };

  const canGoPrev = pageNumber > 1;
  const canGoNext = pageNumber < pageCount;
  const pageList = Array.from({ length: pageCount }, (_, index) => index + 1);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex flex-col bg-slate-100">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-linear-to-r from-[#1782C5] to-[#1F2557] px-3 py-3 text-white sm:px-6">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-semibold sm:text-base">{title}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex items-center gap-1 rounded-lg bg-[#EDD899] px-2 py-1.5 text-xs font-semibold text-[#1F2557] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70 sm:px-3 sm:text-sm"
              title="Download PDF"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={handleOpenInNewTab}
              className="flex items-center gap-1 rounded-lg border border-white/30 bg-white/10 px-2 py-1.5 text-xs font-semibold transition hover:bg-white/20 sm:px-3 sm:text-sm"
              title="Open in new tab"
            >
              <ExternalLink size={16} />
              <span className="hidden sm:inline">Open</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 transition hover:bg-white/20"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 py-2 sm:px-6">
          <div className="flex items-center gap-2">
            {viewMode === 'page' ? (
              <>
                <button
                  onClick={() => setPageNumber((current) => Math.max(1, current - 1))}
                  disabled={!canGoPrev}
                  className="rounded-lg border border-slate-300 bg-white p-2 text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setPageNumber((current) => Math.min(pageCount, current + 1))}
                  disabled={!canGoNext}
                  className="rounded-lg border border-slate-300 bg-white p-2 text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            ) : (
              <div className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 sm:text-sm">
                Continuous scroll
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 rounded-full bg-slate-100 p-1">
            <div className="flex items-center gap-1 rounded-full bg-[#1782C5] px-3 py-1 text-xs font-semibold text-white sm:text-sm">
              <BookOpen size={16} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setScale((current) => Math.max(0.8, Number((current - 0.2).toFixed(1))))}
              className="rounded-lg border border-slate-300 bg-white p-2 text-slate-700 transition hover:bg-slate-50"
              aria-label="Zoom out"
            >
              <ZoomOut size={18} />
            </button>
            <button
              onClick={() => setScale((current) => Math.min(2.5, Number((current + 0.2).toFixed(1))))}
              className="rounded-lg border border-slate-300 bg-white p-2 text-slate-700 transition hover:bg-slate-50"
              aria-label="Zoom in"
            >
              <ZoomIn size={18} />
            </button>
            <button
              onClick={() => {
                setScale(1.2);
                setPageNumber(1);
              }}
              className="rounded-lg border border-slate-300 bg-white p-2 text-slate-700 transition hover:bg-slate-50"
              aria-label="Reset view"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-slate-100 p-3 sm:p-6">
          {isLoading && (
            <div className="flex min-h-[40vh] items-center justify-center text-center">
              <div>
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#1782C5]" />
                <p className="text-sm text-slate-600">Loading PDF viewer...</p>
              </div>
            </div>
          )}

          {error && !isLoading && (
            <div className="flex min-h-[40vh] items-center justify-center">
              <div className="max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
                <p className="mb-4 text-sm text-red-600">{error}</p>
                <button
                  onClick={handleOpenInNewTab}
                  className="rounded-full bg-[#1782C5] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#146ca5]"
                >
                  Open PDF in browser
                </button>
              </div>
            </div>
          )}

          {!isLoading && !error && pdfDoc && (
            <div className="space-y-4">
              {pageList.map((pageIndex) => (
                <div
                  key={pageIndex}
                  className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                >
                  <div className="mb-2 text-xs font-semibold text-slate-500 sm:text-sm">
                    Page {pageIndex} of {pageCount}
                  </div>
                  <canvas
                    ref={(element) => {
                      pageCanvasRefs.current[pageIndex] = element;
                    }}
                    className="mx-auto max-w-full rounded-xl bg-white"
                    aria-label={`PDF page ${pageIndex}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
