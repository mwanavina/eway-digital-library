import { createRequire } from 'node:module';
import sharp from 'sharp';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { UTApi } from 'uploadthing/server';

const require = createRequire(import.meta.url);

function ensurePdfWorker() {
  if (!GlobalWorkerOptions.workerSrc) {
    GlobalWorkerOptions.workerSrc = require.resolve('pdfjs-dist/build/pdf.worker.mjs');
  }
}

function sanitizeName(name: string) {
  return name
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

export async function generatePdfThumbnailUrl(pdfUrl: string, originalName: string) {
  try {
    ensurePdfWorker();

    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error(`Failed to download PDF: ${response.status}`);
    }

    const pdfBuffer = Buffer.from(await response.arrayBuffer());
    const loadingTask = getDocument({ data: pdfBuffer });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 2 });

    let canvas: any = null;

    try {
      const { createCanvas } = await import('canvas');
      canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Failed to create canvas context');
      }

      const renderCanvas = canvas as unknown as HTMLCanvasElement;

      await page.render({
        canvas: renderCanvas,
        canvasContext: context as unknown as CanvasRenderingContext2D,
        viewport,
      }).promise;
    } catch (canvasError) {
      console.warn('Canvas-based PDF thumbnail generation is unavailable, skipping thumbnail generation.', canvasError);
      return null;
    } finally {
      await page.cleanup();
    }

    if (!canvas) {
      return null;
    }

    const pngBuffer = await sharp(Buffer.from(canvas.toDataURL('image/png').split(',')[1], 'base64'))
      .resize(640, 900, { fit: 'cover', withoutEnlargement: true })
      .png({ compressionLevel: 9, adaptiveFiltering: true, force: true })
      .toBuffer();

    const utapi = new UTApi();
    const result = await utapi.uploadFiles([
      new File([pngBuffer], `${sanitizeName(originalName)}-thumb.png`, { type: 'image/png' }),
    ]);

    const uploadedFile = Array.isArray(result) ? result[0] : result;
    return uploadedFile?.data?.url ?? null;
  } catch (error) {
    console.error('Failed to generate pdf thumbnail:', error);
    return null;
  }
}
