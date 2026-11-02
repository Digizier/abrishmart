-- ==============================================================================
-- ABRISH MART (abrishmart.store) - MASTER SUPABASE PRODUCTION SCHEMA
-- ==============================================================================
-- Designed for: Zero Base64, Lean Egress Projections, Post-October 30 RLS & GRANTs
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  stock INT DEFAULT 15,
  thumbnail_url TEXT NOT NULL,
  gallery_urls JSONB DEFAULT '[]'::jsonb,
  category_slug TEXT NOT NULL,
  subcategory_slug TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_flash_deal BOOLEAN DEFAULT FALSE,
  rating NUMERIC DEFAULT 4.8,
  reviews_count INT DEFAULT 14,
  variations JSONB DEFAULT '{}'::jsonb,
  sku TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for sub-millisecond queries
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_flash ON public.products(is_flash_deal);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT,
  parent_slug TEXT,
  show_on_homepage BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_homepage ON public.categories(show_on_homepage);

-- 4. ORDERS TABLE (CASH ON DELIVERY & DIGITAL WALLETS)
CREATE TABLE IF NOT EXISTS public.orders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  delivery_charges NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC NOT NULL DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT DEFAULT 'cod',
  payment_status TEXT DEFAULT 'pending',
  payment_proof_url TEXT,
  status TEXT DEFAULT 'Pending',
  order_notes TEXT,
  hhc_order_id TEXT,
  tracking_number TEXT,
  courier_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(phone);

