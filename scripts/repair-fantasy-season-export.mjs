import { mkdir, readdir, stat, copyFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const workspaceRoot = process.cwd();
const renderedSeasonDir = path.join(workspaceRoot, ".next", "server", "app", "fantasy", "seasons");
const exportedSeasonDir = path.join(workspaceRoot, "out", "fantasy", "seasons");

async function main() {
  const entries = await readdir(renderedSeasonDir, { withFileTypes: true });
  const seasonFiles = entries
    .filter((entry) => entry.isFile() && /^\d{4}\.html$/.test(entry.name))
    .map((entry) => entry.name)
    .sort();

  if (seasonFiles.length === 0) {
    console.warn("No rendered fantasy season recap files were found to repair.");
    return;
  }

  let repairedCount = 0;

  for (const fileName of seasonFiles) {
    const seasonYear = fileName.replace(/\.html$/, "");
    const sourcePath = path.join(renderedSeasonDir, fileName);
    const destinationDir = path.join(exportedSeasonDir, seasonYear);
    const destinationPath = path.join(destinationDir, "index.html");

    await mkdir(destinationDir, { recursive: true });
    await copyFile(sourcePath, destinationPath);

    const destinationStats = await stat(destinationPath);
    if (destinationStats.size > 0) {
      repairedCount += 1;
    }
  }

  console.log(`Repaired ${repairedCount} fantasy season recap export page(s).`);
}

await main();
