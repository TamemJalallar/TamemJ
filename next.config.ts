import type { NextConfig } from "next";

const wantsStaticExport = process.env.npm_lifecycle_event === "build:static";

const nextConfig: NextConfig = {
  ...(wantsStaticExport ? { output: "export" as const } : {}),
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
