'use server';

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

interface CreateDocumentInput {
  title: string;
  courseId: number;
  year: number;
  semester: number;
  examType: string;
  fileKey: string;
  fileUrl: string;
  resourceTypeId?: number;
  author?: string | null;
  publicationDate?: string | null;
  abstract?: string | null;
}

/**
 * Create a new document with PDF processing via API
 */
export async function createDocument(input: CreateDocumentInput): Promise<any> {
  try {
    console.log('[v0] Creating document:', input.title);

    // Save document to database with pending status
    const result = await sql`
      INSERT INTO documents (
        title,
        course_id,
        year,
        semester,
        exam_type,
        file_path,
        file_key,
        upload_status,
        resource_type_id,
        author,
        publication_date,
        abstract
      ) VALUES (
        ${input.title},
        ${input.courseId},
        ${input.year},
        ${input.semester},
        ${input.examType},
        ${input.fileUrl},
        ${input.fileKey},
        'pending',
        ${input.resourceTypeId || 1},
        ${input.author || null},
        ${input.publicationDate || null},
        ${input.abstract || null}
      )
      RETURNING *
    `;

    const documentId = result[0].id;
    console.log('[v0] Document created:', documentId);

    // Trigger thumbnail generation asynchronously via API
    fetch('/api/documents/process-thumbnail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentId,
        fileUrl: input.fileUrl,
        fileKey: input.fileKey,
      }),
    }).catch(err => console.error('[v0] Error triggering thumbnail processing:', err));

    return {
      success: true,
      document: result[0],
    };
  } catch (error) {
    console.error('[v0] Error creating document:', error);
    throw error;
  }
}

/**
 * Get all documents
 */
export async function getAllDocuments(): Promise<any> {
  try {
    const documents = await sql`
      SELECT 
        d.id,
        d.title,
        d.year,
        d.semester,
        d.exam_type,
        d.file_path,
        d.thumbnail_url,
        d.upload_status,
        d.created_at,
        c.code as course_code,
        c.name as course_name,
        p.name as program_name,
        dp.name as department_name,
        s.name as school_name
      FROM documents d
      JOIN courses c ON d.course_id = c.id
      JOIN programs p ON c.program_id = p.id
      JOIN departments dp ON p.department_id = dp.id
      JOIN schools s ON dp.school_id = s.id
      ORDER BY d.created_at DESC
      LIMIT 200
    `;

    return documents;
  } catch (error) {
    console.error('[v0] Error fetching documents:', error);
    throw error;
  }
}

/**
 * Delete document and cleanup from Uploadthing
 */
export async function deleteDocument(documentId: number): Promise<any> {
  try {
    const document = await sql`
      SELECT file_key, thumbnail_key FROM documents WHERE id = ${documentId}
    `;

    if (!document[0]) {
      throw new Error('Document not found');
    }

    // Delete from Uploadthing
    if (document[0].file_key) {
      await utapi.deleteFiles(document[0].file_key);
    }
    if (document[0].thumbnail_key) {
      await utapi.deleteFiles(document[0].thumbnail_key);
    }

    // Delete from database
    await sql`DELETE FROM documents WHERE id = ${documentId}`;

    console.log('[v0] Document deleted:', documentId);
    return { success: true };
  } catch (error) {
    console.error('[v0] Error deleting document:', error);
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
    const result = await sql`
      UPDATE documents 
      SET upload_status = ${status}
      WHERE id = ${documentId}
      RETURNING *
    `;

    return result[0];
  } catch (error) {
    console.error('[v0] Error updating document status:', error);
    throw error;
  }
}
