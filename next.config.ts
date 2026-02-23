import type { NextConfig } from "next";
import fs from "node:fs";
import path from "node:path";

function hasAppsConfigured(): boolean {
  try {
    const appsPath = path.join(process.cwd(), "data", "apps.json");
    const raw = fs.readFileSync(appsPath, "utf8");
    const apps = JSON.parse(raw);
    return Array.isArray(apps) && apps.length > 0;
  } catch {
    return false;
  }
}

const wantsStaticExport = process.env.npm_lifecycle_event === "build:static";
const hasApps = hasAppsConfigured();

if (wantsStaticExport && !hasApps) {
  throw new Error(
    'Static export is disabled because "data/apps.json" is empty and "/apps/[slug]" requires at least one generated path. Add your first app, or run "npm run build" for a normal local build.'
  );
}

const nextConfig: NextConfig = {
  ...(wantsStaticExport ? { output: "export" as const } : {}),
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
