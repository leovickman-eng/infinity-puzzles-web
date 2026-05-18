'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { ShopifyProduct } from '@/lib/shopify/types';
import { formatMoney } from '@/lib/shopify';
import { useCart } from './CartContext';

type Props = {
  product: ShopifyProduct;
};

export default function ProductCard({ product }: Props) {
  const t = useTranslations('shop');
  const { addItem, isLoading } = useCart();
  const [adding, setAdding] = useState(false);

  const defaultVariant = product.variants.nodes[0];
  const price = defaultVariant?.price;
  const available = defaultVariant?.availableForSale ?? false;

  const handleAddToCart = async () => {
    if (!defaultVariant || !available || adding) return;
    setAdding(true);
    try {
      await addItem(defaultVariant.id);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-10 items-center max-w-4xl mx-auto">
      {/* Image */}
      <div className="w-full md:w-1/2 aspect-square relative rounded-3xl overflow-hidden bg-stone-100">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
            <span className="font-display text-stone-400 text-lg">No image</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="w-full md:w-1/2 flex flex-col gap-6">
        <div>
          <p className="font-display text-sm uppercase tracking-widest text-primary mb-2">
            Wild Collection
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight">
            {product.title}
          </h2>
        </div>

        {price && (
          <p className="font-display text-2xl font-semibold text-foreground">
            {formatMoney(price.amount, price.currencyCode)}
          </p>
        )}

        <p className="font-display text-foreground/60 leading-relaxed">
          {product.description}
        </p>

        <button
          onClick={handleAddToCart}
          disabled={!available || adding || isLoading}
          className="
            inline-flex items-center justify-center
            px-8 py-4 rounded-full
            font-display font-semibold text-white text-base
            bg-primary hover:bg-primary-dark
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            shadow-lg shadow-primary/30
            hover:shadow-xl hover:shadow-primary/40
            hover:-translate-y-0.5
            active:translate-y-0
          "
        >
          {!available
            ? t('soldOut')
            : adding
            ? t('loading')
            : t('addToCart')}
        </button>
      </div>
    </div>
  );
}
