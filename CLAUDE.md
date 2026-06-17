# InfinityPuzzles Web — Claude Context

## Project Overview
InfinityPuzzles är en kreativ produkt som kombinerar ett fysiskt modulärt träpussel (19 unika sammankopplingsbara bitar) med en webbaserad spel-/mysterieupplevelse. Webb-appen är butik, spelportal och varumärkeshub.

## Stack
- Framework: Next.js 16 App Router (Turbopack)
- Language: TypeScript
- Styling: Tailwind CSS
- Animation: GSAP (CSS sticky only — ALDRIG ScrollTrigger pin), Lottie, Three.js
- E-commerce: Shopify Headless (infinity-puzzle-2.myshopify.com)
- Email: Shopify Email (installerat), Klaviyo (snart primärt)
- Routing: next-intl (locale-based: /en/, /sv/)
- Deployment: Vercel
- Domain: infinity-puzzle.com (Loopia DNS → Vercel, A-record: 216.198.79.1)

## Repository
- GitHub: leovickman-eng/infinity-puzzles-web
- Local path: /Users/leovickman/Documents/InfinityPuzzles/web/

## Collaborators
- Leo (owner), Oscar (design input), Erik (collaborator)

## Key Files
- Navbar: components/layout/Header.tsx — döljer sig på alla /universe-routes
- Hero S1: components/hero/HeroPhotoSection.tsx
- Formation animation S2: components/formation-morph/FormationMorph.tsx
- PlayModes (S2→S3): components/play-modes/PlayModes.tsx
- Home sections: app/[locale]/HomeClientSections.tsx (dynamic imports, ssr:false)
- Home page: app/[locale]/page.tsx
- Wild Network embed: app/[locale]/WILD_NETWORK/page.tsx (inlinead, ej dynamic import)
- Universe landing: app/[locale]/universe/page.tsx
- Universe stories grid: app/[locale]/universe/stories/page.tsx
- Universe character detail: app/[locale]/universe/stories/[id]/page.tsx
- Brand page: app/[locale]/brand/page.tsx (password: Spagetti!23)
- Signup page: app/[locale]/signup/page.tsx
- Signup API: app/api/subscribe/route.ts
- Translations: messages/en.json, messages/sv.json
- Puzzle pieces desktop (WebP): public/formations/GASP/F1/
- Puzzle pieces mobile (WebP): public/formations/GASP/F1-mobile/
- Hero image: public/images/hero/hero-main.webp (konverterad från HEIC, 1920px bred, 85q)
- QR-kod SVG: public/qr_universe.svg → infinity-puzzle.com/universe
- OG-bild: public/images/hero/og-image.png (1376×768)
- WILD_NETWORK standalone app: /WILD_NETWORK/index.html (14MB, redigeras via Python string-replacement)

## Fonts — Typekit kit mnz1cmc
- **Tumb** — display/headers, font-family: 'tumb', serif
- **Nakone** — menu, cue text
- **Brianne** — dekorativ

## Brand Colors
Primary purple: #ae84ea | Dark bg: #0d0a12 | Light bg: #FFFBF5 | Foreground: #1C1917
Logo purple: #5B4A8A
Full palette: #ae84ea, #544550, #f9ece4, #e81317, #05375a, #533f7e, #f6b8bd, #530100, #dac1ff, #16ade6, #57d494, #fb8f02, #fdf07d, #0d8137, #7ed6cd, #1C1917

## Hero Section (S1) — HeroPhotoSection.tsx
- Full-width puzzle photo (hero-main.webp, aspectRatio 4032/2503)
- Pulsing purple button: "GET YOURS" / "KÖP DITT", borderRadius: 9999px, background: #ae84ea
  - Positioned at bottom: clamp(60px, 16%, 130px) — högt upp på bilden
  - CSS animation: hero-pulse (box-shadow expansion), hero-bounce-in on load
- Below image: tight strip with 3 staggered chevron arrows in #ae84ea (hero-scroll-bounce)
- NO h2/p text below S1 — texten är borttagen, bara pilarna finns kvar
- Scroll-to-shop: scrollIntoView({ behavior: 'smooth' }) till #shop

