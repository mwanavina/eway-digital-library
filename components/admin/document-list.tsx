'use client';

import { useState } from 'react';
import { Trash2, Eye, AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { deleteDocument } from '@/app/actions/documents';
import { PDFModal } from '@/components/pdf-modal';

interface AdminDocumentListProps {
  documents: any[];
  onDelete?: () => void;
}

export function AdminDocumentList({ documents, onDelete }: AdminDocumentListProps) {
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [previewDocument, setPreviewDocument] = useState<{ id: number; title: string; pdfUrl: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const totalPages = Math.max(1, Math.ceil(documents.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedDocuments = documents.slice(startIndex, startIndex + pageSize);
  const visiblePages = Array.from({ length: totalPages }, (_, index) => index + 1).filter((page) => {
    if (totalPages <= 7) return true;
    if (page === 1 || page === totalPages) return true;
    if (page >= safePage - 1 && page <= safePage + 1) return true;
    return false;
  });

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleDelete = async (docId: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    setDeleting(docId);
    setError('');

    try {
      await deleteDocument(docId);
      setDeleting(null);
      onDelete?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document');
      setDeleting(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={16} className="text-green-600" />;
      case 'failed':
        return <XCircle size={16} className="text-red-600" />;
      case 'processing':
        return <Clock size={16} className="text-yellow-600 animate-spin" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400';
      case 'failed':
        return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400';
      case 'processing':
        return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No documents uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg text-red-800 dark:text-red-300">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-foreground">Document</th>
              <th className="text-left py-3 px-4 font-medium text-foreground">Course</th>
              <th className="text-left py-3 px-4 font-medium text-foreground">Year/Sem</th>
              <th className="text-left py-3 px-4 font-medium text-foreground">Exam Type</th>
              <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
              <th className="text-left py-3 px-4 font-medium text-foreground">Uploaded</th>
              <th className="text-center py-3 px-4 font-medium text-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDocuments.map((doc) => (
              <tr key={doc.id} className="border-b border-border hover:bg-muted">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    {doc.thumbnail_url ? (
                      <img
                        src={doc.thumbnail_url}
                        alt={doc.title}
                        className="w-8 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="w-8 h-10 bg-primary rounded flex items-center justify-center text-primary-foreground text-xs font-bold">
                        P
                      </div>
                    )}
                    <div className="flex-1 truncate">
                      <p className="font-medium text-foreground truncate">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">{doc.course_code}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-foreground">{doc.course_name}</td>
                <td className="py-3 px-4 text-foreground">
                  {doc.year} / Sem {doc.semester}
                </td>
                <td className="py-3 px-4 text-foreground">{doc.exam_type}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(doc.upload_status)}
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(doc.upload_status)}`}>
                      {doc.upload_status}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-muted-foreground text-xs">
                  {new Date(doc.created_at).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-center flex items-center justify-center gap-2">
                  {doc.file_url && (
                    <button
                      onClick={() => setPreviewDocument({ id: doc.id, title: doc.title, pdfUrl: doc.file_url })}
                      className="inline-flex items-center justify-center p-2 hover:bg-muted rounded-lg transition-colors"
                      title="Preview PDF"
                    >
                      <Eye size={16} className="text-slate-600" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(doc.id)}
                    disabled={deleting === doc.id}
                    className="inline-flex items-center justify-center p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete document"
                  >
                    <Trash2 size={16} className="text-destructive" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + pageSize, documents.length)} of {documents.length} documents
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => goToPage(safePage - 1)}
              disabled={safePage === 1}
              className="rounded-lg border border-border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            {visiblePages.map((page, index) => {
              const showEllipsisBefore = index > 0 && page !== visiblePages[index - 1] + 1;
              return (
                <div key={page} className="flex items-center gap-2">
                  {showEllipsisBefore && <span className="px-1 text-sm text-muted-foreground">...</span>}
                  <button
                    onClick={() => goToPage(page)}
                    className={`rounded-lg px-3 py-2 text-sm ${page === safePage ? 'bg-[#1782C5] text-white' : 'border border-border'}`}
                  >
                    {page}
                  </button>
                </div>
              );
            })}
            <button
              onClick={() => goToPage(safePage + 1)}
              disabled={safePage === totalPages}
              className="rounded-lg border border-border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <PDFModal
        isOpen={Boolean(previewDocument)}
        onClose={() => setPreviewDocument(null)}
        title={previewDocument?.title ?? ''}
        pdfUrl={previewDocument?.pdfUrl ?? ''}
        documentId={previewDocument?.id ?? 0}
        onDownload={async () => Promise.resolve()}
      />
    </div>
  );
}
