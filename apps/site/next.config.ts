import type { NextConfig } from "next";

const configuredBasePath = process.env.REDEEMLOOP_SITE_BASE_PATH?.trim() ?? "";
const basePath = configuredBasePath === "/" ? "" : configuredBasePath.replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  trailingSlash: true,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_REDEEMLOOP_SITE_BASE_PATH: basePath,
  },
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
};

export default nextConfig;
