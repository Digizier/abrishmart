"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, OrderItem } from "@/lib/types";

interface CartContextType {
  cart: OrderItem[];
  cartCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, size?: string, color?: string, quantity?: number) => void;
  updateQuantity: (id: string | number, qty: number) => void;
  removeFromCart: (id: string | number) => void;
  clearCart: () => void;
  quickCheckoutProduct: Product | null;
  quickCheckoutSize?: string;
  quickCheckoutColor?: string;
  openQuickCheckout: (product: Product, size?: string, color?: string) => void;
  closeQuickCheckout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickCheckoutProduct, setQuickCheckoutProduct] = useState<Product | null>(null);
  const [quickCheckoutSize, setQuickCheckoutSize] = useState<string | undefined>();
  const [quickCheckoutColor, setQuickCheckoutColor] = useState<string | undefined>();

  // Load cart from session/local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("abm_cart");
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save cart
  useEffect(() => {
    try {
      localStorage.setItem("abm_cart", JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product: Product, size?: string, color?: string, quantity: number = 1) => {
    const itemKey = `${product.id}-${size || "std"}-${color || "std"}`;
    setCart((prev) => {
      const existing = prev.find((i) => i.id === itemKey);
      if (existing) {
        return prev.map((i) => (i.id === itemKey ? { ...i, quantity: i.quantity + quantity } : i));
      }
      const newItem: OrderItem = {
        id: itemKey,
        title: product.title,
        price: product.price,
        quantity,
        selected_size: size,
        selected_color: color,
        thumbnail_url: product.thumbnail_url,
        product_id: product.id,
        hhc_product_id: product.hhc_product_id,
        hhc_store_id: product.hhc_store_id,
      };
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string | number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item)));
  };

  const removeFromCart = (id: string | number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const openQuickCheckout = (product: Product, size?: string, color?: string) => {
    setQuickCheckoutProduct(product);
    setQuickCheckoutSize(size);
    setQuickCheckoutColor(color);
  };

  const closeQuickCheckout = () => {
    setQuickCheckoutProduct(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        quickCheckoutProduct,
        quickCheckoutSize,
        quickCheckoutColor,
        openQuickCheckout,
        closeQuickCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
