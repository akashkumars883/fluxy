import type { NextConfig } from "next";
import fs from "node:fs";
import path from "node:path";

function readDistDir() {
  try {
    const p = path.join(process.cwd(), ".next-distdir");
    const v = fs.readFileSync(p, "utf8").trim();
    return v || ".next";
  } catch {
    return ".next";
  }
}

const nextConfig: NextConfig = {
  // If deletes/unlinks are disallowed, we can build to a fresh directory each run.
  // The active build directory is stored in `.next-distdir`.
  distDir: readDistDir(),
};

export default nextConfig;
