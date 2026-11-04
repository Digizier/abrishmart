-- ==============================================================================
-- ABRISH MART (abrishmart.store) - MASTER SUPABASE PRODUCTION SCHEMA
-- ==============================================================================
-- Execute in Supabase Dashboard SQL Editor:
-- https://supabase.com/dashboard/project/mioulpysliiedyekztyo/sql
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY DEFAULT ('PROD-' || floor(extract(epoch from now())*1000)::text),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  wholesale_price NUMERIC,
  stock INT DEFAULT 15,
  thumbnail_url TEXT NOT NULL,
  gallery_urls JSONB DEFAULT '[]'::jsonb,
  category_slug TEXT NOT NULL,
  subcategory_slug TEXT,
  child_subcategory_slug TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_flash_deal BOOLEAN DEFAULT FALSE,
  rating NUMERIC DEFAULT 4.8,
  reviews_count INT DEFAULT 14,
  variations JSONB DEFAULT '{}'::jsonb,
  sku TEXT,
  hhc_product_id BIGINT,
  hhc_store_id INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_flash ON public.products(is_flash_deal);
CREATE INDEX IF NOT EXISTS idx_products_created ON public.products(created_at DESC);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY DEFAULT ('CAT-' || floor(extract(epoch from now())*1000)::text),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT,
  parent_slug TEXT,
  level INT DEFAULT 1,
  subcategories JSONB DEFAULT '[]'::jsonb,
  show_on_homepage BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_homepage ON public.categories(show_on_homepage);
CREATE INDEX IF NOT EXISTS idx_categories_order ON public.categories(sort_order ASC);

-- 4. ORDERS TABLE (CASH ON DELIVERY & DIGITAL WALLETS)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY DEFAULT ('ORD-' || floor(extract(epoch from now())*1000)::text),
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
  discount_code TEXT,
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
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);

