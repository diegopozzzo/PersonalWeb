#!/usr/bin/env node
/**
 * Sync pokemon-overlay-kit-expanded assets from pokemonAutoChess 6.10.0 + PMD SpriteCollab forms.
 */
import { spawnSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createRequire } from "node:module"
import { packSplitFolder } from "./lib/pack-pmd-atlas.mjs"

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, "..")

const manifest = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "pokemon-overlay-sync-manifest.json"),
    "utf8"
  )
)

const pacRepo = path.resolve(REPO_ROOT, manifest.pacRepo)
const spriteCollabRepo = path.resolve(REPO_ROOT, manifest.spriteCollabRepo)
const kitDir = path.resolve(REPO_ROOT, manifest.kitDir)
const pacPokemons = path.join(
  pacRepo,
  "app/public/src/assets/pokemons"
)
const pacPortraits = path.join(
  pacRepo,
  "app/public/src/assets/portraits"
)
const pacDurationsPath = path.join(pacPokemons, "durations.json")
const kitSprites = path.join(kitDir, "assets/sprites")
const kitPortraits = path.join(kitDir, "assets/portraits")
const kitDurationsPath = path.join(kitDir, "assets/durations.json")
const pacEditDir = path.join(pacRepo, "edit")

function assertRepo(dir, name) {
  if (!fs.existsSync(path.join(dir, ".git"))) {
    console.error(`Missing ${name} at ${dir}. Clone it before running sync.`)
    process.exit(1)
  }
}

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

function copyPacAtlas(pacId, assetId, spritesDir) {
  const srcJson = path.join(pacPokemons, `${pacId}.json`)
  const srcPng = path.join(pacPokemons, `${pacId}.png`)
  if (!fs.existsSync(srcJson) || !fs.existsSync(srcPng)) {
    throw new Error(`PAC atlas missing for ${pacId}`)
  }

  const atlas = loadJson(srcJson)
  if (atlas?.textures?.[0]) {
    atlas.textures[0].image = `${assetId}.png`
  }

  fs.mkdirSync(spritesDir, { recursive: true })
  fs.writeFileSync(
    path.join(spritesDir, `${assetId}.json`),
    JSON.stringify(atlas)
  )
  fs.copyFileSync(srcPng, path.join(spritesDir, `${assetId}.png`))
}

function copyPortrait(portraitRel, assetId) {
  const src = path.join(pacPortraits, portraitRel)
  if (!fs.existsSync(src)) {
    throw new Error(`Portrait not found: ${src}`)
  }
  fs.mkdirSync(kitPortraits, { recursive: true })
  fs.copyFileSync(src, path.join(kitPortraits, `${assetId}.png`))
}

function detectActions(durations, assetId) {
  const prefix = `${assetId}/Normal/`
  const actions = new Set()
  for (const key of Object.keys(durations)) {
    if (!key.startsWith(prefix) || !key.endsWith("/Anim")) continue
    const action = key.slice(prefix.length, -"/Anim".length)
    actions.add(action)
  }
  const has = (name) => actions.has(name)
  const idleAction = has("Idle") ? "Idle" : [...actions][0]
  const moveAction = has("Walk") ? "Walk" : idleAction
  let reactAction = idleAction
  for (const candidate of manifest.reactActionPriority) {
    if (has(candidate)) {
      reactAction = candidate
      break
    }
  }
  return { idleAction, moveAction, reactAction, actions: [...actions] }
}

function ensureSpriteCollabSparse(spritePath) {
  const rel = `sprite/${spritePath}/*`
  spawnSync(
    "git",
    ["-C", spriteCollabRepo, "sparse-checkout", "add", rel],
    { stdio: "inherit" }
  )
}

function runSplit(spriteCollabIndex) {
  const spritePath = spriteCollabIndex.replaceAll("-", "/")
  ensureSpriteCollabSparse(spritePath)

  const splitScript = path.join(__dirname, "lib", "pmd-split-one.mts")
  const result = spawnSync(
    "npx",
    [
      "tsx",
      splitScript,
      spriteCollabIndex,
      spriteCollabRepo,
      pacEditDir
    ],
    {
      cwd: REPO_ROOT,
      stdio: "inherit",
      shell: process.platform === "win32"
    }
  )

  if (result.status !== 0) {
    throw new Error(`split failed for ${spriteCollabIndex}`)
  }

  return path.join(pacEditDir, "split", spriteCollabIndex)
}

function mergeSheetDurations(spriteCollabIndex, assetId) {
  const sheetsPath = path.join(pacEditDir, "sheets/durations.json")
  if (!fs.existsSync(sheetsPath)) {
    return {}
  }
  return rewriteDurationPrefix(
    loadJson(sheetsPath),
    spriteCollabIndex,
    assetId
  )
}

