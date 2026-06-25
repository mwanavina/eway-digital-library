'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, FileText, Calendar, User, BookOpen, Eye } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { BottomNav } from '@/components/bottom-nav';

interface DocumentDetail {
  id: number;
  title: string;
  course_code: string;
  course_name: string;
  year?: number;
  semester?: number;
  exam_type?: string;
  school_name: string;
  department_name: string;
  file_path: string;
  download_count?: number;
  resource_type_name?: string;
  author?: string;
  publication_date?: string;
  abstract?: string;
}

export default function DocumentDetailPage() {
  const params = useParams() as { id: string };
  const id = params?.id;
  
  const [document, setDocument] = useState<DocumentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(`/api/documents/${id}`);
        const data = await response.json();
        if (data.success) {
          setDocument(data.data);
        }
      } catch (error) {
        console.error('[v0] Error fetching document:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDocument();
    }
  }, [id]);

  const handleDownload = async () => {
    if (!document) return;
    
    setIsDownloading(true);
    try {
      // Track the download via API
      fetch('/api/documents/track-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: document.id }),
      }).catch(err => console.error('[v0] Error tracking download:', err));

      // Fetch the PDF as a blob
      const response = await fetch(document.file_path);
      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const blob = await response.blob();

      // Create a blob URL and trigger download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = globalThis.document.createElement('a');
      link.href = blobUrl;
      link.download = `${document.title}.pdf`;
      globalThis.document.body.appendChild(link);
      link.click();
      globalThis.document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      console.log('[v0] PDF downloaded:', document.title);
    } catch (error) {
      console.error('[v0] Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pb-20">
        <Spinner />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <Link href="/" className="p-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <ArrowLeft size={20} />
            Back
          </Link>
        </div>
        <div className="p-4 text-center py-12">
          <p className="text-gray-600">Document not found</p>
        </div>
      </div>
    );
  }

  const typeColors: { [key: string]: string } = {
    'Past Papers': '#1782C5',
    'Journals': '#1F2557',
    'Dissertations': '#8B5A8F',
    'Course Outlines': '#F59E0B',
    'Research Papers': '#10B981',
  };

  const typeColor = typeColors[document.resource_type_name || 'Past Papers'] || '#1782C5';

  return (
    <div className="min-h-screen bg-white pb-24 md:pb-6">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <Link href="/" className="p-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
          <ArrowLeft size={20} />
          Back
        </Link>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        {/* Badge and Icon */}
        <div className="flex flex-col items-center mb-6">
          <div className="mb-4">
            <span
              className="px-3 py-1.5 text-xs font-semibold text-white rounded-full inline-block"
              style={{ backgroundColor: typeColor }}
            >
              {document.resource_type_name || 'Past Papers'}
            </span>
          </div>

          <div
            className="w-24 h-24 rounded-xl flex items-center justify-center text-white shadow-lg mb-6"
            style={{ backgroundColor: typeColor }}
          >
            <FileText size={48} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            {document.title}
          </h1>

          {document.download_count !== undefined && (
            <p className="text-sm text-gray-600 mb-4">
              {document.download_count} downloads
            </p>
          )}
        </div>

        {/* Course Information Card */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <BookOpen size={18} style={{ color: typeColor }} />
            Course Information
          </h2>
          <div className="space-y-2 text-sm">
            <div>
              <p className="text-gray-600">Course Code</p>
              <p className="font-semibold text-gray-900">{document.course_code}</p>
            </div>
            <div>
              <p className="text-gray-600">Course Name</p>
              <p className="font-semibold text-gray-900">{document.course_name}</p>
            </div>
          </div>
        </div>

        {/* School & Department Card */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <User size={18} style={{ color: typeColor }} />
            School &amp; Department
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">School</p>
              <p className="font-semibold text-gray-900">{document.school_name}</p>
            </div>
            <div>
              <p className="text-gray-600">Department</p>
              <p className="font-semibold text-gray-900">{document.department_name}</p>
            </div>
          </div>
        </div>

        {/* Resource-Type Specific Information */}
        {document.resource_type_name === 'Past Papers' && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar size={18} style={{ color: typeColor }} />
              Exam Details
            </h2>
            <div className="space-y-2 text-sm">
              {document.year && (
                <div>
                  <p className="text-gray-600">Year</p>
                  <p className="font-semibold text-gray-900">{document.year}</p>
                </div>
              )}
              {document.semester && (
                <div>
                  <p className="text-gray-600">Semester</p>
                  <p className="font-semibold text-gray-900">Semester {document.semester}</p>
                </div>
              )}
              {document.exam_type && (
                <div>
                  <p className="text-gray-600">Exam Type</p>
                  <p className="font-semibold text-gray-900">{document.exam_type}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {['Journals', 'Research Papers'].includes(document.resource_type_name || '') && (
          <>
            {document.author && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User size={18} style={{ color: typeColor }} />
                  Author
                </h2>
                <p className="font-semibold text-gray-900 text-sm">{document.author}</p>
              </div>
            )}
            {document.publication_date && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar size={18} style={{ color: typeColor }} />
                  Publication Date
                </h2>
                <p className="font-semibold text-gray-900 text-sm">
                  {new Date(document.publication_date).toLocaleDateString()}
                </p>
              </div>
            )}
            {document.abstract && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                <h2 className="font-semibold text-gray-900 mb-3">Abstract</h2>
                <p className="text-gray-700 text-sm leading-relaxed">{document.abstract}</p>
              </div>
            )}
          </>
        )}

        {document.resource_type_name === 'Dissertations' && (
          <>
            {document.author && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User size={18} style={{ color: typeColor }} />
                  Author
                </h2>
                <p className="font-semibold text-gray-900 text-sm">{document.author}</p>
              </div>
            )}
            {document.year && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar size={18} style={{ color: typeColor }} />
                  Submission Year
                </h2>
                <p className="font-semibold text-gray-900 text-sm">{document.year}</p>
              </div>
            )}
          </>
        )}

        {/* Related Resources Section */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-3 uppercase text-sm tracking-wide">
            Related Resources
          </h2>
          <div className="space-y-2 text-sm">
            <Link
              href={`/?courseCode=${document.course_code}`}
              className="flex items-center text-[#1782C5] hover:underline font-medium"
            >
              {document.course_code} End-of-semester 2024
            </Link>
            <Link
              href={`/?courseCode=${document.course_code}`}
              className="flex items-center text-[#1782C5] hover:underline font-medium"
            >
              {document.course_code} Mid-semester 2023
            </Link>
            <Link
              href={`/?courseCode=${document.course_code}`}
              className="flex items-center text-[#1782C5] hover:underline font-medium"
            >
              {document.course_code} Course Outline
            </Link>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button className="flex flex-col items-center gap-1 py-3 px-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
            <Eye size={20} className="text-gray-700" />
            <span className="text-xs text-gray-700">Preview</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-3 px-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
            <Eye size={20} className="text-gray-700" />
            <span className="text-xs text-gray-700">PDF</span>
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex flex-col items-center gap-1 py-3 px-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Download size={20} className="text-gray-700" />
            <span className="text-xs text-gray-700">{isDownloading ? 'Loading' : 'Download'}</span>
          </button>
        </div>

        {/* Main Download Button */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-lg font-semibold text-lg transition-all text-white mb-4"
          style={{
            backgroundColor: typeColor,
            opacity: isDownloading ? 0.7 : 1,
          }}
        >
          <Download size={24} />
          {isDownloading ? 'Downloading...' : 'Download Document'}
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab="browse" />
    </div>
  );
}
