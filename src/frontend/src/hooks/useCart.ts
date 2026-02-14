import { useState, useEffect } from 'react';
import type { Product, WeightVariant, FlavorVariant, Price } from '../backend';

export interface CartItem {
  productId: bigint;
  productName: string;
  productImage: string;
  quantity: number;
  price: Price;
  weightVariant?: WeightVariant;
  flavorVariant?: FlavorVariant;
  variantLabel?: string;
}

const STORAGE_KEY = 'shopping_cart';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert productId strings back to bigint
        const restored = parsed.map((item: any) => ({
          ...item,
          productId: BigInt(item.productId),
        }));
        setItems(restored);
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    }
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    // Convert bigint to string for JSON serialization
    const serializable = items.map(item => ({
      ...item,
      productId: item.productId.toString(),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  }, [items]);

  const addItem = (
    product: Product,
    quantity: number,
    price: Price,
    variantLabel?: string,
    weightVariant?: WeightVariant,
    flavorVariant?: FlavorVariant
  ) => {
    setItems(current => {
      // Check if item with same product and variant already exists
      const existingIndex = current.findIndex(
        item =>
          item.productId === product.id &&
          item.variantLabel === variantLabel
      );

      if (existingIndex >= 0) {
        // Update quantity
        const updated = [...current];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      // Add new item
      return [
        ...current,
        {
          productId: product.id,
          productName: product.name,
          productImage: product.image,
          quantity,
          price,
          weightVariant,
          flavorVariant,
          variantLabel,
        },
      ];
    });
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(index);
      return;
    }

    setItems(current => {
      const updated = [...current];
      updated[index] = { ...updated[index], quantity };
      return updated;
    });
  };

  const removeItem = (index: number) => {
    setItems(current => current.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const getTotal = () => {
    return items.reduce((sum, item) => {
      const price = item.price.salePrice ?? item.price.listPrice;
      return sum + price * item.quantity;
    }, 0);
  };

  const getItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getTotal,
    getItemCount,
  };
}
