import { promises as fs } from "fs";
import path from "path";

const IMG_IN_PUBLIC = "img/t";
const IMG_OUTPUT_DIR = path.resolve("./public/" + IMG_IN_PUBLIC);
const PUBLIC_DIR = path.resolve("./public");

const cache = new Map<string, string>();

function shortHashFn(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return (hash >>> 0).toString(16).slice(0, 8);
}

export interface ImageProcessingOptions {
  src: string;
  width?: number;
  height?: number;
  format?: "jpg" | "png" | "webp" | "gif" | "svg" | "avif";
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
}

async function resolveImagePath(src: string): Promise<string> {
  // If path starts with '/', it's relative to public directory
  if (src.startsWith("/")) {
    return path.join(PUBLIC_DIR, src);
  }

  // Otherwise treat as relative path
  return path.resolve(src);
}

async function processImage(options: ImageProcessingOptions) {
  const imagePath = await resolveImagePath(options.src);

  // Check if source image exists
  try {
    await fs.access(imagePath);
  } catch {
    console.error(`Source image not found: ${options.src}`);
    return null;
  }

  // Create a more readable filename
  const dimensions =
    options.width && options.height
      ? `${options.width}x${options.height}`
      : options.width
      ? `w${options.width}`
      : options.height
      ? `h${options.height}`
      : "orig";

  const fit = options.fit ? `-${options.fit}` : "";
  const sourceHash = shortHashFn(imagePath);
  const extension =
    options.format || path.extname(imagePath).slice(1) || "webp";

  const fileName = `${sourceHash}-${dimensions}${fit}.${extension}`;
  const outputPath = path.join(IMG_OUTPUT_DIR, fileName);

  if (cache.has(fileName)) return `/${IMG_IN_PUBLIC}/${fileName}`;

  await fs.mkdir(IMG_OUTPUT_DIR, { recursive: true });

  try {
    await fs.access(outputPath);
    cache.set(fileName, `/${IMG_IN_PUBLIC}/${fileName}`);
    return `/${IMG_IN_PUBLIC}/${fileName}`;
  } catch {
    // For now, we'll just copy the file. In a real implementation,
    // you might want to add actual image processing here
    await fs.copyFile(imagePath, outputPath);
    cache.set(fileName, `/${IMG_IN_PUBLIC}/${fileName}`);
    return `/${IMG_IN_PUBLIC}/${fileName}`;
  }
}

export async function getImageSrc(options: ImageProcessingOptions) {
  if (!options.src) throw new Error("No image source provided");
  return await processImage(options);
}
