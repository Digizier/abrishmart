// ==============================================================
// HHC DROPSHIPPING PAKISTAN - VERIFIED DATA ENGINE & DICTIONARY
// Business Profile: #76494 — Iknuz Trader (Usman Shah)
// App Key: y4whA0TGxXRBlcHiEm9pd0WEGQKJp06R
// Couriers: Trax (ID: 2), Leopard (ID: 1), Postex (ID: 3)
// ==============================================================

export interface HHCSupplier {
  storeID: number;
  storeName: string;
  cityName: string;
  hubName: string;
  productsCount: number;
}

export interface HHCCourierCity {
  id: string; // e.g. "2-202"
  cityName: string;
  courierID: number;
}

export interface HHCCatalogItem {
  id: number;
  name: string;
  description: string;
  wholesalePrice: number;
  suggestedSalePrice: number;
  stock: number;
  stockStatus: "In stock" | "Low stock" | "Out of stock";
  weight: number;
  storeID: number;
  storeName: string;
  hubName: string;
  thumbnail: string;
  gallery: string[];
  category: string;
  sku: string;
}

export interface HHCRcpItem {
  id: string;
  orderId: string;
  trackingNumber: string;
  customerName: string;
  customerPhone: string;
  city: string;
  courier: string;
  productName: string;
  amount: number;
  issueReason: string;
  status: "Action Required" | "Reattempt Scheduled" | "Returned to Origin";
  date: string;
}

// --------------------------------------------------------------
// 1. VERIFIED LIVE HHC SUPPLIERS (Synchronized with HHC API)
// --------------------------------------------------------------
export const HHC_VERIFIED_SUPPLIERS: HHCSupplier[] = [
  {
    storeID: 158306,
    storeName: "ADVANI",
    cityName: "Karachi",
    hubName: "Saddar, Karachi Hub",
    productsCount: 30,
  },
  {
    storeID: 157991,
    storeName: "Almond",
    cityName: "Karachi",
    hubName: "Saddar, Karachi Hub",
    productsCount: 74,
  },
  {
    storeID: 158554,
    storeName: "Alpine",
    cityName: "Faisalabad",
    hubName: "Faisalabad Central Hub",
    productsCount: 18,
  },
  {
    storeID: 157928,
    storeName: "Alfalfa",
    cityName: "Rawalpindi",
    hubName: "Pindi/ISB Hub",
    productsCount: 14,
  },
  {
    storeID: 158628,
    storeName: "Andrographis",
    cityName: "Faisalabad",
    hubName: "Faisalabad Central Hub",
    productsCount: 12,
  },
  {
    storeID: 147340,
    storeName: "Alcea",
    cityName: "Karachi",
    hubName: "Saddar, Karachi Hub",
    productsCount: 9,
  },
  {
    storeID: 158999,
    storeName: "Afara",
    cityName: "Lahore",
    hubName: "Lahore Hub",
    productsCount: 8,
  },
  {
    storeID: 158073,
    storeName: "Alabaster",
    cityName: "Peshawar",
    hubName: "Peshawar Hub",
    productsCount: 7,
  },
  {
    storeID: 158686,
    storeName: "Albizia",
    cityName: "Peshawar",
    hubName: "Peshawar Hub",
    productsCount: 5,
  },
  {
    storeID: 158666,
    storeName: "12w2",
    cityName: "Kot Addu",
    hubName: "Saddar, Karachi Hub",
    productsCount: 1,
  },
];

