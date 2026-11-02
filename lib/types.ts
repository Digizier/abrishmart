export interface Product {
  id: string | number;
  title: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  stock: number;
  thumbnail_url: string;
  gallery_urls: string[];
  category_slug: string;
  subcategory_slug?: string;
  is_active: boolean;
  is_featured: boolean;
  is_flash_deal: boolean;
  rating: number;
  reviews_count: number;
  variations?: {
    sizes?: string[];
    colors?: string[];
  };
  sku?: string;
  created_at?: string;
}

export interface Category {
  id: string | number;
  name: string;
  slug: string;
  image_url: string;
  parent_slug?: string | null;
  show_on_homepage: boolean;
  sort_order: number;
  created_at?: string;
}

export interface OrderItem {
  id: string | number;
  title: string;
  price: number;
  quantity: number;
  selected_size?: string;
  selected_color?: string;
  thumbnail_url: string;
  product_id: string | number;
}

export interface Order {
  id: string | number;
  order_number: string;
  customer_name: string;
  phone: string;
  whatsapp?: string;
  city: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  delivery_charges: number;
  discount: number;
  total_amount: number;
  payment_method: "cod" | "jazzcash" | "easypaisa" | "bank";
  payment_status: "pending" | "verified" | "rejected";
  payment_proof_url?: string | null;
  status: "Pending" | "Confirmed" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  order_notes?: string;
  hhc_order_id?: string | null;
  tracking_number?: string | null;
  courier_name?: string | null;
  created_at: string;
}

export interface Banner {
  id: string | number;
  title: string;
  image_url: string;
  link_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
}

export interface SiteSettings {
  id?: number;
  store_name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  ntn: string;
  delivery_charge: number;
  free_shipping_threshold: number;
  cod_enabled: boolean;
  jazzcash_title: string;
  jazzcash_number: string;
  easypaisa_title: string;
  easypaisa_number: string;
  bank_name: string;
  bank_title: string;
  bank_iban: string;
  admin_pin: string;
  updated_at?: string;
}

export interface Coupon {
  id: string | number;
  code: string;
  discount_type: "fixed" | "percentage";
  discount_value: number;
  min_spend: number;
  free_shipping: boolean;
  is_active: boolean;
  created_at?: string;
}

export interface HHCProduct {
  id: number;
  name: string;
  description: string;
  wholesalePrice: number;
  salePrice: number;
  profitMargin: number;
  stock_quantity: number;
  weight: number;
  product_thumbnail: string;
  product_galleries: string[];
  storeID: number;
  store_name: string;
}
