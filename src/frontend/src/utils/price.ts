import type { Price } from '../backend';

/**
 * Format a price in Indian Rupees (₹)
 */
export function formatINR(amount: number): string {
  return `₹${amount.toFixed(0)}`;
}

/**
 * Check if a product has a discount
 */
export function hasDiscount(price: Price): boolean {
  return price.salePrice !== undefined && price.salePrice !== null;
}

/**
 * Get the display price (sale price if available, otherwise list price)
 */
export function getDisplayPrice(price: Price): number {
  return hasDiscount(price) ? price.salePrice! : price.listPrice;
}

/**
 * Calculate discount percentage
 */
export function getDiscountPercentage(price: Price): number {
  if (!hasDiscount(price)) return 0;
  return Math.round(((price.listPrice - price.salePrice!) / price.listPrice) * 100);
}

/**
 * Render price with discount styling
 */
export interface PriceDisplayProps {
  price: Price;
  className?: string;
}

export function renderPriceDisplay(price: Price): {
  displayPrice: string;
  originalPrice?: string;
  hasDiscount: boolean;
  discountPercentage?: number;
} {
  const discount = hasDiscount(price);
  
  return {
    displayPrice: formatINR(getDisplayPrice(price)),
    originalPrice: discount ? formatINR(price.listPrice) : undefined,
    hasDiscount: discount,
    discountPercentage: discount ? getDiscountPercentage(price) : undefined,
  };
}
