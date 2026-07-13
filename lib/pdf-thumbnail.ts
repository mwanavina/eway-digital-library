import sharp from 'sharp';
import { UTApi } from 'uploadthing/server';

function sanitizeName(name: string) {
  return name
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function createPlaceholderThumbnailBuffer(originalName: string) {
  const title = escapeXml(
    sanitizeName(originalName).replace(/-/g, ' ').trim() || 'document'
  );
  const label = title.length > 28 ? `${title.slice(0, 25)}...` : title;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="900" viewBox="0 0 640 900">
      <rect width="640" height="900" fill="#f8fafc"/>
      <rect x="70" y="70" width="500" height="760" rx="28" fill="#ffffff" stroke="#d8dee9" stroke-width="3"/>
      <rect x="120" y="140" width="400" height="90" rx="18" fill="#dbeafe"/>
      <rect x="120" y="270" width="260" height="18" rx="9" fill="#cbd5e1"/>
      <rect x="120" y="310" width="320" height="18" rx="9" fill="#e2e8f0"/>
      <rect x="120" y="350" width="280" height="18" rx="9" fill="#e2e8f0"/>
      <rect x="120" y="390" width="240" height="18" rx="9" fill="#e2e8f0"/>
      <path d="M210 630h220v110H210z" fill="none" stroke="#0f172a" stroke-width="10" stroke-linejoin="round"/>
      <path d="M260 630v110M310 630v110" stroke="#0f172a" stroke-width="10"/>
      <text x="320" y="775" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#0f172a">${label}</text>
      <text x="320" y="815" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#475569">PDF preview</text>
    </svg>`;

  return sharp(Buffer.from(svg))
    .resize(640, 900, { fit: 'cover', withoutEnlargement: true })
    .png({ compressionLevel: 9, adaptiveFiltering: true, force: true })
    .toBuffer();
}

export async function generatePdfThumbnailUrl(pdfUrl: string, originalName: string) {
  try {
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error(`Failed to download PDF: ${response.status}`);
    }

    await response.arrayBuffer();
    const pngBuffer = await createPlaceholderThumbnailBuffer(originalName);

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