-- 5. BANNERS TABLE
CREATE TABLE IF NOT EXISTS public.banners (
  id TEXT PRIMARY KEY DEFAULT ('BAN-' || floor(extract(epoch from now())*1000)::text),
  title TEXT DEFAULT 'Hero Banner',
  image_url TEXT NOT NULL,
  link_url TEXT DEFAULT '/shop',
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
  id TEXT PRIMARY KEY DEFAULT ('CPN-' || floor(extract(epoch from now())*1000)::text),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL DEFAULT 'percentage',
  discount_value NUMERIC NOT NULL DEFAULT 10,
  min_spend NUMERIC DEFAULT 0,
  free_shipping BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. STORE SETTINGS TABLE
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
  admin_pin TEXT DEFAULT '7e129bc9c65613c98cfb7597f43c5677140c05f84e61ceed714f96b3ced7bf18',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. HHC DROPSHIPPING CACHE & FORWARDING QUEUE
CREATE TABLE IF NOT EXISTS public.hhc_products (
  id TEXT PRIMARY KEY DEFAULT ('HHC-' || floor(extract(epoch from now())*1000)::text),
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
  id TEXT PRIMARY KEY DEFAULT ('Q-' || floor(extract(epoch from now())*1000)::text),
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
-- MANDATORY PERMISSION GRANTS & RLS (POSTGREST ZERO-BLOCK)
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hhc_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hhc_forward_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read products" ON public.products;
DROP POLICY IF EXISTS "Admin write products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admin write products" ON public.products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read categories" ON public.categories;
DROP POLICY IF EXISTS "Admin write categories" ON public.categories;
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin write categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public insert orders" ON public.orders;
DROP POLICY IF EXISTS "Public read own orders" ON public.orders;
DROP POLICY IF EXISTS "Admin manage orders" ON public.orders;
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read own orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Admin manage orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read banners" ON public.banners;
DROP POLICY IF EXISTS "Admin manage banners" ON public.banners;
CREATE POLICY "Public read banners" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Admin manage banners" ON public.banners FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admin manage coupons" ON public.coupons;
CREATE POLICY "Public read coupons" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Admin manage coupons" ON public.coupons FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read settings" ON public.store_settings;
DROP POLICY IF EXISTS "Admin manage settings" ON public.store_settings;
CREATE POLICY "Public read settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Admin manage settings" ON public.store_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Manage hhc products" ON public.hhc_products;
DROP POLICY IF EXISTS "Manage hhc queue" ON public.hhc_forward_queue;
CREATE POLICY "Manage hhc products" ON public.hhc_products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Manage hhc queue" ON public.hhc_forward_queue FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- INITIAL STORE SEED DATA (SAFE UPSERTS)
-- ==============================================================================
INSERT INTO public.store_settings (id, store_name, tagline, phone, whatsapp, email, address, ntn, delivery_charge, free_shipping_threshold)
VALUES (1, 'Abrish Mart', 'Shop Smart, Save More!', '03452086160', '03452086160', 'usmanshah11@gmail.com', 'Online Store — Serving All Pakistan', '4250192695085', 200, 2500)
ON CONFLICT (id) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  phone = EXCLUDED.phone,
  whatsapp = EXCLUDED.whatsapp;

INSERT INTO public.banners (id, title, image_url, link_url, is_active, sort_order)
VALUES ('BAN-1', 'Abrish Mart Special Offers - Shop Smart, Save More!', '/images/banners/hero-banner.png', '/shop', true, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.coupons (id, code, discount_type, discount_value, min_spend, free_shipping, is_active)
VALUES
  ('CPN-1', 'WELCOME200', 'fixed', 200, 1500, false, true),
  ('CPN-2', 'ABRISH10', 'percentage', 10, 2000, false, true),
  ('CPN-3', 'FREESHIP', 'fixed', 200, 2500, true, true)
ON CONFLICT (code) DO NOTHING;

-- 6 CORE CATEGORIES WITH SUB-CATEGORIES
INSERT INTO public.categories (id, name, slug, image_url, level, show_on_homepage, sort_order, subcategories)
VALUES
  (
    'CAT-1',
    'Bridal Silk & Nightwear',
    'bridal-silk-nightwear',
    '/images/categories/bridal-silk.webp',
    1,
    true,
    1,
    '[
      {"id": 101, "name": "Bridal Nighty Gowns", "slug": "bridal-nighty-gowns", "parent_slug": "bridal-silk-nightwear", "child_subcategories": [{"id": 1001, "name": "2-Piece Silk Gown Sets", "slug": "2-piece-silk-sets"}, {"id": 1002, "name": "Embroidered Lace Gowns", "slug": "embroidered-lace-gowns"}, {"id": 1003, "name": "Luxury Bridal Nightwear", "slug": "luxury-bridal-nightwear"}]},
      {"id": 102, "name": "Satin Robes & Kimonos", "slug": "satin-robes-kimonos", "parent_slug": "bridal-silk-nightwear", "child_subcategories": [{"id": 1004, "name": "Silk Kimono Bathrobes", "slug": "silk-kimono-bathrobes"}, {"id": 1005, "name": "Satin Dressing Robes", "slug": "satin-dressing-robes"}]},
      {"id": 103, "name": "Comfort Sleepwear", "slug": "comfort-sleepwear", "parent_slug": "bridal-silk-nightwear", "child_subcategories": [{"id": 1006, "name": "Silk Pajama Sets", "slug": "silk-pajama-sets"}, {"id": 1007, "name": "Soft Cotton Sleep Dresses", "slug": "cotton-sleep-dresses"}]}
    ]'::jsonb
  ),
  (
    'CAT-2',
    'Kids & Educational Toys',
    'kids-educational-toys',
    '/images/categories/kids-toys.webp',
    1,
    true,
    2,
    '[
      {"id": 201, "name": "Montessori Learning", "slug": "montessori-learning", "parent_slug": "kids-educational-toys", "child_subcategories": [{"id": 2001, "name": "Phonetic Learning Tablets", "slug": "phonetic-learning-tablets"}, {"id": 2002, "name": "Wooden Puzzle Blocks", "slug": "wooden-puzzle-blocks"}, {"id": 2003, "name": "Flashcards & Math Cards", "slug": "flashcards-math-cards"}]},
      {"id": 202, "name": "Creative Art & Drawing", "slug": "creative-art-drawing", "parent_slug": "kids-educational-toys", "child_subcategories": [{"id": 2004, "name": "54 Pcs Art Studio Kits", "slug": "54-pcs-art-studio-kits"}, {"id": 2005, "name": "Smiley Cartoon Pencils", "slug": "smiley-cartoon-pencils"}, {"id": 2006, "name": "Bendy Flexible Magic Pencils", "slug": "bendy-magic-pencils"}]},
      {"id": 203, "name": "Fun Stamps & Games", "slug": "fun-stamps-games", "parent_slug": "kids-educational-toys", "child_subcategories": [{"id": 2007, "name": "Self-Inking Emoji Stamps", "slug": "self-inking-emoji-stamps"}, {"id": 2008, "name": "Birthday Return Gifts", "slug": "birthday-return-gifts"}]}
    ]'::jsonb
  ),
  (
    'CAT-3',
    'Fashion & Watches',
    'fashion-watches',
    '/images/categories/fashion-watches.webp',
    1,
    true,
    3,
    '[
      {"id": 301, "name": "Men''s Luxury Watches", "slug": "mens-luxury-watches", "parent_slug": "fashion-watches", "child_subcategories": [{"id": 3001, "name": "Chronograph Quartz Watches", "slug": "chronograph-quartz-watches"}, {"id": 3002, "name": "Genuine Leather Strap Gials", "slug": "leather-strap-watches"}, {"id": 3003, "name": "Waterproof Stainless Steel", "slug": "waterproof-steel-watches"}]},
      {"id": 302, "name": "Women''s Timepieces", "slug": "womens-timepieces", "parent_slug": "fashion-watches", "child_subcategories": [{"id": 3004, "name": "Rose Gold Bracelet Watches", "slug": "rose-gold-bracelet-watches"}, {"id": 3005, "name": "Magnetic Strap Dials", "slug": "magnetic-strap-dials"}]},
      {"id": 303, "name": "Wallets & Accessories", "slug": "wallets-accessories", "parent_slug": "fashion-watches", "child_subcategories": [{"id": 3006, "name": "Men''s Slim Wallets", "slug": "mens-slim-wallets"}, {"id": 3007, "name": "Cosmetic & Beauty Accessories", "slug": "cosmetic-beauty-accessories"}]}
    ]'::jsonb
  ),
  (
    'CAT-4',
    'Smart Gadgets & Audio',
    'smart-gadgets-audio',
    '/images/categories/smart-gadgets.webp',
    1,
    true,
    4,
    '[
      {"id": 401, "name": "Wireless Earbuds (TWS)", "slug": "wireless-earbuds-tws", "parent_slug": "smart-gadgets-audio", "child_subcategories": [{"id": 4001, "name": "LED Battery Display TWS", "slug": "led-display-tws"}, {"id": 4002, "name": "Bluetooth 5.3 Pro Earbuds", "slug": "bluetooth-5-3-earbuds"}, {"id": 4003, "name": "Gaming Low-Latency Pods", "slug": "gaming-low-latency-pods"}]},
      {"id": 402, "name": "Cables & Fast Chargers", "slug": "cables-fast-chargers", "parent_slug": "smart-gadgets-audio", "child_subcategories": [{"id": 4004, "name": "Type-C 3.1A Fast Cables", "slug": "type-c-3-1a-fast-cables"}, {"id": 4005, "name": "Micro USB Android Cables", "slug": "micro-usb-cables"}, {"id": 4006, "name": "Quick Charge 3.0 Adapters", "slug": "quick-charge-adapters"}]},
      {"id": 403, "name": "Wired Handsfree & Audio", "slug": "wired-handsfree-audio", "parent_slug": "smart-gadgets-audio", "child_subcategories": [{"id": 4007, "name": "Deep Bass Stereo Handsfree", "slug": "deep-bass-handsfree"}, {"id": 4008, "name": "In-Ear Mic Headsets", "slug": "in-ear-mic-headsets"}]}
    ]'::jsonb
  ),
  (
    'CAT-5',
    'Home & Kitchen Essentials',
    'home-kitchen-essentials',
    '/images/categories/home-kitchen.webp',
    1,
    true,
    5,
    '[
      {"id": 501, "name": "Smart Kitchen Tools", "slug": "smart-kitchen-tools", "parent_slug": "home-kitchen-essentials", "child_subcategories": [{"id": 5001, "name": "4-in-1 Electric Vegetable Slicers", "slug": "electric-vegetable-slicers"}, {"id": 5002, "name": "Wireless Garlic Choppers", "slug": "wireless-garlic-choppers"}, {"id": 5003, "name": "Rotary Cheese Graters", "slug": "rotary-cheese-graters"}]},
      {"id": 502, "name": "Thermal Bottles & Flasks", "slug": "thermal-bottles-flasks", "parent_slug": "home-kitchen-essentials", "child_subcategories": [{"id": 5004, "name": "LED Temperature Touch Flasks", "slug": "led-temp-flasks"}, {"id": 5005, "name": "Double-Wall Vacuum Bottles", "slug": "vacuum-bottles"}]},
      {"id": 503, "name": "Home Utility Pumps", "slug": "home-utility-pumps", "parent_slug": "home-kitchen-essentials", "child_subcategories": [{"id": 5006, "name": "Automatic Water Dispenser Pumps", "slug": "automatic-water-pumps"}, {"id": 5007, "name": "Rechargeable USB Pumps", "slug": "usb-water-pumps"}]}
    ]'::jsonb
  ),
  (
    'CAT-6',
    'Stationery & School Bags',
    'stationery-school-bags',
    '/images/categories/stationery-crafts.webp',
    1,
    true,
    6,
    '[
      {"id": 601, "name": "School & College Backpacks", "slug": "school-college-backpacks", "parent_slug": "stationery-school-bags", "child_subcategories": [{"id": 6001, "name": "Korean Trendy School Bags", "slug": "korean-school-bags"}, {"id": 6002, "name": "Slim Waterproof Laptop Bags", "slug": "laptop-backpacks"}, {"id": 6003, "name": "Primary School Cartoon Bags", "slug": "cartoon-school-bags"}]},
      {"id": 602, "name": "DIY Crafts & Foam Sheets", "slug": "diy-crafts-foam-sheets", "parent_slug": "stationery-school-bags", "child_subcategories": [{"id": 6004, "name": "A4 Glitter Foam Sheets (Self Adhesive)", "slug": "glitter-foam-sheets"}, {"id": 6005, "name": "Children Craft Accessories", "slug": "craft-accessories"}]}
    ]'::jsonb
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  subcategories = EXCLUDED.subcategories,
  show_on_homepage = EXCLUDED.show_on_homepage,
  sort_order = EXCLUDED.sort_order;

