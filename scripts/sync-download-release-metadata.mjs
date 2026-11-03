#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createHash } from "node:crypto";

const repoRoot = process.cwd();
const targetsPath = path.join(repoRoot, "data", "download-release-sync.targets.json");
const outputPath = path.join(repoRoot, "data", "download-release-metadata.json");

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return undefined;
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes;
  let unitIndex = -1;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const decimals = value >= 100 ? 0 : value >= 10 ? 1 : 2;
  return `${value.toFixed(decimals)} ${units[unitIndex]}`;
}

function normalizeVersion(version) {
  if (typeof version !== "string") return undefined;
  const trimmed = version.trim();
  if (!trimmed) return undefined;
  return trimmed.replace(/^v/i, "");
}

function toHeaders() {
  const headers = {
    "Accept": "application/vnd.github+json",
    "User-Agent": "tamemj-download-sync-script"
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: toHeaders() });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status} for ${url}${body ? `: ${body.slice(0, 300)}` : ""}`);
  }
  return response.json();
}

async function fetchText(url) {
  const response = await fetch(url, { headers: toHeaders() });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.text();
}

function normalizeFileName(name) {
  return name.replace(/^\.?\//, "").trim().toLowerCase();
}

function parseChecksums(text) {
  const checksums = new Map();
  const lines = String(text).split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // "<hash>  filename" or "<hash> *filename"
    let match = line.match(/^([a-fA-F0-9]{64})\s+[* ]?(.+)$/);
    if (match) {
      const [, hash, fileName] = match;
      checksums.set(normalizeFileName(fileName), hash.toLowerCase());
      continue;
    }

    // "SHA256 (filename) = <hash>"
    match = line.match(/^SHA256\s+\((.+)\)\s*=\s*([a-fA-F0-9]{64})$/i);
    if (match) {
      const [, fileName, hash] = match;
      checksums.set(normalizeFileName(fileName), hash.toLowerCase());
      continue;
    }
  }

  return checksums;
}

function parseChecksumMapsFromReleaseBody(body) {
  return parseChecksums(body ?? "");
}

function matchAsset(assets, matcher) {
  const includes = (matcher.assetNameIncludes ?? []).map((value) => String(value).toLowerCase());
  const excludes = (matcher.assetNameExcludes ?? []).map((value) => String(value).toLowerCase());
  const regex = matcher.assetNameRegex ? new RegExp(matcher.assetNameRegex, "i") : null;

  const candidates = assets.filter((asset) => {
    const name = String(asset.name ?? "").toLowerCase();
    if (!name) return false;
    if (includes.some((needle) => !name.includes(needle))) return false;
    if (excludes.some((needle) => name.includes(needle))) return false;
    if (regex && !regex.test(asset.name ?? "")) return false;
    return true;
  });

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => {
    const aDownloads = Number(a.download_count ?? 0);
    const bDownloads = Number(b.download_count ?? 0);
    if (bDownloads !== aDownloads) return bDownloads - aDownloads;

    const aSize = Number(a.size ?? 0);
    const bSize = Number(b.size ?? 0);
    if (bSize !== aSize) return bSize - aSize;

    return String(a.name ?? "").localeCompare(String(b.name ?? ""));
  });

  return candidates[0];
}

function getDigestSha256(asset) {
  const digest = typeof asset.digest === "string" ? asset.digest : undefined;
  if (!digest) return undefined;
  const match = digest.match(/^sha256:([a-fA-F0-9]{64})$/i);
  return match?.[1]?.toLowerCase();
}

function getChecksumCandidates(assets) {
  return assets.filter((asset) => {
    const name = String(asset.name ?? "").toLowerCase();
    if (!name) return false;
    if (!/(sha256|sha-256|checksums?|digest)/i.test(name)) return false;
    if (Number(asset.size ?? 0) > 2_000_000) return false;
    return /\.(txt|sha256|sha256sum|sha256sums|checksums?)$/i.test(name) || /checksums?/i.test(name);
  });
}

async function loadLatestRelease(repo) {
  const base = `https://api.github.com/repos/${repo}`;

  try {
    return await fetchJson(`${base}/releases/latest`);
  } catch (error) {
    const list = await fetchJson(`${base}/releases?per_page=10`);
    const fallback = Array.isArray(list)
      ? list.find((release) => !release.draft && !release.prerelease) ?? list.find((release) => !release.draft)
      : null;
    if (!fallback) {
      throw error;
    }
    return fallback;
  }
}

async function buildChecksumMapForRelease(release) {
  const map = new Map();
  const assets = Array.isArray(release.assets) ? release.assets : [];

  for (const asset of getChecksumCandidates(assets).slice(0, 3)) {
    try {
      const text = await fetchText(asset.browser_download_url);
      const parsed = parseChecksums(text);
      for (const [file, hash] of parsed.entries()) {
        if (!map.has(file)) map.set(file, hash);
      }
    } catch {
      // Ignore checksum asset fetch/parsing failures and continue.
    }
  }

  const bodyMap = parseChecksumMapsFromReleaseBody(release.body);
  for (const [file, hash] of bodyMap.entries()) {
    if (!map.has(file)) map.set(file, hash);
  }

  return map;
}

