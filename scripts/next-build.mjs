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
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const distDir = `.next-build-${stamp}`;

  await fs.writeFile(".next-distdir", distDir, "utf8");

  const env = { ...process.env };
  const code = await run(npx, ["next", "build"], env);
  process.exit(code);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
