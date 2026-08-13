'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { UTApi } from 'uploadthing/server';
import { db } from '@/lib/db';
import { bookmarks, documents, downloadLogs } from '@/lib/db/schema';
import { getServerSession } from '@/lib/server/session';

interface CreateDocumentInput {
  title: string;
  courseId: number;
  year?: number;
  semester?: number;
  examType?: string;
  fileKey: string;
  fileUrl: string;
  fileName?: string;
  fileSize?: number;
  thumbnailUrl?: string;
  thumbnailKey?: string;
  levelId?: number;
  resourceTypeId?: number;
  author?: string | null;
  publicationDate?: string | null;
  abstract?: string | null;
}

export async function createDocument(input: CreateDocumentInput): Promise<any> {
  try {
    const session = await getServerSession();
    const currentUser = session?.user as { id: string; role?: string } | undefined;

    if (!currentUser?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    if (currentUser.role !== 'admin') {
      return { success: false, error: 'Forbidden' };
    }

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
      fileSize: input.fileSize ?? null,
      thumbnailUrl: input.thumbnailUrl ?? null,
      thumbnailKey: input.thumbnailKey ?? null,
      uploadStatus: 'completed',
      uploadedBy: currentUser.id,
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
      fileSize: documents.fileSize,
      thumbnailUrl: documents.thumbnailUrl,
      thumbnailKey: documents.thumbnailKey,
      uploadStatus: documents.uploadStatus,
      uploadedBy: documents.uploadedBy,
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
export async function deleteDocument(documentId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getServerSession();
    const currentUser = session?.user as { id: string; role?: string } | undefined;

    if (!currentUser?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    if (currentUser.role !== 'admin') {
      return { success: false, error: 'Forbidden' };
    }

    const normalizedDocumentId = Number(documentId);
    const [existingDocument] = await db
      .select({
        id: documents.id,
        fileKey: documents.fileKey,
        thumbnailKey: documents.thumbnailKey,
      })
      .from(documents)
      .where(eq(documents.id, normalizedDocumentId))
      .limit(1);

    if (!existingDocument) {
      return { success: false, error: 'Document not found' };
    }

    const fileKeys = [existingDocument.fileKey, existingDocument.thumbnailKey].filter(
      (key): key is string => Boolean(key),
    );

    if (fileKeys.length > 0) {
      try {
        const utapi = new UTApi();
        await utapi.deleteFiles(fileKeys);
      } catch (uploadError) {
        console.error('[v0] Error deleting files from Uploadthing:', uploadError);
      }
    }

    await db.delete(documents).where(eq(documents.id, normalizedDocumentId));

    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/bookmarks');

    return { success: true };
  } catch (error) {
    console.error('Error deleting document:', error);
    return { success: false, error: 'Failed to delete document' };
  }
}

export async function getBookmarkCount(): Promise<number> {
  try {
    const session = await getServerSession();
    const user = session?.user;

    if (!user?.id) {
      return 0;
    }

    const savedBookmarks = await db.select().from(bookmarks).where(eq(bookmarks.userId, user.id));
    return savedBookmarks.length;
  } catch (error) {
    console.error('Error getting bookmark count:', error);
    return 0;
  }
}

export async function toggleBookmark(documentId: number): Promise<{ success: boolean; bookmarked?: boolean; error?: string }> {
  try {
    const session = await getServerSession();
    const user = session?.user;

    if (!user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const normalizedDocumentId = Number(documentId);
    const existing = await db
      .select()
      .from(bookmarks)
      .where(and(eq(bookmarks.userId, user.id), eq(bookmarks.documentId, normalizedDocumentId)))
      .limit(1);

    if (existing.length > 0) {
      await db.delete(bookmarks).where(and(eq(bookmarks.userId, user.id), eq(bookmarks.documentId, normalizedDocumentId)));
      revalidatePath('/bookmarks');
      revalidatePath('/');
      return { success: true, bookmarked: false };
    }

    await db.insert(bookmarks).values({
      userId: user.id,
      documentId: normalizedDocumentId,
    });

    revalidatePath('/bookmarks');
    revalidatePath('/');
    return { success: true, bookmarked: true };
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return { success: false, error: 'Failed to toggle bookmark' };
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

/**
 * Track a document download and increment the download count
 */
export async function trackDownload(documentId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getServerSession();
    const user = session?.user;

    if (!user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const normalizedDocumentId = Number(documentId);

    // Record the download in downloadLogs
    await db.insert(downloadLogs).values({
      documentId: normalizedDocumentId,
      userId: user.id,
      downloadedAt: new Date(),
    });

    // Update the download count on the document
    const currentDoc = await db
      .select({ downloadCount: documents.downloadCount })
      .from(documents)
      .where(eq(documents.id, normalizedDocumentId))
      .limit(1);

    if (currentDoc.length > 0) {
      const newCount = (currentDoc[0].downloadCount ?? 0) + 1;
      await db
        .update(documents)
        .set({ downloadCount: newCount })
        .where(eq(documents.id, normalizedDocumentId));
    }

    console.log('[v0] Download tracked for document:', documentId, 'by user:', user.id);

    return { success: true };
  } catch (error) {
    console.error('[v0] Error tracking download:', error);
    return { success: false, error: 'Failed to track download' };
  }
}
