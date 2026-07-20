'use client';

import { useState, useEffect } from 'react';
import { Download, X, FileText } from 'lucide-react';

const loadPdfJs = async () => {
  if (typeof window === 'undefined') {
    throw new Error('PDF.js can only run in the browser');
  }

  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';
  return pdfjsLib;
};

interface PDFPreviewProps {
  pdfUrl: string;
  fileName: string;
  onDownload?: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function PDFPreview({ pdfUrl, fileName, onDownload, isOpen, onClose }: PDFPreviewProps) {
  const [thumbnail, setThumbnail] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!pdfUrl || !isOpen) return;

    const loadPDFThumbnail = async () => {
      try {
        setLoading(true);
        setError('');
        
        const pdfjsLib = await loadPdfJs();
        const pdf = await pdfjsLib.getDocument({ url: pdfUrl }).promise;
        const page = await pdf.getPage(1);
        
        const screenScale = Math.min(1.5, Math.max(0.7, window.innerWidth / 640));
        const scale = screenScale;
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) throw new Error('Failed to get canvas context');
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({
          canvas,
          viewport,
        }).promise;
        
        setThumbnail(canvas.toDataURL());
      } catch (err) {
        console.error('[v0] Error loading PDF thumbnail:', err);
        setError('Failed to load PDF preview');
      } finally {
        setLoading(false);
      }
    };

    loadPDFThumbnail();
  }, [pdfUrl, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-3xl max-h-[95vh] overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-200 bg-[#1782C5]">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-white truncate">{fileName}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onDownload}
              className="flex items-center gap-2 px-3 py-2 bg-[#EDD899] text-[#1F2557] rounded-full hover:bg-opacity-90 transition-colors text-sm font-medium"
            >
              <Download size={18} />
              <span>Open PDF</span>
            </a>
            <button
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Close preview"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4 flex items-center justify-center min-h-72">
          {loading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1782C5] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading PDF preview...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center text-red-600 max-w-lg">
              <p className="mb-4">{error}</p>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onDownload}
                className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#1782C5] text-white hover:bg-[#1465a3] transition-colors font-medium"
              >
                Open PDF in browser
              </a>
            </div>
          )}
          
          {thumbnail && !loading && (
            <img
              src={thumbnail}
              alt="PDF first page"
              className="max-w-full max-h-[80vh] object-contain rounded-xl border border-gray-200 shadow-sm"
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface PDFThumbnailProps {
  pdfUrl: string;
  fileName: string;
  onPreview: (url: string, name: string) => void;
}

export function PDFThumbnail({ pdfUrl, fileName, onPreview }: PDFThumbnailProps) {
  const [thumbnail, setThumbnail] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadThumbnail = async () => {
      try {
        const pdfjsLib = await loadPdfJs();
        const pdf = await pdfjsLib.getDocument({ url: pdfUrl }).promise;
        const page = await pdf.getPage(1);
        
        const screenScale = Math.min(1.2, Math.max(0.7, window.innerWidth / 680));
        const scale = screenScale;
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) throw new Error('Failed to get canvas context');
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({
          canvas,
          viewport,
        }).promise;
        
        setThumbnail(canvas.toDataURL());
      } catch (err) {
        console.error('[v0] Error loading PDF thumbnail:', err);
        // Set a fallback placeholder instead of failing silently
        setThumbnail('fallback');
      } finally {
        setLoading(false);
      }
    };

    loadThumbnail();
  }, [pdfUrl]);

  if (loading) {
    return (
      <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center animate-pulse">
        <div className="text-sm text-gray-600">Loading preview...</div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onPreview(pdfUrl, fileName)}
      className="cursor-pointer group relative overflow-hidden rounded-lg border-2 border-gray-300 hover:border-[#1782C5] transition-all hover:shadow-lg h-32"
    >
      {thumbnail && thumbnail !== 'fallback' ? (
        <img
          src={thumbnail}
          alt={fileName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
      ) : (
        <div className="w-full h-full bg-linear-to-br from-[#1782C5] to-[#1F2557] flex flex-col items-center justify-center text-white">
          <FileText size={32} className="mb-2 opacity-80" />
          <span className="text-xs font-medium">PDF Document</span>
        </div>
      )}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all">
        <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-medium">View</span>
      </div>
    </div>
  );
}
