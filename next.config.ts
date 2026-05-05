import type { NextConfig } from "next";
import path from "path";

const PROJECT_ROOT = path.resolve(__dirname);

const nextConfig: NextConfig = {
  turbopack: {
    root: PROJECT_ROOT,
  },
};

export default nextConfig;
