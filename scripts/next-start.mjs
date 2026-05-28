import { spawn } from "node:child_process";

const nextCli = "node_modules/next/dist/bin/next";

function run(cmd, args, env) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { stdio: "inherit", shell: false, env });
    child.on("exit", (code) => resolve(code ?? 1));
  });
}

async function main() {
  // distDir is resolved from `.next-distdir` inside `next.config.ts`.
  const code = await run(process.execPath, [nextCli, "start"], { ...process.env });
  process.exit(code);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
