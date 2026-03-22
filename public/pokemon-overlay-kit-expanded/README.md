# Pokemon Overlay Kit Expanded

Kit portable para integrar una capa interactiva Pokemon encima de otra web, ahora con un roster curado de 12 Pokemon.

## Que incluye

- Honedge como mouse custom por defecto.
- Pikachu, Eevee y Mew como companeros superiores.
- Gengar, Machop, Axew y Charmander caminando en la franja inferior.
- Selector para cambiar el mouse entre 12 Pokemon.
- Demo lista para abrir en navegador.
- Creditos separados en `CREDITS.md`.
- Guia de seleccion en `ROSTER.md`.

## Roster incluido

- Honedge
- Pikachu
- Eevee
- Gengar
- Machop
- Axew
- Charmander
- Bulbasaur
- Squirtle
- Lucario
- Mew
- Snorlax

## Carpeta

- `demo.html`
- `pokemon-overlay.js`
- `pokemon-overlay.css`
- `ROSTER.md`
- `assets/`
- `CREDITS.md`

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
  topCompanions: ["PIKACHU", "EEVEE", "MEW"],
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
    "SNORLAX"
  ]
})

overlay.setCursorPokemon("LUCARIO")
overlay.destroy()
```

## Recomendaciones rapidas

- Usa de 2 a 4 `topCompanions` para que respiren mejor en la cabecera.
- Usa de 3 a 5 `bottomWalkers` si quieres evitar saturar la parte baja.
- Deja a Honedge, Gengar o Lucario como cursores si quieres una silueta mas legible.

## Nota tecnica

- Este kit usa ES modules y `fetch()` para cargar atlas y duraciones.
- No lo abras por `file://`; sirvelo con un server estatico.
- Los sprites se renderizan en `canvas`, sin dependencia de Phaser.

## Nota legal

- El codigo del repo original y los assets no necesariamente comparten el mismo nivel de permiso practico para reutilizacion publica.
- Aqui deje los creditos fuente para los Pokemon usados, pero eso no reemplaza una revision legal propia.
- Si tu web va a crecer o monetizarse despues, mi recomendacion sigue siendo migrar a arte propio o con licencia clara.
