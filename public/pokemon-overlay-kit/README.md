# Pokemon Overlay Kit

Kit portable para integrar una capa interactiva Pokemon encima de otra web.

## Que incluye

- Honedge como mouse custom por defecto.
- Gengar, Machop y Axew caminando en la parte baja de la pantalla.
- Pikachu y Eevee en la parte superior.
- Selector para cambiar el mouse entre los seis Pokemon.
- Demo lista para abrir en navegador.
- Creditos separados en `CREDITS.md`.

## Carpeta

- `demo.html`
- `pokemon-overlay.js`
- `pokemon-overlay.css`
- `assets/`
- `CREDITS.md`

## Como usarlo en otra web

Sirve la carpeta por HTTP y luego agrega esto en tu pagina:

```html
<link rel="stylesheet" href="/pokemon-overlay-kit/pokemon-overlay.css" />
<script type="module">
  import { createPokemonOverlay } from "/pokemon-overlay-kit/pokemon-overlay.js"

  createPokemonOverlay({
    cursorPokemon: "HONEDGE"
  })
</script>
```

## API minima

```js
import { createPokemonOverlay } from "/pokemon-overlay-kit/pokemon-overlay.js"

const overlay = createPokemonOverlay({
  cursorPokemon: "HONEDGE",
  topCompanions: ["PIKACHU", "EEVEE"],
  bottomWalkers: ["GENGAR", "MACHOP", "AXEW"],
  toolbarPokemon: ["HONEDGE", "GENGAR", "MACHOP", "AXEW", "PIKACHU", "EEVEE"]
})

overlay.setCursorPokemon("GENGAR")
overlay.destroy()
```

## Nota tecnica

- Este kit usa ES modules y `fetch()` para cargar atlas y duraciones.
- No lo abras por `file://`; sirvelo con un server estatico.
- Los sprites se renderizan en `canvas`, sin dependencia de Phaser.

## Nota legal

- El codigo del repo original y los assets no necesariamente comparten el mismo nivel de permiso practico para reutilizacion publica.
- Aqui deje los creditos fuente para los Pokemon usados, pero eso no reemplaza una revision legal propia.
- Si tu web va a crecer o monetizarse despues, mi recomendacion sigue siendo migrar a arte propio o con licencia clara.

## Archivos fuente usados

- `assets/sprites/0679.*` Honedge
- `assets/sprites/0094.*` Gengar
- `assets/sprites/0066.*` Machop
- `assets/sprites/0610.*` Axew
- `assets/sprites/0025.*` Pikachu
- `assets/sprites/0133.*` Eevee

