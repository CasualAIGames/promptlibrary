/**
 * Comprime una imagen a base64 con calidad reducida
 */
export function compressImage(file: File, maxWidth: number = 1920, maxHeight: number = 1080, quality: number = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calcular nuevas dimensiones manteniendo aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo obtener contexto del canvas'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir a base64 con calidad reducida
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Verifica si una cadena base64 es una imagen
 */
export function isBase64Image(str: string): boolean {
  return str.startsWith('data:image/');
}

/**
 * Obtiene el tamaño aproximado de una cadena base64 en bytes
 */
export function getBase64Size(base64: string): number {
  // Aproximación: base64 es ~33% más grande que el original
  return Math.ceil((base64.length * 3) / 4);
}

/**
 * Verifica si una imagen base64 es demasiado grande para localStorage
 */
export function isImageTooLarge(base64: string, maxSizeMB: number = 1): boolean {
  const sizeBytes = getBase64Size(base64);
  const maxBytes = maxSizeMB * 1024 * 1024;
  return sizeBytes > maxBytes;
}

/**
 * Convierte una URL de imagen a base64 (si es necesario)
 */
export function imageUrlToBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Si ya es base64, retornar directamente
    if (isBase64Image(url)) {
      resolve(url);
      return;
    }

    // Si es una URL externa, cargar y convertir
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('No se pudo obtener contexto del canvas'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      const base64 = canvas.toDataURL('image/jpeg', 0.7);
      resolve(base64);
    };
    img.onerror = reject;
    img.src = url;
  });
}

