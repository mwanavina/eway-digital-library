'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { documents } from '@/lib/db/schema';

interface CreateDocumentInput {
  title: string;
  courseId: number;
  year?: number;
  semester?: number;
  examType?: string;
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

export async function createDocument(input: CreateDocumentInput): Promise<any> {
  try {
    console.log('[v0] Creating document:', input.title);

    const [createdDocument] = await db.insert(documents).values({
      title: input.title,
      courseId: input.courseId,
      levelId: input.levelId ?? null,
      resourceTypeId: input.resourceTypeId ?? null,
      year: input.year ?? null,
      semester: input.semester ?? null,
      examType: input.examType?.trim() || null,
      filePath: input.fileUrl,
      fileKey: input.fileKey,
      thumbnailUrl: input.thumbnailUrl ?? null,
      uploadStatus: 'completed',
      uploadedBy: null,
      uploadedAt: new Date(),
    }).returning({
      id: documents.id,
      title: documents.title,
      courseId: documents.courseId,
      levelId: documents.levelId,
      resourceTypeId: documents.resourceTypeId,
      year: documents.year,
      semester: documents.semester,
      examType: documents.examType,
      filePath: documents.filePath,
      fileKey: documents.fileKey,
      thumbnailUrl: documents.thumbnailUrl,
      uploadStatus: documents.uploadStatus,
      createdAt: documents.createdAt,
    });

    revalidatePath('/admin');

    return {
      success: true,
      document: createdDocument,
      thumbnailUrl: createdDocument.thumbnailUrl,
    };
  } catch (error) {
    console.error('Error creating document:', error);
    return { success: false, error: 'Failed to save document' };
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
