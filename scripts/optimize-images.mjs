import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const TARGET_DIR = path.join(ROOT, "src", "assets");
const SUPPORTED = new Set([".jpg", ".jpeg", ".png"]);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (SUPPORTED.has(ext)) {
      files.push(fullPath);
    }
  }

  return files;
}

async function optimize(filePath) {
  const parsed = path.parse(filePath);
  const webpOut = path.join(parsed.dir, `${parsed.name}.webp`);
  const avifOut = path.join(parsed.dir, `${parsed.name}.avif`);

  const image = sharp(filePath, { failOn: "none" }).rotate();

  await image.clone().webp({ quality: 78, effort: 5 }).toFile(webpOut);
  await image.clone().avif({ quality: 52, effort: 6 }).toFile(avifOut);

  return { webpOut, avifOut };
}

async function main() {
  const files = await walk(TARGET_DIR);

  if (!files.length) {
    console.log("No source images found to optimize.");
    return;
  }

  console.log(`Optimizing ${files.length} source images to WebP and AVIF...`);

  for (const file of files) {
    try {
      const outputs = await optimize(file);
      console.log(`✔ ${path.relative(ROOT, file)} -> ${path.relative(ROOT, outputs.webpOut)}, ${path.relative(ROOT, outputs.avifOut)}`);
    } catch (error) {
      console.error(`✖ Failed: ${path.relative(ROOT, file)}`);
      console.error(error);
      process.exitCode = 1;
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
