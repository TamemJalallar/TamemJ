import type { NextConfig } from "next";

type ConfigTransformer = (config: NextConfig) => NextConfig;

function getBundleAnalyzer(): ConfigTransformer {
  if (process.env.ANALYZE !== "true") {
    return (config) => config;
  }

  const createBundleAnalyzer = require("@next/bundle-analyzer") as (options: {
    enabled: boolean;
  }) => ConfigTransformer;

  return createBundleAnalyzer({
    enabled: true
  });
}

const wantsStaticExport = process.env.npm_lifecycle_event === "build:static";
const withBundleAnalyzer = getBundleAnalyzer();

const nextConfig: NextConfig = {
  ...(wantsStaticExport ? { output: "export" as const } : {}),
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default withBundleAnalyzer(nextConfig);
