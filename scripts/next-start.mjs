import fs from "node:fs/promises";
import { spawn } from "node:child_process";

const npx = process.platform === "win32" ? "npx.cmd" : "npx";

function run(cmd, args, env) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { stdio: "inherit", shell: true, env });
    child.on("exit", (code) => resolve(code ?? 1));
  });
}

async function main() {
  // distDir is resolved from `.next-distdir` inside `next.config.ts`.
  const code = await run(npx, ["next", "start"], { ...process.env });
  process.exit(code);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
