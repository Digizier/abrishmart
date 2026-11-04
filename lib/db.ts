import { supabase } from "./supabase";
import { Product, Category, Subcategory, Order, Banner, SiteSettings, Coupon } from "./types";

// ==========================================
// INITIAL CATEGORIES & NESTED SUBCATEGORIES (DARAZ HIERARCHY)
// ==========================================
export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Bridal Silk & Nightwear",
    slug: "bridal-silk-nightwear",
    image_url: "/images/categories/bridal-silk.webp",
    show_on_homepage: true,
    sort_order: 1,
    subcategories: [
      {
        id: 101,
        name: "Bridal Nighty Gowns",
        slug: "bridal-nighty-gowns",
        parent_slug: "bridal-silk-nightwear",
        child_subcategories: [
          { id: 1001, name: "2-Piece Silk Gown Sets", slug: "2-piece-silk-sets" },
          { id: 1002, name: "Embroidered Lace Gowns", slug: "embroidered-lace-gowns" },
          { id: 1003, name: "Luxury Bridal Nightwear", slug: "luxury-bridal-nightwear" },
        ],
      },
      {
        id: 102,
        name: "Satin Robes & Kimonos",
        slug: "satin-robes-kimonos",
        parent_slug: "bridal-silk-nightwear",
        child_subcategories: [
          { id: 1004, name: "Silk Kimono Bathrobes", slug: "silk-kimono-bathrobes" },
          { id: 1005, name: "Satin Dressing Robes", slug: "satin-dressing-robes" },
        ],
      },
      {
        id: 103,
        name: "Comfort Sleepwear",
        slug: "comfort-sleepwear",
        parent_slug: "bridal-silk-nightwear",
        child_subcategories: [
          { id: 1006, name: "Silk Pajama Sets", slug: "silk-pajama-sets" },
          { id: 1007, name: "Soft Cotton Sleep Dresses", slug: "cotton-sleep-dresses" },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Kids & Educational Toys",
    slug: "kids-educational-toys",
    image_url: "/images/categories/kids-toys.webp",
    show_on_homepage: true,
    sort_order: 2,
    subcategories: [
      {
        id: 201,
        name: "Montessori Learning",
        slug: "montessori-learning",
        parent_slug: "kids-educational-toys",
        child_subcategories: [
          { id: 2001, name: "Phonetic Learning Tablets", slug: "phonetic-learning-tablets" },
          { id: 2002, name: "Wooden Puzzle Blocks", slug: "wooden-puzzle-blocks" },
          { id: 2003, name: "Flashcards & Math Cards", slug: "flashcards-math-cards" },
        ],
      },
      {
        id: 202,
        name: "Creative Art & Drawing",
        slug: "creative-art-drawing",
        parent_slug: "kids-educational-toys",
        child_subcategories: [
          { id: 2004, name: "54 Pcs Art Studio Kits", slug: "54-pcs-art-studio-kits" },
          { id: 2005, name: "Smiley Cartoon Pencils", slug: "smiley-cartoon-pencils" },
          { id: 2006, name: "Bendy Flexible Magic Pencils", slug: "bendy-flexible-pencils" },
        ],
      },
      {
        id: 203,
        name: "Fun Stamps & Games",
        slug: "fun-stamps-games",
        parent_slug: "kids-educational-toys",
        child_subcategories: [
          { id: 2007, name: "Self-Inking Emoji Stamps", slug: "emoji-stamp-sets" },
          { id: 2008, name: "Birthday Return Gifts", slug: "birthday-return-gifts" },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Fashion & Watches",
    slug: "fashion-watches",
    image_url: "/images/categories/fashion-watches.webp",
    show_on_homepage: true,
    sort_order: 3,
    subcategories: [
      {
        id: 301,
        name: "Men's Luxury Watches",
        slug: "mens-luxury-watches",
        parent_slug: "fashion-watches",
        child_subcategories: [
          { id: 3001, name: "Chronograph Quartz Watches", slug: "chronograph-quartz-watches" },
          { id: 3002, name: "Genuine Leather Strap Dials", slug: "leather-strap-dials" },
          { id: 3003, name: "Waterproof Stainless Steel", slug: "waterproof-stainless-steel" },
        ],
      },
      {
        id: 302,
        name: "Women's Timepieces",
        slug: "womens-timepieces",
        parent_slug: "fashion-watches",
        child_subcategories: [
          { id: 3004, name: "Rose Gold Bracelet Watches", slug: "rose-gold-bracelet-watches" },
          { id: 3005, name: "Magnetic Strap Dials", slug: "magnetic-strap-dials" },
        ],
      },
      {
        id: 303,
        name: "Wallets & Accessories",
        slug: "wallets-accessories",
        parent_slug: "fashion-watches",
        child_subcategories: [
          { id: 3006, name: "Men's Slim Wallets", slug: "mens-slim-wallets" },
          { id: 3007, name: "Cosmetic & Beauty Accessories", slug: "beauty-accessories" },
        ],
      },
    ],
  },
  {
    id: 4,
    name: "Smart Gadgets & Audio",
    slug: "smart-gadgets-audio",
    image_url: "/images/categories/smart-gadgets.webp",
    show_on_homepage: true,
    sort_order: 4,
    subcategories: [
      {
        id: 401,
        name: "Wireless Earbuds (TWS)",
        slug: "wireless-earbuds-tws",
        parent_slug: "smart-gadgets-audio",
        child_subcategories: [
          { id: 4001, name: "LED Battery Display TWS", slug: "led-battery-display-tws" },
          { id: 4002, name: "Bluetooth 5.3 Pro Earbuds", slug: "bluetooth-5-3-earbuds" },
          { id: 4003, name: "Gaming Low-Latency Pods", slug: "gaming-earbuds" },
        ],
      },
      {
        id: 402,
        name: "Cables & Fast Chargers",
        slug: "cables-fast-chargers",
        parent_slug: "smart-gadgets-audio",
        child_subcategories: [
          { id: 4004, name: "Type-C 3.1A Fast Cables", slug: "type-c-fast-cables" },
          { id: 4005, name: "Micro USB Android Cables", slug: "micro-usb-cables" },
          { id: 4006, name: "Quick Charge 3.0 Adapters", slug: "qc-3-adapters" },
        ],
      },
      {
        id: 403,
        name: "Wired Handsfree & Audio",
        slug: "wired-handsfree-audio",
        parent_slug: "smart-gadgets-audio",
        child_subcategories: [
          { id: 4007, name: "Deep Bass Stereo Handsfree", slug: "deep-bass-stereo-handsfree" },
          { id: 4008, name: "In-Ear Mic Headsets", slug: "in-ear-mic-headsets" },
        ],
      },
    ],
  },
  {
    id: 5,
    name: "Home & Kitchen Essentials",
    slug: "home-kitchen-essentials",
    image_url: "/images/categories/home-kitchen.webp",
    show_on_homepage: true,
    sort_order: 5,
    subcategories: [
      {
        id: 501,
        name: "Smart Kitchen Tools",
        slug: "smart-kitchen-tools",
        parent_slug: "home-kitchen-essentials",
        child_subcategories: [
          { id: 5001, name: "4-in-1 Electric Vegetable Slicers", slug: "electric-vegetable-slicers" },
          { id: 5002, name: "Wireless Garlic Choppers", slug: "wireless-garlic-choppers" },
          { id: 5003, name: "Rotary Cheese Graters", slug: "rotary-cheese-graters" },
        ],
      },
      {
        id: 502,
        name: "Thermal Bottles & Flasks",
        slug: "thermal-bottles-flasks",
        parent_slug: "home-kitchen-essentials",
        child_subcategories: [
          { id: 5004, name: "LED Temperature Touch Flasks", slug: "led-temperature-flasks" },
          { id: 5005, name: "Double-Wall Vacuum Bottles", slug: "vacuum-insulated-bottles" },
        ],
      },
      {
        id: 503,
        name: "Home Utility Pumps",
        slug: "home-utility-pumps",
        parent_slug: "home-kitchen-essentials",
        child_subcategories: [
          { id: 5006, name: "Automatic Water Dispenser Pumps", slug: "automatic-water-pumps" },
          { id: 5007, name: "Rechargeable USB Pumps", slug: "rechargeable-usb-pumps" },
        ],
      },
    ],
  },
  {
    id: 6,
    name: "Stationery & School Bags",
    slug: "stationery-school-bags",
    image_url: "/images/categories/stationery-crafts.webp",
    show_on_homepage: true,
    sort_order: 6,
    subcategories: [
      {
        id: 601,
        name: "School & College Backpacks",
        slug: "school-college-backpacks",
        parent_slug: "stationery-school-bags",
        child_subcategories: [
          { id: 6001, name: "Korean Trendy School Bags", slug: "korean-school-bags" },
          { id: 6002, name: "Slim Waterproof Laptop Bags", slug: "waterproof-laptop-bags" },
          { id: 6003, name: "Primary School Cartoon Bags", slug: "primary-school-bags" },
        ],
      },
      {
        id: 602,
        name: "DIY Crafts & Foam Sheets",
        slug: "diy-crafts-foam-sheets",
        parent_slug: "stationery-school-bags",
        child_subcategories: [
          { id: 6004, name: "A4 Glitter Foam Sheets (Self Adhesive)", slug: "glitter-foam-sheets" },
          { id: 6005, name: "Children Craft Accessories", slug: "children-craft-accessories" },
        ],
      },
    ],
  },
];

// ==========================================
// REAL INITIAL PRODUCTS (HHC DROPSHIPPING VERIFIED)
// ==========================================
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 3768621,
    title: "Premium Bridal Silk Nighty Gown Set (Night Ease Edition)",
    slug: "premium-bridal-silk-nighty-gown-set",
    description: "Ultra-luxurious 2-piece bridal silk nighty gown set crafted with imported satin silk. Features delicate lace embroidery, adjustable straps, and smooth breathable fabric tailored for superior comfort and elegance.",
    price: 2450,
    original_price: 3650,
    wholesale_price: 1450,
    stock: 25,
    thumbnail_url: "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/18/1e9c870518b5798afed6e643e848de66.jpg",
    gallery_urls: [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/18/80d5d26f5a51fb1cc6fef86d85450daa.jpg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/18/c001e6291270ba7cb24a61f5f698e0cf.jpg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/18/45875c174b1cfa6709eebba468fc75e1.jpg",
    ],
    category_slug: "bridal-silk-nightwear",
    subcategory_slug: "bridal-nighty-gowns",
    child_subcategory_slug: "2-piece-silk-sets",
    is_active: true,
    is_featured: true,
    is_flash_deal: true, // Flash deal top 4
    rating: 4.9,
    reviews_count: 42,
    variations: {
      sizes: ["Small", "Medium", "Large", "XL"],
      colors: ["Royal Maroon", "Midnight Black", "Blush Pink", "Emerald Green"],
    },
    sku: "NE-SILK-001",
    created_at: new Date().toISOString(),
  },
  {
    id: 3765606,
    title: "Smiley Cartoon Stationery Pencils Children Gift (Pack of 5)",
    slug: "smiley-cartoon-stationery-pencils-children-gift-pack-of-5",
    description: "Smiley Cartoon Stationery Pencils for kids. These colorful, fun pencils feature funny faces and come in a pack of 5. Perfect for school students, birthday return gifts, and daily drawing routine.",
    price: 761,
    original_price: 1050,
    wholesale_price: 261,
    stock: 50,
    thumbnail_url: "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/16/c8f6f115b78ec57b96203e6ca4911ca3.jpeg",
    gallery_urls: [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/16/c8f6f115b78ec57b96203e6ca4911ca3.jpeg",
    ],
    category_slug: "kids-educational-toys",
    subcategory_slug: "creative-art-drawing",
    child_subcategory_slug: "smiley-cartoon-pencils",
    is_active: true,
    is_featured: true,
    is_flash_deal: true, // Flash deal top 4
    rating: 4.8,
    reviews_count: 28,
    variations: {
      colors: ["Rainbow Fun Faces", "Pastel Assorted"],
    },
    sku: "HHC-3765606-ADV",
    created_at: new Date().toISOString(),
  },
  {
    id: 3765602,
    title: "54 Pcs Art Studio Kit - Children Creative Drawing & Craft Set",
    slug: "54-pcs-color-kit-art-studio-drawing-craft-set",
    description: "Complete 54-piece art studio kit containing vibrant oil pastels, wax crayons, color markers, watercolor cakes, paint brush, sharpener, and eraser in a portable carry organizer box.",
    price: 1650,
    original_price: 2450,
    wholesale_price: 1082,
    stock: 35,
    thumbnail_url: "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/16/81a9c402120019ee7fe46914619bb391.jpeg",
    gallery_urls: [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/16/81a9c402120019ee7fe46914619bb391.jpeg",
    ],
    category_slug: "kids-educational-toys",
    subcategory_slug: "creative-art-drawing",
    child_subcategory_slug: "54-pcs-art-studio-kits",
    is_active: true,
    is_featured: true,
    is_flash_deal: true, // Flash deal top 4
    rating: 4.9,
    reviews_count: 31,
    variations: {
      colors: ["Sky Blue Studio", "Princess Pink Studio"],
    },
    sku: "HHC-3765602-ADV",
    created_at: new Date().toISOString(),
  },
  {
    id: 3764364,
    title: "Type-C 3.1A Quick Charge Fast Charging Data Cable (Tangle Free)",
    slug: "type-c-3-1a-fast-charging-data-cable-tangle-free",
    description: "Quick charge 3.0 Type-C cable with reinforced stress points. Ultra durable pure copper core guarantees stable power delivery and rapid data synchronization for all Android smartphones.",
    price: 550,
    original_price: 850,
    wholesale_price: 186,
    stock: 110,
    thumbnail_url: "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/10/eb014c405615d0fa8b2b7161b369c733.jpeg",
    gallery_urls: [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/10/eb014c405615d0fa8b2b7161b369c733.jpeg",
    ],
    category_slug: "smart-gadgets-audio",
    subcategory_slug: "cables-fast-chargers",
    child_subcategory_slug: "type-c-fast-cables",
    is_active: true,
    is_featured: true,
    is_flash_deal: true, // Flash deal top 4
    rating: 4.8,
    reviews_count: 56,
    variations: {
      colors: ["Braided Red", "Stealth Black"],
    },
    sku: "HHC-3764364-ADV",
    created_at: new Date().toISOString(),
  },
  {
    id: 3764363,
    title: "In-Ear Deep Bass Stereo Handsfree with HD Microphone & Call Button",
    slug: "in-ear-deep-bass-stereo-handsfree-hd-mic",
    description: "Deep bass sound reproduction 3.5mm jack earphones with silicone ear tips for noise isolation. Crystal clear microphone for gaming, calling, and online classes.",
    price: 590,
    original_price: 950,
    wholesale_price: 175,
    stock: 95,
    thumbnail_url: "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/10/a563a34a8b79ff88d8b6710b1a03e1e2.jpeg",
    gallery_urls: [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/10/a563a34a8b79ff88d8b6710b1a03e1e2.jpeg",
    ],
    category_slug: "smart-gadgets-audio",
    subcategory_slug: "wired-handsfree-audio",
    child_subcategory_slug: "deep-bass-stereo-handsfree",
    is_active: true,
    is_featured: true,
    is_flash_deal: false,
    rating: 4.7,
    reviews_count: 39,
    variations: {
      colors: ["Piano Black", "Arctic White"],
    },
    sku: "HHC-3764363-ADV",
    created_at: new Date().toISOString(),
  },
  {
    id: 3769110,
    title: "Multifunction 4-in-1 Handheld Electric Vegetable Slicer & Garlic Chopper",
    slug: "multifunction-4-in-1-electric-vegetable-slicer-chopper",
    description: "Wireless handheld 4-in-1 electric food chopper, slicer, mincer, and cleaning brush. USB Type-C rechargeable with stainless steel blades. Chops garlic, peppers, onions, and vegetables in seconds without eye tears.",
    price: 2250,
    original_price: 3250,
    wholesale_price: 1450,
    stock: 40,
    thumbnail_url: "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/20/3b5d2ef48c0a34b22c8e312948c5a210.jpg",
    gallery_urls: [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/20/3b5d2ef48c0a34b22c8e312948c5a210.jpg",
    ],
    category_slug: "home-kitchen-essentials",
    subcategory_slug: "smart-kitchen-tools",
    child_subcategory_slug: "electric-vegetable-slicers",
    is_active: true,
    is_featured: true,
    is_flash_deal: false,
    rating: 4.9,
    reviews_count: 64,
    variations: {
      colors: ["Pastel Mint Green", "Cream White"],
    },
    sku: "HHC-3769110-ALM",
    created_at: new Date().toISOString(),
  },
  {
    id: 3769225,
    title: "Stainless Steel Smart Vacuum Flask with LED Temperature Touch Display 500ml",
    slug: "smart-vacuum-flask-led-temperature-display-500ml",
    description: "500ml double-wall insulated water bottle keeping liquids hot or cold for 12 hours. High-tech smart touch LED temperature display cap with waterproof battery.",
    price: 1550,
    original_price: 2250,
    wholesale_price: 890,
    stock: 55,
    thumbnail_url: "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/22/e1b34c118a7d65f5e8841a0e8832a8ff.jpg",
    gallery_urls: [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/22/e1b34c118a7d65f5e8841a0e8832a8ff.jpg",
    ],
    category_slug: "home-kitchen-essentials",
    subcategory_slug: "thermal-bottles-flasks",
    child_subcategory_slug: "led-temperature-flasks",
    is_active: true,
    is_featured: true,
    is_flash_deal: false,
    rating: 4.8,
    reviews_count: 48,
    variations: {
      colors: ["Matte Black", "Rose Gold", "Royal Navy", "Metallic Silver"],
    },
    sku: "HHC-3769225-ALP",
    created_at: new Date().toISOString(),
  },
  {
    id: 3768840,
    title: "Automatic Wireless USB Rechargeable Water Dispenser Pump for 19L Bottles",
    slug: "automatic-wireless-usb-water-dispenser-pump",
    description: "Universal electric water bottle pump for standard 19-liter water coolers. One-touch silent pumping, food grade silicone hose, 1200mAh long battery life.",
    price: 1199,
    original_price: 1850,
    wholesale_price: 620,
    stock: 65,
    thumbnail_url: "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/19/7e9a8f118a7d65f5e8841a0e8832a8ff.jpg",
    gallery_urls: [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/19/7e9a8f118a7d65f5e8841a0e8832a8ff.jpg",
    ],
    category_slug: "home-kitchen-essentials",
    subcategory_slug: "home-utility-pumps",
    child_subcategory_slug: "automatic-water-pumps",
    is_active: true,
    is_featured: true,
    is_flash_deal: false,
    rating: 4.7,
    reviews_count: 33,
    variations: {
      colors: ["Crisp White", "Obsidian Black"],
    },
    sku: "HHC-3768840-ALF",
    created_at: new Date().toISOString(),
  },
  {
    id: 3768622,
    title: "Glitter Foam Sheet A4 - Self Adhesive (Pack of 10 Assorted Vibrant Colors)",
    slug: "glitter-foam-sheet-a4-self-adhesive-pack-of-10",
    description: "Glitter Foam Sheets A4 - Self Adhesive (Pack of 10). Assorted vibrant colors. Perfect for children's craft activities, school models, and DIY projects. Sheets are self-adhesive (sticky back) for easy mess-free crafting.",
    price: 826,
    original_price: 1250,
    wholesale_price: 326,
    stock: 60,
    thumbnail_url: "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/18/1e9c870518b5798afed6e643e848de66.jpg",
    gallery_urls: [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/18/80d5d26f5a51fb1cc6fef86d85450daa.jpg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/18/c001e6291270ba7cb24a61f5f698e0cf.jpg",
    ],
    category_slug: "stationery-school-bags",
    subcategory_slug: "diy-crafts-foam-sheets",
    child_subcategory_slug: "glitter-foam-sheets",
    is_active: true,
    is_featured: false,
    is_flash_deal: false,
    rating: 4.8,
    reviews_count: 17,
    sku: "HHC-3768621-ADV",
    created_at: new Date().toISOString(),
  },
  {
    id: 3765076,
    title: "Maybelline Superstay Lumi Matte Foundation Shade 220 (Light-as-Air)",
    slug: "maybelline-superstay-lumi-matte-foundation-220",
    description: "Long-wear foundation with breathable light formula, providing 30H matte luminous coverage resistant to sweat, humidity, and transfer. Ideal for all skin types.",
    price: 2850,
    original_price: 3950,
    wholesale_price: 2205,
    stock: 22,
    thumbnail_url: "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/13/2a1a8df9e821ef9a1e8ff5f9e8312e73.jpeg",
    gallery_urls: [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/13/2a1a8df9e821ef9a1e8ff5f9e8312e73.jpeg",
    ],
    category_slug: "fashion-watches",
    subcategory_slug: "wallets-accessories",
    child_subcategory_slug: "beauty-accessories",
    is_active: true,
    is_featured: false,
    is_flash_deal: false,
    rating: 4.9,
    reviews_count: 14,
    variations: {
      colors: ["Shade 220 Warm", "Shade 128 Medium"],
    },
    sku: "HHC-3765076-12W",
    created_at: new Date().toISOString(),
  },
];

// ==========================================
// INITIAL STORE SETTINGS
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

// ==========================================
// DUAL-TIER STORAGE HELPERS (Zero-Crash Fallback)
// ==========================================
function getStoredProducts(): Product[] {
  if (typeof window === "undefined") return INITIAL_PRODUCTS;
  try {
    const raw = localStorage.getItem("abm_stored_products");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return INITIAL_PRODUCTS;
}

function setStoredProducts(prods: Product[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("abm_stored_products", JSON.stringify(prods));
    } catch {}
  }
}

function getStoredCategories(): Category[] {
  if (typeof window === "undefined") return INITIAL_CATEGORIES;
  try {
    const raw = localStorage.getItem("abm_stored_categories");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return INITIAL_CATEGORIES;
}

function setStoredCategories(cats: Category[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("abm_stored_categories", JSON.stringify(cats));
    } catch {}
  }
}

export function getStoredOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("abm_stored_orders") || localStorage.getItem("abm_orders");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function setStoredOrders(ords: Order[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("abm_stored_orders", JSON.stringify(ords));
      localStorage.setItem("abm_orders", JSON.stringify(ords));
    } catch {}
  }
}

// ==========================================
// PRODUCTS DATA LAYER
// ==========================================
export async function getProducts(options?: {
  category?: string;
  subcategory?: string;
  search?: string;
  limit?: number;
  offset?: number;
  featured?: boolean;
  flashDeals?: boolean;
  includeInactive?: boolean;
}): Promise<{ products: Product[]; total: number }> {
  try {
    let query = supabase
      .from("products")
      .select(
        "id, title, slug, description, price, original_price, wholesale_price, stock, thumbnail_url, gallery_urls, category_slug, subcategory_slug, child_subcategory_slug, is_active, is_featured, is_flash_deal, rating, reviews_count, variations, sku, hhc_product_id, hhc_store_id, created_at",
        { count: "exact" }
      );

    if (!options?.includeInactive) {
      query = query.eq("is_active", true);
    }

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

    const limit = options?.limit || 8;
    const from = options?.offset || 0;
    const to = from + limit - 1;

    query = query.order("created_at", { ascending: false }).range(from, to);

    const { data, count, error } = await query;

    if (!error && data && data.length > 0) {
      const prods = data as Product[];
      setStoredProducts(prods);
      return {
        products: prods,
        total: count ?? prods.length,
      };
    }

    // Fallback only if database unreachable
    let filtered = getStoredProducts();
    if (!options?.includeInactive) {
      filtered = filtered.filter((p) => p.is_active);
    }
    if (options?.category) {
      filtered = filtered.filter((p) => p.category_slug === options.category);
    }
    if (options?.subcategory) {
      filtered = filtered.filter((p) => p.subcategory_slug === options.subcategory);
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
  } catch {
    const list = getStoredProducts().filter((p) => p.is_active);
    return { products: list.slice(0, options?.limit || 8), total: list.length };
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const cleanSlug = decodeURIComponent(slug || "").trim();
  if (!cleanSlug) return null;

  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        "id, title, slug, description, price, original_price, wholesale_price, stock, thumbnail_url, gallery_urls, category_slug, subcategory_slug, child_subcategory_slug, is_active, is_featured, is_flash_deal, rating, reviews_count, variations, sku, hhc_product_id, hhc_store_id, created_at"
      )
      .eq("slug", cleanSlug)
      .maybeSingle();

    if (!error && data) {
      return data as Product;
    }

    const prods = getStoredProducts();
    const match = prods.find(
      (p) =>
        p.slug === cleanSlug ||
        p.slug === slug ||
        String(p.id) === String(cleanSlug) ||
        (p.sku && p.sku.toLowerCase() === cleanSlug.toLowerCase()) ||
        (p.hhc_product_id && String(p.hhc_product_id) === String(cleanSlug))
    );
    return match || null;
  } catch {
    const prods = getStoredProducts();
    const match = prods.find(
      (p) =>
        p.slug === cleanSlug ||
        p.slug === slug ||
        String(p.id) === String(cleanSlug) ||
        (p.sku && p.sku.toLowerCase() === cleanSlug.toLowerCase()) ||
        (p.hhc_product_id && String(p.hhc_product_id) === String(cleanSlug))
    );
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
      .select("id, name, slug, image_url, parent_slug, level, subcategories, show_on_homepage, sort_order")
      .order("sort_order", { ascending: true });

    if (!error && data && data.length > 0) {
      const cats = data as Category[];
      setStoredCategories(cats);
      return cats;
    }
    return getStoredCategories();
  } catch {
    return getStoredCategories();
  }
}

// ==========================================
// ORDERS DATA LAYER
// ==========================================
// ==========================================
// ORDERS DATA LAYER
// ==========================================
export async function getOrders(): Promise<Order[]> {
  const localOrders = getStoredOrders();
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      const remoteOrders = data as Order[];
      const map = new Map<string, Order>();
      // First populate with local orders
      localOrders.forEach((o) => {
        const key = o.order_number || String(o.id);
        if (key) map.set(key, o);
      });
      // Merge remote orders
      remoteOrders.forEach((o) => {
        const key = o.order_number || String(o.id);
        if (key) map.set(key, o);
      });
      const merged = Array.from(map.values()).sort((a, b) => {
        const tA = new Date(a.created_at || "").getTime();
        const tB = new Date(b.created_at || "").getTime();
        return tB - tA;
      });
      setStoredOrders(merged);
      return merged;
    }
  } catch {}
  return localOrders;
}

