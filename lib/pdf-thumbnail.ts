import 'server-only';

import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { UTApi } from 'uploadthing/server';
import {
  BLANK_MEAN_THRESHOLD,
  BLANK_STDEV_THRESHOLD,
  MAX_THUMBNAIL_PAGES,
} from '@/lib/pdf-thumbnail-utils';

const require = createRequire(import.meta.url);
const THUMBNAIL_SCALE = 2;

type CreateCanvasFn = typeof import('canvas').createCanvas;

let createCanvasFn: CreateCanvasFn | null = null;
let canvasLoadAttempted = false;

async function getCreateCanvas(): Promise<CreateCanvasFn | null> {
  if (canvasLoadAttempted) {
    return createCanvasFn;
  }

  canvasLoadAttempted = true;

  try {
    const canvasModule = await import('canvas');
    createCanvasFn = canvasModule.createCanvas;
  } catch (error) {
    console.warn(
      'canvas native module unavailable; server PDF thumbnail fallback disabled:',
      error instanceof Error ? error.message : error,
    );
    createCanvasFn = null;
  }

  return createCanvasFn;
}

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

async function isPngBufferMostlyBlank(pngBuffer: Buffer): Promise<boolean> {
  const { channels } = await sharp(pngBuffer).stats();
  return channels.every(
    (channel) => channel.mean >= BLANK_MEAN_THRESHOLD && channel.stdev <= BLANK_STDEV_THRESHOLD,
  );
}

async function renderPageToPngBuffer(pdf: any, pageNumber: number): Promise<Buffer | null> {
  const createCanvas = await getCreateCanvas();
  if (!createCanvas) {
    return null;
  }

  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale: THUMBNAIL_SCALE });
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  const context = canvas.getContext('2d');

  if (!context) {
    await page.cleanup();
    return null;
  }

  await page.render({
    canvas: canvas as any,
    canvasContext: context as any,
    viewport,
    intent: 'display',
  }).promise;
  await page.cleanup();

  return canvas.toBuffer('image/png');
}

async function generateBestThumbnailBuffer(pdfBytes: Uint8Array): Promise<Buffer | null> {
  ensurePdfWorker();

  const loadingTask = getDocument({
    data: pdfBytes,
    disableWorker: true,
    stopAtErrors: false,
    isEvalSupported: false,
  } as any);
  const pdf = await loadingTask.promise;
  const maxPage = Math.min(pdf.numPages, MAX_THUMBNAIL_PAGES);
  let fallbackBuffer: Buffer | null = null;

  for (let pageNumber = 1; pageNumber <= maxPage; pageNumber += 1) {
    const pngBuffer = await renderPageToPngBuffer(pdf, pageNumber);
    if (!pngBuffer) {
      continue;
    }

    if (!fallbackBuffer) {
      fallbackBuffer = pngBuffer;
    }

    if (!(await isPngBufferMostlyBlank(pngBuffer))) {
      await loadingTask.destroy();
      return pngBuffer;
    }
  }

  await loadingTask.destroy();
  return fallbackBuffer;
}

async function resizeThumbnailBuffer(pngBuffer: Buffer): Promise<Buffer> {
  return sharp(pngBuffer)
    .resize(640, 900, { fit: 'cover', withoutEnlargement: true })
    .png({ compressionLevel: 9, adaptiveFiltering: true, force: true })
    .toBuffer();
}

async function uploadThumbnailBuffer(
  thumbnailBuffer: Buffer,
  originalName: string,
): Promise<{ url: string | null; key: string | null }> {
  const utapi = new UTApi();
  const result = await utapi.uploadFiles([
    // Convert Node Buffer to Uint8Array so it satisfies the BlobPart / ArrayBufferView type
    new File([new Uint8Array(thumbnailBuffer)], `${sanitizeName(originalName)}-thumb.png`, { type: 'image/png' }),
  ]);

  const uploadedFile = Array.isArray(result) ? result[0] : result;
  return {
    url: uploadedFile?.data?.url ?? null,
    key: uploadedFile?.data?.key ?? null,
  };
}

export async function generatePdfThumbnailFromBytes(
  pdfBytes: Uint8Array,
  originalName: string,
): Promise<{ url: string | null; key: string | null }> {
  try {
    const pngBuffer = await generateBestThumbnailBuffer(pdfBytes);
    if (!pngBuffer) {
      throw new Error('Failed to render any PDF page');
    }

    const resizedBuffer = await resizeThumbnailBuffer(pngBuffer);
    return uploadThumbnailBuffer(resizedBuffer, originalName);
  } catch (error) {
    console.error('Failed to generate pdf thumbnail from bytes:', error);
    return { url: null, key: null };
  }
}

export async function generatePdfThumbnailUrl(pdfUrl: string, originalName: string) {
  try {
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error(`Failed to download PDF: ${response.status}`);
    }

    const pdfBytes = new Uint8Array(await response.arrayBuffer());
    return generatePdfThumbnailFromBytes(pdfBytes, originalName);
  } catch (error) {
    console.error('Failed to generate pdf thumbnail:', error);
    return { url: null, key: null };
  }
}
