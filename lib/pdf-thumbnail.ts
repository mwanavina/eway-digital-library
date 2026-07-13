import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { createCanvas } from 'canvas';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { UTApi } from 'uploadthing/server';

const require = createRequire(import.meta.url);

function sanitizeName(name: string) {
  return name
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

function ensurePdfWorker() {
  if (!GlobalWorkerOptions.workerSrc) {
    const workerPath = require.resolve('pdfjs-dist/build/pdf.worker.mjs');
    GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href;
  }
}

export async function generatePdfThumbnailUrl(pdfUrl: string, originalName: string) {
  try {
    ensurePdfWorker();

    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error(`Failed to download PDF: ${response.status}`);
    }

    const pdfBytes = new Uint8Array(await response.arrayBuffer());
    const loadingTask = getDocument({ data: pdfBytes, disableWorker: true } as any);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 2 });
    const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Failed to create canvas context');
    }

    await page.render({
      canvas: canvas as any,
      canvasContext: context as any,
      viewport,
    }).promise;
    await page.cleanup();

    const pngBuffer = canvas.toBuffer('image/png');
    const resizedBuffer = await sharp(pngBuffer)
      .resize(640, 900, { fit: 'cover', withoutEnlargement: true })
      .png({ compressionLevel: 9, adaptiveFiltering: true, force: true })
      .toBuffer();

    const utapi = new UTApi();
    const result = await utapi.uploadFiles([
      new File([resizedBuffer], `${sanitizeName(originalName)}-thumb.png`, { type: 'image/png' }),
    ]);

    const uploadedFile = Array.isArray(result) ? result[0] : result;
    return uploadedFile?.data?.url ?? null;
  } catch (error) {
    console.error('Failed to generate pdf thumbnail:', error);
    return null;
  }
}
