'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useCart } from './CartContext';
import { formatMoney } from '@/lib/shopify';

export default function CartDrawer() {
  const t = useTranslations('shop');
  const { cart, isOpen, isLoading, closeCart, updateItem, removeItem } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-foreground/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-foreground/10">
          <h2 className="font-display text-xl font-bold text-foreground">{t('checkout')}</h2>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-foreground/5 transition-colors"
            aria-label="Close cart"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {!cart || cart.lines.nodes.length === 0 ? (
            <p className="font-body text-foreground/50 text-center mt-12">{t('cartEmpty')}</p>
          ) : (
            <ul className="flex flex-col gap-6">
              {cart.lines.nodes.map((line) => (
                <li key={line.id} className="flex gap-4">
                  <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                    {line.merchandise.product.featuredImage && (
                      <Image
                        src={line.merchandise.product.featuredImage.url}
                        alt={line.merchandise.product.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-foreground text-sm truncate">
                      {line.merchandise.product.title}
                    </p>
                    <p className="font-body text-foreground/50 text-xs mt-0.5">
                      {formatMoney(line.cost.totalAmount.amount, line.cost.totalAmount.currencyCode)}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateItem(line.id, Math.max(0, line.quantity - 1))}
                        className="w-6 h-6 rounded-full border border-foreground/20 flex items-center justify-center text-sm hover:bg-foreground/5"
                        disabled={isLoading}
                      >−</button>
                      <span className="font-body text-sm w-4 text-center">{line.quantity}</span>
                      <button
                        onClick={() => updateItem(line.id, line.quantity + 1)}
                        className="w-6 h-6 rounded-full border border-foreground/20 flex items-center justify-center text-sm hover:bg-foreground/5"
                        disabled={isLoading}
                      >+</button>
                      <button
                        onClick={() => removeItem(line.id)}
                        className="ml-auto text-foreground/30 hover:text-foreground/70 transition-colors text-xs font-body"
                        disabled={isLoading}
                      >
                        {t('remove')}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart && cart.lines.nodes.length > 0 && (
          <div className="p-6 border-t border-foreground/10 flex flex-col gap-4">
            <div className="flex justify-between font-body font-semibold text-foreground">
              <span>Total</span>
              <span>
                {formatMoney(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode)}
              </span>
            </div>
            <a
              href={cart.checkoutUrl}
              className="
                block text-center
                px-8 py-4 rounded-full
                font-body font-semibold text-white
                bg-primary hover:bg-primary-dark
                transition-colors duration-200
                shadow-lg shadow-primary/30
              "
            >
              {t('checkout')}
            </a>
          </div>
        )}
      </div>
    </>
  );
}
