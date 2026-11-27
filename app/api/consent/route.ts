/**
 * Sets Shopify's _tracking_consent cookie directly on .infinity-puzzle.com.
 *
 * The Shopify Customer Privacy API (consent-tracking-api.js) fails in headless
 * setups because it tries to reach checkout.infinity-puzzle.com's GraphQL endpoint
 * which returns 401. Instead, we set the cookie ourselves in the correct format
 * that Shopify's checkout custom pixel reads.
 *
 * Cookie format: {"con":{"CMP":{"a":1,"m":1,"p":1,"s":1}}}
 *   a = analytics, m = marketing, p = preferences, s = sale_of_data  (0 or 1)
 */
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { granted } = await req.json() as { granted: boolean };
  const bit = granted ? 1 : 0;

  const consentValue = JSON.stringify({
    con: { CMP: { a: bit, m: bit, p: bit, s: bit } },
  });

  // Max-Age 1 year in seconds
  const maxAge = 60 * 60 * 24 * 365;

  const res = NextResponse.json({ ok: true });

  res.headers.set(
    'Set-Cookie',
    `_tracking_consent=${encodeURIComponent(consentValue)}; Domain=.infinity-puzzle.com; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure`,
  );

  return res;
}
