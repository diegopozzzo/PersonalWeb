# Creditos

Este kit reutiliza 12 Pokemon del repo [keldaanCommunity/pokemonAutoChess](https://github.com/keldaanCommunity/pokemonAutoChess) v6.10.0 (`assetsVersion` 2026-05-30) y formas empaquetadas desde [PMD SpriteCollab](https://github.com/PMDCollab/SpriteCollab) cuando PAC aun no publicaba el atlas.

## Fuente de creditos

- `app/models/precomputed/credits.json` y `tracker.json` (PAC)
- `credit_names.txt` y `sprite/*/credits.txt` (SpriteCollab)

## Pokemon usados

### Honedge (`0679`)

- Portrait primary: Emmuffin
- Portrait secondary: Garbage
- Sprite primary: Emmuffin

### Gengar (`0094`)

- Portrait primary: CHUNSOFT
- Sprite primary: CHUNSOFT
- Sprite secondary: Emboarger

### Machop (`0066`)

- Portrait primary: CHUNSOFT
- Portrait secondary: felis_licht, Murpi
- Sprite primary: CHUNSOFT
- Sprite secondary: Emboarger

### Pikachu (`0025`)

- Portrait primary: CHUNSOFT
- Sprite primary: CHUNSOFT

### Pikachu — forma Libre (`0025-f06`, PMDCollab forma 6)

- Portrait primary: PMDCollab contributor (tracker `0025/0006`)
- Sprite primary: PMDCollab contributor (tracker `0025/0006`, [PMD Sprite Repository](https://sprites.pmdcollab.org/#/0025?form=6))

### Pikachu Surf (`0025-surfer`, PAC `0025-9999`)

- Portrait primary: PMDCollab contributor (tracker `0025/9999`)
- Sprite primary: PMDCollab contributor (tracker `0025/9999`)

### Eevee (`0133`)

- Portrait primary: CHUNSOFT
- Sprite primary: CHUNSOFT

### Charmander (`0004`)

- Portrait primary: CHUNSOFT
- Portrait secondary: PMDCollab contributor
- Sprite primary: CHUNSOFT

### Kecleon — forma Purple (`0352-f01`, SpriteCollab `0352/0001`)

- Portrait primary: CHUNSOFT
- Sprite primary: CHUNSOFT (PMD Collab sheet)

### Mr. Mime — forma Galar (`0122-f01`, SpriteCollab `0122/0001`)

- Portrait primary: PMDCollab contributor (tracker)
- Sprite: PMDCollab contributors per `sprite/0122/0001/credits.txt`

### Meowth — forma Galar (`0052-f02`, SpriteCollab `0052/0002`)

- Portrait primary: PMDCollab contributor (tracker)
- Sprite: PMDCollab contributors per `sprite/0052/0002/credits.txt`

### Lucario (`0448`)

- Portrait primary: CHUNSOFT
- Portrait secondary: PMDCollab contributors
- Sprite primary: CHUNSOFT
- Sprite secondary: PMDCollab contributor

### Tandemaus (`0924-f01`, PAC `0924`)

- Portrait primary: PMDCollab contributor
- Sprite primary: PMDCollab contributor

### Snorlax (`0143`)

- Portrait primary: CHUNSOFT
- Portrait secondary: PMDCollab contributors
- Sprite primary: CHUNSOFT

## Sincronizar assets

Desde la raiz del portfolio (con `.tmp-pac` y `.tmp-spritecollab` clonados):

```bash
npm run sync:pokemon-overlay
```