## Formation Morph (S2) — FormationMorph.tsx — KRITISKT
- Canvas: 550×1265px desktop, 275×633px mobil, CSS-skalat
- Bilder desktop: /formations/GASP/F1/1_X.webp (F1), 2_X.webp (F2)
- Bilder mobil: /formations/GASP/F1-mobile/
- ALDRIG GSAP ScrollTrigger pin — orsakar removeChild-krasch. Använd CSS sticky.
- F2-bilder lazy-laddas via IntersectionObserver + data-src (loading="lazy" är opålitlig för opacity:0 element)
- Piece 0 ("katten") startar ALLTID synlig: opacity:1, transform:translateY(0), f1Progresses returnerar 1 för i===0
- Overlay startar med opacity:1 (inte 0) — annars döljs katten innan scroll
- paddingTop på sticky overlay: 48px (var 140px)
- Bakgrundscanvas (bgCanvasRef): full viewport-storlek (window.innerWidth × window.innerHeight), position:absolute inset:0 i overlay, zIndex:0
  - Ritas om vid resize, antal prickar skalas med skärmyta: Math.round((W*H)/4000)
  - Under F2: translateY synkas med wrapRef så prickarna följer pusslet
  - Statisk under F1

## Universe (/universe) — universe/page.tsx
- 'use client', dark bg #0d0a12
- Animerad stjärn-/nebulosabakgrund (StarCanvas, identisk med WILD_NETWORK)
  - 300 small + 60 medium + 20 bright twinkling stars (Math.sin(ts * 0.0008 + s.phase))
  - 3 nebula-blobs med blur(80px)
- 3 nav-knappar: CHEAT → /WILD_NETWORK, STORIES → /universe/stories, SHOP → /
- ALLA nav-knappar är `<a>`-taggar (full page load), inte Next.js `<Link>`
- Header dold på alla /universe-routes (pathname.includes('/universe'))
- QR-kod inuti pusselboxen → infinity-puzzle.com/universe

## WILD_NETWORK
- GitHub Pages: leovickman-eng.github.io/WILD_NETWORK/
- Inbäddad som iframe i Next.js på /WILD_NETWORK
- WILD_NETWORK/page.tsx: inlinead komponent (INTE dynamic import — orsakar blank iframe vid client-side navigation)
- Redigeras via Python string-replacement (14MB, för stor för Edit-verktyget)
- Karaktärsnamn (uppdaterade): Tanya, Dali, Mira, Lana
- pCharLink URL: infinity-puzzle.com/sv/universe/stories (var /sv/characters)

## Header
- Döljer sig på alla /universe-routes: `if (pathname.includes('/universe')) return null`
- usePathname från next/navigation

## Karaktärer
- 19 st på Cloudinary: res.cloudinary.com/dk3ftfygx/image/upload/infinitypuzzles/karaktarer/karaktar_N.png
- URLs i characters.json
- Poster-bilder: public/images/posters/poster_XX.webp

## Navigation
- Infinity knot-ikon (övre vänster) = hemknapp (/)
- ... knapp = dropdown-meny med createPortal till document.body
- Länkar: Characters, Story (#story), Shop (#shop), Wild Network, språkväxlare

## Shopify Admin API
- Endpoint: https://infinity-puzzle-2.myshopify.com/admin/api/2026-04/graphql.json
- Token genereras dynamiskt via client credentials (går ut 24h)

## Environment Variables (.env.local + Vercel)
SHOPIFY_STORE_DOMAIN=infinity-puzzle-2.myshopify.com
SHOPIFY_ADMIN_ACCESS_TOKEN=<see Vercel env>
SHOPIFY_CLIENT_ID=<see Vercel env>
SHOPIFY_CLIENT_SECRET=<see Vercel env>

## Signup-sida
- /en/signup och /sv/signup
- Navbar och footer dolda via CSS: `body:has([data-page='signup'])`
- Captcha-text: "Slide the purple piece into place to unlock", färg #ae84ea
- H1-font: Tumb
- Kunder skapas i Shopify med acceptsMarketing: true
- 205 gamla kunder importerade från infinitypuzzles.se

## SEO
- sr-only H1 i page.tsx + .sr-only CSS i globals.css
- Page title: "Infinity Puzzle Wild | Wooden Puzzle with 19 Characters"
- OG-bild: /images/hero/og-image.png (1376×768)
- hreflang /en + /sv i layout.tsx
- Canonical: https://infinity-puzzle.com/en
- Product JSON-LD via next/script i page.tsx
- Sitemap: app/sitemap.ts

## Git / Workflow — VIKTIG GOTCHA
- Sandboxen skapar .git/index.lock som blockerar git-kommandon från användaren
- Kör ALDRIG git från sandboxen — det skapar en lock-fil som Leo måste ta bort manuellt
- Leo commitar och pushar alltid själv från sin terminal
- Om lock finns: `rm ~/Documents/InfinityPuzzles/web/.git/index.lock` sedan commit direkt

## InfinityPuzzles Logo SVG
- viewBox="0 0 1920 1080", fill="#5B4A8A" (eller #ae84ea för ljus lila variant)
- Inlinead i HeroPhotoSection.tsx och HeroText.tsx
- Används aldrig som `<img src>` — alltid inline SVG för färgkontroll
