/**
 * Normalizes asset URLs by encoding special characters (e.g., spaces) in filenames.
 * This ensures that product image URLs with spaces or other special characters
 * render correctly in <img> tags.
 */
export function normalizeAssetUrl(url: string): string {
  if (!url) return url;
  
  // If it's already a full URL or data URL, return as-is
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  
  // Split the path into segments
  const parts = url.split('/');
  
  // Encode only the filename (last segment) to handle spaces and special chars
  const encodedParts = parts.map((part, index) => {
    // Don't encode the path segments, only the filename
    if (index === parts.length - 1) {
      return encodeURIComponent(part);
    }
    return part;
  });
  
  return encodedParts.join('/');
}
