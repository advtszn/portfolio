import sharp from "sharp";
import type { ImageMetadata } from "astro";
import path from "path";
import { fileURLToPath } from "url";

export async function generateLQIP(
  image: ImageMetadata,
  options: { width?: number; blur?: number; grayscale?: boolean } = {}
): Promise<string> {
  const { width = 20, blur = 10, grayscale = false } = options;

  // Astro's ImageMetadata has the original file path encoded
  // We need to find the actual file on disk
  let absolutePath: string;

  // Check for fsPath (internal Astro property for original file)
  const fsPath = (image as any).fsPath;
  if (fsPath) {
    if (fsPath.startsWith("file://")) {
      absolutePath = fileURLToPath(fsPath);
    } else {
      absolutePath = fsPath;
    }
  } else {
    // Fallback: construct path from image src
    // The image.src in dev looks like "/@fs/path/to/file" or "/src/assets/..."
    const imageSrc = image.src;

    if (imageSrc.includes("/@fs/")) {
      absolutePath = imageSrc.split("/@fs")[1].split("?")[0];
    } else if (imageSrc.startsWith("/src/")) {
      absolutePath = path.join(process.cwd(), imageSrc);
    } else {
      // Try to extract path from the image metadata
      // For build time, we need to look at where the original asset came from
      const srcDir = path.join(process.cwd(), "src");

      // Extract filename from the src (handles hashed names like foo.abc123.png)
      const filename = path.basename(imageSrc).split(".")[0];

      // Search in assets directory - this is a fallback
      absolutePath = path.join(srcDir, "assets", imageSrc);
    }
  }

  // Read and process the image
  let pipeline = sharp(absolutePath).resize(width).blur(blur);

  if (grayscale) {
    pipeline = pipeline.grayscale();
  }

  const buffer = await pipeline.webp({ quality: 20 }).toBuffer();
  const base64 = buffer.toString("base64");

  return `data:image/webp;base64,${base64}`;
}

// Alternative: Generate LQIP from file path directly
export async function generateLQIPFromPath(
  filePath: string,
  options: { width?: number; blur?: number; grayscale?: boolean } = {}
): Promise<string> {
  const { width = 20, blur = 10, grayscale = false } = options;

  let pipeline = sharp(filePath).resize(width).blur(blur);

  if (grayscale) {
    pipeline = pipeline.grayscale();
  }

  const buffer = await pipeline.webp({ quality: 20 }).toBuffer();
  const base64 = buffer.toString("base64");

  return `data:image/webp;base64,${base64}`;
}

export type LQIPImage = {
  src: ImageMetadata;
  alt: string;
  lqip: string;
};

export async function processImagesWithLQIP(
  images: { src: ImageMetadata; alt: string }[],
  options: { grayscale?: boolean } = {}
): Promise<LQIPImage[]> {
  return Promise.all(
    images.map(async (img) => ({
      ...img,
      lqip: await generateLQIP(img.src, options),
    }))
  );
}
