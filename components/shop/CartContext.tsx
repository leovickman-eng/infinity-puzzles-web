'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { ShopifyCart } from '@/lib/shopify/types';

type CartState = {
  cart: ShopifyCart | null;
  isOpen: boolean;
  isLoading: boolean;
};

type CartAction =
  | { type: 'SET_CART'; cart: ShopifyCart | null }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' };

const CART_ID_KEY = 'shopify_cart_id';

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, cart: action.cart };
    case 'SET_LOADING':
      return { ...state, isLoading: action.isLoading };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

type CartContextValue = CartState & {
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    cart: null,
    isOpen: false,
    isLoading: false,
  });

  const getStoredCartId = () =>
    typeof window !== 'undefined' ? localStorage.getItem(CART_ID_KEY) : null;

  const storeCartId = (id: string) => {
    if (typeof window !== 'undefined') localStorage.setItem(CART_ID_KEY, id);
  };

  useEffect(() => {
    const cartId = getStoredCartId();
    if (!cartId) return;

    dispatch({ type: 'SET_LOADING', isLoading: true });
    fetch(`/api/cart?cartId=${cartId}`)
      .then((r) => r.json())
      .then((data) => dispatch({ type: 'SET_CART', cart: data.cart }))
      .catch(() => localStorage.removeItem(CART_ID_KEY))
      .finally(() => dispatch({ type: 'SET_LOADING', isLoading: false }));
  }, []);

  const addItem = useCallback(async (variantId: string, quantity = 1) => {
    dispatch({ type: 'SET_LOADING', isLoading: true });
    try {
      const cartId = getStoredCartId();
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId, quantity, cartId }),
      });
      const data = await res.json();
      storeCartId(data.cart.id);
      dispatch({ type: 'SET_CART', cart: data.cart });
      dispatch({ type: 'OPEN_CART' });
    } finally {
      dispatch({ type: 'SET_LOADING', isLoading: false });
    }
  }, []);

  const updateItem = useCallback(async (lineId: string, quantity: number) => {
    const cartId = getStoredCartId();
    if (!cartId) return;
    dispatch({ type: 'SET_LOADING', isLoading: true });
    try {
      const res = await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId, lineId, quantity }),
      });
      const data = await res.json();
      dispatch({ type: 'SET_CART', cart: data.cart });
    } finally {
      dispatch({ type: 'SET_LOADING', isLoading: false });
    }
  }, []);

  const removeItem = useCallback(async (lineId: string) => {
    const cartId = getStoredCartId();
    if (!cartId) return;
    dispatch({ type: 'SET_LOADING', isLoading: true });
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId, lineId }),
      });
      const data = await res.json();
      dispatch({ type: 'SET_CART', cart: data.cart });
    } finally {
      dispatch({ type: 'SET_LOADING', isLoading: false });
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        updateItem,
        removeItem,
        openCart: () => dispatch({ type: 'OPEN_CART' }),
        closeCart: () => dispatch({ type: 'CLOSE_CART' }),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