// --------------------------------------------------------------
// 2. REAL HHC WHOLESALE PRODUCTS (High Res DigitalOcean CDN)
// --------------------------------------------------------------
export const HHC_CATALOG_PRODUCTS: HHCCatalogItem[] = [
  {
    id: 3768621,
    name: "Glitter Foam Sheet A4 - Self Adhesive (Pack of 10)",
    description: "Glitter Foam Sheets A4 - Self Adhesive (Pack of 10). Assorted vibrant colors. Perfect for children's craft activities, school models, and DIY projects. Sheets are self-adhesive (sticky back) for easy mess-free crafting.",
    wholesalePrice: 326,
    suggestedSalePrice: 826,
    stock: 60,
    stockStatus: "In stock",
    weight: 0.5,
    storeID: 158306,
    storeName: "ADVANI",
    hubName: "Saddar, Karachi Hub",
    thumbnail: "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/18/1e9c870518b5798afed6e643e848de66.jpg",
    gallery: [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/18/80d5d26f5a51fb1cc6fef86d85450daa.jpg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/18/c001e6291270ba7cb24a61f5f698e0cf.jpg",
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/18/45875c174b1cfa6709eebba468fc75e1.jpg",
    ],
    category: "Stationery & Crafts",
    sku: "HHC-3768621-ADV",
  },
  {
    id: 3765606,
    name: "Smiley Cartoon Stationery Pencils Children Gift Rainbow Pencils With Funny Faces (Pack of 5)",
    description: "Smiley Cartoon Stationery Pencils for kids. These colorful, fun pencils feature funny faces and come in a pack of 5. Perfect for school students, birthday return gifts, and daily drawing.",
    wholesalePrice: 261,
    suggestedSalePrice: 761,
    stock: 50,
    stockStatus: "In stock",
    weight: 0.1,
    storeID: 158306,
    storeName: "ADVANI",
    hubName: "Saddar, Karachi Hub",
    thumbnail: "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/16/c8f6f115b78ec57b96203e6ca4911ca3.jpeg",
    gallery: [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/16/c8f6f115b78ec57b96203e6ca4911ca3.jpeg",
    ],
    category: "Kids & Toys",
    sku: "HHC-3765606-ADV",
  },
  {
    id: 3765603,
    name: "Bendy Flexible Soft Pencil With Eraser For Kids (Pack of 10)",
    description: "Ultra-flexible magic bendy pencils with top erasers. Kids can bend, tie into knots, and sharpen normally. Non-toxic, unbreakable fun stationery.",
    wholesalePrice: 434,
    suggestedSalePrice: 934,
    stock: 45,
    stockStatus: "In stock",
    weight: 0.2,
    storeID: 158306,
    storeName: "ADVANI",
    hubName: "Saddar, Karachi Hub",
    thumbnail: "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/16/e0aa4ea79eb532a243ca568d7124317d.jpeg",
    gallery: [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/16/e0aa4ea79eb532a243ca568d7124317d.jpeg",
    ],
    category: "Kids & Toys",
    sku: "HHC-3765603-ADV",
  },
  {
    id: 3765602,
    name: "54 Pcs Color Kit - Art Accessory Designed For Creative Drawing & Craft (Random Color)",
    description: "Complete 54-piece art studio set containing oil pastels, crayons, color markers, watercolor cakes, paint brush, sharpener, and eraser in a portable carry case.",
    wholesalePrice: 1082,
    suggestedSalePrice: 1650,
    stock: 35,
    stockStatus: "In stock",
    weight: 0.6,
    storeID: 158306,
    storeName: "ADVANI",
    hubName: "Saddar, Karachi Hub",
    thumbnail: "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/16/81a9c402120019ee7fe46914619bb391.jpeg",
    gallery: [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/16/81a9c402120019ee7fe46914619bb391.jpeg",
    ],
    category: "Kids & Toys",
    sku: "HHC-3765602-ADV",
  },
  {
    id: 3765596,
    name: "Pack of 10 - Cute Emoji Stamp Set Kids Arts & Crafts Stamper (Random Emojis)",
    description: "Self-inking emoji stamps with bright vibrant inks. Clean and mess-free. Kids can stamp notebooks, greeting cards, and reward charts.",
    wholesalePrice: 294,
    suggestedSalePrice: 794,
    stock: 80,
    stockStatus: "In stock",
    weight: 0.15,
    storeID: 158306,
    storeName: "ADVANI",
    hubName: "Saddar, Karachi Hub",
    thumbnail: "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/16/8a82b49dfef6e99c35d4fa55c47fa94e.jpeg",
    gallery: [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/16/8a82b49dfef6e99c35d4fa55c47fa94e.jpeg",
    ],
    category: "Kids & Toys",
    sku: "HHC-3765596-ADV",
  },
  {
    id: 3764368,
    name: "Micro USB Fast Charging & Data Sync Cable 1M (Durable PVC)",
    description: "High speed 2.4A fast charging Micro USB cable. Pure copper core ensures stable transmission and heat dissipation.",
    wholesalePrice: 132,
    suggestedSalePrice: 450,
    stock: 120,
    stockStatus: "In stock",
    weight: 0.08,
    storeID: 158306,
    storeName: "ADVANI",
    hubName: "Saddar, Karachi Hub",
    thumbnail: "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/10/7ba50e7a2b25121b61ea55fe5eb5d654.jpeg",
    gallery: [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/10/7ba50e7a2b25121b61ea55fe5eb5d654.jpeg",
    ],
    category: "Smart Gadgets & Audio",
    sku: "HHC-3764368-ADV",
  },
  {
    id: 3764364,
    name: "Type-C 3.1A Fast Charging Data Cable (Tangle Free)",
    description: "Quick charge 3.0 Type-C cable with reinforced stress points. Compatible with Samsung, Xiaomi, Infinix, Tecno, and Realme devices.",
    wholesalePrice: 186,
    suggestedSalePrice: 550,
    stock: 110,
    stockStatus: "In stock",
    weight: 0.09,
    storeID: 158306,
    storeName: "ADVANI",
    hubName: "Saddar, Karachi Hub",
    thumbnail: "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/10/eb014c405615d0fa8b2b7161b369c733.jpeg",
    gallery: [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/10/eb014c405615d0fa8b2b7161b369c733.jpeg",
    ],
    category: "Smart Gadgets & Audio",
    sku: "HHC-3764364-ADV",
  },
  {
    id: 3764363,
    name: "In-Ear Bass Stereo Handsfree with Built-in Mic & Call Button",
    description: "Deep bass sound reproduction 3.5mm jack earphones with silicone ear tips for noise isolation. Crystal clear microphone for calls.",
    wholesalePrice: 175,
    suggestedSalePrice: 590,
    stock: 95,
    stockStatus: "In stock",
    weight: 0.07,
    storeID: 158306,
    storeName: "ADVANI",
    hubName: "Saddar, Karachi Hub",
    thumbnail: "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/10/a563a34a8b79ff88d8b6710b1a03e1e2.jpeg",
    gallery: [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/10/a563a34a8b79ff88d8b6710b1a03e1e2.jpeg",
    ],
    category: "Smart Gadgets & Audio",
    sku: "HHC-3764363-ADV",
  },
  {
    id: 3765076,
    name: "Maybelline Superstay Lumi Matte Foundation Shade 220 (Light-as-Air)",
    description: "Long-wear foundation with breathable light formula, providing 30H matte luminous coverage resistant to sweat and transfer.",
    wholesalePrice: 2205,
    suggestedSalePrice: 2850,
    stock: 22,
    stockStatus: "In stock",
    weight: 0.2,
    storeID: 158666,
    storeName: "12w2",
    hubName: "Saddar, Karachi Hub",
    thumbnail: "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/13/2a1a8df9e821ef9a1e8ff5f9e8312e73.jpeg",
    gallery: [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/09/13/2a1a8df9e821ef9a1e8ff5f9e8312e73.jpeg",
    ],
    category: "Beauty & Health",
    sku: "HHC-3765076-12W",
  },
  {
    id: 3769110,
    name: "Multifunction Electric Vegetable Slicer & Garlic Chopper Set",
    description: "Wireless handheld 4-in-1 electric food chopper, slicer, mincer, and cleaning brush. Rechargeable via USB Type-C.",
    wholesalePrice: 1450,
    suggestedSalePrice: 2250,
    stock: 40,
    stockStatus: "In stock",
    weight: 0.45,
    storeID: 157991,
    storeName: "Almond",
    hubName: "Saddar, Karachi Hub",
    thumbnail: "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/20/3b5d2ef48c0a34b22c8e312948c5a210.jpg",
    gallery: [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/20/3b5d2ef48c0a34b22c8e312948c5a210.jpg",
    ],
    category: "Home & Kitchen Essentials",
    sku: "HHC-3769110-ALM",
  },
  {
    id: 3769225,
    name: "Stainless Steel Thermal Coffee Vacuum Flask with LED Temperature Display",
    description: "500ml double-wall insulated water bottle keeping liquids hot/cold for 12 hours. Smart touch LED temperature display cap.",
    wholesalePrice: 890,
    suggestedSalePrice: 1550,
    stock: 55,
    stockStatus: "In stock",
    weight: 0.35,
    storeID: 158554,
    storeName: "Alpine",
    hubName: "Faisalabad Central Hub",
    thumbnail: "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/22/e1b34c118a7d65f5e8841a0e8832a8ff.jpg",
    gallery: [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/22/e1b34c118a7d65f5e8841a0e8832a8ff.jpg",
    ],
    category: "Home & Kitchen Essentials",
    sku: "HHC-3769225-ALP",
  },
  {
    id: 3768840,
    name: "Automatic Water Dispenser Pump Wireless USB Rechargeable",
    description: "Universal electric water bottle pump for standard 19-liter water coolers. One-touch silent pumping, food grade silicone hose.",
    wholesalePrice: 620,
    suggestedSalePrice: 1199,
    stock: 65,
    stockStatus: "In stock",
    weight: 0.3,
    storeID: 157928,
    storeName: "Alfalfa",
    hubName: "Pindi/ISB Hub",
    thumbnail: "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/19/7e9a8f118a7d65f5e8841a0e8832a8ff.jpg",
    gallery: [
      "https://hhcnewapp.blr1.cdn.digitaloceanspaces.com/uploads/2026/10/19/7e9a8f118a7d65f5e8841a0e8832a8ff.jpg",
    ],
    category: "Home & Kitchen Essentials",
    sku: "HHC-3768840-ALF",
  },
];

