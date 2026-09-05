'use server';

export async function createPdfThumbnail(pdfUrl: string, originalName: string) {
  const { generatePdfThumbnailUrl } = await import('@/lib/pdf-thumbnail');
  return generatePdfThumbnailUrl(pdfUrl, originalName);
}