-- 10 CORE PRODUCTS
INSERT INTO public.products (id, title, slug, description, price, original_price, wholesale_price, stock, thumbnail_url, gallery_urls, category_slug, subcategory_slug, child_subcategory_slug, is_active, is_featured, is_flash_deal, rating, reviews_count, variations, sku)
VALUES
  (
    'PROD-3768621',
    'Premium Bridal Silk Nighty Gown Set (Night Ease Edition)',
    'premium-bridal-silk-nighty-gown-set',
    'Ultra-luxurious 2-piece bridal silk nighty gown set crafted with imported satin silk. Features delicate lace embroidery, adjustable straps, and smooth breathable fabric tailored for superior comfort and elegance.',
    2450, 3650, 1450, 25,
    'https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/18/1e9c870518b5798afed6e643e848de66.jpg',
    '["https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/18/80d5d26f5a51fb1cc6fef86d85450daa.jpg", "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/18/c001e6291270ba7cb24a61f5f698e0cf.jpg"]'::jsonb,
    'bridal-silk-nightwear',
    'bridal-nighty-gowns',
    '2-piece-silk-sets',
    true, true, true, 4.9, 42,
    '{"sizes": ["Small", "Medium", "Large", "XL"], "colors": ["Royal Maroon", "Midnight Black", "Blush Pink", "Emerald Green"]}'::jsonb,
    'NE-SILK-001'
  ),
  (
    'PROD-3765026',
    'Smiley Cartoon Stationery Pencils Children Gift (Pack of 12 Assorted Colors)',
    'smiley-cartoon-stationery-pencils-pack-of-12',
    'High quality wooden HB pencils with adorable 3D smiley emoji erasers. Ergonomic grip suitable for kids handwriting practice and school gifts.',
    761, 1150, 261, 50,
    'https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/18/80d5d26f5a51fb1cc6fef86d85450daa.jpg',
    '["https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/18/80d5d26f5a51fb1cc6fef86d85450daa.jpg"]'::jsonb,
    'kids-educational-toys',
    'creative-art-drawing',
    'smiley-cartoon-pencils',
    true, true, true, 4.8, 36,
    '{}'::jsonb,
    'HHC-3765026-ADV'
  ),
  (
    'PROD-3765007',
    '54 Pcs Art Studio Kit - Children Creative Drawing & Craft Set in Portable Case',
    '54-pcs-art-studio-kit-children-drawing-craft-set',
    'Complete art studio with oil pastels, watercolor markers, crayons, colored pencils, and drawing paper neatly organized in a snap-shut carrying case.',
    1650, 2450, 1062, 35,
    'https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/18/c001e6291270ba7cb24a61f5f698e0cf.jpg',
    '["https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/18/c001e6291270ba7cb24a61f5f698e0cf.jpg"]'::jsonb,
    'kids-educational-toys',
    'creative-art-drawing',
    '54-pcs-art-studio-kits',
    true, true, true, 4.9, 29,
    '{}'::jsonb,
    'HHC-3765007-ADV'
  ),
  (
    'PROD-3764364',
    'Type-C 3.1A Quick Charge Fast Charging Data Cable (1.2m Braided Nylon)',
    'type-c-quick-charge-fast-charging-cable',
    'Heavy-duty nylon braided fast charging cable delivering 3.1A safe current with high-speed 480Mbps data transfer. Tested for 15,000+ bends.',
    550, 850, 185, 110,
    'https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/19/2265c0bbad02c1f54497e8876c48d21b.jpg',
    '["https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/19/2265c0bbad02c1f54497e8876c48d21b.jpg"]'::jsonb,
    'smart-gadgets-audio',
    'cables-fast-chargers',
    'type-c-3-1a-fast-cables',
    true, true, true, 4.7, 54,
    '{"colors": ["Jet Black", "Silver Gray", "Metallic Red"]}'::jsonb,
    'HHC-3764364-ADV'
  ),
  (
    'PROD-3764363',
    'In-Ear Deep Bass Stereo Handsfree with HD Microphone (3.5mm Tangle-Free)',
    'in-ear-deep-bass-stereo-handsfree-microphone',
    'Crystal clear calls and punchy deep bass sound with ergonomic noise-isolating silicone ear buds and built-in remote microphone.',
    590, 950, 175, 95,
    'https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/19/a7dbf22f77341da626ea4cbe4580bf71.jpg',
    '["https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/19/a7dbf22f77341da626ea4cbe4580bf71.jpg"]'::jsonb,
    'smart-gadgets-audio',
    'wired-handsfree-audio',
    'deep-bass-handsfree',
    true, true, false, 4.6, 68,
    '{"colors": ["Classic White", "Midnight Black"]}'::jsonb,
    'HHC-3764363-ADV'
  ),
  (
    'PROD-3769118',
    'Multifunction 4-in-1 Handheld Electric Vegetable Slicer & Garlic Chopper',
    'multifunction-4-in-1-electric-vegetable-slicer-chopper',
    'Cordless handheld food processor for slicing garlic, chili, celery, ginger, and mincing meat instantly. Easy one-click self-cleaning.',
    2250, 3200, 1450, 40,
    'https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/19/9fdb34be348f98d7fa224855581179ab.jpg',
    '["https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/19/9fdb34be348f98d7fa224855581179ab.jpg"]'::jsonb,
    'home-kitchen-essentials',
    'smart-kitchen-tools',
    'electric-vegetable-slicers',
    true, true, false, 4.9, 81,
    '{}'::jsonb,
    'HHC-3769118-ALM'
  ),
  (
    'PROD-3769225',
    'Stainless Steel Smart Vacuum Flask with LED Temperature Touch Display (500ml)',
    'stainless-steel-smart-vacuum-flask-led-temperature',
    'Double-wall 304 food-grade stainless steel thermos keeping drinks hot for 12 hours or cold for 24 hours. Waterproof HD LED touch screen lid.',
    1550, 2400, 890, 55,
    'https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/19/d3e74288019fb3b66432ae30c5e7bce8.jpg',
    '["https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/19/d3e74288019fb3b66432ae30c5e7bce8.jpg"]'::jsonb,
    'home-kitchen-essentials',
    'thermal-bottles-flasks',
    'led-temp-flasks',
    true, true, false, 4.8, 47,
    '{"colors": ["Matte Black", "Ocean Blue", "Gradient Pink", "Pearl White"]}'::jsonb,
    'HHC-3769225-ALP'
  ),
  (
    'PROD-3768840',
    'Automatic Wireless USB Rechargeable Water Dispenser Pump for 19L Bottles',
    'automatic-wireless-usb-water-dispenser-pump',
    'Universal electric water bottle pump for standard 19-liter water coolers. One-touch silent pumping, food grade silicone hose, 1200mAh battery.',
    1199, 1850, 620, 65,
    'https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/19/7e9a8f118a7d65f5e8841a0e8832a8ff.jpg',
    '["https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/19/7e9a8f118a7d65f5e8841a0e8832a8ff.jpg"]'::jsonb,
    'home-kitchen-essentials',
    'home-utility-pumps',
    'automatic-water-pumps',
    true, true, false, 4.7, 33,
    '{"colors": ["Crisp White", "Obsidian Black"]}'::jsonb,
    'HHC-3768840-ALF'
  ),
  (
    'PROD-3768622',
    'Glitter Foam Sheet A4 - Self Adhesive (Pack of 10 Assorted Vibrant Colors)',
    'glitter-foam-sheet-a4-self-adhesive-pack-of-10',
    'Glitter Foam Sheets A4 - Self Adhesive (Pack of 10). Assorted vibrant colors. Perfect for children craft activities, school models, and DIY projects.',
    826, 1250, 326, 60,
    'https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/18/1e9c870518b5798afed6e643e848de66.jpg',
    '["https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/18/80d5d26f5a51fb1cc6fef86d85450daa.jpg"]'::jsonb,
    'stationery-school-bags',
    'diy-crafts-foam-sheets',
    'glitter-foam-sheets',
    true, false, false, 4.8, 17,
    '{}'::jsonb,
    'HHC-3768621-ADV'
  ),
  (
    'PROD-3765076',
    'Maybelline Superstay Lumi Matte Foundation Shade 220 (Light-as-Air)',
    'maybelline-superstay-lumi-matte-foundation-220',
    'Long-wear foundation with breathable light formula, providing 30H matte luminous coverage resistant to sweat, humidity, and transfer.',
    2850, 3950, 2205, 22,
    'https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/18/1e9c870518b5798afed6e643e848de66.jpg',
    '["https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/18/80d5d26f5a51fb1cc6fef86d85450daa.jpg"]'::jsonb,
    'fashion-watches',
    'wallets-accessories',
    'cosmetic-beauty-accessories',
    true, false, false, 4.9, 11,
    '{}'::jsonb,
    'HHC-3765076-12W'
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  price = EXCLUDED.price,
  wholesale_price = EXCLUDED.wholesale_price,
  stock = EXCLUDED.stock,
  thumbnail_url = EXCLUDED.thumbnail_url,
  gallery_urls = EXCLUDED.gallery_urls,
  category_slug = EXCLUDED.category_slug,
  subcategory_slug = EXCLUDED.subcategory_slug,
  child_subcategory_slug = EXCLUDED.child_subcategory_slug,
  is_active = EXCLUDED.is_active,
  is_featured = EXCLUDED.is_featured,
  is_flash_deal = EXCLUDED.is_flash_deal,
  variations = EXCLUDED.variations,
  sku = EXCLUDED.sku;
