// Utility for working with blob storage
// Provides helpers for converting Files to bytes and uploading with progress tracking

export async function fileToBytes(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      resolve(new Uint8Array(arrayBuffer));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

export async function createExternalBlobFromFile(
  file: File,
  onProgress?: (percentage: number) => void
): Promise<{ directURL: string }> {
  // For now, create a simple blob URL for the file
  // In a real implementation with blob-storage component, this would upload to IC storage
  
  // Simply use the file directly to create a blob URL
  const directURL = URL.createObjectURL(file);
  
  // Simulate progress if callback provided
  if (onProgress) {
    onProgress(100);
  }
  
  return { directURL };
}
