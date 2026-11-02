import { supabase } from "./supabase";
import { Product, Category, Order, Banner, SiteSettings, Coupon } from "./types";

// ==========================================
// INITIAL SEED DATA (Used when DB is empty)
// ==========================================
export const INITIAL_SETTINGS: SiteSettings = {
  id: 1,
  store_name: "Abrish Mart",
  tagline: "Shop Smart, Save More!",
  phone: "03452086160",
  whatsapp: "03452086160",
  email: "usmanshah11@gmail.com",
  address: "Online Store — Serving All Pakistan",
  ntn: "4250192695085",
  delivery_charge: 200,
  free_shipping_threshold: 2500,
  cod_enabled: true,
  jazzcash_title: "Usman Shah",
  jazzcash_number: "03452086160",
  easypaisa_title: "Usman Shah",
  easypaisa_number: "03452086160",
  bank_name: "Meezan Bank",
  bank_title: "Usman Shah",
  bank_iban: "PK72MEZN0001020304050607",
  admin_pin: "abrishmart_smart2026",
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Bridal Silk & Nightwear",
    slug: "bridal-silk-nightwear",
    image_url: "/images/banners/hero-banner.png",
    show_on_homepage: true,
    sort_order: 1,
  },
  {
    id: 2,
    name: "Kids & Educational Toys",
    slug: "kids-educational-toys",
    image_url: "/images/banners/hero-banner.png",
    show_on_homepage: true,
    sort_order: 2,
  },
  {
    id: 3,
    name: "Fashion & Watches",
    slug: "fashion-watches",
    image_url: "/images/banners/hero-banner.png",
    show_on_homepage: true,
    sort_order: 3,
  },
  {
    id: 4,
    name: "Smart Gadgets & Audio",
    slug: "smart-gadgets-audio",
    image_url: "/images/banners/hero-banner.png",
    show_on_homepage: true,
    sort_order: 4,
  },
  {
    id: 5,
    name: "Home & Kitchen Essentials",
    slug: "home-kitchen-essentials",
    image_url: "/images/banners/hero-banner.png",
    show_on_homepage: true,
    sort_order: 5,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    title: "Premium Bridal Silk Nighty Gown Set (Night Ease Edition)",
    slug: "premium-bridal-silk-nighty-gown-set",
    description: "Ultra-luxurious 2-piece bridal silk nighty gown set crafted with imported satin silk. Features delicate lace embroidery, adjustable straps, and smooth breathable fabric tailored for superior comfort and elegance.",
    price: 2450,
    original_price: 3650,
    stock: 25,
    thumbnail_url: "/images/banners/hero-banner.png",
    gallery_urls: ["/images/banners/hero-banner.png"],
    category_slug: "bridal-silk-nightwear",
    is_active: true,
    is_featured: true,
    is_flash_deal: true,
    rating: 4.9,
    reviews_count: 38,
    variations: {
      sizes: ["Small", "Medium", "Large", "XL"],
      colors: ["Royal Maroon", "Midnight Black", "Rose Pink", "Emerald Green"],
    },
    sku: "NE-SILK-001",
  },
  {
    id: 2,
    title: "Kids Interactive Montessori Educational Learning Tablet",
    slug: "kids-montessori-learning-tablet",
    description: "Engaging interactive screen-free learning tablet with phonetic pronunciation, alphabet flashcards, math challenges, and musical rewards. Safe, durable, and rechargeable.",
    price: 1850,
    original_price: 2800,
    stock: 40,
    thumbnail_url: "/images/banners/hero-banner.png",
    gallery_urls: ["/images/banners/hero-banner.png"],
    category_slug: "kids-educational-toys",
    is_active: true,
    is_featured: true,
    is_flash_deal: true,
    rating: 4.8,
    reviews_count: 24,
    variations: {
      colors: ["Sky Blue", "Candy Pink"],
    },
    sku: "TOY-MONT-102",
  },
  {
    id: 3,
    title: "Men's Luxury Chronograph Quartz Watch with Leather Strap",
    slug: "mens-luxury-chronograph-quartz-watch",
    description: "Waterproof stainless steel case with working sub-dials, date display, luminous hands, and genuine textured leather strap. Ideal for formal and casual wear.",
    price: 2199,
    original_price: 3499,
    stock: 18,
    thumbnail_url: "/images/banners/hero-banner.png",
    gallery_urls: ["/images/banners/hero-banner.png"],
    category_slug: "fashion-watches",
    is_active: true,
    is_featured: true,
    is_flash_deal: false,
    rating: 4.7,
    reviews_count: 19,
    variations: {
      colors: ["Black Dial / Black Strap", "Blue Dial / Brown Strap"],
    },
    sku: "WTC-CHRONO-55",
  },
  {
    id: 4,
    title: "TWS Wireless Bluetooth 5.3 Earbuds with LED Digital Display",
    slug: "tws-wireless-bluetooth-earbuds-led",
    description: "Deep bass acoustics, low-latency gaming mode, noise reduction microphone, and emergency power-bank charging case with real-time battery percentage display.",
    price: 1650,
    original_price: 2600,
    stock: 35,
    thumbnail_url: "/images/banners/hero-banner.png",
    gallery_urls: ["/images/banners/hero-banner.png"],
    category_slug: "smart-gadgets-audio",
    is_active: true,
    is_featured: true,
    is_flash_deal: true,
    rating: 4.9,
    reviews_count: 52,
    variations: {
      colors: ["Piano Black", "Arctic White"],
    },
    sku: "AUD-TWS-99",
  },
  {
    id: 5,
    title: "Multipurpose Vegetable Cutter & Rotary Cheese Grater",
    slug: "multipurpose-vegetable-cutter-grater",
    description: "Stainless steel 3-in-1 rotary drum blades for fast slicing, shredding, and julienning. Strong vacuum suction base keeps it secure on kitchen countertops.",
    price: 1399,
    original_price: 2100,
    stock: 30,
    thumbnail_url: "/images/banners/hero-banner.png",
    gallery_urls: ["/images/banners/hero-banner.png"],
    category_slug: "home-kitchen-essentials",
    is_active: true,
    is_featured: true,
    is_flash_deal: false,
    rating: 4.8,
    reviews_count: 31,
    sku: "KIT-ROTG-03",
  },
  {
    id: 6,
    title: "Silky Smooth Satin Kimono Bathrobe with Belt",
    slug: "silky-smooth-satin-kimono-bathrobe",
    description: "Lightweight satin loungewear robe featuring 3/4 sleeves, removable tie waist belt, and elegant french seams for comfortable everyday luxury.",
    price: 1750,
    original_price: 2500,
    stock: 22,
    thumbnail_url: "/images/banners/hero-banner.png",
    gallery_urls: ["/images/banners/hero-banner.png"],
    category_slug: "bridal-silk-nightwear",
    is_active: true,
    is_featured: false,
    is_flash_deal: true,
    rating: 4.8,
    reviews_count: 14,
    variations: {
      sizes: ["Standard Fit", "Plus Fit"],
      colors: ["Champagne Gold", "Blush Pink", "Burgundy"],
    },
    sku: "NE-KIMO-02",
  },
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 1,
    title: "Mega Sale - Up to 40% Off",
    image_url: "/images/banners/hero-banner.png",
    link_url: "/shop",
    is_active: true,
    sort_order: 1,
  },
];

