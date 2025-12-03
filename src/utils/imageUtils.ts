/**
 * Image optimization utilities
 */

/**
 * Generate a blur placeholder from an image source
 * Returns a base64 encoded tiny version of the image
 */
export async function generateBlurPlaceholder(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Create tiny thumbnail (10x10)
      const size = 10;
      canvas.width = size;
      canvas.height = size;

      // Draw scaled down image
      ctx.drawImage(img, 0, 0, size, size);

      // Convert to base64
      try {
        const dataUrl = canvas.toDataURL('image/jpeg', 0.1);
        resolve(dataUrl);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = src;
  });
}

/**
 * Check browser support for modern image formats
 */
export function supportsModernFormats(): { webp: boolean; avif: boolean } {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;

  const webp = canvas.toDataURL('image/webp').startsWith('data:image/webp');
  const avif = canvas.toDataURL('image/avif').startsWith('data:image/avif');

  return { webp, avif };
}

/**
 * Generate srcset for responsive images
 * @param src - Base image URL
 * @param widths - Array of widths to generate
 * @returns srcset string
 */
export function generateSrcSet(src: string, widths: number[]): string {
  return widths
    .map((width) => {
      const url = getResizedImageUrl(src, width);
      return `${url} ${width}w`;
    })
    .join(', ');
}

/**
 * Get resized image URL (adjust based on your image CDN/service)
 */
function getResizedImageUrl(src: string, width: number): string {
  // If src is already an absolute URL, return as-is with width param
  try {
    const url = new URL(src);
    url.searchParams.set('w', width.toString());
    return url.toString();
  } catch {
    // Relative URL - construct with origin
    const url = new URL(src, window.location.origin);
    url.searchParams.set('w', width.toString());
    return url.toString();
  }
}

/**
 * Calculate optimal image sizes for responsive loading
 */
export function getOptimalSizes(
  containerWidth: number,
  devicePixelRatio = window.devicePixelRatio || 1
): number[] {
  const baseWidth = containerWidth * devicePixelRatio;

  // Generate sizes: 1x, 1.5x, 2x
  return [Math.round(baseWidth), Math.round(baseWidth * 1.5), Math.round(baseWidth * 2)].filter(
    (size, index, arr) => arr.indexOf(size) === index
  ); // Remove duplicates
}

/**
 * Preload an image
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Check if image URL is valid and accessible
 */
export async function isImageAccessible(src: string): Promise<boolean> {
  try {
    await preloadImage(src);
    return true;
  } catch {
    return false;
  }
}
