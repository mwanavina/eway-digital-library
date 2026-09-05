import {
  isPixelSampleMostlyWhite,
  MAX_THUMBNAIL_PAGES,
} from '@/lib/pdf-thumbnail-utils';

const THUMBNAIL_SCALE = 1.5;

const loadPdfJs = async () => {
  if (typeof window === 'undefined') {
    throw new Error('PDF.js can only run in the browser');
  }

  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';
  return pdfjsLib;
};

async function isBlobMostlyBlank(blob: Blob): Promise<boolean> {
  if (typeof createImageBitmap !== 'function') {
    return false;
  }

  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement('canvas');
  const maxSampleEdge = 240;
  const scale = Math.min(1, maxSampleEdge / Math.max(bitmap.width, bitmap.height));
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));

  const context = canvas.getContext('2d');
  if (!context) {
    bitmap.close();
    return false;
  }

  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
  return isPixelSampleMostlyWhite(data);
}

async function renderPageToBlob(pdf: any, pageNumber: number): Promise<Blob | null> {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale: THUMBNAIL_SCALE });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    await page.cleanup();
    return null;
  }

  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);

  await page.render({
    canvas,
    canvasContext: context,
    viewport,
    intent: 'display',
  }).promise;
  await page.cleanup();

  return await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}

export async function generatePdfThumbnailBlobFromFile(file: File): Promise<Blob | null> {
  const pdfBytes = new Uint8Array(await file.arrayBuffer());
  return generatePdfThumbnailBlobFromBytes(pdfBytes);
}

export async function generatePdfThumbnailBlobFromBytes(
  pdfBytes: Uint8Array,
): Promise<Blob | null> {
  try {
    const pdfjsLib = await loadPdfJs();
    const loadingTask = pdfjsLib.getDocument({
      data: pdfBytes,
      stopAtErrors: false,
    });
    const pdf = await loadingTask.promise;

    const maxPage = Math.min(pdf.numPages, MAX_THUMBNAIL_PAGES);
    let fallbackBlob: Blob | null = null;

    for (let pageNumber = 1; pageNumber <= maxPage; pageNumber += 1) {
      const blob = await renderPageToBlob(pdf, pageNumber);
      if (!blob) {
        continue;
      }

      if (!fallbackBlob) {
        fallbackBlob = blob;
      }

      if (!(await isBlobMostlyBlank(blob))) {
        await loadingTask.destroy();
        return blob;
      }
    }

    await loadingTask.destroy();
    return fallbackBlob;
  } catch (error) {
    console.error('Failed to generate PDF thumbnail from bytes:', error);
    return null;
  }
}

export async function generatePdfThumbnailBlobFromUrl(pdfUrl: string): Promise<Blob | null> {
  try {
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error(`Failed to download PDF: ${response.status}`);
    }

    const pdfBytes = new Uint8Array(await response.arrayBuffer());
    return generatePdfThumbnailBlobFromBytes(pdfBytes);
  } catch (error) {
    console.error('Failed to generate PDF thumbnail from URL:', error);
    return null;
  }
}