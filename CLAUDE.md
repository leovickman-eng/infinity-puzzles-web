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
- Navbar: `components/header/` — `HeaderClient.tsx` loaded with `ssr: false` via `dynamic()`
- Formation animation (s2): `components/formation-morph/FormationMorph.tsx`
- Wild Network: `app/[locale]/wild_network/` — loaded with `ssr: false` via `dynamic()`
- Brand page: `app/[locale]/brand/page.tsx` — password protected (`Spagetti!23`)
- Lottie animation: `public/lottie/test.json`
- Puzzle piece images (desktop): `public/formations/GASP/F1/` — WebP format
- Puzzle piece images (mobile, 400px): `public/images/pieces/mobile/`
- Character images: Cloudinary (`dk3ftfygx`, path: `infinitypuzzles/karaktarer/karaktar_1.png` → `karaktar_19.png`)
- Logo SVG: `public/images/SVG/Logga_svart-02.svg`
- Menu icon SVG: `public/images/SVG/Menu.svg`

## Fonts
- **Trykker** — password gate, brand page
- **Nakone** — menu links, cue text, body in places
- **Brianne** — decorative

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
- **s1**: Hero — logo, headline "Infinity Puzzle", sublines, Lottie animation (`test.json`) below
- **s2**: Formation Morph — canvas animation of 19 puzzle pieces assembling (F1 phase) then morphing (F2 phase), scroll-driven
- **s3**: Hero photos / real-world imagery

## Formation Morph (s2) — Critical Notes
- Canvas: 550×1265px internal, CSS-scaled
- F1 phase: 19 pieces slide in one by one, scroll-driven (25px scroll per piece)
- F2 phase: pieces swap out one by one
- Images: `/formations/GASP/F1/1_X.webp` (F1), `/formations/GASP/F1/2_X.webp` (F2)
- Map keys must match image src strings exactly — never change F1_SRCS or F2_SEQ keys without updating renderCanvas
- **CRITICAL**: Never use GSAP ScrollTrigger pin on s2 — causes `removeChild` crash on navigation. Use CSS `position: sticky` instead.
- Mobile images exist at `/images/pieces/mobile/piece_X.png` (400×400px) but are NOT compatible with canvas compositing (wrong format) — do not use these as canvas sources

## Known Issues / To Do
1. **S2 mobile lag** — F1 animation is slow on mobile. Next step: frame skip throttle (`frameSkipRef % 2 === 0` on mobile)
2. **Shopify API locked** — `infinity-puzzle-2.myshopify.com` returns "Online Store channel is locked". Must log into that store specifically and contact Shopify support from there.
3. **Logo gradient** — animated color gradient on the SVG logo in s1 using brand colors
4. **S2→S3 transition** — s2 should scroll up and off screen revealing s3 hero images underneath

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
