export async function compressImage(file: File, maxWidth = 1280, quality = 0.85): Promise<File> {
  if (!file || !file.type || !file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file;
  }

  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolve(file);
              return;
            }

            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
              (blob) => {
                if (blob && blob.size < file.size) {
                  const cleanName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                  const compressedFile = new File([blob], cleanName, {
                    type: 'image/webp',
                    lastModified: Date.now(),
                  });
                  resolve(compressedFile);
                } else {
                  resolve(file);
                }
              },
              'image/webp',
              quality
            );
          } catch {
            resolve(file);
          }
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    } catch {
      resolve(file);
    }
  });
}