import fs from "node:fs"
import path from "node:path"
import { SpriteSheetProcessor } from "../../.tmp-pac/edit/add-pokemon.ts"

const spriteCollabIndex = process.argv[2]
const spriteCollabPath = process.argv[3]
const pacEditDir = process.argv[4]

if (!spriteCollabIndex || !spriteCollabPath || !pacEditDir) {
  console.error(
    "Usage: pmd-split-one.mts <index> <spriteCollabPath> <pacEditDir>"
  )
  process.exit(1)
}

process.chdir(pacEditDir)
fs.mkdirSync(path.join(pacEditDir, "sheets"), { recursive: true })
fs.mkdirSync(path.join(pacEditDir, "split"), { recursive: true })

const splitter = new SpriteSheetProcessor()
splitter.loadDelaysFile()
splitter.loadDurationsFile()
await splitter.splitIndex(spriteCollabPath, spriteCollabIndex)
splitter.saveDurationsFile()
splitter.saveDelaysFile()

console.log(
  path.join(
    pacEditDir,
    "split",
    spriteCollabIndex
  )
)
