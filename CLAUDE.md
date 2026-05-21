# InfinityPuzzles Web — Claude Context

## Project Overview
InfinityPuzzles är en kreativ produkt som kombinerar ett fysiskt modulärt träpussel (19 unika sammankopplingsbara bitar) med en webbaserad spel-/mysterieupplevelse. Webb-appen är butik, spelportal och varumärkeshub.

## Stack
- Framework: Next.js 16 App Router (Turbopack)
- Language: TypeScript
- Styling: Tailwind CSS
- Animation: GSAP (CSS sticky only — ALDRIG ScrollTrigger pin), Lottie, Three.js
- E-commerce: Shopify Headless (infinity-puzzle-2.myshopify.com)
- Email: Shopify Email (installerat), Klaviyo (installerat men ej primärt)
- Routing: next-intl (locale-based: /en/, /sv/)
- Deployment: Vercel
- Domain: infinity-puzzle.com (Loopia DNS → Vercel, A-record: 216.198.79.1)

## Repository
- GitHub: leovickman-eng/infinity-puzzles-web
- Local path: /Users/leovickman/Documents/InfinityPuzzles/web/

## Collaborators
- Leo (owner), Oscar (domain), Erik (collaborator)

## Key Files
- Navbar: components/header/HeaderClient.tsx (ssr: false)
- Formation animation s2: components/formation-morph/FormationMorph.tsx
- Wild Network: app/[locale]/wild_network/ (ssr: false)
- Brand page: app/[locale]/brand/page.tsx (password: Spagetti!23)
- Signup page: app/[locale]/signup/page.tsx
- Signup API: app/api/subscribe/route.ts
- Lottie: public/lottie/test.json
- Puzzle pieces (WebP): public/formations/GASP/F1/
- Logo SVG: public/images/SVG/Logga_svart-02.svg
- Menu icon: public/images/SVG/Menu.svg

## Fonts
- Trykker — brand page, password gate
- Nakone — menu, cue text
- Brianne — dekorativ

## Brand Colors
#ae84ea, #544550, #f9ece4, #e81317, #05375a, #533f7e, #f6b8bd, #530100, #dac1ff, #16ade6, #57d494, #fb8f02, #fdf07d, #0d8137, #7ed6cd, #1C1917

## Formation Morph (s2) — KRITISKT
- Canvas: 550x1265px, CSS-skalat
- Bilder: /formations/GASP/F1/1_X.webp (F1), 2_X.webp (F2)
- ALDRIG GSAP ScrollTrigger pin — orsakar removeChild-krasch. Använd CSS sticky.
- Map-nycklar måste matcha src exakt — ändra aldrig F1_SRCS/F2_SEQ utan att uppdatera renderCanvas

## Hydration / SSR
- Aldrig SSR för komponenter med document/window/createPortal
- Header: dynamic(() => import('./HeaderClient'), { ssr: false, loading: () => null })
- Wild Network: dynamic(() => import('./WildNetworkClient'), { ssr: false })

## Navigation
- Infinity knot-ikon (övre vänster) = hemknapp (/)
- ... knapp = dropdown-meny med createPortal till document.body
- Länkar: Characters, Story (#story), Shop (#shop), Wild Network, språkväxlare

## Shopify Admin API (fungerar)
- Endpoint: https://infinity-puzzle-2.myshopify.com/admin/api/2026-04/graphql.json
- Token genereras dynamiskt via client credentials (går ut 24h)
- Används i app/api/subscribe/route.ts

## Shopify Storefront API (låst)
- Online Store channel är låst — kontakta Shopify support från rätt butik

## Environment Variables (.env.local + Vercel)
SHOPIFY_STORE_DOMAIN=infinity-puzzle-2.myshopify.com
SHOPIFY_ADMIN_ACCESS_TOKEN=<see Vercel env>
SHOPIFY_CLIENT_ID=<see Vercel env>
SHOPIFY_CLIENT_SECRET=<see Vercel env>

## Signup & Email
- Signup på /en/signup och /sv/signup
- Kunder skapas i Shopify med acceptsMarketing: true
- 205 gamla kunder importerade från infinitypuzzles.se
- Nyhetsbrev via Shopify Email: Marketing → Emails

## Wild Network
- Fullskärms canvas med 19 karaktärer som noder
- Tillbaka-knapp: infinity knot, position: fixed, z-index: 50

## Karaktärer
- 19 st på Cloudinary: res.cloudinary.com/dk3ftfygx/image/upload/infinitypuzzles/karaktarer/karaktar_N.png
- URLs i characters.json
- Framtid: Neo4j för karaktärsrelationer och spellogik
