import type { ShopifyCart, ShopifyProduct } from './types';
import {
  CREATE_CART,
  ADD_TO_CART,
  UPDATE_CART,
  REMOVE_FROM_CART,
  GET_CART,
  GET_PRODUCT_BY_HANDLE,
  GET_ALL_PRODUCTS,
} from './queries';

const domain = process.env.SHOPIFY_STORE_DOMAIN!;
const token = process.env.SHOPIFY_STOREFRONT_TOKEN!;
const endpoint = `https://${domain}/api/2024-01/graphql.json`;

async function storefront<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }

  return json.data as T;
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await storefront<{ product: ShopifyProduct | null }>(
    GET_PRODUCT_BY_HANDLE,
    { handle }
  );
  return data.product;
}

export async function getAllProducts(first = 20): Promise<ShopifyProduct[]> {
  const data = await storefront<{ products: { nodes: ShopifyProduct[] } }>(
    GET_ALL_PRODUCTS,
    { first }
  );
  return data.products.nodes;
}

export async function createCart(
  variantId: string,
  quantity = 1
): Promise<ShopifyCart> {
  const data = await storefront<{ cartCreate: { cart: ShopifyCart } }>(CREATE_CART, {
    lines: [{ merchandiseId: variantId, quantity }],
  });
  return data.cartCreate.cart;
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity = 1
): Promise<ShopifyCart> {
  const data = await storefront<{ cartLinesAdd: { cart: ShopifyCart } }>(ADD_TO_CART, {
    cartId,
    lines: [{ merchandiseId: variantId, quantity }],
  });
  return data.cartLinesAdd.cart;
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ShopifyCart> {
  const data = await storefront<{ cartLinesUpdate: { cart: ShopifyCart } }>(UPDATE_CART, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });
  return data.cartLinesUpdate.cart;
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<ShopifyCart> {
  const data = await storefront<{ cartLinesRemove: { cart: ShopifyCart } }>(
    REMOVE_FROM_CART,
    { cartId, lineIds }
  );
  return data.cartLinesRemove.cart;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  try {
    const data = await storefront<{ cart: ShopifyCart | null }>(GET_CART, { cartId });
    return data.cart;
  } catch {
    return null;
  }
}

export function formatMoney(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat('en-SE', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));
}
