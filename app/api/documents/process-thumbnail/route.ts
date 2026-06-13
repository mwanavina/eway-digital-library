import { neon } from '@neondatabase/serverless';
import sharp from 'sharp';
import { utapi } from '@/lib/uploadthing-server';

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  try {
    const { documentId, fileUrl, fileKey } = await request.json();

    if (!documentId || !fileUrl || !fileKey) {
      return Response.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    console.log('[v0] Processing thumbnail for document:', documentId);

    // Update status to processing
    await sql`
      UPDATE documents 
      SET upload_status = 'processing'
      WHERE id = ${documentId}
    `;

    // Create a simple thumbnail image (150x200px) with MUBAS branding
    const thumbnailBuffer = await sharp({
      create: {
        width: 150,
        height: 200,
        channels: 3,
        background: { r: 23, g: 130, b: 197 }, // MUBAS Blue
      },
    })
      .png()
      .toBuffer();

    console.log('[v0] Thumbnail generated, size:', thumbnailBuffer.length);

    // Upload thumbnail to Uploadthing
    const thumbnailKey = `${fileKey}-thumbnail.png`;
    const file = new File([thumbnailBuffer], thumbnailKey, { type: 'image/png' });
    const uploadResponse = await utapi.uploadFiles(file);

    if (!uploadResponse.data) {
      throw new Error('Failed to upload thumbnail to Uploadthing');
    }

    const thumbnailUrl = uploadResponse.data.url;
    console.log('[v0] Thumbnail uploaded:', thumbnailUrl);

    // Update document with thumbnail URL and completed status
    await sql`
      UPDATE documents 
      SET thumbnail_url = ${thumbnailUrl}, upload_status = 'completed'
      WHERE id = ${documentId}
    `;

    console.log('[v0] Document updated with thumbnail');

    return Response.json({ success: true, thumbnailUrl });
  } catch (error) {
    console.error('[v0] Error processing thumbnail:', error);

    // Update document status to failed
    const documentId = (await request.json()).documentId;
    if (documentId) {
      await sql`
        UPDATE documents 
        SET upload_status = 'failed', error_message = ${
          error instanceof Error ? error.message : 'Unknown error'
        }
        WHERE id = ${documentId}
      `;
    }

    return Response.json(
      { error: 'Failed to process thumbnail' },
      { status: 500 }
    );
  }
}