async function syncFromSpriteCollab(entry) {
  const { spriteCollabIndex, assetId } = entry
  console.log(`Packing ${spriteCollabIndex} -> ${assetId} from SpriteCollab...`)

  const splitRoot = runSplit(spriteCollabIndex)
  await packSplitFolder(splitRoot, assetId, kitSprites)

  const durationChunk = mergeSheetDurations(spriteCollabIndex, assetId)
  if (!Object.keys(durationChunk).length) {
    throw new Error(`No durations produced for ${spriteCollabIndex}`)
  }

  if (entry.portraitPath) {
    try {
      copyPortrait(entry.portraitPath, assetId)
    } catch (error) {
      console.warn(`Portrait copy failed for ${assetId}: ${error.message}`)
    }
  }
  return { durationChunk, ...detectActions(durationChunk, assetId) }
}

function syncFromPac(entry) {
  const pacId = entry.pacId
  const assetId = entry.assetId
  console.log(`Copying PAC ${pacId} -> ${assetId}...`)

  copyPacAtlas(pacId, assetId, kitSprites)

  const pacDurations = loadJson(pacDurationsPath)
  const durationChunk = rewriteDurationPrefix(pacDurations, pacId, assetId)
  if (!Object.keys(durationChunk).length) {
    throw new Error(`No duration keys for ${pacId}`)
  }

  if (entry.portraitPath) {
    try {
      copyPortrait(entry.portraitPath, assetId)
    } catch (error) {
      console.warn(`Portrait copy failed for ${assetId}: ${error.message}`)
    }
  } else {
    const flatPortrait = path.join(pacPortraits, `${pacId}.png`)
    if (fs.existsSync(flatPortrait)) {
      fs.mkdirSync(kitPortraits, { recursive: true })
      fs.copyFileSync(
        flatPortrait,
        path.join(kitPortraits, `${assetId}.png`)
      )
    } else {
      const dex = pacId.split("-")[0]
      const happy = path.join(pacPortraits, dex, "0000", "0000", "Happy.png")
      if (fs.existsSync(happy)) {
        copyPortrait(path.relative(pacPortraits, happy), assetId)
      }
    }
  }

  const detected = detectActions(durationChunk, assetId)
  const actions = {
    idleAction: entry.idleAction ?? detected.idleAction,
    moveAction: entry.moveAction ?? detected.moveAction,
    reactAction: entry.reactAction ?? detected.reactAction
  }
  return { durationChunk, ...actions }
}

function removeLegacyAssets() {
  for (const assetId of manifest.removeAssetIds) {
    for (const dir of [kitSprites, kitPortraits]) {
      for (const ext of [".json", ".png"]) {
        const file = path.join(dir, `${assetId}${ext}`)
        if (fs.existsSync(file)) {
          fs.unlinkSync(file)
          console.log(`Removed ${file}`)
        }
      }
    }
  }

  const durations = loadJson(kitDurationsPath)
  for (const assetId of manifest.removeAssetIds) {
    for (const key of Object.keys(durations)) {
      if (key.startsWith(`${assetId}/`)) {
        delete durations[key]
      }
    }
  }
  saveJson(kitDurationsPath, durations)
}

async function main() {
  assertRepo(pacRepo, "pokemonAutoChess (.tmp-pac)")
  assertRepo(spriteCollabRepo, "SpriteCollab (.tmp-spritecollab)")

  if (!fs.existsSync(pacDurationsPath)) {
    console.error(`PAC durations not found at ${pacDurationsPath}`)
    process.exit(1)
  }

  fs.mkdirSync(kitSprites, { recursive: true })
  fs.mkdirSync(kitPortraits, { recursive: true })

  const libraryHints = {}
  let durations = fs.existsSync(kitDurationsPath)
    ? loadJson(kitDurationsPath)
    : {}

  for (const entry of manifest.entries) {
    const assetId = entry.assetId
    let result

    if (entry.spriteCollabIndex) {
      const pacAtlas = path.join(
        pacPokemons,
        `${entry.spriteCollabIndex}.json`
      )
      if (fs.existsSync(pacAtlas) && entry.forceSpriteCollab !== true) {
        result = syncFromPac({
          ...entry,
          pacId: entry.spriteCollabIndex
        })
      } else {
        result = await syncFromSpriteCollab(entry)
      }
    } else if (entry.pacId) {
      if (entry.refresh === false) {
        console.log(`Skipping ${entry.key} (refresh=false)`)
        continue
      }
      result = syncFromPac(entry)
    } else {
      throw new Error(`Entry ${entry.key} has no pacId or spriteCollabIndex`)
    }

    durations = {
      ...durations,
      ...result.durationChunk
    }

    libraryHints[entry.key] = {
      assetId,
      idleAction: result.idleAction,
      moveAction: result.moveAction,
      reactAction: result.reactAction
    }
  }

  saveJson(kitDurationsPath, durations)
  removeLegacyAssets()

  const hintsPath = path.join(kitDir, "sync-library-hints.json")
  saveJson(hintsPath, libraryHints)

  console.log("\nSync complete. Library action hints:")
  console.log(JSON.stringify(libraryHints, null, 2))
  console.log(`\nHints written to ${hintsPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
