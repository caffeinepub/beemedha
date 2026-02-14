export function validateJPEG(file: File): { valid: boolean; error?: string } {
  // Check MIME type
  if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
    return {
      valid: false,
      error: 'Only JPEG images are allowed',
    };
  }

  // Check file extension
  const fileName = file.name.toLowerCase();
  if (!fileName.endsWith('.jpg') && !fileName.endsWith('.jpeg')) {
    return {
      valid: false,
      error: 'File must have .jpg or .jpeg extension',
    };
  }

  return { valid: true };
}

export async function readFileAsBytes(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(new Uint8Array(reader.result));
      } else {
        reject(new Error('Failed to read file as ArrayBuffer'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}
