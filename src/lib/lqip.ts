import { getPlaiceholder } from "plaiceholder";
import type { ImageMetadata } from "astro";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Cache for blur placeholders to avoid regenerating on every request
const placeholderCache = new Map<string, string>();

// Get the project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");

/**
 * Generates a low-quality image placeholder (LQIP) for a given image.
 * Accepts a path relative to src/assets (e.g., "home/city.png").
 * Returns a base64-encoded blurred placeholder data URL.
 */
export async function getBlurPlaceholder(assetPath: string): Promise<string> {
  try {
    // Check cache first
    if (placeholderCache.has(assetPath)) {
      return placeholderCache.get(assetPath)!;
    }

    // Resolve the full path from assets directory
    const fullPath = path.resolve(projectRoot, "src/assets", assetPath);

    const buffer = fs.readFileSync(fullPath);

    const { base64 } = await getPlaiceholder(buffer, {
      size: 10, // Small size for blur effect
    });

    // Cache the result
    placeholderCache.set(assetPath, base64);

    return base64;
  } catch (error) {
    console.error("Error generating blur placeholder for:", assetPath, error);
    // Return a transparent pixel as fallback
    return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  }
}

/**
 * Generates blur placeholders for multiple images.
 * Returns an array of base64 placeholders in the same order as input.
 */
export async function getBlurPlaceholders(
  assetPaths: string[],
): Promise<string[]> {
  return Promise.all(assetPaths.map((p) => getBlurPlaceholder(p)));
}
