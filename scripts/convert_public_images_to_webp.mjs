import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const TARGETS = [
  "public/brochure/agents.png",
  "public/brochure/forecast.png",
  "public/brochure/scope.jpg",
  "public/diegopozo.png",
];

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const results = {};

  for (const rel of TARGETS) {
    const abs = path.join(ROOT, rel);
    if (!(await exists(abs))) {
      console.warn(`Missing: ${rel}`);
      continue;
    }

    const img = sharp(abs, { failOn: "none" });
    const meta = await img.metadata();
    if (!meta.width || !meta.height) {
      console.warn(`No dimensions: ${rel}`);
      continue;
    }

    const outRel = rel.replace(/\.(png|jpe?g)$/i, ".webp");
    const outAbs = path.join(ROOT, outRel);

    await img
      .webp({
        quality: 82,
        effort: 5,
      })
      .toFile(outAbs);

    results["/" + rel.replace(/\\/g, "/").replace(/^public\//, "")] = {
      width: meta.width,
      height: meta.height,
      webp: "/" + outRel.replace(/\\/g, "/").replace(/^public\//, ""),
    };
  }

  // OG image (1200x630) from diegopozo.png
  const ogOut = path.join(ROOT, "public/og.webp");
  const ogSrc = path.join(ROOT, "public/diegopozo.png");
  if (await exists(ogSrc)) {
    await sharp(ogSrc, { failOn: "none" })
      .resize(1200, 630, { fit: "cover", position: "centre" })
      .webp({ quality: 84, effort: 5 })
      .toFile(ogOut);
  }

  const outJson = path.join(ROOT, "scripts/image-dimensions.generated.json");
  await fs.writeFile(outJson, JSON.stringify(results, null, 2) + "\n", "utf8");
  console.log(`Wrote ${outJson}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