function resolveChecksumForAsset(asset, checksumMap) {
  const fromDigest = getDigestSha256(asset);
  if (fromDigest) return fromDigest;

  const assetName = normalizeFileName(String(asset.name ?? ""));
  if (checksumMap.has(assetName)) return checksumMap.get(assetName);

  const basename = assetName.split("/").pop() ?? assetName;
  if (checksumMap.has(basename)) return checksumMap.get(basename);

  return undefined;
}

async function computeSha256FromDownload(url) {
  const response = await fetch(url, { headers: toHeaders() });
  if (!response.ok || !response.body) {
    throw new Error(`Unable to download asset for checksum: ${response.status} ${url}`);
  }

  const hash = createHash("sha256");
  for await (const chunk of response.body) {
    hash.update(chunk);
  }
  return hash.digest("hex");
}

async function main() {
  const shouldComputeMissingChecksums = process.env.DOWNLOAD_SYNC_COMPUTE_SHA256 === "1";
  const checksumComputeLimitBytes = Number(process.env.DOWNLOAD_SYNC_CHECKSUM_MAX_BYTES ?? 100_000_000);

  const targetsRaw = JSON.parse(await fs.readFile(targetsPath, "utf8"));
  const targets = Array.isArray(targetsRaw.targets) ? targetsRaw.targets : [];

  const store = {
    version: 1,
    generatedAt: new Date().toISOString(),
    entries: {}
  };

  let matchedArtifacts = 0;
  let unmatchedArtifacts = 0;

  for (const target of targets) {
    if (!target || typeof target !== "object") continue;
    const entrySlug = String(target.entrySlug ?? "");
    const repo = String(target.repo ?? "");
    const artifactMatchers = Array.isArray(target.artifacts) ? target.artifacts : [];
    if (!entrySlug || !repo || artifactMatchers.length === 0) continue;

    process.stdout.write(`Syncing ${entrySlug} <- ${repo} ... `);

    try {
      const release = await loadLatestRelease(repo);
      const assets = Array.isArray(release.assets) ? release.assets : [];
      const checksumMap = await buildChecksumMapForRelease(release);

      const entryMetadata = {
        repo,
        releaseTag: typeof release.tag_name === "string" ? release.tag_name : undefined,
        releaseName: typeof release.name === "string" ? release.name : undefined,
        releaseUrl: typeof release.html_url === "string" ? release.html_url : undefined,
        publishedAt: typeof release.published_at === "string" ? release.published_at : undefined,
        artifacts: {}
      };

      for (const matcher of artifactMatchers) {
        const artifactLabel = String(matcher.artifactLabel ?? "");
        if (!artifactLabel) continue;

        const asset = matchAsset(assets, matcher);
        if (!asset) {
          unmatchedArtifacts += 1;
          continue;
        }

        matchedArtifacts += 1;
        let checksumSha256 = resolveChecksumForAsset(asset, checksumMap);
        if (
          !checksumSha256 &&
          shouldComputeMissingChecksums &&
          Number.isFinite(Number(asset.size ?? 0)) &&
          Number(asset.size ?? 0) > 0 &&
          Number(asset.size ?? 0) <= checksumComputeLimitBytes
        ) {
          try {
            checksumSha256 = await computeSha256FromDownload(asset.browser_download_url);
          } catch {
            // Keep checksum empty if checksum computation fails.
          }
        }

        entryMetadata.artifacts[artifactLabel] = {
          assetName: typeof asset.name === "string" ? asset.name : undefined,
          resolvedUrl:
            typeof asset.browser_download_url === "string" ? asset.browser_download_url : undefined,
          version: normalizeVersion(
            typeof release.tag_name === "string" ? release.tag_name : release.name
          ),
          fileSize: formatBytes(Number(asset.size ?? 0)),
          fileSizeBytes: Number.isFinite(Number(asset.size ?? 0)) ? Number(asset.size ?? 0) : undefined,
          checksumSha256
        };
      }

      store.entries[entrySlug] = entryMetadata;
      process.stdout.write(
        `ok (${Object.keys(entryMetadata.artifacts).length}/${artifactMatchers.length} artifacts matched)\n`
      );
    } catch (error) {
      process.stdout.write(`failed\n`);
      console.error(`  ${repo}:`, error instanceof Error ? error.message : String(error));
    }
  }

  await fs.writeFile(outputPath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
  console.log(
    `Wrote ${outputPath} (${Object.keys(store.entries).length} repos, ${matchedArtifacts} matched artifact(s), ${unmatchedArtifacts} unmatched artifact(s)).`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
