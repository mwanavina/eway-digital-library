'use server';

import { generatePdfThumbnailUrl } from '@/lib/pdf-thumbnail';

export async function createPdfThumbnail(pdfUrl: string, originalName: string) {
  return generatePdfThumbnailUrl(pdfUrl, originalName);
}
