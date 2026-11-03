"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { CartProvider, useCart } from "@/context/CartContext";
import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";
import Footer from "./Footer";
import MobileBottomNav from "./MobileBottomNav";
import CartDrawer from "./CartDrawer";
import QuickCheckoutModal from "./QuickCheckoutModal";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const {
    cart,
    cartCount,
    isCartOpen,
    openCart,
    closeCart,
    updateQuantity,
    removeFromCart,
    quickCheckoutProduct,
    quickCheckoutSize,
    quickCheckoutColor,
    closeQuickCheckout,
  } = useCart();

  // FIX: Page opens from the bottom bug fix -> Always restore scroll to top instantly on route change
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    };

    scrollToTop();
    // Fire on next animation frame and 60ms delay to catch async hydration
    requestAnimationFrame(scrollToTop);
    const timer = setTimeout(scrollToTop, 60);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-pink selection:text-white">
      {!isAdmin && <AnnouncementBar />}
      {!isAdmin && <Header onOpenCart={openCart} cartCount={cartCount} />}

      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      {!isAdmin && <Footer />}
      {!isAdmin && <MobileBottomNav onOpenCart={openCart} cartCount={cartCount} />}

      {/* Global Slide-out Cart Drawer */}
      {!isAdmin && (
        <CartDrawer
          isOpen={isCartOpen}
          onClose={closeCart}
          items={cart}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onProceedToCheckout={() => {
            closeCart();
            if (cart.length > 0) {
              // Open checkout for first item or redirect
              window.location.href = "/checkout";
            }
          }}
        />
      )}

      {/* Global Quick Checkout Modal */}
      {quickCheckoutProduct && (
        <QuickCheckoutModal
          isOpen={!!quickCheckoutProduct}
          onClose={closeQuickCheckout}
          product={quickCheckoutProduct}
          selectedSize={quickCheckoutSize}
          selectedColor={quickCheckoutColor}
        />
      )}
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <LayoutContent>{children}</LayoutContent>
    </CartProvider>
  );
}