export async function createOrder(orderPayload: Omit<Order, "id" | "created_at">): Promise<{ success: boolean; order_number?: string; error?: string }> {
  try {
    const orderNumber = `ABM-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      ...orderPayload,
      id: `ORD-${Date.now()}`,
      order_number: orderNumber,
      status: "Pending",
      created_at: new Date().toISOString(),
    };

    // 1. Save to local cache first
    const currentOrders = getStoredOrders();
    setStoredOrders([newOrder, ...currentOrders]);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("abm_last_order_id", orderNumber);
        localStorage.setItem("abm_last_order", JSON.stringify(newOrder));
        sessionStorage.setItem("abm_last_order_id", orderNumber);
      } catch {}
      window.dispatchEvent(new CustomEvent("kb_orders_updated", { detail: newOrder }));
    }

    // 2. Non-blocking remote database insert
    try {
      await supabase.from("orders").insert([
        {
          order_number: orderNumber,
          customer_name: orderPayload.customer_name,
          phone: orderPayload.phone,
          whatsapp: orderPayload.whatsapp || null,
          city: orderPayload.city,
          address: orderPayload.address,
          items: orderPayload.items,
          subtotal: orderPayload.subtotal,
          delivery_charges: orderPayload.delivery_charges,
          discount: orderPayload.discount,
          discount_code: orderPayload.discount_code || null,
          total_amount: orderPayload.total_amount,
          payment_method: orderPayload.payment_method,
          payment_status: orderPayload.payment_status,
          payment_proof_url: orderPayload.payment_proof_url || null,
          status: "Pending",
          order_notes: orderPayload.order_notes || null,
        },
      ]);
    } catch {}

    return { success: true, order_number: orderNumber };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Order placement failed";
    return { success: false, error: msg };
  }
}

export async function getOrderById(orderNumber: string): Promise<Order | null> {
  const localList = getStoredOrders();
  const localMatch = localList.find((o) => o.order_number === orderNumber || String(o.id) === orderNumber);

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_number", orderNumber)
      .maybeSingle();

    if (!error && data) {
      return data as Order;
    }
  } catch {}

  if (typeof window !== "undefined") {
    try {
      const last = localStorage.getItem("abm_last_order");
      if (last) {
        const p = JSON.parse(last);
        if (p.order_number === orderNumber) return p;
      }
    } catch {}
  }

  return localMatch || null;
}

export async function adminDeleteOrder(orderId: string | number): Promise<{ success: boolean; error?: string }> {
  try {
    const orders = getStoredOrders().filter(
      (o) => String(o.id) !== String(orderId) && o.order_number !== String(orderId)
    );
    setStoredOrders(orders);

    try {
      await supabase.from("orders").delete().or(`id.eq.${orderId},order_number.eq.${orderId}`);
    } catch {}

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("kb_orders_updated", { detail: orders }));
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Order deletion failed";
    return { success: false, error: msg };
  }
}

// ==========================================
// SETTINGS & BANNERS
// ==========================================
export function getStoredSettings(): SiteSettings {
  if (typeof window === "undefined") return INITIAL_SETTINGS;
  try {
    const raw = localStorage.getItem("abm_stored_settings");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return { ...INITIAL_SETTINGS, ...parsed };
    }
  } catch {}
  return INITIAL_SETTINGS;
}

export function setStoredSettings(settings: SiteSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("abm_stored_settings", JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent("kb_settings_updated", { detail: settings }));
  } catch {}
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const local = getStoredSettings();
  try {
    const { data, error } = await supabase.from("store_settings").select("*").eq("id", 1).maybeSingle();
    if (!error && data) {
      const merged = { ...local, ...data };
      setStoredSettings(merged);
      return merged as SiteSettings;
    }
  } catch {}
  return local;
}

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 1,
    title: "Abrish Mart Special Offers - Shop Smart, Save More!",
    image_url: "/images/banners/hero-banner.png",
    link_url: "/shop",
    is_active: true,
    sort_order: 1,
  },
];

export function getStoredBanners(): Banner[] {
  if (typeof window === "undefined") return INITIAL_BANNERS;
  try {
    const raw = localStorage.getItem("abm_stored_banners");
    if (!raw) return INITIAL_BANNERS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_BANNERS;
  } catch {
    return INITIAL_BANNERS;
  }
}

export function setStoredBanners(banners: Banner[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("abm_stored_banners", JSON.stringify(banners));
    window.dispatchEvent(new CustomEvent("kb_banners_updated", { detail: banners }));
  } catch {}
}

export async function getBanners(includeInactive = false): Promise<Banner[]> {
  const localBanners = getStoredBanners();
  try {
    let query = supabase
      .from("banners")
      .select("id, title, image_url, link_url, is_active, sort_order")
      .order("sort_order", { ascending: true });
    if (!includeInactive) {
      query = query.eq("is_active", true);
    }
    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      const remoteBanners = data as Banner[];
      const map = new Map<string, Banner>();
      remoteBanners.forEach((b) => map.set(String(b.id), b));
      localBanners.forEach((b) => {
        if (!map.has(String(b.id))) map.set(String(b.id), b);
      });
      const combined = Array.from(map.values()).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      setStoredBanners(combined);
      return includeInactive ? combined : combined.filter((b) => b.is_active);
    }
  } catch {}
  return includeInactive ? localBanners : localBanners.filter((b) => b.is_active);
}

export async function adminSaveBanner(banner: Partial<Banner>): Promise<{ success: boolean; banner?: Banner; error?: string }> {
  try {
    const banners = getStoredBanners();
    const id = banner.id || `BAN-${Date.now()}`;
    const cleanBanner: Banner = {
      id,
      title: banner.title || "Promotional Banner",
      image_url: banner.image_url || "/images/banners/hero-banner.png",
      link_url: banner.link_url || "/shop",
      is_active: banner.is_active ?? true,
      sort_order: banner.sort_order ?? (banners.length + 1),
    };

    const idx = banners.findIndex((b) => String(b.id) === String(id));
    if (idx >= 0) {
      banners[idx] = { ...banners[idx], ...cleanBanner };
    } else {
      banners.push(cleanBanner);
    }
    setStoredBanners(banners);

    // Sync to Supabase in non-blocking way
    try {
      await supabase.from("banners").upsert([
        {
          id: String(cleanBanner.id),
          title: cleanBanner.title,
          image_url: cleanBanner.image_url,
          link_url: cleanBanner.link_url,
          is_active: cleanBanner.is_active,
          sort_order: cleanBanner.sort_order,
        },
      ]);
    } catch {}

    return { success: true, banner: cleanBanner };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Banner save failed";
    return { success: false, error: msg };
  }
}

export async function adminDeleteBanner(id: string | number): Promise<{ success: boolean; error?: string }> {
  try {
    const banners = getStoredBanners().filter((b) => String(b.id) !== String(id));
    setStoredBanners(banners);

    try {
      await supabase.from("banners").delete().eq("id", id);
    } catch {}

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Banner deletion failed";
    return { success: false, error: msg };
  }
}

// ==========================================
// COUPONS & DISCOUNTS SYSTEM (HYBRID DUAL-TIER)
// ==========================================
export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 1,
    code: "WELCOME200",
    discount_type: "fixed",
    discount_value: 200,
    min_spend: 1500,
    free_shipping: false,
    is_active: true,
  },
  {
    id: 2,
    code: "ABRISH10",
    discount_type: "percentage",
    discount_value: 10,
    min_spend: 2000,
    free_shipping: false,
    is_active: true,
  },
  {
    id: 3,
    code: "FREESHIP",
    discount_type: "fixed",
    discount_value: 200,
    min_spend: 2500,
    free_shipping: true,
    is_active: true,
  },
];

export function getStoredCoupons(): Coupon[] {
  if (typeof window === "undefined") return INITIAL_COUPONS;
  try {
    const raw = localStorage.getItem("abm_stored_coupons");
    if (!raw) return INITIAL_COUPONS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_COUPONS;
  } catch {
    return INITIAL_COUPONS;
  }
}

export function setStoredCoupons(coupons: Coupon[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("abm_stored_coupons", JSON.stringify(coupons));
    window.dispatchEvent(new CustomEvent("kb_coupons_updated", { detail: coupons }));
  } catch {}
}

export async function getCoupons(): Promise<Coupon[]> {
  const localList = getStoredCoupons();
  try {
    const { data, error } = await supabase.from("coupons").select("*");
    if (!error && data && data.length > 0) {
      const remoteCoupons = data as Coupon[];
      const map = new Map<string, Coupon>();
      remoteCoupons.forEach((c) => map.set(c.code.toUpperCase(), c));
      localList.forEach((c) => {
        if (!map.has(c.code.toUpperCase())) map.set(c.code.toUpperCase(), c);
      });
      const combined = Array.from(map.values());
      setStoredCoupons(combined);
      return combined;
    }
  } catch {}
  return localList;
}

export async function adminSaveCoupon(coupon: Partial<Coupon>): Promise<{ success: boolean; coupon?: Coupon; error?: string }> {
  try {
    const code = (coupon.code || "").trim().toUpperCase();
    if (!code) {
      return { success: false, error: "Coupon code is required" };
    }
    const coupons = getStoredCoupons();
    const id = coupon.id || `CPN-${Date.now()}`;
    const cleanCoupon: Coupon = {
      id,
      code,
      discount_type: coupon.discount_type || "fixed",
      discount_value: Number(coupon.discount_value) || 0,
      min_spend: Number(coupon.min_spend) || 0,
      free_shipping: Boolean(coupon.free_shipping),
      is_active: coupon.is_active ?? true,
      created_at: coupon.created_at || new Date().toISOString(),
    };

    const idx = coupons.findIndex((c) => String(c.id) === String(id) || c.code.toUpperCase() === code);
    if (idx >= 0) {
      coupons[idx] = cleanCoupon;
    } else {
      coupons.unshift(cleanCoupon);
    }
    setStoredCoupons(coupons);

    try {
      await supabase.from("coupons").upsert([cleanCoupon]);
    } catch {}

    return { success: true, coupon: cleanCoupon };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Coupon save failed";
    return { success: false, error: msg };
  }
}

export async function adminDeleteCoupon(id: string | number): Promise<{ success: boolean; error?: string }> {
  try {
    const coupons = getStoredCoupons().filter((c) => String(c.id) !== String(id));
    setStoredCoupons(coupons);

    try {
      await supabase.from("coupons").delete().eq("id", id);
    } catch {}

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Coupon deletion failed";
    return { success: false, error: msg };
  }
}

export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<{ valid: boolean; message: string; discountAmount: number; freeShipping: boolean; coupon?: Coupon }> {
  const cleanCode = (code || "").trim().toUpperCase();
  if (!cleanCode) {
    return { valid: false, message: "Please enter a coupon code.", discountAmount: 0, freeShipping: false };
  }

  const coupons = await getCoupons();
  const found = coupons.find((c) => c.code.toUpperCase() === cleanCode);

  if (!found) {
    return { valid: false, message: `Coupon "${cleanCode}" is invalid.`, discountAmount: 0, freeShipping: false };
  }

  if (!found.is_active) {
    return { valid: false, message: `Coupon "${cleanCode}" is inactive or expired.`, discountAmount: 0, freeShipping: false };
  }

  if (subtotal < (found.min_spend || 0)) {
    return {
      valid: false,
      message: `Coupon "${cleanCode}" requires a minimum order value of Rs. ${(found.min_spend || 0).toLocaleString()}.`,
      discountAmount: 0,
      freeShipping: false,
    };
  }

  let discountAmount = 0;
  if (found.discount_type === "percentage") {
    discountAmount = Math.round((subtotal * found.discount_value) / 100);
  } else {
    discountAmount = Math.min(found.discount_value, subtotal);
  }

  return {
    valid: true,
    message: `🎉 Coupon "${found.code}" applied! You saved Rs. ${discountAmount.toLocaleString()}.`,
    discountAmount,
    freeShipping: Boolean(found.free_shipping),
    coupon: found,
  };
}

// ==========================================
// ADMIN MUTATION ROUTINES (HYBRID DUAL-TIER)
// ==========================================
export async function adminSaveProduct(product: Partial<Product>): Promise<{ success: boolean; error?: string }> {
  try {
    const cleanPayload: Product = {
      id: product.id || `PROD-${Date.now()}`,
      title: product.title || "Untitled Product",
      slug: product.slug || `prod-${Date.now()}`,
      description: product.description || "",
      price: product.price || 0,
      original_price: product.original_price,
      wholesale_price: product.wholesale_price,
      stock: product.stock || 0,
      thumbnail_url: product.thumbnail_url || "/images/banners/hero-banner.png",
      gallery_urls: product.gallery_urls || [],
      category_slug: product.category_slug || "general",
      subcategory_slug: product.subcategory_slug || undefined,
      child_subcategory_slug: product.child_subcategory_slug || undefined,
      is_active: product.is_active ?? true,
      is_featured: product.is_featured ?? false,
      is_flash_deal: product.is_flash_deal ?? false,
      rating: product.rating || 4.8,
      reviews_count: product.reviews_count || 12,
      variations: product.variations || {},
      sku: product.sku || "",
      hhc_product_id:
        product.hhc_product_id ||
        (product.sku && /hhc/i.test(product.sku)
          ? parseInt(product.sku.replace(/\D/g, ""), 10) || undefined
          : undefined),
      hhc_store_id: product.hhc_store_id,
      created_at: product.created_at || new Date().toISOString(),
    };

    // 1. Update local cache immediately
    const prods = getStoredProducts();
    const existingIndex = prods.findIndex((p) => String(p.id) === String(cleanPayload.id) || p.slug === cleanPayload.slug);
    if (existingIndex >= 0) {
      prods[existingIndex] = { ...prods[existingIndex], ...cleanPayload };
    } else {
      prods.unshift(cleanPayload);
    }
    setStoredProducts(prods);

    // 2. Try remote database sync
    try {
      await supabase.from("products").upsert(cleanPayload, { onConflict: "slug" });
    } catch {}

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
    const target = String(id);
    const prods = getStoredProducts().filter((p) => String(p.id) !== target && p.slug !== target);
    setStoredProducts(prods);

    try {
      await supabase.from("products").delete().eq("id", target);
      await supabase.from("products").delete().eq("slug", target);
    } catch {}

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
    const newCat: Category = {
      id: category.id || `CAT-${Date.now()}`,
      name: category.name || "New Category",
      slug: category.slug || `cat-${Date.now()}`,
      image_url: category.image_url || "/images/categories/bridal-silk.webp",
      parent_slug: category.parent_slug || null,
      level: category.level || 1,
      subcategories: category.subcategories || [],
      show_on_homepage: category.show_on_homepage ?? true,
      sort_order: category.sort_order || 0,
      created_at: new Date().toISOString(),
    };

    // 1. Update local cache
    const cats = getStoredCategories();
    const idx = cats.findIndex((c) => String(c.id) === String(newCat.id) || c.slug === newCat.slug);
    if (idx >= 0) {
      cats[idx] = { ...cats[idx], ...newCat };
    } else {
      cats.push(newCat);
    }
    setStoredCategories(cats);

    // 2. Try remote database sync
    try {
      await supabase.from("categories").upsert(
        {
          id: String(newCat.id),
          name: newCat.name,
          slug: newCat.slug,
          image_url: newCat.image_url,
          parent_slug: newCat.parent_slug,
          level: newCat.level || 1,
          subcategories: newCat.subcategories || [],
          show_on_homepage: newCat.show_on_homepage,
          sort_order: newCat.sort_order,
        },
        { onConflict: "slug" }
      );
    } catch {}

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
    const cats = getStoredCategories().filter((c) => String(c.id) !== String(id) && c.slug !== String(id));
    setStoredCategories(cats);

    try {
      await supabase.from("categories").delete().or(`id.eq.${id},slug.eq.${id}`);
    } catch {}

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("kb_categories_updated"));
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Delete category failed";
    return { success: false, error: msg };
  }
}

export async function adminAddSubcategory(
  categorySlug: string,
  subName: string,
  subSlug: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const cats = getStoredCategories();
    const parentCat = cats.find((c) => c.slug === categorySlug);
    if (!parentCat) return { success: false, error: "Parent category not found" };

    if (!parentCat.subcategories) parentCat.subcategories = [];
    parentCat.subcategories.push({
      id: Date.now(),
      name: subName,
      slug: subSlug,
      parent_slug: categorySlug,
      child_subcategories: [],
    });

    setStoredCategories(cats);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("kb_categories_updated"));
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to add subcategory";
    return { success: false, error: msg };
  }
}

export async function adminAddChildSubcategory(
  categorySlug: string,
  subcategorySlug: string,
  childName: string,
  childSlug: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const cats = getStoredCategories();
    const parentCat = cats.find((c) => c.slug === categorySlug);
    if (!parentCat || !parentCat.subcategories) return { success: false, error: "Subcategory parent not found" };

    const sub = parentCat.subcategories.find((s) => s.slug === subcategorySlug);
    if (!sub) return { success: false, error: "Subcategory not found" };

    if (!sub.child_subcategories) sub.child_subcategories = [];
    sub.child_subcategories.push({
      id: Date.now(),
      name: childName,
      slug: childSlug,
    });

    setStoredCategories(cats);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("kb_categories_updated"));
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to add nested child subcategory";
    return { success: false, error: msg };
  }
}

export async function adminDeleteSubcategory(
  categorySlug: string,
  subcategorySlug: string
): Promise<{ success: boolean }> {
  const cats = getStoredCategories();
  const parentCat = cats.find((c) => c.slug === categorySlug);
  if (parentCat && parentCat.subcategories) {
    parentCat.subcategories = parentCat.subcategories.filter((s) => s.slug !== subcategorySlug);
    setStoredCategories(cats);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("kb_categories_updated"));
    }
  }
  return { success: true };
}

export async function adminUpdateOrderStatus(orderId: string | number, status: Order["status"]): Promise<{ success: boolean; error?: string }> {
  try {
    const ords = getStoredOrders();
    const match = ords.find((o) => String(o.id) === String(orderId) || o.order_number === String(orderId));
    if (match) {
      match.status = status;
      setStoredOrders(ords);
    }

    try {
      await supabase.from("orders").update({ status }).eq("id", orderId);
    } catch {}

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("kb_orders_updated"));
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Update order status failed";
    return { success: false, error: msg };
  }
}

export async function adminUpdateOrderHhcDispatch(
  orderId: string | number,
  hhcOrderId: string | number,
  trackingNumber: string,
  courierName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const ords = getStoredOrders();
    const match = ords.find((o) => String(o.id) === String(orderId) || o.order_number === String(orderId));
    if (match) {
      match.status = "Shipped";
      match.hhc_order_id = String(hhcOrderId);
      match.tracking_number = trackingNumber;
      match.courier_name = courierName;
      setStoredOrders(ords);
    }

    try {
      await supabase
        .from("orders")
        .update({
          status: "Shipped",
          hhc_order_id: String(hhcOrderId),
          tracking_number: trackingNumber,
          courier_name: courierName,
        })
        .eq("id", orderId);
    } catch {}

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("kb_orders_updated"));
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Dispatch update failed";
    return { success: false, error: msg };
  }
}

export async function adminSaveSettings(settings: Partial<SiteSettings>): Promise<{ success: boolean; error?: string }> {
  try {
    const current = getStoredSettings();
    const updated: SiteSettings = {
      ...current,
      ...settings,
      delivery_charge: settings.delivery_charge !== undefined ? Number(settings.delivery_charge) : current.delivery_charge,
      free_shipping_threshold: settings.free_shipping_threshold !== undefined ? Number(settings.free_shipping_threshold) : current.free_shipping_threshold,
    };
    setStoredSettings(updated);

    try {
      await supabase.from("store_settings").upsert({
        id: 1,
        ...updated,
        updated_at: new Date().toISOString()
      });
    } catch {}

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("kb_settings_updated", { detail: updated }));
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Save settings failed";
    return { success: false, error: msg };
  }
}
