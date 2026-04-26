const FPS_UNIT_MS = 1000 / 36
const STORAGE_KEY = "pokemon-overlay-kit.cursor-pokemon"
const ORIENTATION = {
  DOWN: "0",
  DOWNRIGHT: "1",
  RIGHT: "2",
  UPRIGHT: "3",
  UP: "4",
  UPLEFT: "5",
  LEFT: "6",
  DOWNLEFT: "7"
}

const POKEMON_LIBRARY = {
  HONEDGE: {
    id: "0679",
    label: "Honedge",
    role: "mouse",
    idleAction: "Idle",
    moveAction: "Walk",
    reactAction: "Swing",
    topAction: "Idle"
  },
  GENGAR: {
    id: "0094",
    label: "Gengar",
    role: "bottom",
    idleAction: "Idle",
    moveAction: "Walk",
    reactAction: "Charge",
    topAction: "Idle"
  },
  MACHOP: {
    id: "0066",
    label: "Machop",
    role: "bottom",
    idleAction: "Idle",
    moveAction: "Walk",
    reactAction: "Kick",
    topAction: "Idle"
  },
  AXEW: {
    id: "0610",
    label: "Axew",
    role: "bottom",
    idleAction: "Idle",
    moveAction: "Walk",
    reactAction: "Bite",
    topAction: "Idle"
  },
  PIKACHU: {
    id: "0025",
    label: "Pikachu",
    role: "top",
    idleAction: "Idle",
    moveAction: "Walk",
    reactAction: "Shock",
    topAction: "Idle"
  },
  EEVEE: {
    id: "0133",
    label: "Eevee",
    role: "top",
    idleAction: "Idle",
    moveAction: "Walk",
    reactAction: "Hop",
    topAction: "Idle"
  },
  CHARMANDER: {
    id: "0004",
    label: "Charmander",
    role: "bottom",
    idleAction: "Idle",
    moveAction: "Walk",
    reactAction: "DeepBreath",
    topAction: "Pose"
  },
  BULBASAUR: {
    id: "0001",
    label: "Bulbasaur",
    role: "roster",
    idleAction: "Idle",
    moveAction: "Walk",
    reactAction: "Rotate",
    topAction: "Idle"
  },
  SQUIRTLE: {
    id: "0007",
    label: "Squirtle",
    role: "roster",
    idleAction: "Idle",
    moveAction: "Walk",
    reactAction: "Pose",
    topAction: "Idle"
  },
  LUCARIO: {
    id: "0448",
    label: "Lucario",
    role: "bottom",
    idleAction: "Idle",
    moveAction: "Walk",
    reactAction: "Strike",
    topAction: "Pose"
  },
  MEW: {
    id: "0151",
    label: "Mew",
    role: "top",
    idleAction: "Idle",
    moveAction: "Walk",
    reactAction: "Charge",
    topAction: "Idle"
  },
  SNORLAX: {
    id: "0143",
    label: "Snorlax",
    role: "bottom",
    idleAction: "Idle",
    moveAction: "Walk",
    reactAction: "Stomp",
    topAction: "Idle"
  },
  CHARIZARD: {
    id: "0006",
    label: "Charizard",
    role: "roster",
    idleAction: "Idle",
    moveAction: "Walk",
    reactAction: "Attack",
    topAction: "Idle"
  },
  GYARADOS: {
    id: "0130",
    label: "Gyarados",
    role: "roster",
    idleAction: "Idle",
    moveAction: "Walk",
    reactAction: "Attack",
    topAction: "Idle"
  },
  LAPRAS: {
    id: "0131",
    label: "Lapras",
    role: "roster",
    idleAction: "Idle",
    moveAction: "Walk",
    reactAction: "Attack",
    topAction: "Idle"
  },
  ARTICUNO: {
    id: "0144",
    label: "Articuno",
    role: "roster",
    idleAction: "Idle",
    moveAction: "Walk",
    reactAction: "Attack",
    topAction: "Idle"
  }
}

const DEFAULT_OPTIONS = {
  root: document.body,
  cursorPokemon: "HONEDGE",
  topCompanions: ["PIKACHU", "EEVEE", "MEW"],
  centerCompanions: [],
  headerWalkers: [],
  bottomWalkers: ["GENGAR", "MACHOP", "AXEW", "CHARMANDER"],
  toolbarPokemon: [
    "HONEDGE",
    "GENGAR",
    "MACHOP",
    "AXEW",
    "PIKACHU",
    "EEVEE",
    "CHARMANDER",
    "BULBASAUR",
    "SQUIRTLE",
    "LUCARIO",
    "MEW",
    "SNORLAX",
    "CHARIZARD",
    "GYARADOS",
    "LAPRAS",
    "ARTICUNO"
  ],
  showToolbar: true,
  toolbarCollapsed: false,
  toolbarTitle: "Pokemon overlay",
  toolbarSubtitle: "Click to change cursor",
  toolbarToggleHide: "Hide",
  toolbarToggleShow: "Show",
  toolbarHint: "Click or drag the Pokemon",
  toolbarDisableLabel: "Disable",
  toolbarCreditsLabel: "View credits",
  toolbarCreditsHref: "./CREDITS.md",
  toolbarRoleLabels: {
    mouse: "cursor",
    top: "companion",
    bottom: "walker",
    header: "header",
    center: "core"
  },
  activeLabel: "cursor",
  badgePrefix: "Cursor",
  cursorScale: 1,
  cursorOffsetX: -18,
  cursorOffsetY: -18,
  cursorSmoothing: 14,
  onDisable: null,
  themeClass: "",
  theme: {}
}

const assetCache = new Map()
let durationsPromise

