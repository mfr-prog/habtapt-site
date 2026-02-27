/**
 * Utility to build optimized Unsplash image URLs with responsive srcSet.
 *
 * Unsplash supports on-the-fly transforms via URL parameters:
 *   w   – width         fm  – format (webp, avif, jpg)
 *   q   – quality 1-100 fit – crop/max/clip
 */

/** Replace or add a query-string parameter in an Unsplash URL */
function setParam(url: string, key: string, value: string): string {
  const re = new RegExp(`([?&])${key}=[^&]*`);
  if (re.test(url)) return url.replace(re, `$1${key}=${value}`);
  return url + (url.includes('?') ? '&' : '?') + `${key}=${value}`;
}

/** Build an optimised Unsplash URL at a specific width */
export function unsplashUrl(
  src: string,
  width: number,
  { format = 'avif', quality = 40 }: { format?: string; quality?: number } = {},
): string {
  let url = src;
  url = setParam(url, 'fm', format);
  url = setParam(url, 'q', String(quality));
  url = setParam(url, 'w', String(width));
  return url;
}

/** Check if an URL points to Unsplash (images.unsplash.com) */
export function isUnsplashUrl(src: string): boolean {
  return src.includes('images.unsplash.com');
}

/**
 * Generate a srcSet string for responsive images.
 * Returns undefined for non-Unsplash images.
 */
export function unsplashSrcSet(
  src: string,
  widths: number[],
  opts?: { format?: string; quality?: number },
): string | undefined {
  if (!isUnsplashUrl(src)) return undefined;
  return widths
    .map((w) => `${unsplashUrl(src, w, opts)} ${w}w`)
    .join(', ');
}
