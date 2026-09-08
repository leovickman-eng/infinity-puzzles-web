import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, consent } = await req.json();

    if (!email || !consent) {
      return NextResponse.json({ error: 'Missing email or consent' }, { status: 400 });
    }

    const apiKey = process.env.OMNISEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const res = await fetch('https://api.omnisend.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
      },
      body: JSON.stringify({
        email,
        status: 'subscribed',
        statusDate: new Date().toISOString(),
        sendWelcomeEmail: true,
        tags: ['website-signup'],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Omnisend error:', err);
      return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Subscribe error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
