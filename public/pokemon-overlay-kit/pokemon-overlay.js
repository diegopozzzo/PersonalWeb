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
  }
}

const DEFAULT_OPTIONS = {
  root: document.body,
  cursorPokemon: "HONEDGE",
  topCompanions: ["PIKACHU", "EEVEE"],
  bottomWalkers: ["GENGAR", "MACHOP", "AXEW"],
  toolbarPokemon: ["HONEDGE", "GENGAR", "MACHOP", "AXEW", "PIKACHU", "EEVEE"],
  showToolbar: true,
  toolbarCollapsed: false,
  toolbarTitle: "Pokemon overlay",
  toolbarSubtitle: "Click to change cursor",
  toolbarToggleHide: "Hide",
  toolbarToggleShow: "Show",
  toolbarHint: "Click or drag the Pokemon",
  toolbarCreditsLabel: "View credits",
  toolbarCreditsHref: "./CREDITS.md",
  toolbarRoleLabels: {
    mouse: "cursor",
    top: "companion",
    bottom: "walker"
  },
  activeLabel: "cursor",
  badgePrefix: "Cursor",
  cursorScale: 1,
  cursorOffsetX: -18,
  cursorOffsetY: -18,
  cursorSmoothing: 14,
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
    const sourceSize = this.current.baseSourceSize?.w
      ? this.current.baseSourceSize
      : currentFrame.sourceSize
    const spriteSource = currentFrame.spriteSourceSize
    const availableWidth = this.size - 8
    const availableHeight = this.size - 8
    const scale = Math.min(
      availableWidth / sourceSize.w,
      availableHeight / sourceSize.h
    )

    const fullWidth = sourceSize.w * scale
    const fullHeight = sourceSize.h * scale
    const offsetX = (this.size - fullWidth) / 2
    const offsetY = (this.size - fullHeight) / 2

    ctx.drawImage(
      this.asset.image,
      rect.x,
      rect.y,
      rect.w,
      rect.h,
      offsetX + spriteSource.x * scale,
      offsetY + spriteSource.y * scale,
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
    this.pointerStart = null
    this.pointerOffset = null
    this.seed = Math.random() * Math.PI * 2
    this.scale = options.size || (options.role === "top" ? 96 : 112)
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
    this.floatX = options.floatX ?? (options.role === "top" ? 8 : 0)
    this.floatY = options.floatY ?? (options.role === "top" ? 4 : 2)

    this.element = document.createElement("div")
    this.element.className = `pk-overlay-actor ${options.role}`
    this.element.setAttribute(
      "data-selected-label",
      overlay.options.activeLabel || "cursor"
    )
    this.element.style.width = `${this.scale}px`
    this.element.style.height = `${this.scale}px`
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

    this.element.addEventListener("pointerenter", this.onPointerEnter)
    this.element.addEventListener("pointerleave", this.onPointerLeave)
    this.element.addEventListener("pointerdown", this.onPointerDown)

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

    overlay.root.appendChild(this.element)

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
    if (this.options.role === "top") {
      return this.meta.topAction || this.meta.idleAction
    }

    if (this.options.role === "bottom" && !this.dragging) {
      return this.meta.moveAction
    }

    return this.meta.idleAction
  }

  currentOrientation() {
    if (this.options.role === "top") {
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
    this.hovered = true
    this.element.classList.add("is-hovered")
    this.react()
  }

  onPointerLeave() {
    this.hovered = false
    this.element.classList.remove("is-hovered")
  }

  onPointerDown(event) {
    event.preventDefault()
    event.stopPropagation()

    if (this.options.role === "top") {
      this.overlay.setCursorPokemon(this.key, true)
      this.react()
      return
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

    if (!this.dragging) {
      this.overlay.setCursorPokemon(this.key, true)
      this.react()
    } else {
      const deltaX = event.clientX - this.pointerStart.x
      this.direction = deltaX >= 0 ? 1 : -1
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

      if (!this.sprite.temporary) {
        this.sprite.play(this.meta.topAction || this.meta.idleAction, this.currentOrientation())
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
    this.sprite = new PixelCanvasSprite(this.size)
    this.element.appendChild(this.sprite.canvas)
    overlay.root.appendChild(this.element)

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
    const easing = clamp(deltaSeconds * this.smoothing, 0.1, 0.42)

    this.x += dx * easing
    this.y += dy * easing

    if (Math.abs(this.targetX - this.lastTargetX) > 1.5) {
      this.orientation =
        this.targetX >= this.lastTargetX ? ORIENTATION.RIGHT : ORIENTATION.LEFT
    }
    this.lastTargetX = this.targetX

    if (this.asset && !this.sprite.temporary) {
      const moving = Math.hypot(dx, dy) > 18
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
    this.createBottomActors()

    if (this.options.showToolbar) {
      this.createToolbar()
    }

    window.addEventListener("pointermove", this.pointerMove, { passive: true })
    window.addEventListener("pointerdown", this.pointerDown, { passive: true })
    window.addEventListener("resize", this.onResize)

    this.ready = Promise.all([
      this.cursor.ready,
      ...this.actors.map((actor) => actor.ready)
    ]).then(() => {
      this.refreshSelectionState()
    })

    requestAnimationFrame(this.tick)
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

    const titleWrap = document.createElement("div")
    const title = document.createElement("h2")
    title.className = "pk-overlay-toolbar-title"
    title.textContent = this.options.toolbarTitle
    const subtitle = document.createElement("p")
    subtitle.className = "pk-overlay-toolbar-subtitle"
    subtitle.textContent = this.options.toolbarSubtitle
    titleWrap.appendChild(title)
    titleWrap.appendChild(subtitle)

    const toggle = document.createElement("button")
    toggle.className = "pk-overlay-toolbar-toggle"
    toggle.type = "button"
    toggle.textContent = this.options.toolbarCollapsed
      ? this.options.toolbarToggleShow
      : this.options.toolbarToggleHide
    toggle.addEventListener("click", () => {
      this.toolbar.classList.toggle("is-collapsed")
      toggle.textContent = this.toolbar.classList.contains("is-collapsed")
        ? this.options.toolbarToggleShow
        : this.options.toolbarToggleHide
    })

    header.appendChild(titleWrap)
    header.appendChild(toggle)
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

    const credits = document.createElement("a")
    credits.href = /^https?:/i.test(this.options.toolbarCreditsHref)
      ? this.options.toolbarCreditsHref
      : resolveAsset(this.options.toolbarCreditsHref)
    credits.target = "_blank"
    credits.rel = "noreferrer"
    credits.textContent = this.options.toolbarCreditsLabel

    footer.appendChild(hint)
    footer.appendChild(credits)

    this.toolbar.appendChild(footer)
    this.root.appendChild(this.toolbar)
  }

  pointerMove(event) {
    this.pointerX = event.clientX
    this.pointerY = event.clientY
    this.cursor.updateTarget(this.pointerX, this.pointerY)
  }

  pointerDown() {
    this.cursor.react()
  }

  onResize() {
    this.pointerX = clamp(this.pointerX, 0, window.innerWidth)
    this.pointerY = clamp(this.pointerY, 0, window.innerHeight)
  }

  tick(now) {
    if (!this.running) return

    const deltaSeconds = Math.min((now - this.lastTick) / 1000, 0.05)
    this.lastTick = now

    this.actors.forEach((actor) => actor.update(now, deltaSeconds))
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
  }
}

export function createPokemonOverlay(options = {}) {
  return new PokemonOverlay(options)
}
