import type { NextConfig } from "next";
import createBundleAnalyzer from "@next/bundle-analyzer";

const wantsStaticExport = process.env.npm_lifecycle_event === "build:static";
const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true"
});

const nextConfig: NextConfig = {
  ...(wantsStaticExport ? { output: "export" as const } : {}),
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default withBundleAnalyzer(nextConfig);
