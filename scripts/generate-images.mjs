#!/usr/bin/env node
/**
 * scripts/generate-images.mjs
 *
 * Generates PNG assets (OG image + PWA/favicon icons) from SVG sources using sharp.
 *
 * Usage:
 *   node scripts/generate-images.mjs
 *
 * Outputs:
 *   public/images/site/og-image.png        1200 × 630  (Open Graph / Twitter card)
 *   public/icons/icon-192.png               192 × 192  (PWA / manifest)
 *   public/icons/icon-512.png               512 × 512  (PWA / manifest)
 *   public/icons/apple-touch-icon.png       180 × 180  (iOS home screen)
 */

import sharp from "sharp";
import { existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PUBLIC = resolve(ROOT, "public");

// ── Source SVG paths ──────────────────────────────────────────────────────────
const OG_SVG = resolve(PUBLIC, "images", "site", "og-image.svg");
const FAVICON_SVG = resolve(PUBLIC, "favicon.svg");

// ── Ensure output directories exist ──────────────────────────────────────────
const ICONS_DIR = resolve(PUBLIC, "icons");
const SITE_IMG_DIR = resolve(PUBLIC, "images", "site");
[ICONS_DIR, SITE_IMG_DIR].forEach((dir) => {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
});

// ── Task list ─────────────────────────────────────────────────────────────────
/**
 * @typedef {{ src: string; out: string; width: number; height: number; bg?: sharp.Color; label: string }} Task
 */
const WHITE_BG = { r: 255, g: 255, b: 255, alpha: 1 };
const TRANSPARENT_BG = { r: 0, g: 0, b: 0, alpha: 0 };

/** @type {Task[]} */
const tasks = [
  {
    src: OG_SVG,
    out: resolve(SITE_IMG_DIR, "og-image.png"),
    width: 1200,
    height: 630,
    bg: WHITE_BG,
    label: "og-image.png (1200×630)"
  },
  {
    src: FAVICON_SVG,
    out: resolve(ICONS_DIR, "icon-192.png"),
    width: 192,
    height: 192,
    bg: TRANSPARENT_BG,
    label: "icon-192.png (192×192)"
  },
  {
    src: FAVICON_SVG,
    out: resolve(ICONS_DIR, "icon-512.png"),
    width: 512,
    height: 512,
    bg: TRANSPARENT_BG,
    label: "icon-512.png (512×512)"
  },
  {
    // Apple recommends a non-transparent background so the rounded mask
    // looks great. We use the dark brand colour from the favicon gradient.
    src: FAVICON_SVG,
    out: resolve(ICONS_DIR, "apple-touch-icon.png"),
    width: 180,
    height: 180,
    bg: WHITE_BG,
    label: "apple-touch-icon.png (180×180)"
  }
];

// ── Runner ────────────────────────────────────────────────────────────────────
async function run() {
  console.log("🖼  Generating PNG assets from SVG sources…\n");

  let ok = 0;
  let skipped = 0;

  for (const task of tasks) {
    if (!existsSync(task.src)) {
      console.warn(`  ⚠️  Source not found, skipping: ${task.src}`);
      skipped++;
      continue;
    }

    try {
      // Use a high density so the SVG vector paths render crisply at the
      // target resolution, then resize to the exact pixel dimensions.
      const density = Math.ceil((Math.max(task.width, task.height) / 64) * 72);

      await sharp(task.src, { density: Math.max(density, 144) })
        .resize(task.width, task.height, {
          fit: "contain",
          background: task.bg ?? TRANSPARENT_BG
        })
        .flatten(task.bg?.alpha === 1 ? { background: task.bg } : false)
        .png({ compressionLevel: 9, adaptiveFiltering: true, palette: false })
        .toFile(task.out);

      console.log(`  ✅  ${task.label} → ${task.out.replace(ROOT, ".")}`);
      ok++;
    } catch (err) {
      console.error(`  ❌  Failed: ${task.label}`);
      console.error(`     ${err.message}`);
    }
  }

  const summary = skipped > 0 ? `, skipped ${skipped}` : "";
  console.log(`\n  Done — generated ${ok} file(s)${summary}.\n`);
}

run().catch((err) => {
  console.error("Fatal error in generate-images.mjs:", err);
  process.exit(1);
});
