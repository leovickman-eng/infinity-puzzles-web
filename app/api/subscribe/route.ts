import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, consent } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    if (!consent) {
      return NextResponse.json({ error: 'Consent required' }, { status: 400 });
    }

    const apiKey = process.env.OMNISEND_API_KEY;
    if (!apiKey) {
      console.error('OMNISEND_API_KEY not set');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const res = await fetch('https://api.omnisend.com/v3/contacts', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        status: 'subscribed',
        sendWelcomeEmail: true,
        channels: {
          email: {
            status: 'subscribed',
            statusDate: new Date().toISOString(),
          },
        },
        consents: [
          {
            source: 'website-form',
            createdAt: new Date().toISOString(),
          },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error('Omnisend error:', res.status, body);
      // 409 = already subscribed — treat as success
      if (res.status === 409) {
        return NextResponse.json({ ok: true });
      }
      return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Subscribe route error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
