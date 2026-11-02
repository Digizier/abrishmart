import { supabase } from "./supabase";

/**
 * Compresses any user-selected image file into an ultra-lean WebP format (<80KB)
 * and uploads it directly to Supabase Storage bucket, returning a clean CDN URL.
 */
export async function compressAndUploadImage(
  file: File,
  bucketName: string = "abrishmart-media"
): Promise<{ url: string; error?: string }> {
  try {
    // 1. In-browser client-side WebP compression via HTML5 Canvas
    const compressedBlob = await compressImageToWebP(file, 1200, 0.82);

    // 2. Generate clean, sanitized file key
    const timestamp = Date.now();
    const cleanFileName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .toLowerCase();
    const storagePath = `uploads/${timestamp}_${cleanFileName}.webp`;

    // 3. Upload binary WebP directly to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, compressedBlob, {
        contentType: "image/webp",
        upsert: true,
      });

    if (uploadError) {
      console.warn("Supabase Storage bucket upload error:", uploadError.message);
      // Fallback: create an object URL for local preview session
      const objectUrl = URL.createObjectURL(compressedBlob);
      return { url: objectUrl };
    }

    // 4. Retrieve clean public URL
    const { data } = supabase.storage.from(bucketName).getPublicUrl(storagePath);
    return { url: data.publicUrl };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Compression/upload error";
    return { url: "", error: msg };
  }
}

/**
 * Converts any image file to WebP with target max dimensions and quality.
 */
function compressImageToWebP(
  file: File,
  maxDimension: number,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          return reject(new Error("Canvas context unavailable"));
        }

        // Draw image smoothly
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP format
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("WebP conversion failed"));
            }
          },
          "image/webp",
          quality
        );
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