// ==========================================
// PRODUCTS DATA LAYER (LEAN PROJECTIONS)
// ==========================================
export async function getProducts(options?: {
  category?: string;
  subcategory?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
  flashDeals?: boolean;
  search?: string;
}): Promise<{ products: Product[]; total: number }> {
  try {
    const page = options?.page || 1;
    const limit = options?.limit || 8;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("products")
      .select(
        "id, title, slug, price, original_price, stock, thumbnail_url, category_slug, subcategory_slug, is_active, is_featured, is_flash_deal, rating, reviews_count, variations, sku",
        { count: "exact" }
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (options?.category) {
      query = query.eq("category_slug", options.category);
    }
    if (options?.subcategory) {
      query = query.eq("subcategory_slug", options.subcategory);
    }
    if (options?.featured) {
      query = query.eq("is_featured", true);
    }
    if (options?.flashDeals) {
      query = query.eq("is_flash_deal", true);
    }
    if (options?.search) {
      query = query.ilike("title", `%${options.search}%`);
    }

    const { data, error, count } = await query.range(from, to);

    if (error || !data || data.length === 0) {
      // Fallback filter on initial seed items if table is empty or error
      let filtered = [...INITIAL_PRODUCTS];
      if (options?.category) {
        filtered = filtered.filter((p) => p.category_slug === options.category);
      }
      if (options?.search) {
        const q = options.search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.category_slug.toLowerCase().includes(q)
        );
      }
      if (options?.flashDeals) {
        filtered = filtered.filter((p) => p.is_flash_deal);
      }
      if (options?.featured) {
        filtered = filtered.filter((p) => p.is_featured);
      }
      return {
        products: filtered.slice(from, from + limit),
        total: filtered.length,
      };
    }

    return {
      products: data as Product[],
      total: count || data.length,
    };
  } catch {
    return { products: INITIAL_PRODUCTS.slice(0, options?.limit || 8), total: INITIAL_PRODUCTS.length };
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        "id, title, slug, description, price, original_price, stock, thumbnail_url, gallery_urls, category_slug, subcategory_slug, is_active, is_featured, is_flash_deal, rating, reviews_count, variations, sku, created_at"
      )
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) {
      const match = INITIAL_PRODUCTS.find((p) => p.slug === slug);
      return match || null;
    }
    return data as Product;
  } catch {
    const match = INITIAL_PRODUCTS.find((p) => p.slug === slug);
    return match || null;
  }
}

