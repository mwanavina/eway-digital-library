export const MAX_THUMBNAIL_PAGES = 5;
export const BLANK_WHITE_RATIO = 0.95;
export const BLANK_MEAN_THRESHOLD = 250;
export const BLANK_STDEV_THRESHOLD = 8;

export function isPixelSampleMostlyWhite(
  data: Uint8ClampedArray | Uint8Array,
  sampleCount = 120,
): boolean {
  if (data.length < 4) {
    return true;
  }

  const pixelCount = data.length / 4;
  const step = Math.max(1, Math.floor(pixelCount / sampleCount));
  let whitePixels = 0;
  let totalSamples = 0;

  for (let pixelIndex = 0; pixelIndex < pixelCount; pixelIndex += step) {
    const offset = pixelIndex * 4;
    const alpha = data[offset + 3];

    if (alpha < 16) {
      whitePixels += 1;
      totalSamples += 1;
      continue;
    }

    const red = data[offset];
    const green = data[offset + 1];
    const blue = data[offset + 2];

    if (red >= 245 && green >= 245 && blue >= 245) {
      whitePixels += 1;
    }

    totalSamples += 1;
  }

  return totalSamples === 0 || whitePixels / totalSamples >= BLANK_WHITE_RATIO;
}
