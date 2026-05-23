import fs from "node:fs/promises";

async function main() {
  // Minimal test harness placeholder:
  // - Keeps `npm test` functional in CI/dev
  // - Avoids silently passing when critical files are missing
  const requiredFiles = ["package.json", "src/app/layout.tsx"];
  for (const file of requiredFiles) {
    await fs.access(new URL(`../${file}`, import.meta.url));
  }
  process.stdout.write("ok\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

