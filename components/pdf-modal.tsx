'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BookOpen, Download, ExternalLink, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';

interface PDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pdfUrl: string;
  documentId: number;
  onDownload?: (documentId: number) => Promise<void>;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;
const PAGE_HORIZONTAL_PADDING = 48;

const loadPdfJs = async () => {
  if (typeof window === 'undefined') {
    throw new Error('PDF.js can only run in the browser');
  }

  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';
  return pdfjsLib;
};

export function PDFModal({ isOpen, onClose, title, pdfUrl, documentId, onDownload }: PDFModalProps) {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const pageCanvasRefs = useRef<Record<number, HTMLCanvasElement | null>>({});
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const [viewMode] = useState<'continuous' | 'page'>('continuous');

  const getFitScale = useCallback((page: any, availableWidth: number) => {
    const baseViewport = page.getViewport({ scale: 1 });
    const safeWidth = Math.max(availableWidth, 240);
    return safeWidth / baseViewport.width;
  }, []);

  const renderPageToCanvas = useCallback(
    async (doc: any, pageIndex: number, availableWidth: number, zoomLevel: number, canvas: HTMLCanvasElement | null) => {
      if (!canvas || availableWidth <= 0) {
        return;
      }

      const page = await doc.getPage(pageIndex);
      const fitScale = getFitScale(page, availableWidth - PAGE_HORIZONTAL_PADDING);
      const renderScale = fitScale * zoomLevel;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const viewport = page.getViewport({ scale: renderScale * dpr });
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Failed to get canvas context');
      }

      const displayWidth = Math.floor(viewport.width / dpr);
      const displayHeight = Math.floor(viewport.height / dpr);

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = `${displayWidth}px`;
      canvas.style.maxWidth = '100%';
      canvas.style.height = 'auto';

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);

      await page.render({
        canvasContext: context,
        viewport,
      }).promise;
    },
    [getFitScale],
  );

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
        setZoom(1);

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
    if (!isOpen || !viewerRef.current) {
      return;
    }

    const updateWidth = () => {
      if (viewerRef.current) {
        setContainerWidth(viewerRef.current.clientWidth);
      }
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(viewerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isOpen, pdfDoc]);

  useEffect(() => {
    if (!pdfDoc || !isOpen || containerWidth <= 0) {
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
            return renderPageToCanvas(pdfDoc, pageIndex, containerWidth, zoom, canvas);
          });

          await Promise.all(pagePromises);
        } else {
          const canvas = pageCanvasRefs.current[pageNumber];
          await renderPageToCanvas(pdfDoc, pageNumber, containerWidth, zoom, canvas);
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
  }, [pdfDoc, pageNumber, pageCount, zoom, viewMode, isOpen, containerWidth, renderPageToCanvas]);

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

  const handleZoomOut = () => {
    setZoom((current) => Math.max(MIN_ZOOM, Number((current - ZOOM_STEP).toFixed(2))));
  };

  const handleZoomIn = () => {
    setZoom((current) => Math.min(MAX_ZOOM, Number((current + ZOOM_STEP).toFixed(2))));
  };

  const handleResetView = () => {
    setZoom(1);
    setPageNumber(1);
    viewerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pageList = Array.from({ length: pageCount }, (_, index) => index + 1);
  const zoomLabel = `${Math.round(zoom * 100)}%`;

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
            <div className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 sm:text-sm">
              <BookOpen size={16} className="text-[#1782C5]" />
              <span>{pageCount > 0 ? `${pageCount} pages` : 'PDF'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden min-w-12 text-center text-xs font-medium text-slate-500 sm:inline">{zoomLabel}</span>
            <button
              onClick={handleZoomOut}
              disabled={zoom <= MIN_ZOOM}
              className="rounded-lg border border-slate-300 bg-white p-2 text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Zoom out"
            >
              <ZoomOut size={18} />
            </button>
            <span className="min-w-10 text-center text-xs font-medium text-slate-600 sm:hidden">{zoomLabel}</span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= MAX_ZOOM}
              className="rounded-lg border border-slate-300 bg-white p-2 text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Zoom in"
            >
              <ZoomIn size={18} />
            </button>
            <button
              onClick={handleResetView}
              className="rounded-lg border border-slate-300 bg-white p-2 text-slate-700 transition hover:bg-slate-50"
              aria-label="Reset view"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-slate-100 p-2 sm:p-6">
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
            <div ref={viewerRef} className="mx-auto w-full max-w-3xl space-y-3 sm:space-y-4">
              {pageList.map((pageIndex) => (
                <div
                  key={pageIndex}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-sm sm:rounded-2xl sm:p-3"
                >
                  <div className="mb-2 text-xs font-semibold text-slate-500 sm:text-sm">
                    Page {pageIndex} of {pageCount}
                  </div>
                  <div className="w-full overflow-x-auto">
                    <canvas
                      ref={(element) => {
                        pageCanvasRefs.current[pageIndex] = element;
                      }}
                      className="mx-auto block h-auto max-w-full"
                      aria-label={`PDF page ${pageIndex}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
