import { copyFile, mkdir, readFile, readdir, rm, stat } from "node:fs/promises";
import { dirname, join } from "node:path";

const output = "build/client";
const manifest = await readFile("app/data/skins.ts", "utf8") + await readFile("app/data/aospSkins.ts", "utf8");
const routes = new Set();
for (const entry of await readdir(output, { withFileTypes: true })) {
  if (entry.isDirectory() && await stat(join(output, entry.name, "index.html")).catch(() => null)) {
    routes.add(entry.name);
  }
}
if (routes.size === 0) throw new Error("No prerendered device routes found; refusing to prune skin assets.");

// Some public devices share another model's official front artwork.
for (const [, target, source] of manifest.matchAll(/skins\["([^"/]+)\/[^\"]+"\] = skins\["([^"/]+)\/[^\"]+"\]/g)) {
  if (routes.has(target)) routes.add(source);
}

const assets = [...new Set([...manifest.matchAll(/"\/(skins\/[^"\n]+\.(?:png|webp))"/g)]
  .map(match => match[1])
  .filter(path => routes.has(path.split("/")[1])))];
if (assets.length === 0) throw new Error("No published skin images found; refusing to prune skin assets.");

// Validate everything before replacing the copied public directory.
for (const asset of assets) {
  const webp = asset.replace(/\.png$/, ".webp");
  if (!await stat(join("public", webp)).catch(() => null)) {
    throw new Error(`Missing ${webp}; run pnpm skins:optimize after importing Samsung PNGs.`);
  }
}

await rm(join(output, "skins"), { recursive: true, force: true });
let bytes = 0;
for (const asset of assets) {
  const webp = asset.replace(/\.png$/, ".webp");
  const source = join("public", webp);
  const destination = join(output, webp);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(source, destination);
  bytes += (await stat(destination)).size;
}
console.log(`Deployment skins: ${assets.length} WebP images, ${(bytes / 1024 / 1024).toFixed(1)} MiB.`);
