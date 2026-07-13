'use server';

import { generatePdfThumbnailUrl } from '@/lib/pdf-thumbnail';

// Mock database for demonstration

interface CreateDocumentInput {
  title: string;
  courseId: number;
  year: number;
  semester: number;
  examType: string;
  fileKey: string;
  fileUrl: string;
  fileName?: string;
  thumbnailUrl?: string;
  levelId?: number;
  resourceTypeId?: number;
  author?: string | null;
  publicationDate?: string | null;
  abstract?: string | null;
}

/**
 * Create a new document with PDF processing via API
 * we need to improve this
 */
export async function createDocument(input: CreateDocumentInput): Promise<any> {
  try {
    console.log('[v0] Creating document:', input.title);

    const thumbnailUrl = input.thumbnailUrl ?? (input.fileUrl
      ? await generatePdfThumbnailUrl(input.fileUrl, input.fileName ?? input.title)
      : null);

    const mockDocument = {
      id: Math.floor(Math.random() * 10000),
      title: input.title,
      course_id: input.courseId,
      level_id: input.levelId || null,
      file_key: input.fileKey,
      file_url: input.fileUrl,
      thumbnail_url: thumbnailUrl,
      upload_status: 'completed',
      resource_type_id: input.resourceTypeId || 1,
      author: input.author || null,
      publication_date: input.publicationDate || null,
      abstract: input.abstract || null,
      created_at: new Date().toISOString(),
    };

    return {
      success: true,
      document: mockDocument,
      thumbnailUrl,
    };
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
}

/**
 * Get all documents
 */
export async function getAllDocuments(): Promise<any> {
  try {
    // Mock documents
    return [
      {
        id: 1,
        title: 'Calculus I Mid-term Examination 2024',
        course_code: 'MATH101',
        course_name: 'Calculus I',
        program_name: 'BSc Mathematics',
        department_name: 'Mathematics',
        school_name: 'School of Science',
        upload_status: 'completed',
      },
    ];
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
}

/**
 * Delete document and cleanup from Uploadthing
 */
export async function deleteDocument(documentId: number): Promise<any> {
  try {
    console.log('Document deleted:', documentId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
}

/**
 * Update document status
 */
export async function updateDocumentStatus(
  documentId: number,
  status: 'pending' | 'processing' | 'completed' | 'failed'
): Promise<any> {
  try {
    return { id: documentId, upload_status: status };
  } catch (error) {
    console.error('Error updating document status:', error);
    throw error;
  }
}
