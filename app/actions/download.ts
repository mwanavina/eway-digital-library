'use server';

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

/**
 * Increment download count for a document
 */
export async function trackDownload(documentId: number): Promise<void> {
  try {
    await sql`
      UPDATE documents
      SET download_count = download_count + 1
      WHERE id = ${documentId}
    `;
    console.log('[v0] Download tracked for document:', documentId);
  } catch (error) {
    console.error('[v0] Error tracking download:', error);
    // Don't throw - this is a non-critical operation
  }
}

/**
 * Get document details including download count
 */
export async function getDocumentDetails(documentId: number): Promise<any> {
  try {
    const result = await sql`
      SELECT 
        id,
        title,
        file_path,
        download_count
      FROM documents
      WHERE id = ${documentId}
    `;
    return result[0];
  } catch (error) {
    console.error('[v0] Error getting document details:', error);
    throw error;
  }
}