-- 5. BANNERS TABLE
CREATE TABLE IF NOT EXISTS public.banners (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT DEFAULT 'Hero Banner',
  image_url TEXT NOT NULL,
  link_url TEXT DEFAULT '/shop',
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. STORE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.store_settings (
  id INT PRIMARY KEY DEFAULT 1,
  store_name TEXT DEFAULT 'Abrish Mart',
  tagline TEXT DEFAULT 'Shop Smart, Save More!',
  phone TEXT DEFAULT '03452086160',
  whatsapp TEXT DEFAULT '03452086160',
  email TEXT DEFAULT 'usmanshah11@gmail.com',
  address TEXT DEFAULT 'Online Store — Serving All Pakistan',
  ntn TEXT DEFAULT '4250192695085',
  delivery_charge NUMERIC DEFAULT 200,
  free_shipping_threshold NUMERIC DEFAULT 2500,
  cod_enabled BOOLEAN DEFAULT TRUE,
  jazzcash_title TEXT DEFAULT 'Usman Shah',
  jazzcash_number TEXT DEFAULT '03452086160',
  easypaisa_title TEXT DEFAULT 'Usman Shah',
  easypaisa_number TEXT DEFAULT '03452086160',
  bank_name TEXT DEFAULT 'Meezan Bank',
  bank_title TEXT DEFAULT 'Usman Shah',
  bank_iban TEXT DEFAULT 'PK72MEZN0001020304050607',
  admin_pin TEXT DEFAULT 'abrishmart_smart2026',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. HHC DROPSHIPPING PRODUCTS CACHE & FORWARDING QUEUE
CREATE TABLE IF NOT EXISTS public.hhc_products (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  hhc_product_id BIGINT NOT NULL UNIQUE,
  store_id INT,
  store_name TEXT,
  name TEXT NOT NULL,
  description TEXT,
  wholesale_price NUMERIC NOT NULL,
  sale_price NUMERIC NOT NULL,
  profit_margin NUMERIC NOT NULL,
  stock_quantity INT DEFAULT 0,
  weight NUMERIC DEFAULT 0.5,
  thumbnail_url TEXT,
  gallery_urls JSONB,
  is_synced BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hhc_forward_queue (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id TEXT NOT NULL,
  idempotency_key TEXT UNIQUE,
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'pending',
  hhc_order_id TEXT,
  tracking_number TEXT,
  courier_name TEXT,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- POST-OCTOBER 30 SUPABASE MANDATORY PERMISSION GRANTS
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hhc_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hhc_forward_queue ENABLE ROW LEVEL SECURITY;

-- Permissive public read & order write policies
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admin write products" ON public.products FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin write categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read own orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Admin manage orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read banners" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Admin manage banners" ON public.banners FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Admin manage settings" ON public.store_settings FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Manage hhc products" ON public.hhc_products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Manage hhc queue" ON public.hhc_forward_queue FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- INITIAL STORE SEED DATA
-- ==============================================================================
INSERT INTO public.store_settings (id, store_name, tagline, phone, whatsapp, email, address, ntn, delivery_charge, free_shipping_threshold)
VALUES (1, 'Abrish Mart', 'Shop Smart, Save More!', '03452086160', '03452086160', 'usmanshah11@gmail.com', 'Online Store — Serving All Pakistan', '4250192695085', 200, 2500)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.categories (name, slug, image_url, show_on_homepage, sort_order)
VALUES
  ('Bridal Silk & Nightwear', 'bridal-silk-nightwear', '/images/banners/hero-banner.png', true, 1),
  ('Kids & Educational Toys', 'kids-educational-toys', '/images/banners/hero-banner.png', true, 2),
  ('Fashion & Watches', 'fashion-watches', '/images/banners/hero-banner.png', true, 3),
  ('Smart Gadgets & Audio', 'smart-gadgets-audio', '/images/banners/hero-banner.png', true, 4),
  ('Home & Kitchen Essentials', 'home-kitchen-essentials', '/images/banners/hero-banner.png', true, 5)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.banners (title, image_url, link_url, is_active, sort_order)
VALUES
  ('Mega Sale - Up to 40% Off', '/images/banners/hero-banner.png', '/shop', true, 1)
ON CONFLICT DO NOTHING;

INSERT INTO public.products (title, slug, description, price, original_price, stock, thumbnail_url, gallery_urls, category_slug, is_active, is_featured, is_flash_deal, rating, reviews_count, variations, sku)
VALUES
  (
    'Premium Bridal Silk Nighty Gown Set (Night Ease Edition)',
    'premium-bridal-silk-nighty-gown-set',
    'Ultra-luxurious 2-piece bridal silk nighty gown set crafted with imported satin silk. Features delicate lace embroidery, adjustable straps, and smooth breathable fabric tailored for superior comfort and elegance.',
    2450, 3650, 25,
    '/images/banners/hero-banner.png',
    '["/images/banners/hero-banner.png"]'::jsonb,
    'bridal-silk-nightwear',
    true, true, true, 4.9, 38,
    '{"sizes": ["Small", "Medium", "Large", "XL"], "colors": ["Royal Maroon", "Midnight Black", "Rose Pink"]}'::jsonb,
    'NE-SILK-001'
  ),
  (
    'Kids Interactive Montessori Educational Learning Tablet',
    'kids-montessori-learning-tablet',
    'Engaging interactive screen-free learning tablet with phonetic pronunciation, alphabet flashcards, math challenges, and musical rewards. Safe, durable, and rechargeable.',
    1850, 2800, 40,
    '/images/banners/hero-banner.png',
    '["/images/banners/hero-banner.png"]'::jsonb,
    'kids-educational-toys',
    true, true, true, 4.8, 24,
    '{"colors": ["Sky Blue", "Candy Pink"]}'::jsonb,
    'TOY-MONT-102'
  ),
  (
    'Men''s Luxury Chronograph Quartz Watch with Leather Strap',
    'mens-luxury-chronograph-quartz-watch',
    'Waterproof stainless steel case with working sub-dials, date display, luminous hands, and genuine textured leather strap. Ideal for formal and casual wear.',
    2199, 3499, 18,
    '/images/banners/hero-banner.png',
    '["/images/banners/hero-banner.png"]'::jsonb,
    'fashion-watches',
    true, true, false, 4.7, 19,
    '{"colors": ["Black Dial / Black Strap", "Blue Dial / Brown Strap"]}'::jsonb,
    'WTC-CHRONO-55'
  ),
  (
    'TWS Wireless Bluetooth 5.3 Earbuds with LED Digital Display',
    'tws-wireless-bluetooth-earbuds-led',
    'Deep bass acoustics, low-latency gaming mode, noise reduction microphone, and emergency power-bank charging case with real-time battery percentage display.',
    1650, 2600, 35,
    '/images/banners/hero-banner.png',
    '["/images/banners/hero-banner.png"]'::jsonb,
    'smart-gadgets-audio',
    true, true, true, 4.9, 52,
    '{"colors": ["Piano Black", "Arctic White"]}'::jsonb,
    'AUD-TWS-99'
  ),
  (
    'Multipurpose Vegetable Cutter & Rotary Cheese Grater',
    'multipurpose-vegetable-cutter-grater',
    'Stainless steel 3-in-1 rotary drum blades for fast slicing, shredding, and julienning. Strong vacuum suction base keeps it secure on kitchen countertops.',
    1399, 2100, 30,
    '/images/banners/hero-banner.png',
    '["/images/banners/hero-banner.png"]'::jsonb,
    'home-kitchen-essentials',
    true, true, false, 4.8, 31,
    '{}'::jsonb,
    'KIT-ROTG-03'
  ),
  (
    'Silky Smooth Satin Kimono Bathrobe with Belt',
    'silky-smooth-satin-kimono-bathrobe',
    'Lightweight satin loungewear robe featuring 3/4 sleeves, removable tie waist belt, and elegant french seams for comfortable everyday luxury.',
    1750, 2500, 22,
    '/images/banners/hero-banner.png',
    '["/images/banners/hero-banner.png"]'::jsonb,
    'bridal-silk-nightwear',
    true, false, true, 4.8, 14,
    '{"sizes": ["Standard Fit", "Plus Fit"], "colors": ["Champagne Gold", "Blush Pink", "Burgundy"]}'::jsonb,
    'NE-KIMO-02'
  )
ON CONFLICT (slug) DO NOTHING;
