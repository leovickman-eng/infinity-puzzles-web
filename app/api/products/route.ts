import { NextRequest, NextResponse } from 'next/server';
import { getProductByHandle, getAllProducts } from '@/lib/shopify';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const handle = searchParams.get('handle');

  console.log('[/api/products] SHOPIFY_STORE_DOMAIN:', process.env.SHOPIFY_STORE_DOMAIN);
console.log('[/api/products] token present:', !!process.env.SHOPIFY_STOREFRONT_TOKEN);
  console.log('[/api/products] handle:', handle);

  try {
    if (handle) {
      const product = await getProductByHandle(handle);
      console.log('[/api/products] product:', product ? product.title : null);
      return NextResponse.json({ product });
    }

    const products = await getAllProducts(20);
    console.log('[/api/products] products count:', products.length);
    return NextResponse.json({ products });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[/api/products] error:', message);
    return NextResponse.json({ product: null, error: message }, { status: 200 });
  }
}
