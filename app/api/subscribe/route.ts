import { NextRequest, NextResponse } from 'next/server';

const KLAVIYO_PRIVATE_KEY = process.env.KLAVIYO_PRIVATE_KEY ?? '';
const KLAVIYO_LIST_ID = process.env.KLAVIYO_LIST_ID ?? 'LIST_ID_PLACEHOLDER';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = body?.email;

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  if (!KLAVIYO_PRIVATE_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  const res = await fetch('https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`,
      'revision': '2024-02-15',
    },
    body: JSON.stringify({
      data: {
        type: 'profile-subscription-bulk-create-job',
        attributes: {
          profiles: {
            data: [{
              type: 'profile',
              attributes: {
                email,
                subscriptions: {
                  email: { marketing: { consent: 'SUBSCRIBED' } },
                },
              },
            }],
          },
        },
        relationships: {
          list: { data: { type: 'list', id: KLAVIYO_LIST_ID } },
        },
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Klaviyo error:', text);
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
