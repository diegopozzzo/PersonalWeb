#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const { Jimp } = require("../.tmp-pac/node_modules/jimp")

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const kitSprites = path.join(root, "public/pokemon-overlay-kit-expanded/assets/sprites")
const kitPortraits = path.join(root, "public/pokemon-overlay-kit-expanded/assets/portraits")
const kitDurations = path.join(root, "public/pokemon-overlay-kit-expanded/assets/durations.json")
const pacPokemons = path.join(root, ".tmp-pac/app/public/src/assets/pokemons")
const sheetDurations = path.join(root, ".tmp-pac/edit/sheets/durations.json")
const idleSheet = path.join(root, ".tmp-spritecollab/sprite/0025/0006/Idle-Anim.png")

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"))
}

function saveJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`)
}

function rewriteDurationPrefix(durations, fromPrefix, toPrefix) {
  const merged = {}
  for (const [key, value] of Object.entries(durations)) {
    if (!key.startsWith(`${fromPrefix}/`)) continue
    merged[key.replace(`${fromPrefix}/`, `${toPrefix}/`)] = value
  }
  return merged
}

function copyPacAtlas(pacId, assetId) {
  const atlas = loadJson(path.join(pacPokemons, `${pacId}.json`))
  if (atlas?.textures?.[0]) {
    atlas.textures[0].image = `${assetId}.png`
  }
  fs.writeFileSync(
    path.join(kitSprites, `${assetId}.json`),
    JSON.stringify(atlas)
  )
  fs.copyFileSync(
    path.join(pacPokemons, `${pacId}.png`),
    path.join(kitSprites, `${assetId}.png`)
  )
}

async function writeLibrePortrait() {
  const img = await Jimp.read(idleSheet)
  const frame = img.clone().crop({ x: 0, y: 0, w: 40, h: 56 })
  fs.mkdirSync(kitPortraits, { recursive: true })
  await frame.write(path.join(kitPortraits, "0025-f06.png"))
}

async function writePortraitFromAtlas(assetId) {
  const atlas = loadJson(path.join(kitSprites, `${assetId}.json`))
  const candidates = atlas.textures[0].frames.filter((frame) =>
    /Normal\/(Idle|Walk)\/Anim\/0\//.test(frame.filename)
  )
  if (!candidates.length) {
    throw new Error(`Could not find portrait frame in ${assetId} atlas`)
  }
  const idleFrame = candidates.sort(
    (a, b) => b.frame.w * b.frame.h - a.frame.w * a.frame.h
  )[0]

  const sheet = await Jimp.read(path.join(kitSprites, `${assetId}.png`))
  const rect = idleFrame.frame
  const frame = sheet
    .clone()
    .crop({ x: rect.x, y: rect.y, w: rect.w, h: rect.h })
  const target = Math.max(rect.w, rect.h, 1)
  const scale = Math.min(3, Math.max(1.5, 48 / target))
  const scaled = frame.scale(scale)
  fs.mkdirSync(kitPortraits, { recursive: true })
  await scaled.write(path.join(kitPortraits, `${assetId}.png`))
}

async function main() {
  console.log("Copying PAC base Pikachu (0025)...")
  copyPacAtlas("0025", "0025")

  console.log("Merging Libre durations (0025-0006 -> 0025-f06)...")
  const durations = loadJson(kitDurations)
  const chunk = rewriteDurationPrefix(loadJson(sheetDurations), "0025-0006", "0025-f06")
  const merged = { ...durations, ...chunk }
  for (const key of Object.keys(merged)) {
    if (key.startsWith("0025-f06/Shiny/")) {
      delete merged[key]
    }
  }
  saveJson(kitDurations, merged)

  console.log("Copying PAC Pikachu Surfer (0025-9999 -> 0025-surfer)...")
  copyPacAtlas("0025-9999", "0025-surfer")
  const surferChunk = rewriteDurationPrefix(
    loadJson(path.join(pacPokemons, "durations.json")),
    "0025-9999",
    "0025-surfer"
  )
  saveJson(kitDurations, { ...loadJson(kitDurations), ...surferChunk })

  console.log("Copying PAC Squirtle (0007)...")
  copyPacAtlas("0007", "0007")
  const squirtleChunk = rewriteDurationPrefix(
    loadJson(path.join(pacPokemons, "durations.json")),
    "0007",
    "0007"
  )
  saveJson(kitDurations, { ...loadJson(kitDurations), ...squirtleChunk })

  console.log("Writing portraits...")
  await writeLibrePortrait()
  await writePortraitFromAtlas("0025-f06")
  await writePortraitFromAtlas("0025-surfer")
  await writePortraitFromAtlas("0007")

  console.log("Done.")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
