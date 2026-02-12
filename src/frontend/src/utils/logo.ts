import type { Logo } from '../backend';

/**
 * Converts a Logo object from the backend into a browser-renderable URL.
 * Returns null if the logo data is invalid or empty.
 */
export function logoToUrl(logo: Logo | null | undefined): string | null {
  if (!logo || !logo.data || logo.data.length === 0) {
    return null;
  }

  try {
    // Convert Uint8Array to regular array for Blob compatibility
    const blob = new Blob([new Uint8Array(logo.data)], { type: logo.mimeType });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Failed to convert logo to URL:', error);
    return null;
  }
}

/**
 * Revokes a previously created object URL to free memory.
 * Safe to call with null values.
 */
export function revokeLogoUrl(url: string | null): void {
  if (url) {
    try {
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to revoke logo URL:', error);
    }
  }
}