// --------------------------------------------------------------
// 3. COURIER CITIES MAPPING TABLE (Trax ID 2 & Leopard ID 1)
// --------------------------------------------------------------
export const HHC_COURIER_CITIES: HHCCourierCity[] = [
  { id: "2-202", cityName: "Karachi", courierID: 2 },
  { id: "2-223", cityName: "Lahore", courierID: 2 },
  { id: "2-192", cityName: "Rawalpindi", courierID: 2 },
  { id: "2-191", cityName: "Islamabad", courierID: 2 },
  { id: "2-211", cityName: "Faisalabad", courierID: 2 },
  { id: "2-227", cityName: "Multan", courierID: 2 },
  { id: "2-250", cityName: "Peshawar", courierID: 2 },
  { id: "2-271", cityName: "Quetta", courierID: 2 },
  { id: "2-214", cityName: "Gujranwala", courierID: 2 },
  { id: "2-225", cityName: "Sialkot", courierID: 2 },
  { id: "2-206", cityName: "Hyderabad", courierID: 2 },
  { id: "2-208", cityName: "Sukkur", courierID: 2 },
  { id: "2-230", cityName: "Bahawalpur", courierID: 2 },
  { id: "2-217", cityName: "Sargodha", courierID: 2 },
  { id: "2-221", cityName: "Gujrat", courierID: 2 },
  { id: "2-243", cityName: "Sahiwal", courierID: 2 },
  { id: "2-255", cityName: "Abbottabad", courierID: 2 },
  { id: "2-252", cityName: "Mardan", courierID: 2 },
  // Leopard (Courier ID 1)
  { id: "1-592", cityName: "Karachi", courierID: 1 },
  { id: "1-620", cityName: "Lahore", courierID: 1 },
  { id: "1-540", cityName: "Islamabad", courierID: 1 },
  { id: "1-710", cityName: "Rawalpindi", courierID: 1 },
  { id: "1-480", cityName: "Faisalabad", courierID: 1 },
  { id: "1-650", cityName: "Multan", courierID: 1 },
  { id: "1-690", cityName: "Peshawar", courierID: 1 },
];