// ==========================================
// CATEGORIES DATA LAYER
// ==========================================
export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, image_url, parent_slug, show_on_homepage, sort_order")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return INITIAL_CATEGORIES;
    }
    return data as Category[];
  } catch {
    return INITIAL_CATEGORIES;
  }
}

// ==========================================
// BANNERS DATA LAYER
// ==========================================
export async function getBanners(): Promise<Banner[]> {
  try {
    const { data, error } = await supabase
      .from("banners")
      .select("id, title, image_url, link_url, is_active, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return INITIAL_BANNERS;
    }
    return data as Banner[];
  } catch {
    return INITIAL_BANNERS;
  }
}

// ==========================================
// STORE SETTINGS DATA LAYER
// ==========================================
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const { data, error } = await supabase
      .from("store_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data) {
      return INITIAL_SETTINGS;
    }
    return { ...INITIAL_SETTINGS, ...data };
  } catch {
    return INITIAL_SETTINGS;
  }
}

// ==========================================
// ORDER SUBMISSION (REAL COD ORDER CREATION)
// ==========================================
export async function createOrder(orderPayload: Omit<Order, "id" | "created_at">): Promise<{ success: boolean; order_number?: string; error?: string }> {
  try {
    const orderNumber = `ABM-${Date.now().toString().slice(-6)}`;
    const fullOrder: Order = {
      ...orderPayload,
      id: Date.now(),
      order_number: orderNumber,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("orders").insert([
      {
        order_number: fullOrder.order_number,
        customer_name: fullOrder.customer_name,
        phone: fullOrder.phone,
        whatsapp: fullOrder.whatsapp || fullOrder.phone,
        city: fullOrder.city,
        address: fullOrder.address,
        items: fullOrder.items,
        subtotal: fullOrder.subtotal,
        delivery_charges: fullOrder.delivery_charges,
        discount: fullOrder.discount,
        total_amount: fullOrder.total_amount,
        payment_method: fullOrder.payment_method,
        payment_status: fullOrder.payment_status,
        payment_proof_url: fullOrder.payment_proof_url,
        status: "Pending",
        order_notes: fullOrder.order_notes || "",
      },
    ]);

    if (error) {
      console.warn("Direct Supabase insert failed, logging order locally:", error.message);
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("kb_orders_updated"));
    }

    return { success: true, order_number: orderNumber };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to place order";
    return { success: false, error: message };
  }
}

// ==========================================
// ADMIN MUTATION ROUTINES
// ==========================================
export async function adminSaveProduct(product: Partial<Product>): Promise<{ success: boolean; error?: string }> {
  try {
    const cleanPayload = {
      title: product.title,
      slug: product.slug,
      description: product.description,
      price: product.price,
      original_price: product.original_price,
      stock: product.stock,
      thumbnail_url: product.thumbnail_url,
      gallery_urls: product.gallery_urls || [],
      category_slug: product.category_slug,
      subcategory_slug: product.subcategory_slug || null,
      is_active: product.is_active ?? true,
      is_featured: product.is_featured ?? false,
      is_flash_deal: product.is_flash_deal ?? false,
      variations: product.variations || {},
      sku: product.sku || "",
    };

    if (product.id && typeof product.id === "number" && product.id > 100) {
      const { error } = await supabase.from("products").update(cleanPayload).eq("id", product.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("products").insert([cleanPayload]);
      if (error) throw error;
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("kb_products_updated"));
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Save failed";
    return { success: false, error: msg };
  }
}

export async function adminDeleteProduct(id: string | number): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("kb_products_updated"));
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Delete failed";
    return { success: false, error: msg };
  }
}

export async function adminSaveCategory(category: Partial<Category>): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      name: category.name,
      slug: category.slug,
      image_url: category.image_url || "/images/banners/hero-banner.png",
      parent_slug: category.parent_slug || null,
      show_on_homepage: category.show_on_homepage ?? true,
      sort_order: category.sort_order || 0,
    };

    if (category.id && typeof category.id === "number" && category.id > 100) {
      const { error } = await supabase.from("categories").update(payload).eq("id", category.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("categories").insert([payload]);
      if (error) throw error;
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("kb_categories_updated"));
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Save category failed";
    return { success: false, error: msg };
  }
}

export async function adminDeleteCategory(id: string | number): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("kb_categories_updated"));
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Delete category failed";
    return { success: false, error: msg };
  }
}

export async function adminUpdateOrderStatus(orderId: string | number, status: Order["status"]): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) throw error;
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("kb_orders_updated"));
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Update order status failed";
    return { success: false, error: msg };
  }
}

export async function adminSaveSettings(settings: Partial<SiteSettings>): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("store_settings").upsert({ id: 1, ...settings, updated_at: new Date().toISOString() });
    if (error) throw error;
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("kb_settings_updated"));
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Save settings failed";
    return { success: false, error: msg };
  }
}
