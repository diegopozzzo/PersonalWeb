# Diego Portfolio — Elegant & Strategic (Next.js + TypeScript)

Personal site for a **Systems Architect** narrative: NONHUMAN, Magnus, GIA PUCP, and cross-domain systems work.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Edit content

- **Home HTML (sections below the React hero):** [`src/lib/landing-html.ts`](src/lib/landing-html.ts) — edit the exported strings directly. To re-sync from a file that still contains legacy `const LANDING_HTML_HEAD = \`...\`` / `LANDING_HTML_REST` template blocks, point `scripts/extract-html-blocks.mjs` at that file or paste the templates back temporarily and run `npm run extract:landing-html`.
- **Motion / WebGL / i18n client runtime:** [`src/lib/landing-client-init.ts`](src/lib/landing-client-init.ts) — regenerate with `npm run build:landing-init` after updating the raw fragment in `scripts/_extracted_landing_inner.txt` (from an older `page.tsx` that still contained `LANDING_JS`, or by hand).
- **Hero (photo, roles, CTAs):** [`src/components/LandingHero.tsx`](src/components/LandingHero.tsx)
- **Brochure route:** [`src/app/brochure/page.tsx`](src/app/brochure/page.tsx)
- **Global styles:** [`src/app/globals.css`](src/app/globals.css)
- **Metadata / OG:** [`src/app/layout.tsx`](src/app/layout.tsx) (avoid duplicating social tags in extra `head.*` files)

## Performance & libraries

- **Three.js** is bundled via `import("three")` on the client (no CDN). Keeps a single version in the app graph and works with strict CSP better than a third-party script tag.
- **WebGL** hero + architecture graph pause when the tab is hidden, when `prefers-reduced-motion: reduce` is set, and the graph pauses until `#arch-graph-wrap` is near the viewport.
- **Pokémon overlay** is **opt-in**: no assets load until the user clicks **Enable Pokemon**. Keys: `localStorage` `dbpa_overlay_enabled=1` (on); legacy `dbpa_overlay_disabled=1` is treated as off until the user opts in again.

## Internationalization (future)

The home page still uses a DOM text-walker + dictionary for EN/ES. For more content or routes, consider [`next-intl`](https://github.com/amannn/next-intl) or App Router segments such as `app/[locale]/page.tsx` instead of string-key matching.

## Notes

- Custom cursor is disabled on small viewports (existing CSS); mobile nav uses the menu button + full-screen panel.
- Service worker cache version is bumped in [`public/sw.js`](public/sw.js) when offline caching behaviour changes.
