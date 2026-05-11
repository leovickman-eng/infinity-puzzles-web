import { NextRequest, NextResponse } from 'next/server';
import { createCart, addToCart, updateCartLine, removeFromCart, getCart } from '@/lib/shopify';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cartId = searchParams.get('cartId');
  if (!cartId) return NextResponse.json({ cart: null });

  try {
    const cart = await getCart(cartId);
    return NextResponse.json({ cart });
  } catch {
    return NextResponse.json({ cart: null });
  }
}

export async function POST(req: NextRequest) {
  const { variantId, quantity, cartId } = await req.json();

  try {
    const cart = cartId
      ? await addToCart(cartId, variantId, quantity)
      : await createCart(variantId, quantity);
    return NextResponse.json({ cart });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Cart error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const { cartId, lineId, quantity } = await req.json();
  try {
    const cart =
      quantity === 0
        ? await removeFromCart(cartId, [lineId])
        : await updateCartLine(cartId, lineId, quantity);
    return NextResponse.json({ cart });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Cart error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { cartId, lineId } = await req.json();
  try {
    const cart = await removeFromCart(cartId, [lineId]);
    return NextResponse.json({ cart });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Cart error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
