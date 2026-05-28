import fs from "node:fs/promises";
import { spawn } from "node:child_process";

const nextCli = "node_modules/next/dist/bin/next";

function run(cmd, args, env) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { stdio: "inherit", shell: false, env });
    child.on("exit", (code) => resolve(code ?? 1));
  });
}

async function removeTimestampedTypeIncludes() {
  const tsconfigPath = "tsconfig.json";
  const raw = await fs.readFile(tsconfigPath, "utf8");
  const config = JSON.parse(raw);
  if (!Array.isArray(config.include)) return;

  const filtered = config.include.filter(
    (entry) => !/^\.next-build-\d{4}-.+\/(?:dev\/)?types\/\*\*\/\*\.ts$/.test(entry)
  );

  if (filtered.length !== config.include.length) {
    config.include = filtered;
    await fs.writeFile(tsconfigPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  }
}

async function main() {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const distDir = `.next-build-${stamp}`;

  await fs.writeFile(".next-distdir", distDir, "utf8");

  const env = { ...process.env };
  const code = await run(process.execPath, [nextCli, "build", "--webpack"], env);
  if (code === 0) {
    await removeTimestampedTypeIncludes();
  }
  process.exit(code);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
