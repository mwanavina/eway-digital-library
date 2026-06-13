'use client';

import { useState, useEffect } from 'react';
import { Download, X, FileText } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker with path from public folder
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';
}

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
        
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const page = await pdf.getPage(1);
        
        const scale = 1.5;
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) throw new Error('Failed to get canvas context');
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({
          canvasContext: context,
          viewport: viewport,
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#1782C5]">
          <div className="flex-1">
            <h3 className="font-semibold text-white truncate">{fileName}</h3>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onDownload}
              className="flex items-center gap-2 px-3 py-2 bg-[#EDD899] text-[#1F2557] rounded-lg hover:bg-opacity-90 transition-colors font-medium"
            >
              <Download size={18} />
              <span className="text-sm">Download</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-100 flex items-center justify-center">
          {loading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1782C5] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading PDF preview...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center text-red-600">
              <p className="mb-4">{error}</p>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onDownload}
                className="text-[#1782C5] hover:underline font-medium"
              >
                Open PDF in new tab
              </a>
            </div>
          )}
          
          {thumbnail && !loading && (
            <img
              src={thumbnail}
              alt="PDF first page"
              className="max-w-full max-h-full object-contain"
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
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const page = await pdf.getPage(1);
        
        const scale = 1.2;
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) throw new Error('Failed to get canvas context');
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({
          canvasContext: context,
          viewport: viewport,
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
        <div className="w-full h-full bg-gradient-to-br from-[#1782C5] to-[#1F2557] flex flex-col items-center justify-center text-white">
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
