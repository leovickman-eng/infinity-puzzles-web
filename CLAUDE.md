# InfinityPuzzles Web — Claude Context

## Project Overview
InfinityPuzzles is a creative product combining a physical modular wooden puzzle (19 unique interlocking pieces) with a web-based murder mystery/puzzle game experience. The web app is the storefront, game portal, and brand hub.

## Stack
- **Framework**: Next.js 16 App Router (Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: GSAP (scroll-driven), Lottie, Three.js
- **E-commerce**: Shopify Headless (`infinity-puzzle-2.myshopify.com`)
- **Email**: Klaviyo
- **Routing**: next-intl (locale-based: `/en/`, `/sv/`)
- **Deployment**: Vercel
- **Domain**: `infinity-puzzle.com` (managed by Oscar)

## Repository
- GitHub: `leovickman-eng/infinity-puzzles-web`
- Local path: `/Users/leovickman/Documents/InfinityPuzzles/web/`

## Collaborators
- Leo (owner)
- Oscar (domain, collaborator)
- Erik (collaborator)

## Key File Locations
- Navbar: `components/layout/Header.tsx` — `HeaderClient.tsx` loaded with `ssr: false` via `dynamic()`
- Formation animation (s2): `components/formation-morph/FormationMorph.tsx`
- Wild Network: `app/[locale]/wild_network/` — loaded with `ssr: false` via `dynamic()`
- Brand page: `app/[locale]/brand/page.tsx` — password protected (`Spagetti!23`)
- Lottie animation: `public/lottie/test.json`
- Puzzle piece images: `public/formations/GASP/F1/` — WebP format (`1_1.webp`…`2_19.webp`)
- Character images: `/public/images/characters/WILD_characters-01.webp` … `WILD_characters-19.webp`
- Logo (hero): inline SVG in `HeroText.tsx`, fill `#5B4A8A`
- Logo (footer): `<img src="/images/SVG/infinity-puzzles-logo (1).svg">`, width 120px
- Cart icon: `/images/SVG/Korg-01.svg`, width 28px (`Header.tsx`)

## Fonts
- **Display/titles** (`font-display`): `tumb` via Adobe Fonts — `@import url("https://use.typekit.net/mnz1cmc.css")` at top of `globals.css`. Kit also has `aabak`, `aabak-swash`, `tt-modernoir`.
- **Body text** (`font-body`): Cormorant Garamond via `next/font/google`, CSS var `--font-cormorant`
- **Nakone**: formation cue text + legacy uses, loaded via `@font-face` from `/fonts/Nakone.ttf`
- Rule: `font-display` only on h1–h6. All p-tags, spans, buttons, links → `font-body`.

## Brand Colors
| Hex | Description |
|-----|-------------|
| `#ae84ea` | Primary purple (main brand) |
| `#544550` | Dark purple/grey |
| `#f9ece4` | Cream white (background) |
| `#e81317` | Red |
| `#05375a` | Dark blue |
| `#533f7e` | Purple |
| `#f6b8bd` | Pink |
| `#530100` | Dark red |
| `#dac1ff` | Lavender |
| `#16ade6` | Light blue |
| `#57d494` | Green |
| `#fb8f02` | Orange |
| `#fdf07d` | Yellow |
| `#0d8137` | Dark green |
| `#7ed6cd` | Turquoise |
| `#1C1917` | Almost black |

## Page Structure (Home)
- **S1** `LottieScrollSection` — Lottie hero (`test.json`), `marginBottom: -50svh` so S2 overlaps underneath
- **S2** `FormationMorph` — img-tag animation (not canvas), scroll-driven
- **S3** Physical object section (hero photos)
- **Shop** section (`id="shop"`)
- **S4** Characters — `CharacterCarousel` 3D perspective carousel (`components/character-carousel/`)
- **S7** `StoryTimeline`

## Formation Morph (s2) — Critical Notes
- **Not canvas** — uses 38 `<img>` tags (`f1ImgRefs` / `f2ImgRefs`), styles set directly via refs
- F1 phase: scroll-driven `opacity` + `translateY` on img elements, no React re-renders
- F2 phase: opacity swap on `f2Step` change; CSS `transition: opacity 0.3s ease` on F2 imgs
- Frame-skip on mobile: `frameSkipRef % 2 !== 0`, reset to 0 on new F2 step
- Piece 0 (cat/1_1.webp): uses `catScrolled` (70% viewport early trigger) and `SLIDE_P0 = 350`
- Images: `/formations/GASP/F1/1_X.webp` (F1), `/formations/GASP/F1/2_X.webp` (F2)
- **CRITICAL**: Never use GSAP ScrollTrigger pin on s2 — causes `removeChild` crash. Use CSS `position: sticky` instead.

## Characters
- 19 unique characters, each is a puzzle piece
- Images: `/public/images/characters/WILD_characters-01.webp` … `WILD_characters-19.webp` (local, not Cloudinary)
- Homepage: `CharacterCarousel` — 3D fan with `perspective: 1200px`, rotateY ±35°/±55°, scale 0.82/0.65
- Characters page: flex-wrap grid, `w-1/3 md:w-1/5`, seeded shuffle (seed=42)

## Known Issues / To Do
1. **Shopify API locked** — `infinity-puzzle-2.myshopify.com` returns "Online Store channel is locked". Must log into that store specifically and contact Shopify support from there.
2. **Logo gradient** — `Logga_gradient.svg` exists in `/images/SVG/` with animated gradient, not yet used in hero

## Hydration / SSR Rules
- **Never** server-render components that use `document`, `window`, or `createPortal` — wrap in `dynamic(..., { ssr: false })`
- Header is client-only: `dynamic(() => import('./HeaderClient'), { ssr: false, loading: () => null })`
- Wild Network is client-only: `dynamic(() => import('./WildNetworkClient'), { ssr: false })`
- The `removeChild` crash is caused by GSAP manipulating DOM nodes outside React's virtual DOM — always clean up GSAP in `useEffect` return, and prefer CSS sticky over ScrollTrigger pin

## Navigation
- Infinity knot icon (top left) = home link (`/`)
- `...` button next to it = dropdown menu
- Menu links: Characters, Story (smooth scroll to `#story`), Shop (smooth scroll to `#shop`), Wild Network, language switcher
- Dropdown uses `createPortal` to `document.body` to avoid DOM conflicts

## Shopify
- Store: `infinity-puzzle-2.myshopify.com`
- API: Storefront API via Headless channel
- Token: in `.env.local` as `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- Product handle: `infinity-puzzles-wild-19-characters-infinite-formations`
- Note: `.env.local` currently missing SHOPIFY env vars — needs to be restored

## Environment Variables (`.env.local`)
```
SHOPIFY_STORE_DOMAIN=infinity-puzzle-2.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=<token>
```

## Internationalization
- Locales: `en`, `sv`
- All pages under `app/[locale]/`
- Translations via `next-intl`
- Middleware/proxy handles locale routing (`proxy.ts`)

## Wild Network
- Full-screen dark canvas showing 19 characters as nodes with adjacency connections
- Clicking a node shows which pieces it connects to
- Back button: infinity knot icon (top left, `position: fixed`, `z-index: 50`)
- Loaded client-side only (`ssr: false`)

## Characters
- 19 unique characters, each is a puzzle piece
- Images hosted on Cloudinary: `https://res.cloudinary.com/dk3ftfygx/image/upload/infinitypuzzles/karaktarer/karaktar_N.png`
- URLs saved in `characters.json`
- Future: Neo4j graph database for character relationships and game logic

## Game Concept
- Murder mystery / puzzle game
- Characters interact based on physical puzzle adjacency
- Claude API planned for character dialogue with graph context injection
- Player session tracking as graph paths