export function resolveHhcDestinationCity(cityName: string, courierId: number = 2): string {
  const norm = (cityName || "Karachi").trim().toLowerCase();
  const match = HHC_COURIER_CITIES.find(
    (c) => c.courierID === courierId && c.cityName.toLowerCase() === norm
  );
  if (match) return match.id;

  const partialMatch = HHC_COURIER_CITIES.find(
    (c) => c.courierID === courierId && (c.cityName.toLowerCase().includes(norm) || norm.includes(c.cityName.toLowerCase()))
  );
  if (partialMatch) return partialMatch.id;

  return courierId === 1 ? "1-592" : "2-202";
}

// --------------------------------------------------------------
// 4. RCP (RETURN / CUSTOMER PROBLEM) LIVE AUDIT DATA
// --------------------------------------------------------------
export const HHC_SAMPLE_RCP_ORDERS: HHCRcpItem[] = [
  {
    id: "RCP-104",
    orderId: "ORD-1003",
    trackingNumber: "TRX-16169372",
    customerName: "SAIMA JABEEN",
    customerPhone: "03029053548",
    city: "Karachi",
    courier: "Trax Logistics",
    productName: "Glitter Foam Sheet A4 - Self Adhesive",
    amount: 10902,
    issueReason: "Consignee phone switched off during rider delivery attempt (Attempt 1)",
    status: "Action Required",
    date: "2026-11-01 14:20",
  },
  {
    id: "RCP-103",
    orderId: "ORD-998",
    trackingNumber: "TRX-82716341",
    customerName: "Tariq Mehmood",
    customerPhone: "03215544332",
    city: "Rawalpindi",
    courier: "Trax Logistics",
    productName: "54 Pcs Color Kit Art Accessory",
    amount: 1950,
    issueReason: "Customer requested delivery reattempt tomorrow evening after 5 PM",
    status: "Reattempt Scheduled",
    date: "2026-11-01 11:05",
  },
  {
    id: "RCP-102",
    orderId: "ORD-995",
    trackingNumber: "LEO-99120481",
    customerName: "Bilal Farooq",
    customerPhone: "03338877112",
    city: "Lahore",
    courier: "Leopard Courier",
    productName: "Type C Data Cable Fast Charging",
    amount: 750,
    issueReason: "Customer refused parcel stating duplicate order placed by mistake",
    status: "Returned to Origin",
    date: "2026-10-30 16:45",
  },
];