function resolveAsset(path) {
  return new URL(path, import.meta.url).href
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function uniq(values) {
  return [...new Set(values)]
}

function applyThemeToElement(element, options) {
  if (!element || !options) return

  if (options.themeClass) {
    element.classList.add(options.themeClass)
  }

  const theme = options.theme || {}
  const variableMap = {
    "--pk-accent": theme.accent,
    "--pk-accent-2": theme.accent2,
    "--pk-border": theme.border,
    "--pk-surface": theme.surface,
    "--pk-panel": theme.panel,
    "--pk-text": theme.text,
    "--pk-muted": theme.muted,
    "--pk-badge-bg": theme.badgeBg,
    "--pk-glow": theme.glow,
    "--pk-glow-2": theme.glow2
  }

  Object.entries(variableMap).forEach(([property, value]) => {
    if (value) {
      element.style.setProperty(property, value)
    }
  })
}

function normalizeActorEntry(entry) {
  if (typeof entry === "string") {
    return { key: entry }
  }

  if (!entry || typeof entry !== "object") {
    return null
  }

  const key = entry.key || entry.pokemon || entry.name
  if (!key || !POKEMON_LIBRARY[key]) {
    return null
  }

  return {
    ...entry,
    key
  }
}

function toPixels(value, total, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value !== "string") {
    return fallback
  }

  const raw = value.trim()
  if (!raw) {
    return fallback
  }

  if (raw.endsWith("%")) {
    const percent = Number.parseFloat(raw)
    return Number.isFinite(percent) ? total * (percent / 100) : fallback
  }

  if (raw.endsWith("vw")) {
    const ratio = Number.parseFloat(raw)
    return Number.isFinite(ratio) ? window.innerWidth * (ratio / 100) : fallback
  }

  if (raw.endsWith("vh")) {
    const ratio = Number.parseFloat(raw)
    return Number.isFinite(ratio) ? window.innerHeight * (ratio / 100) : fallback
  }

  if (raw.endsWith("px")) {
    const pixels = Number.parseFloat(raw)
    return Number.isFinite(pixels) ? pixels : fallback
  }

  const number = Number.parseFloat(raw)
  return Number.isFinite(number) ? number : fallback
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

async function loadDurations() {
  if (!durationsPromise) {
    durationsPromise = fetch(resolveAsset("./assets/durations.json")).then(
      (response) => {
        if (!response.ok) {
          throw new Error("No se pudo cargar assets/durations.json")
        }
        return response.json()
      }
    )
  }
  return durationsPromise
}

async function loadPokemonAsset(key) {
  if (assetCache.has(key)) {
    return assetCache.get(key)
  }

  const meta = POKEMON_LIBRARY[key]
  if (!meta) {
    throw new Error(`Pokemon no soportado: ${key}`)
  }

  const assetPromise = Promise.all([
    loadDurations(),
    fetch(resolveAsset(`./assets/sprites/${meta.id}.json`)).then((response) => {
      if (!response.ok) {
        throw new Error(`No se pudo cargar atlas de ${meta.label}`)
      }
      return response.json()
    }),
    loadImage(resolveAsset(`./assets/sprites/${meta.id}.png`)),
    resolveAsset(`./assets/portraits/${meta.id}.png`)
  ]).then(([durations, atlas, image, portraitUrl]) => {
    return new PokemonAtlasAsset(meta, atlas, image, durations, portraitUrl)
  })

  assetCache.set(key, assetPromise)
  return assetPromise
}

class PokemonAtlasAsset {
  constructor(meta, atlas, image, durations, portraitUrl) {
    this.meta = meta
    this.image = image
    this.durations = durations
    this.portraitUrl = portraitUrl
    this.framesByAction = {}
    this.sequenceCache = new Map()

    const frames = atlas?.textures?.[0]?.frames ?? []
    frames.forEach((frame) => {
      const parts = frame.filename.split("/")
      if (parts.length !== 5) return

      const [tint, action, mode, orientation, frameNumber] = parts
      if (tint !== "Normal" || mode !== "Anim") return

      if (!this.framesByAction[action]) {
        this.framesByAction[action] = {}
      }
      if (!this.framesByAction[action][orientation]) {
        this.framesByAction[action][orientation] = new Map()
      }

      this.framesByAction[action][orientation].set(frameNumber, frame)
    })
  }

  getSequence(action, orientation = ORIENTATION.DOWN) {
    const cacheKey = `${action}:${orientation}`
    if (this.sequenceCache.has(cacheKey)) {
      return this.sequenceCache.get(cacheKey)
    }

    const durationKey = `${this.meta.id}/Normal/${action}/Anim`
    const durationUnits = this.durations[durationKey]
    const actionFrames = this.framesByAction[action]

    if (!durationUnits || !actionFrames) {
      return null
    }

    const preferredOrientations = uniq([
      orientation,
      ORIENTATION.RIGHT,
      ORIENTATION.LEFT,
      ORIENTATION.DOWN,
      ...Object.keys(actionFrames)
    ])

    const chosenOrientation = preferredOrientations.find(
      (candidate) => actionFrames[candidate]
    )

    if (!chosenOrientation) {
      return null
    }

    const frameMap = actionFrames[chosenOrientation]
    const frames = []
    for (let index = 0; index < durationUnits.length; index += 1) {
      const frameName = String(index).padStart(4, "0")
      const frame = frameMap.get(frameName)
      if (!frame) continue
      frames.push({
        frame,
        durationMs: Math.max(durationUnits[index], 1) * FPS_UNIT_MS
      })
    }

    if (!frames.length) {
      return null
    }

    const sequence = {
      action,
      orientation: chosenOrientation,
      frames
    }

    this.sequenceCache.set(cacheKey, sequence)
    return sequence
  }
}

class PixelCanvasSprite {
  constructor(size) {
    this.size = size
    this.asset = null
    this.current = null
    this.temporary = false
    this.dpr = Math.max(window.devicePixelRatio || 1, 1)
    this.canvas = document.createElement("canvas")
    this.context = this.canvas.getContext("2d")
    this.context.imageSmoothingEnabled = false
    this.resize(size)
  }

  resize(size) {
    this.size = size
    this.canvas.width = Math.round(size * this.dpr)
    this.canvas.height = Math.round(size * this.dpr)
    this.canvas.style.width = `${size}px`
    this.canvas.style.height = `${size}px`
    this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    this.context.imageSmoothingEnabled = false
    this.draw()
  }

  setAsset(asset) {
    this.asset = asset
    this.current = null
    this.temporary = false
    this.draw()
  }

  play(action, orientation, options = {}) {
    if (!this.asset) return false

    const sequence =
      this.asset.getSequence(action, orientation) ??
      this.asset.getSequence(this.asset.meta.idleAction, ORIENTATION.DOWN) ??
      this.asset.getSequence("Idle", ORIENTATION.DOWN)

    if (!sequence) return false

    const loop = options.loop !== false
    const shouldReuse =
      !options.force &&
      this.current &&
      this.current.action === sequence.action &&
      this.current.orientation === sequence.orientation &&
      this.current.loop === loop

    if (shouldReuse) {
      return true
    }

    this.current = {
      action: sequence.action,
      orientation: sequence.orientation,
      frames: sequence.frames,
      baseContentBox: sequence.frames.reduce(
        (acc, fr) => {
          const ss = fr?.frame?.spriteSourceSize
          if (!ss) return acc
          const minX = Math.min(acc.minX, ss.x || 0)
          const minY = Math.min(acc.minY, ss.y || 0)
          const maxX = Math.max(acc.maxX, (ss.x || 0) + (ss.w || 0))
          const maxY = Math.max(acc.maxY, (ss.y || 0) + (ss.h || 0))
          return { minX, minY, maxX, maxY }
        },
        { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
      ),
      baseSourceSize: sequence.frames.reduce(
        (acc, fr) => {
          const ss = fr?.frame?.sourceSize
          if (!ss) return acc
          return { w: Math.max(acc.w, ss.w || 0), h: Math.max(acc.h, ss.h || 0) }
        },
        { w: 0, h: 0 }
      ),
      loop,
      index: 0,
      elapsed: 0,
      onComplete: options.onComplete || null
    }

    this.draw()
    return true
  }

  playTemporary(action, orientation, fallbackAction, fallbackOrientation) {
    const played = this.play(action, orientation, {
      loop: false,
      force: true,
      onComplete: () => {
        this.temporary = false
        this.play(fallbackAction, fallbackOrientation, { force: true })
      }
    })

    if (played) {
      this.temporary = true
      return true
    }

    this.temporary = false
    return this.play(fallbackAction, fallbackOrientation, { force: true })
  }

  tick(deltaMs) {
    if (!this.current || !this.current.frames.length) return

    this.current.elapsed += deltaMs
    let needsRedraw = false
    let guard = 0

    while (guard < 24) {
      const currentFrame = this.current.frames[this.current.index]
      if (this.current.elapsed < currentFrame.durationMs) {
        break
      }

      this.current.elapsed -= currentFrame.durationMs
      this.current.index += 1
      needsRedraw = true

      if (this.current.index >= this.current.frames.length) {
        if (this.current.loop) {
          this.current.index = 0
        } else {
          const onComplete = this.current.onComplete
          this.current.index = this.current.frames.length - 1
          this.current.elapsed = 0
          this.current.onComplete = null
          if (onComplete) {
            onComplete()
          }
          break
        }
      }

      guard += 1
    }

    if (needsRedraw) {
      this.draw()
    }
  }

  draw() {
    const ctx = this.context
    ctx.clearRect(0, 0, this.size, this.size)

    if (!this.current || !this.asset) return

    const currentFrame = this.current.frames[this.current.index]?.frame
    if (!currentFrame) return

    const rect = currentFrame.frame
    const spriteSource = currentFrame.spriteSourceSize
    const contentBox = this.current.baseContentBox?.maxX > -Infinity
      ? this.current.baseContentBox
      : {
          minX: spriteSource.x || 0,
          minY: spriteSource.y || 0,
          maxX: (spriteSource.x || 0) + (spriteSource.w || 0),
          maxY: (spriteSource.y || 0) + (spriteSource.h || 0),
        }
    const contentW = Math.max(1, (contentBox.maxX - contentBox.minX) || 1)
    const contentH = Math.max(1, (contentBox.maxY - contentBox.minY) || 1)
    const availableWidth = this.size - 8
    const availableHeight = this.size - 8
    const scale = Math.min(
      availableWidth / contentW,
      availableHeight / contentH
    )

    const fullWidth = contentW * scale
    const fullHeight = contentH * scale
    const offsetX = (this.size - fullWidth) / 2
    const offsetY = (this.size - fullHeight) / 2

    ctx.drawImage(
      this.asset.image,
      rect.x,
      rect.y,
      rect.w,
      rect.h,
      offsetX + ((spriteSource.x || 0) - contentBox.minX) * scale,
      offsetY + ((spriteSource.y || 0) - contentBox.minY) * scale,
      rect.w * scale,
      rect.h * scale
    )
  }
}

class OverlayActor {
  constructor(overlay, key, options) {
    this.overlay = overlay
    this.key = key
    this.options = options
    this.meta = POKEMON_LIBRARY[key]
    this.asset = null
    this.hovered = false
    this.dragging = false
    this.placed = false
    this.pointerStart = null
    this.pointerOffset = null
    this.seed = Math.random() * Math.PI * 2
    // Default sprite size (px). Individual actors can override via options.size.
    // Sized to match the project's global 1.6x scale.
    this.scale = options.size || (options.role === "top" ? 154 : 180)
    this.speed = options.speed || (40 + Math.random() * 28)
    this.direction =
      options.direction === -1 || options.direction === "left"
        ? -1
        : options.direction === 1 || options.direction === "right"
          ? 1
          : Math.random() > 0.5
            ? 1
            : -1
    this.x = 0
    this.y = 0
    this.baseY = 0
    this.floatX = options.floatX ?? (options.role === "top" ? 8 : options.role === "bottom" ? 6 : 0)
    this.floatY = options.floatY ?? (options.role === "top" ? 4 : 2)
    this.interactive = options.interactive !== false

    this.element = document.createElement("div")
    this.element.className = `pk-overlay-actor ${options.role}`
    this.element.setAttribute(
      "data-selected-label",
      overlay.options.activeLabel || "cursor"
    )
    this.element.style.width = `${this.scale}px`
    this.element.style.height = `${this.scale}px`
    if (!this.interactive) {
      this.element.classList.add("is-passive")
    }
    if (options.role === "top") {
      this.element.classList.add(options.side)
    }

    this.sprite = new PixelCanvasSprite(this.scale)
    this.element.appendChild(this.sprite.canvas)

    this.onPointerEnter = this.onPointerEnter.bind(this)
    this.onPointerLeave = this.onPointerLeave.bind(this)
    this.onPointerDown = this.onPointerDown.bind(this)
    this.onPointerMove = this.onPointerMove.bind(this)
    this.onPointerUp = this.onPointerUp.bind(this)

    if (this.interactive) {
      this.element.addEventListener("pointerenter", this.onPointerEnter)
      this.element.addEventListener("pointerleave", this.onPointerLeave)
      this.element.addEventListener("pointerdown", this.onPointerDown)
    }

    if (options.role === "bottom") {
      const total = Math.max(options.total || 1, 1)
      const laneWidth = window.innerWidth / total
      const defaultX = laneWidth * options.index + laneWidth * 0.25
      this.x = clamp(
        toPixels(options.startX, window.innerWidth - this.scale, defaultX),
        0,
        window.innerWidth - this.scale
      )
      this.baseY = clamp(
        toPixels(
          options.startY,
          window.innerHeight - this.scale,
          window.innerHeight - this.scale + (options.laneOffsetY ?? 12)
        ),
        0,
        window.innerHeight - this.scale
      )
      this.y = this.baseY
    }

    if (options.mountToBody) {
      applyThemeToElement(this.element, overlay.options)
      document.body.appendChild(this.element)
    } else {
      overlay.root.appendChild(this.element)
    }

    this.ready = loadPokemonAsset(key).then((asset) => {
      this.asset = asset
      this.sprite.setAsset(asset)
      this.sprite.play(this.currentBaseAction(), this.currentOrientation(), {
        force: true
      })
      this.element.classList.add("ready")
      this.overlay.refreshSelectionState()
    })
  }

  currentBaseAction() {
    if (this.options.role === "top" || this.options.role === "center") {
      return this.meta.topAction || this.meta.idleAction
    }

    if ((this.options.role === "bottom" || this.options.role === "header") && !this.dragging) {
      return this.meta.moveAction
    }

    return this.meta.idleAction
  }

  currentOrientation() {
    if (this.options.role === "top" || this.options.role === "center") {
      if (this.options.facing === "left") return ORIENTATION.LEFT
      if (this.options.facing === "right") return ORIENTATION.RIGHT
      return this.options.side === "left" ? ORIENTATION.RIGHT : ORIENTATION.LEFT
    }

    return this.direction >= 0 ? ORIENTATION.RIGHT : ORIENTATION.LEFT
  }

  currentScale() {
    // Keep a constant visual size (no hover scaling).
    return 1
  }

  onPointerEnter() {
    if (!this.interactive) return
    this.hovered = true
    this.element.classList.add("is-hovered")
    this.react()
  }

  onPointerLeave() {
    if (!this.interactive) return
    this.hovered = false
    this.element.classList.remove("is-hovered")
  }

  onPointerDown(event) {
    if (!this.interactive) return
    event.preventDefault()
    event.stopPropagation()
    try {
      window.getSelection()?.removeAllRanges()
    } catch (_error) {
      // ignore selection clearing failures
    }

    this.pointerStart = {
      x: event.clientX,
      y: event.clientY
    }
    this.pointerOffset = {
      x: event.clientX - this.x,
      y: event.clientY - this.y
    }

    window.addEventListener("pointermove", this.onPointerMove)
    window.addEventListener("pointerup", this.onPointerUp)
  }

  onPointerMove(event) {
    if (!this.pointerStart || !this.pointerOffset) return

    const dx = event.clientX - this.pointerStart.x
    const dy = event.clientY - this.pointerStart.y

    if (!this.dragging && Math.hypot(dx, dy) > 6) {
      this.dragging = true
      this.overlay.setDraggingState(true)
      this.react()
    }

    if (!this.dragging) return

    this.x = clamp(event.clientX - this.pointerOffset.x, 0, window.innerWidth - this.scale)
    this.y = clamp(event.clientY - this.pointerOffset.y, 0, window.innerHeight - this.scale)
    this.direction = dx >= 0 ? 1 : -1
  }

  onPointerUp(event) {
    window.removeEventListener("pointermove", this.onPointerMove)
    window.removeEventListener("pointerup", this.onPointerUp)
    this.overlay.setDraggingState(false)

    if (!this.dragging) {
      if (this.options.role === "top" || this.options.role === "bottom") {
        this.overlay.setCursorPokemon(this.key, true)
        this.react()
      }
    } else {
      const deltaX = event.clientX - this.pointerStart.x
      this.direction = deltaX >= 0 ? 1 : -1
      if (this.options.role === "top" || this.options.role === "bottom") {
        this.placed = true
        this.options.anchorX = this.x
        this.options.anchorY = this.y
      } else {
        this.baseY = clamp(
          toPixels(
            this.options.startY,
            window.innerHeight - this.scale,
            window.innerHeight - this.scale + (this.options.laneOffsetY ?? 12)
          ),
          0,
          window.innerHeight - this.scale
        )
        this.y = this.baseY
      }
    }

    this.pointerStart = null
    this.pointerOffset = null
    this.dragging = false
  }

  react() {
    if (!this.asset) return
    const orientation = this.currentOrientation()
    this.sprite.playTemporary(
      this.meta.reactAction,
      orientation,
      this.currentBaseAction(),
      orientation
    )
  }

  setSelected(selected) {
    this.element.classList.toggle("is-selected", selected)
  }

  update(time, deltaSeconds) {
    if (!this.asset) return

    if (this.options.role === "top") {
      if (!this.dragging) {
        const fallbackLeft =
          this.options.side === "left" ? 16 : window.innerWidth - this.scale - 16
        const fallbackTop = 12
        const anchorX = toPixels(
          this.options.anchorX,
          window.innerWidth - this.scale,
          fallbackLeft
        )
        const anchorY = toPixels(
          this.options.anchorY,
          window.innerHeight - this.scale,
          fallbackTop
        )
        this.x = clamp(
          anchorX + Math.cos(time / 860 + this.seed) * this.floatX,
          0,
          window.innerWidth - this.scale
        )
        this.y = clamp(
          anchorY + Math.sin(time / 520 + this.seed) * this.floatY,
          0,
          window.innerHeight - this.scale
        )
      }

      if (!this.sprite.temporary) {
        this.sprite.play(
          this.dragging ? this.meta.idleAction : (this.meta.topAction || this.meta.idleAction),
          this.currentOrientation()
        )
      }
    } else if (this.options.role === "center") {
      const anchorX =
        toPixels(this.options.anchorX, window.innerWidth, window.innerWidth / 2) - this.scale / 2
      const anchorY =
        toPixels(this.options.anchorY, window.innerHeight, window.innerHeight / 2) - this.scale / 2
      this.x = clamp(
        anchorX + Math.cos(time / 900 + this.seed) * this.floatX,
        0,
        window.innerWidth - this.scale
      )
      this.y = clamp(
        anchorY + Math.sin(time / 620 + this.seed) * this.floatY,
        0,
        window.innerHeight - this.scale
      )

      if (!this.sprite.temporary) {
        this.sprite.play(this.meta.topAction || this.meta.idleAction, this.currentOrientation())
      }
    } else if (this.options.role === "header") {
      const minX = clamp(
        toPixels(this.options.minX, window.innerWidth - this.scale, 0),
        0,
        window.innerWidth - this.scale
      )
      const maxX = clamp(
        toPixels(this.options.maxX, window.innerWidth - this.scale, window.innerWidth - this.scale),
        minX,
        window.innerWidth - this.scale
      )
      const headerTop = toPixels(this.options.headerTop, window.innerHeight, 0)
      const headerHeight = Math.max(
        toPixels(this.options.headerHeight, window.innerHeight, 92),
        this.scale + headerTop
      )
      const fallbackY = headerTop + Math.max((headerHeight - this.scale) / 2, 0)

      this.x += this.direction * this.speed * deltaSeconds
      if (this.x <= minX) {
        this.x = minX
        this.direction = 1
      } else if (this.x >= maxX) {
        this.x = maxX
        this.direction = -1
      }

      this.baseY = clamp(
        toPixels(this.options.startY, headerTop + headerHeight - this.scale, fallbackY),
        headerTop,
        headerTop + headerHeight - this.scale
      )
      this.y = this.baseY + Math.sin(time / 460 + this.seed) * this.floatY

      if (!this.sprite.temporary) {
        this.sprite.play(this.meta.moveAction, this.currentOrientation())
      }
    } else if (this.options.role === "bottom" && this.placed && !this.dragging) {
      const anchorX = toPixels(
        this.options.anchorX,
        window.innerWidth - this.scale,
        this.x
      )
      const anchorY = toPixels(
        this.options.anchorY,
        window.innerHeight - this.scale,
        this.y
      )

      this.x = clamp(
        anchorX + Math.cos(time / 760 + this.seed) * this.floatX,
        0,
        window.innerWidth - this.scale
      )
      this.y = clamp(
        anchorY + Math.sin(time / 520 + this.seed) * this.floatY,
        0,
        window.innerHeight - this.scale
      )

      if (!this.sprite.temporary) {
        this.sprite.play(this.meta.idleAction, this.currentOrientation())
      }
    } else if (!this.dragging) {
      const minX = clamp(
        toPixels(this.options.minX, window.innerWidth - this.scale, 0),
        0,
        window.innerWidth - this.scale
      )
      const maxX = clamp(
        toPixels(
          this.options.maxX,
          window.innerWidth - this.scale,
          window.innerWidth - this.scale
        ),
        minX,
        window.innerWidth - this.scale
      )

      this.x += this.direction * this.speed * deltaSeconds

      if (this.x <= minX) {
        this.x = minX
        this.direction = 1
      } else if (this.x >= maxX) {
        this.x = maxX
        this.direction = -1
      }

      this.baseY = clamp(
        toPixels(
          this.options.startY,
          window.innerHeight - this.scale,
          window.innerHeight - this.scale + (this.options.laneOffsetY ?? 12)
        ),
        0,
        window.innerHeight - this.scale
      )
      this.y = this.baseY + Math.sin(time / 260 + this.seed) * this.floatY

      if (!this.sprite.temporary) {
        this.sprite.play(this.meta.moveAction, this.currentOrientation())
      }
    } else if (!this.sprite.temporary) {
      this.sprite.play(this.meta.idleAction, this.currentOrientation())
    }

    this.element.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) scale(${this.currentScale()})`
    this.sprite.tick(deltaSeconds * 1000)
  }

  destroy() {
    window.removeEventListener("pointermove", this.onPointerMove)
    window.removeEventListener("pointerup", this.onPointerUp)
    this.element.remove()
  }
}

class OverlayCursor {
  constructor(overlay, key) {
    this.overlay = overlay
    this.key = key
    this.asset = null
    this.x = window.innerWidth / 2
    this.y = window.innerHeight / 2
    this.targetX = this.x
    this.targetY = this.y
    this.lastTargetX = this.x
    this.orientation = ORIENTATION.RIGHT

    this.element = document.createElement("div")
    this.element.className = "pk-overlay-cursor"
    this.size = Math.round(72 * (overlay.options.cursorScale || 1))
    this.offsetX = overlay.options.cursorOffsetX ?? -18
    this.offsetY = overlay.options.cursorOffsetY ?? -18
    this.smoothing = overlay.options.cursorSmoothing || 14
    applyThemeToElement(this.element, overlay.options)
    this.sprite = new PixelCanvasSprite(this.size)
    this.element.appendChild(this.sprite.canvas)
    document.body.appendChild(this.element)

    this.ready = this.setPokemon(key)
  }

  async setPokemon(key) {
    this.key = key
    this.asset = await loadPokemonAsset(key)
    this.sprite.setAsset(this.asset)
    this.sprite.play(this.asset.meta.idleAction, this.orientation, { force: true })
    this.element.classList.add("ready")
  }

  react() {
    if (!this.asset) return
    this.sprite.playTemporary(
      this.asset.meta.reactAction,
      this.orientation,
      this.asset.meta.idleAction,
      this.orientation
    )
  }

  updateTarget(x, y) {
    this.targetX = x
    this.targetY = y
  }

  update(deltaSeconds) {
    const dx = this.targetX - this.x
    const dy = this.targetY - this.y
    const easing = clamp(deltaSeconds * this.smoothing, 0.16, 0.58)

    this.x += dx * easing
    this.y += dy * easing

    if (Math.abs(this.targetX - this.lastTargetX) > 1.5) {
      this.orientation =
        this.targetX >= this.lastTargetX ? ORIENTATION.RIGHT : ORIENTATION.LEFT
    }
    this.lastTargetX = this.targetX

    if (this.asset && !this.sprite.temporary) {
      const moving = Math.hypot(dx, dy) > 10
      const action = moving ? this.asset.meta.moveAction : this.asset.meta.idleAction
      this.sprite.play(action, this.orientation)
    }

    this.element.style.transform = `translate3d(${this.x + this.offsetX}px, ${this.y + this.offsetY}px, 0)`
    this.sprite.tick(deltaSeconds * 1000)
  }

  destroy() {
    this.element.remove()
  }
}

class PokemonOverlay {
  constructor(options = {}) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options
    }
    this.root = document.createElement("div")
    this.root.className = "pk-overlay-root"
    this.actors = []
    this.toolbarButtons = new Map()
    this.running = true
    this.lastTick = performance.now()
    this.accumulator = 0
    this.targetStep = 1 / 30
    this.pointerX = window.innerWidth / 2
    this.pointerY = window.innerHeight / 2
    this.pointerMove = this.pointerMove.bind(this)
    this.pointerDown = this.pointerDown.bind(this)
    this.onResize = this.onResize.bind(this)
    this.tick = this.tick.bind(this)

    this.badge = document.createElement("div")
    this.badge.className = "pk-overlay-badge"

    this.cursorPokemon = this.resolveInitialCursor()
    this.cursor = new OverlayCursor(this, this.cursorPokemon)

    this.applyTheme()
    this.root.appendChild(this.badge)
    this.options.root.appendChild(this.root)
    document.body.classList.add("pk-overlay-cursor-enabled")

    this.createTopActors()
    this.createCenterActors()
    this.createHeaderWalkers()
    this.createBottomActors()

    if (this.options.showToolbar) {
      this.createToolbar()
    }

    window.addEventListener("pointermove", this.pointerMove, { passive: true })
    window.addEventListener("pointerdown", this.pointerDown, { passive: true })
    window.addEventListener("resize", this.onResize)
    document.addEventListener("visibilitychange", () => {
      // Reset timing after tab resumes to avoid huge catch-up frames.
      this.lastTick = performance.now()
      this.accumulator = 0
    })

    this.ready = Promise.all([
      this.cursor.ready,
      ...this.actors.map((actor) => actor.ready)
    ]).then(() => {
      this.refreshSelectionState()
    })

    requestAnimationFrame(this.tick)
  }

  resolveActorOverlaps(deltaSeconds) {
    // Lightweight separation pass so actors don't stack on top of each other.
    // Keep it cheap: only a few iterations and only between actors (cursor excluded).
    const actors = this.actors
      .filter((a) => a && a.element && a.asset)
      .filter((a) => !a.dragging)

    if (actors.length < 2) return

    const iter = 2
    const padding = 8

    for (let k = 0; k < iter; k += 1) {
      for (let i = 0; i < actors.length; i += 1) {
        for (let j = i + 1; j < actors.length; j += 1) {
          const a = actors[i]
          const b = actors[j]

          // Prefer separating within the same band (top/top, bottom/bottom, header/header).
          // Center actors repel everyone since they sit in the middle.
          const sameBand =
            a.options.role === b.options.role ||
            a.options.role === "center" ||
            b.options.role === "center"

          if (!sameBand) continue

          const ax = a.x + a.scale / 2
          const ay = a.y + a.scale / 2
          const bx = b.x + b.scale / 2
          const by = b.y + b.scale / 2
          const dx = ax - bx
          const dy = ay - by

          const minDist = (a.scale + b.scale) * 0.34 + padding
          const dist = Math.hypot(dx, dy) || 0.0001
          if (dist >= minDist) continue

          const push = (minDist - dist) * 0.5
          const nx = dx / dist
          const ny = dy / dist

          // Make the push subtle and stable across frame rates.
          const strength = clamp(deltaSeconds * 10, 0.2, 1)
          const px = nx * push * strength
          const py = ny * push * strength

          // Top / header actors should not drift vertically too much.
          const lockY =
            a.options.role === "top" ||
            a.options.role === "header" ||
            a.options.role === "bottom"

          a.x = clamp(a.x + px, 0, window.innerWidth - a.scale)
          b.x = clamp(b.x - px, 0, window.innerWidth - b.scale)

          if (!lockY) {
            a.y = clamp(a.y + py, 0, window.innerHeight - a.scale)
            b.y = clamp(b.y - py, 0, window.innerHeight - b.scale)
          }
        }
      }
    }
  }

  resolveInitialCursor() {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored && POKEMON_LIBRARY[stored]) {
        return stored
      }
    } catch (_error) {
      // ignore storage failures
    }

    return this.options.cursorPokemon
  }

  applyTheme() {
    if (this.options.themeClass) {
      this.root.classList.add(this.options.themeClass)
    }

    const theme = this.options.theme || {}
    const variableMap = {
      "--pk-accent": theme.accent,
      "--pk-accent-2": theme.accent2,
      "--pk-border": theme.border,
      "--pk-surface": theme.surface,
      "--pk-panel": theme.panel,
      "--pk-text": theme.text,
      "--pk-muted": theme.muted,
      "--pk-badge-bg": theme.badgeBg,
      "--pk-glow": theme.glow,
      "--pk-glow-2": theme.glow2
    }

    Object.entries(variableMap).forEach(([property, value]) => {
      if (value) {
        this.root.style.setProperty(property, value)
      }
    })
  }

  createTopActors() {
    this.options.topCompanions
      .map(normalizeActorEntry)
      .filter(Boolean)
      .forEach((entry, index) => {
      const side = entry.side || (index === 0 ? "left" : "right")
      this.actors.push(
        new OverlayActor(this, entry.key, {
          ...entry,
          role: "top",
          side
        })
      )
    })
  }

  createCenterActors() {
    this.options.centerCompanions
      .map(normalizeActorEntry)
      .filter(Boolean)
      .forEach((entry) => {
        this.actors.push(
          new OverlayActor(this, entry.key, {
            ...entry,
            role: "center"
          })
        )
      })
  }

  createHeaderWalkers() {
    this.options.headerWalkers
      .map(normalizeActorEntry)
      .filter(Boolean)
      .forEach((entry) => {
        this.actors.push(
          new OverlayActor(this, entry.key, {
            ...entry,
            role: "header"
          })
        )
      })
  }

  createBottomActors() {
    const walkers = this.options.bottomWalkers
      .map(normalizeActorEntry)
      .filter(Boolean)
    const total = walkers.length
    walkers.forEach((entry, index) => {
      this.actors.push(
        new OverlayActor(this, entry.key, {
          ...entry,
          role: "bottom",
          index,
          total
        })
      )
    })
  }

  createToolbar() {
    this.toolbar = document.createElement("section")
    this.toolbar.className = "pk-overlay-toolbar"

    const header = document.createElement("div")
    header.className = "pk-overlay-toolbar-header"
    header.setAttribute("role", "button")
    header.setAttribute("tabindex", "0")
    header.setAttribute("aria-expanded", this.options.toolbarCollapsed ? "false" : "true")

    const titleWrap = document.createElement("div")
    const title = document.createElement("h2")
    title.className = "pk-overlay-toolbar-title"
    title.textContent = this.options.toolbarTitle
    const subtitle = document.createElement("p")
    subtitle.className = "pk-overlay-toolbar-subtitle"
    subtitle.textContent = this.options.toolbarSubtitle
    titleWrap.appendChild(title)
    titleWrap.appendChild(subtitle)
    const toggleToolbar = () => {
      const collapsed = this.toolbar.classList.toggle("is-collapsed")
      header.setAttribute("aria-expanded", collapsed ? "false" : "true")
    }
    header.addEventListener("click", toggleToolbar)
    header.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        toggleToolbar()
      }
    })

    header.appendChild(titleWrap)
    this.toolbar.appendChild(header)

    if (this.options.toolbarCollapsed) {
      this.toolbar.classList.add("is-collapsed")
    }

    const grid = document.createElement("div")
    grid.className = "pk-overlay-toolbar-grid"
    const roleLabels = {
      ...DEFAULT_OPTIONS.toolbarRoleLabels,
      ...(this.options.toolbarRoleLabels || {})
    }

    this.options.toolbarPokemon.forEach((key) => {
      const button = document.createElement("button")
      button.className = "pk-overlay-toolbar-button"
      button.type = "button"

      const image = document.createElement("img")
      image.alt = POKEMON_LIBRARY[key].label
      image.src = resolveAsset(`./assets/portraits/${POKEMON_LIBRARY[key].id}.png`)

      const labelWrap = document.createElement("span")
      const name = document.createElement("span")
      name.className = "pk-overlay-toolbar-name"
      name.textContent = POKEMON_LIBRARY[key].label

      const role = document.createElement("span")
      role.className = "pk-overlay-toolbar-role"
      role.textContent = roleLabels[POKEMON_LIBRARY[key].role] || POKEMON_LIBRARY[key].role

      labelWrap.appendChild(name)
      labelWrap.appendChild(role)

      button.appendChild(image)
      button.appendChild(labelWrap)
      button.addEventListener("click", () => this.setCursorPokemon(key, true))

      this.toolbarButtons.set(key, button)
      grid.appendChild(button)
    })

    this.toolbar.appendChild(grid)

    const footer = document.createElement("div")
    footer.className = "pk-overlay-toolbar-footer"

    const hint = document.createElement("span")
    hint.textContent = this.options.toolbarHint

    const actions = document.createElement("div")
    actions.className = "pk-overlay-toolbar-actions"

    const disable = document.createElement("button")
    disable.type = "button"
    disable.className = "pk-overlay-toolbar-link"
    disable.textContent = this.options.toolbarDisableLabel || "Disable"
    disable.addEventListener("click", () => {
      this.disableOverlay()
    })

    const credits = document.createElement("a")
    credits.href = /^https?:/i.test(this.options.toolbarCreditsHref)
      ? this.options.toolbarCreditsHref
      : resolveAsset(this.options.toolbarCreditsHref)
    credits.target = "_blank"
    credits.rel = "noreferrer"
    credits.textContent = this.options.toolbarCreditsLabel

    actions.appendChild(disable)
    actions.appendChild(credits)

    footer.appendChild(hint)
    footer.appendChild(actions)

    this.toolbar.appendChild(footer)
    this.root.appendChild(this.toolbar)
  }

  disableOverlay() {
    if (typeof this.options.onDisable === "function") {
      this.options.onDisable()
      return
    }

    this.destroy()
  }

  pointerMove(event) {
    this.pointerX = event.clientX
    this.pointerY = event.clientY
    this.cursor.updateTarget(this.pointerX, this.pointerY)
  }

  pointerDown(event) {
    this.cursor.react()

    if (!this.toolbar || this.toolbar.classList.contains("is-collapsed")) {
      return
    }

    const target = event?.target
    if (target instanceof Node && !this.toolbar.contains(target)) {
      this.toolbar.classList.add("is-collapsed")
      const header = this.toolbar.querySelector(".pk-overlay-toolbar-header")
      if (header) {
        header.setAttribute("aria-expanded", "false")
      }
    }
  }

  setDraggingState(isDragging) {
    document.body.classList.toggle("pk-overlay-dragging", Boolean(isDragging))
  }

  onResize() {
    this.pointerX = clamp(this.pointerX, 0, window.innerWidth)
    this.pointerY = clamp(this.pointerY, 0, window.innerHeight)
  }

  tick(now) {
    if (!this.running) return

    if (document.hidden) {
      this.lastTick = now
      requestAnimationFrame(this.tick)
      return
    }

    const deltaSeconds = Math.min((now - this.lastTick) / 1000, 0.05)
    this.lastTick = now

    // Throttle actor simulation to ~30fps to reduce CPU usage.
    this.accumulator += deltaSeconds
    const step = this.targetStep
    const maxSteps = 2
    let steps = 0
    while (this.accumulator >= step && steps < maxSteps) {
      this.actors.forEach((actor) => actor.update(now, step))
      this.resolveActorOverlaps(step)
      this.accumulator -= step
      steps += 1
    }

    // Cursor stays smooth; it's cheap compared to actor updates.
    this.cursor.update(deltaSeconds)

    requestAnimationFrame(this.tick)
  }

  async setCursorPokemon(key, showBadge = false) {
    if (!POKEMON_LIBRARY[key]) return

    this.cursorPokemon = key
    await this.cursor.setPokemon(key)
    this.refreshSelectionState()

    try {
      window.localStorage.setItem(STORAGE_KEY, key)
    } catch (_error) {
      // ignore storage failures
    }

    if (showBadge) {
      this.showBadge(`${this.options.badgePrefix}: ${POKEMON_LIBRARY[key].label}`)
    }
  }

  refreshSelectionState() {
    this.actors.forEach((actor) => {
      actor.setSelected(actor.key === this.cursorPokemon)
    })

    this.toolbarButtons.forEach((button, key) => {
      button.classList.toggle("is-selected", key === this.cursorPokemon)
    })
  }

  showBadge(text) {
    this.badge.textContent = text
    this.badge.classList.add("show")
    clearTimeout(this.badgeTimer)
    this.badgeTimer = window.setTimeout(() => {
      this.badge.classList.remove("show")
    }, 1400)
  }

  destroy() {
    this.running = false
    clearTimeout(this.badgeTimer)
    window.removeEventListener("pointermove", this.pointerMove)
    window.removeEventListener("pointerdown", this.pointerDown)
    window.removeEventListener("resize", this.onResize)
    this.actors.forEach((actor) => actor.destroy())
    this.cursor.destroy()
    this.root.remove()
    document.body.classList.remove("pk-overlay-cursor-enabled")
    document.body.classList.remove("pk-overlay-dragging")
  }
}

export function createPokemonOverlay(options = {}) {
  return new PokemonOverlay(options)
}
