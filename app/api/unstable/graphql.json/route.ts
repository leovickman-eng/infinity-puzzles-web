/**
 * Proxy for Shopify's Storefront API (unstable version).
 *
 * Shopify's consent-tracking-api.js calls window.location.origin + '/api/unstable/graphql.json'
 * to persist visitor consent server-side. Since www.infinity-puzzle.com is a headless Next.js
 * app (not a Shopify theme), we proxy the request to Shopify ourselves.
 */
import { NextRequest, NextResponse } from 'next/server';

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN!;
const SHOPIFY_ENDPOINT = `https://${SHOPIFY_DOMAIN}/api/unstable/graphql.json`;

export async function POST(req: NextRequest) {
  const body = await req.text();

  // Prefer the token the client script sends (from setTrackingConsent's storefrontAccessToken param),
  // fall back to the server env var so the proxy works even without a client-provided token.
  const clientToken = req.headers.get('x-shopify-storefront-access-token');

  const res = await fetch(SHOPIFY_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': req.headers.get('content-type') || 'application/json',
      'X-Shopify-Storefront-Access-Token': clientToken || SHOPIFY_STOREFRONT_TOKEN,
    },
    body,
  });

  const data = await res.text();

  return new NextResponse(data, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('content-type') || 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Shopify-Storefront-Access-Token',
    },
  });
}
