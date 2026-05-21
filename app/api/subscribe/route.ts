import { NextRequest, NextResponse } from "next/server";

const CUSTOMER_CREATE = `
  mutation customerCreate($email: String!) {
    customerCreate(input: { email: $email }) {
      customer {
        id
        email
      }
      userErrors {
        field
        message
      }
    }
  }
`;

async function fetchAccessToken(): Promise<string> {
  const res = await fetch(
    "https://infinity-puzzle-2.myshopify.com/admin/oauth/access_token",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_CLIENT_ID,
        client_secret: process.env.SHOPIFY_CLIENT_SECRET,
        grant_type: "client_credentials",
      }),
    }
  );
  if (!res.ok) {
    throw new Error(`Token fetch failed: ${res.status}`);
  }
  const data = await res.json();
  return data.access_token as string;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = body?.email;

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  if (!domain || !process.env.SHOPIFY_CLIENT_ID || !process.env.SHOPIFY_CLIENT_SECRET) {
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  let token: string;
  try {
    token = await fetchAccessToken();
  } catch (err) {
    console.error("Shopify token error:", err);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }

  const res = await fetch(`https://${domain}/admin/api/2026-04/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query: CUSTOMER_CREATE, variables: { email } }),
  });

  if (!res.ok) {
    console.error("Shopify subscribe HTTP error:", res.status);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }

  const data = await res.json();
  const errors = data?.data?.customerCreate?.userErrors as
    | { field: string; message: string }[]
    | undefined;

  if (!errors || errors.length === 0) {
    return NextResponse.json({ success: true });
  }

  // Email already taken — treat as success
  if (errors.some((e) => e.message.toLowerCase().includes("taken"))) {
    return NextResponse.json({ success: true });
  }

  console.error("Shopify subscribe userErrors:", JSON.stringify(errors));
  return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
}
