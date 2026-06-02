# Pokemon Overlay Kit Expanded

Kit portable para integrar una capa interactiva Pokemon encima de otra web, con un roster curado de 12 Pokemon sincronizado con [pokemonAutoChess 6.10.0](https://github.com/keldaanCommunity/pokemonAutoChess) y formas PMD Collab.

## Que incluye

- Honedge como mouse custom por defecto.
- Pikachu y Eevee como companeros superiores recomendados.
- Kecleon, Charmander, Machop, Mr. Mime y Meowth (Galar) como walkers inferiores en el sitio.
- Selector para cambiar el mouse entre 12 Pokemon (`assetId` por forma cuando aplica).
- Demo lista para abrir en navegador.
- Creditos en `CREDITS.md` y guia en `ROSTER.md`.

## Roster incluido

- Honedge, Gengar, Machop, Kecleon, Pikachu (f6), Eevee, Charmander, Mr. Mime, Meowth (Galar), Lucario, Tandemaus, Snorlax

## Carpeta

- `demo.html`
- `pokemon-overlay.js`
- `pokemon-overlay.css`
- `ROSTER.md`
- `assets/`
- `CREDITS.md`

## Sincronizar sprites desde PAC / PMD

En la raiz del portfolio (clones `.tmp-pac` y `.tmp-spritecollab`):

```bash
npm run sync:pokemon-overlay
```

El manifest vive en `scripts/pokemon-overlay-sync-manifest.json`.

## Como usarlo en otra web

Sirve la carpeta por HTTP y luego agrega esto en tu pagina:

```html
<link rel="stylesheet" href="/pokemon-overlay-kit-expanded/pokemon-overlay.css" />
<script type="module">
  import { createPokemonOverlay } from "/pokemon-overlay-kit-expanded/pokemon-overlay.js"

  createPokemonOverlay({
    cursorPokemon: "HONEDGE"
  })
</script>
```

## API minima

```js
import { createPokemonOverlay } from "/pokemon-overlay-kit-expanded/pokemon-overlay.js"

const overlay = createPokemonOverlay({
  cursorPokemon: "HONEDGE",
  topCompanions: ["PIKACHU", "EEVEE"],
  bottomWalkers: ["KECLEON", "CHARMANDER", "MACHOP", "MR_MIME", "MEOWTH_GALAR"],
  toolbarPokemon: [
    "HONEDGE",
    "GENGAR",
    "MACHOP",
    "KECLEON",
    "PIKACHU",
    "EEVEE",
    "CHARMANDER",
    "MR_MIME",
    "MEOWTH_GALAR",
    "LUCARIO",
    "ARCHALUDON",
    "SNORLAX"
  ]
})

overlay.setCursorPokemon("LUCARIO")
overlay.destroy()
```

## Recomendaciones rapidas

- Usa de 2 a 4 companeros en header si los anclas manualmente.
- Usa de 3 a 5 `bottomWalkers` para no saturar la parte baja.
- Las variantes de forma usan `assetId` en disco (`0025-f06`, `0052-f02`, etc.).

## Nota tecnica

- ES modules y `fetch()` para atlas y duraciones.
- No abras por `file://`; sirve con un server estatico.
- Render en `canvas`, sin Phaser en runtime.

## Nota legal

- Creditos en `CREDITS.md`; no sustituyen revision legal propia.
- Obra derivada de fans; Pokemon (c) The Pokemon Company.
