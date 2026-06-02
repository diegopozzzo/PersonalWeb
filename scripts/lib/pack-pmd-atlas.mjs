import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const { packAsync } = require(
  "../../.tmp-pac/edit/assetpack/node_modules/free-tex-packer-core"
)

/**
 * @param {string} splitRoot e.g. .../edit/split/0052-0002
 * @param {string} assetId output basename
 * @param {string} outDir directory for assetId.json/png
 */
export async function packSplitFolder(splitRoot, assetId, outDir) {
  if (!fs.existsSync(splitRoot)) {
    throw new Error(`Split folder not found: ${splitRoot}`)
  }

  const files = []
  const walk = (dir, prefix = "") => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(full, prefix ? `${prefix}/${entry.name}` : entry.name)
        continue
      }
      if (!entry.name.endsWith(".png")) continue
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name
      const framePath = rel.replace(/\.png$/i, "")
      files.push({
        path: framePath,
        contents: fs.readFileSync(full)
      })
    }
  }
  walk(splitRoot)

  if (!files.length) {
    throw new Error(`No PNG frames in ${splitRoot}`)
  }

  const packed = await packAsync(files, {
    textureName: assetId,
    width: 2048,
    height: 2048,
    padding: 2,
    allowRotation: false,
    detectIdentical: true,
    allowTrim: true,
    trimMode: "trim",
    exporter: "Phaser3",
    fileName: assetId,
    packer: "MaxRectsBin",
    packerMethod: "BestShortSideFit"
  })

  fs.mkdirSync(outDir, { recursive: true })
  for (const file of packed) {
    fs.writeFileSync(path.join(outDir, file.name), file.buffer)
  }

  const atlasPath = path.join(outDir, `${assetId}.json`)
  const atlas = JSON.parse(fs.readFileSync(atlasPath, "utf8"))
  if (atlas?.textures?.[0]) {
    atlas.textures[0].image = `${assetId}.png`
    fs.writeFileSync(atlasPath, JSON.stringify(atlas))
  }
}
