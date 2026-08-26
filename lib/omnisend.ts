// Omnisend event tracking helpers
// Brand ID: 6a465f89cf34331db96b8ad4
// Docs: https://developers.omnisend.com

type OmnisendLineItem = {
  productID: string;
  productTitle: string;
  productPrice: number;
  productQuantity: number;
  productImageURL?: string;
  productURL?: string;
};

type CartPayload = {
  cartID: string;
  value: number;
  currency: string;
  abandonedCheckoutURL?: string;
  lineItems: OmnisendLineItem[];
};

function push(event: 'added product to cart' | 'started checkout', cart: CartPayload) {
  if (typeof window === 'undefined') return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  w.omnisend = w.omnisend || [];
  w.omnisend.push(['track', event, { origin: 'api', properties: cart }]);
}

export function trackAddedToCart(cart: CartPayload) {
  push('added product to cart', cart);
}

export function trackStartedCheckout(cart: CartPayload) {
  push('started checkout', cart);
}

export type { CartPayload, OmnisendLineItem };
