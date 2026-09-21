'use client';

import { useEffect, useState } from 'react';
import type { ShopifyProduct } from '@/lib/shopify/types';
import ProductCard from './ProductCard';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

// Placeholder product shown when Shopify is not yet configured
const PLACEHOLDER_PRODUCT: ShopifyProduct = {
  id: 'placeholder',
  handle: 'infinity-puzzles-wild-19-characters-infinite-formations',
  title: 'Infinity Puzzles Wild',
  description:
    'The first chapter. 19 unique wooden characters with infinite formation possibilities. Precision-crafted from premium wood. Includes the Infinity app for formation recognition.',
  descriptionHtml:
    '<p>The first chapter. 19 unique wooden characters with infinite formation possibilities.</p>',
  availableForSale: true,
  featuredImage: null,
  images: { nodes: [] },
  priceRange: {
    minVariantPrice: { amount: '349.00', currencyCode: 'SEK' },
    maxVariantPrice: { amount: '349.00', currencyCode: 'SEK' },
  },
  variants: {
    nodes: [
      {
        id: 'placeholder-variant',
        title: 'Default',
        availableForSale: true,
        selectedOptions: [],
        price: { amount: '349.00', currencyCode: 'SEK' },
        compareAtPrice: null,
      },
    ],
  },
};

export default function ProductSection() {
  const t = useTranslations('shop');
  const params = useParams();
  const locale = (params?.locale as string) ?? 'sv';
  const lang = locale.toUpperCase(); // 'SV' or 'EN'
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products?handle=infinity-puzzles-wild-19-characters-infinite-formations&lang=${lang}`)
      .then((r) => r.json())
      .then((data) => setProduct(data.product ?? PLACEHOLDER_PRODUCT))
      .catch(() => setProduct(PLACEHOLDER_PRODUCT))
      .finally(() => setLoading(false));
  }, [lang]);

  if (loading) {
    return (
      <div className="text-center py-16 font-body text-foreground/30 text-sm">
        {t('loading')}
      </div>
    );
  }

  if (!product) return null;

  return <ProductCard product={product} />;
}
