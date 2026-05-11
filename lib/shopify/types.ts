export type ShopifyImage = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

export type ShopifyMoneyV2 = {
  amount: string;
  currencyCode: string;
};

export type ShopifyProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
  price: ShopifyMoneyV2;
  compareAtPrice: ShopifyMoneyV2 | null;
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  featuredImage: ShopifyImage | null;
  images: { nodes: ShopifyImage[] };
  priceRange: {
    minVariantPrice: ShopifyMoneyV2;
    maxVariantPrice: ShopifyMoneyV2;
  };
  variants: { nodes: ShopifyProductVariant[] };
  availableForSale: boolean;
};

export type ShopifyCartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    selectedOptions: { name: string; value: string }[];
    product: { title: string; handle: string; featuredImage: ShopifyImage | null };
    price: ShopifyMoneyV2;
  };
  cost: {
    totalAmount: ShopifyMoneyV2;
  };
};

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  cost: {
    subtotalAmount: ShopifyMoneyV2;
    totalAmount: ShopifyMoneyV2;
    totalTaxAmount: ShopifyMoneyV2 | null;
  };
  lines: { nodes: ShopifyCartLine[] };
  totalQuantity: number;
};
