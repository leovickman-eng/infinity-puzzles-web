import { NextRequest, NextResponse } from 'next/server';
import { getProductByHandle, getAllProducts } from '@/lib/shopify';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const handle = searchParams.get('handle');

  try {
    if (handle) {
      const product = await getProductByHandle(handle);
      return NextResponse.json({ product });
    }

    const products = await getAllProducts(20);
    return NextResponse.json({ products });
  } catch (err) {
    // Return null product so the client falls back to placeholder
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ product: null, error: message }, { status: 200 });
  }
}
