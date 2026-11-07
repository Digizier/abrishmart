import { supabase } from "./supabase";
import { Product, Category, Subcategory, Order, Banner, SiteSettings, Coupon } from "./types";

// ==========================================
// INITIAL CATEGORIES & NESTED SUBCATEGORIES (DARAZ HIERARCHY)
// ==========================================
export const INITIAL_CATEGORIES: Category[] = [
  {
    id: "CAT-1",
    name: "Kitchen",
    slug: "kitchen",
    image_url: "/images/categories/kitchen.webp",
    show_on_homepage: true,
    sort_order: 1,
    subcategories: [
      {
        id: 101,
        name: "Cookware & Bakeware",
        slug: "cookware-bakeware",
        parent_slug: "kitchen",
        child_subcategories: [
          { id: 1001, name: "Non-Stick Frying Pans", slug: "non-stick-frying-pans" },
          { id: 1002, name: "Pressure Cookers & Pots", slug: "pressure-cookers-pots" },
          { id: 1003, name: "Baking Moulds & Trays", slug: "baking-moulds-trays" }
        ]
      },
      {
        id: 102,
        name: "Kitchen Appliances",
        slug: "kitchen-appliances",
        parent_slug: "kitchen",
        child_subcategories: [
          { id: 1004, name: "Blenders & Food Processors", slug: "blenders-food-processors" },
          { id: 1005, name: "Electric Choppers & Slicers", slug: "electric-choppers-slicers" },
          { id: 1006, name: "Electric Kettles & Dispensers", slug: "electric-kettles-dispensers" }
        ]
      },
      {
        id: 103,
        name: "Kitchen Storage & Organizers",
        slug: "kitchen-storage-organizers",
        parent_slug: "kitchen",
        child_subcategories: [
          { id: 1007, name: "Spice Racks & Jars", slug: "spice-racks-jars" },
          { id: 1008, name: "Airtight Food Containers", slug: "airtight-food-containers" },
          { id: 1009, name: "Dish Drying Racks", slug: "dish-drying-racks" }
        ]
      },
      {
        id: 104,
        name: "Cutlery & Prep Tools",
        slug: "cutlery-prep-tools",
        parent_slug: "kitchen",
        child_subcategories: [
          { id: 1010, name: "Chef Knife Sets", slug: "chef-knife-sets" },
          { id: 1011, name: "Peelers, Graters & Mashers", slug: "peelers-graters-mashers" }
        ]
      }
    ]
  },
  {
    id: "CAT-2",
    name: "Toys",
    slug: "toys",
    image_url: "/images/categories/toys.webp",
    show_on_homepage: true,
    sort_order: 2,
    subcategories: [
      {
        id: 201,
        name: "Educational & STEM Toys",
        slug: "educational-stem-toys",
        parent_slug: "toys",
        child_subcategories: [
          { id: 2001, name: "Wooden Puzzle Blocks", slug: "wooden-puzzle-blocks" },
          { id: 2002, name: "Learning Tablets & Boards", slug: "learning-tablets-boards" },
          { id: 2003, name: "Flashcards & Math Games", slug: "flashcards-math-games" }
        ]
      },
      {
        id: 202,
        name: "Remote Control & Vehicles",
        slug: "rc-vehicles",
        parent_slug: "toys",
        child_subcategories: [
          { id: 2004, name: "RC Cars & Stunt Vehicles", slug: "rc-cars-stunt-vehicles" },
          { id: 2005, name: "Toy Helicopters & Drones", slug: "toy-helicopters-drones" }
        ]
      },
      {
        id: 203,
        name: "Action Figures & Dolls",
        slug: "action-figures-dolls",
        parent_slug: "toys",
        child_subcategories: [
          { id: 2006, name: "Superhero Figures", slug: "superhero-figures" },
          { id: 2007, name: "Fashion Dolls & Dollhouses", slug: "fashion-dolls-dollhouses" }
        ]
      },
      {
        id: 204,
        name: "Musical & Sensory Toys",
        slug: "musical-sensory-toys",
        parent_slug: "toys",
        child_subcategories: [
          { id: 2008, name: "Kids Toy Guitars & Pianos", slug: "kids-guitars-pianos" },
          { id: 2009, name: "Bubble Guns & Light Guns", slug: "bubble-guns-light-guns" }
        ]
      }
    ]
  },
  {
    id: "CAT-3",
    name: "Fashion",
    slug: "fashion",
    image_url: "/images/categories/fashion.webp",
    show_on_homepage: true,
    sort_order: 3,
    subcategories: [
      {
        id: 301,
        name: "Women's Clothing & Nightwear",
        slug: "womens-clothing-nightwear",
        parent_slug: "fashion",
        child_subcategories: [
          { id: 3001, name: "Bridal Silk Nighty Gowns", slug: "bridal-nighty-gowns" },
          { id: 3002, name: "Satin Robes & Kimonos", slug: "satin-robes-kimonos" },
          { id: 3003, name: "Pret Kurtis & Stitched Suits", slug: "pret-kurtis-stitched-suits" }
        ]
      },
      {
        id: 302,
        name: "Men's Apparel",
        slug: "mens-apparel",
        parent_slug: "fashion",
        child_subcategories: [
          { id: 3004, name: "Casual T-Shirts & Polos", slug: "casual-tshirts-polos" },
          { id: 3005, name: "Tracksuits & Loungewear", slug: "tracksuits-loungewear" }
        ]
      },
      {
        id: 303,
        name: "Watches & Accessories",
        slug: "watches-accessories",
        parent_slug: "fashion",
        child_subcategories: [
          { id: 3006, name: "Men's Chronograph Watches", slug: "mens-chronograph-watches" },
          { id: 3007, name: "Women's Luxury Watches", slug: "womens-luxury-watches" },
          { id: 3008, name: "Sunglasses & Belts", slug: "sunglasses-belts" }
        ]
      },
      {
        id: 304,
        name: "Jewelry & Ornaments",
        slug: "jewelry-ornaments",
        parent_slug: "fashion",
        child_subcategories: [
          { id: 3009, name: "Necklace & Earring Sets", slug: "necklace-earring-sets" },
          { id: 3010, name: "Rings, Bangles & Bracelets", slug: "rings-bangles-bracelets" }
        ]
      }
    ]
  },
  {
    id: "CAT-4",
    name: "Home & Living",
    slug: "home-living",
    image_url: "/images/categories/home-living.webp",
    show_on_homepage: true,
    sort_order: 4,
    subcategories: [
      {
        id: 401,
        name: "Bedding & Mattresses",
        slug: "bedding-mattresses",
        parent_slug: "home-living",
        child_subcategories: [
          { id: 4001, name: "Waterproof Mattress Protectors", slug: "waterproof-mattress-protectors" },
          { id: 4002, name: "Fitted Bed Sheets & Sets", slug: "fitted-bed-sheets" },
          { id: 4003, name: "Pillows & Cushions", slug: "pillows-cushions" }
        ]
      },
      {
        id: 402,
        name: "Home Decor & Lighting",
        slug: "home-decor-lighting",
        parent_slug: "home-living",
        child_subcategories: [
          { id: 4004, name: "LED Fairy Lights & Lamps", slug: "led-fairy-lights-lamps" },
          { id: 4005, name: "Wall Clocks & Wall Art", slug: "wall-clocks-wall-art" },
          { id: 4006, name: "Artificial Plants & Vases", slug: "artificial-plants-vases" }
        ]
      },
      {
        id: 403,
        name: "Bathroom Accessories",
        slug: "bathroom-accessories",
        parent_slug: "home-living",
        child_subcategories: [
          { id: 4007, name: "Shower Heads & Dispensers", slug: "shower-heads-dispensers" },
          { id: 4008, name: "Anti-Slip Floor Mats", slug: "anti-slip-floor-mats" }
        ]
      },
      {
        id: 404,
        name: "Cleaning & Organizers",
        slug: "cleaning-organizers",
        parent_slug: "home-living",
        child_subcategories: [
          { id: 4009, name: "Mops, Brooms & Dustpans", slug: "mops-brooms-dustpans" },
          { id: 4010, name: "Wardrobe & Closet Organizers", slug: "wardrobe-closet-organizers" }
        ]
      }
    ]
  },
  {
    id: "CAT-5",
    name: "Beauty & Personal Care",
    slug: "beauty-personal-care",
    image_url: "/images/categories/beauty-personal-care.webp",
    show_on_homepage: true,
    sort_order: 5,
    subcategories: [
      {
        id: 501,
        name: "Makeup & Cosmetics",
        slug: "makeup-cosmetics",
        parent_slug: "beauty-personal-care",
        child_subcategories: [
          { id: 5001, name: "Foundations & Concealers", slug: "foundations-concealers" },
          { id: 5002, name: "Lipsticks & Lip Tints", slug: "lipsticks-lip-tints" },
          { id: 5003, name: "Eye Shadows & Mascaras", slug: "eye-shadows-mascaras" }
        ]
      },
      {
        id: 502,
        name: "Skincare Essentials",
        slug: "skincare-essentials",
        parent_slug: "beauty-personal-care",
        child_subcategories: [
          { id: 5004, name: "Facial Serums & Essences", slug: "facial-serums-essences" },
          { id: 5005, name: "Sunblocks & Moisturizers", slug: "sunblocks-moisturizers" },
          { id: 5006, name: "Face Washes & Scrubs", slug: "face-washes-scrubs" }
        ]
      },
      {
        id: 503,
        name: "Hair Care & Styling",
        slug: "hair-care-styling",
        parent_slug: "beauty-personal-care",
        child_subcategories: [
          { id: 5007, name: "Hair Dryers & Straighteners", slug: "hair-dryers-straighteners" },
          { id: 5008, name: "Hair Oils & Masks", slug: "hair-oils-masks" }
        ]
      },
      {
        id: 504,
        name: "Fragrances & Perfumes",
        slug: "fragrances-perfumes",
        parent_slug: "beauty-personal-care",
        child_subcategories: [
          { id: 5009, name: "Men's Perfumes & Bodysprays", slug: "mens-perfumes-bodysprays" },
          { id: 5010, name: "Women's Perfumes & Mists", slug: "womens-perfumes-mists" }
        ]
      }
    ]
  },
  {
    id: "CAT-6",
    name: "Electronics & Mobile",
    slug: "electronics-mobile",
    image_url: "/images/categories/electronics-mobile.webp",
    show_on_homepage: true,
    sort_order: 6,
    subcategories: [
      {
        id: 601,
        name: "Audio & Headphones",
        slug: "audio-headphones",
        parent_slug: "electronics-mobile",
        child_subcategories: [
          { id: 6001, name: "Wireless TWS Earbuds", slug: "wireless-tws-earbuds" },
          { id: 6002, name: "Bluetooth Portable Speakers", slug: "bluetooth-portable-speakers" },
          { id: 6003, name: "Handsfree & Neckbands", slug: "handsfree-neckbands" }
        ]
      },
      {
        id: 602,
        name: "Mobile Accessories",
        slug: "mobile-accessories",
        parent_slug: "electronics-mobile",
        child_subcategories: [
          { id: 6004, name: "Fast Chargers & Adapters", slug: "fast-chargers-adapters" },
          { id: 6005, name: "Type-C & Lightning Cables", slug: "type-c-lightning-cables" },
          { id: 6006, name: "Phone Mounts & Ring Lights", slug: "phone-mounts-ring-lights" }
        ]
      },
      {
        id: 603,
        name: "Smart Gadgets",
        slug: "smart-gadgets",
        parent_slug: "electronics-mobile",
        child_subcategories: [
          { id: 6007, name: "Smart Fitness Watches", slug: "smart-fitness-watches" },
          { id: 6008, name: "Portable Mini Fans", slug: "portable-mini-fans" }
        ]
      },
      {
        id: 604,
        name: "Power & Batteries",
        slug: "power-batteries",
        parent_slug: "electronics-mobile",
        child_subcategories: [
          { id: 6009, name: "High Capacity Power Banks", slug: "high-capacity-power-banks" },
          { id: 6010, name: "Multi-Port Extension Sockets", slug: "multi-port-extension-sockets" }
        ]
      }
    ]
  },
  {
    id: "CAT-7",
    name: "Health & Fitness",
    slug: "health-fitness",
    image_url: "/images/categories/health-fitness.webp",
    show_on_homepage: true,
    sort_order: 7,
    subcategories: [
      {
        id: 701,
        name: "Exercise & Workout Gear",
        slug: "exercise-workout-gear",
        parent_slug: "health-fitness",
        child_subcategories: [
          { id: 7001, name: "Yoga Mats & Foam Rollers", slug: "yoga-mats-foam-rollers" },
          { id: 7002, name: "Resistance Bands & Tubes", slug: "resistance-bands-tubes" },
          { id: 7003, name: "Hand Grippers & Pushup Bars", slug: "hand-grippers-pushup-bars" }
        ]
      },
      {
        id: 702,
        name: "Massagers & Pain Relief",
        slug: "massagers-pain-relief",
        parent_slug: "health-fitness",
        child_subcategories: [
          { id: 7004, name: "Foot & Neck Massagers", slug: "foot-neck-massagers" },
          { id: 7005, name: "Posture Correctors & Belts", slug: "posture-correctors-belts" }
        ]
      },
      {
        id: 703,
        name: "Health Monitoring",
        slug: "health-monitoring",
        parent_slug: "health-fitness",
        child_subcategories: [
          { id: 7006, name: "Digital Weight Scales", slug: "digital-weight-scales" },
          { id: 7007, name: "Infrared Thermometers", slug: "infrared-thermometers" }
        ]
      }
    ]
  },
  {
    id: "CAT-8",
    name: "Baby & Kids",
    slug: "baby-kids",
    image_url: "/images/categories/baby-kids.webp",
    show_on_homepage: true,
    sort_order: 8,
    subcategories: [
      {
        id: 801,
        name: "Baby Feeding & Nursing",
        slug: "baby-feeding-nursing",
        parent_slug: "baby-kids",
        child_subcategories: [
          { id: 8001, name: "Silicone Feeding Bottles", slug: "silicone-feeding-bottles" },
          { id: 8002, name: "Sippy Cups & Teethers", slug: "sippy-cups-teethers" }
        ]
      },
      {
        id: 802,
        name: "Baby Clothing & Footwear",
        slug: "baby-clothing-footwear",
        parent_slug: "baby-kids",
        child_subcategories: [
          { id: 8003, name: "Soft Cotton Rompers & Suits", slug: "cotton-rompers-suits" },
          { id: 8004, name: "Baby Booties & Soft Shoes", slug: "baby-booties-shoes" }
        ]
      },
      {
        id: 803,
        name: "Baby Care & Safety",
        slug: "baby-care-safety",
        parent_slug: "baby-kids",
        child_subcategories: [
          { id: 8005, name: "Baby Grooming Kits", slug: "baby-grooming-kits" },
          { id: 8006, name: "Mosquito Nets & Bedding", slug: "baby-mosquito-nets" }
        ]
      }
    ]
  },
  {
    id: "CAT-9",
    name: "Bags & Footwear",
    slug: "bags-footwear",
    image_url: "/images/categories/bags-footwear.webp",
    show_on_homepage: true,
    sort_order: 9,
    subcategories: [
      {
        id: 901,
        name: "Women's Bags",
        slug: "womens-bags",
        parent_slug: "bags-footwear",
        child_subcategories: [
          { id: 9001, name: "Leather Tote Bags", slug: "leather-tote-bags" },
          { id: 9002, name: "Crossbody & Shoulder Bags", slug: "crossbody-shoulder-bags" },
          { id: 9003, name: "Party Clutches & Wallets", slug: "party-clutches-wallets" }
        ]
      },
      {
        id: 902,
        name: "Men's Wallets & Accessories",
        slug: "mens-wallets-accessories",
        parent_slug: "bags-footwear",
        child_subcategories: [
          { id: 9004, name: "Genuine Leather Wallets", slug: "genuine-leather-wallets" },
          { id: 9005, name: "Card Holders & Key Pouches", slug: "card-holders-key-pouches" }
        ]
      },
      {
        id: 903,
        name: "Backpacks & Travel Bags",
        slug: "backpacks-travel-bags",
        parent_slug: "bags-footwear",
        child_subcategories: [
          { id: 9006, name: "Laptop Backpacks", slug: "laptop-backpacks" },
          { id: 9007, name: "Duffel & Gym Bags", slug: "duffel-gym-bags" }
        ]
      },
      {
        id: 904,
        name: "Footwear",
        slug: "footwear",
        parent_slug: "bags-footwear",
        child_subcategories: [
          { id: 9008, name: "Comfort Slides & Slippers", slug: "comfort-slides-slippers" },
          { id: 9009, name: "Casual Sneakers & Loafers", slug: "casual-sneakers-loafers" }
        ]
      }
    ]
  },
  {
    id: "CAT-10",
    name: "Tools & Auto",
    slug: "tools-auto",
    image_url: "/images/categories/tools-auto.webp",
    show_on_homepage: true,
    sort_order: 10,
    subcategories: [
      {
        id: 1001,
        name: "Car Interior Accessories",
        slug: "car-interior-accessories",
        parent_slug: "tools-auto",
        child_subcategories: [
          { id: 10001, name: "Car Phone Mounts & Chargers", slug: "car-phone-mounts-chargers" },
          { id: 10002, name: "Portable Car Vacuum Cleaners", slug: "car-vacuum-cleaners" },
          { id: 10003, name: "Ambient Car LED Lights", slug: "ambient-car-led-lights" }
        ]
      },
      {
        id: 1002,
        name: "Hand Tools & Kits",
        slug: "hand-tools-kits",
        parent_slug: "tools-auto",
        child_subcategories: [
          { id: 10004, name: "Multi-Bit Screwdriver Sets", slug: "screwdriver-sets" },
          { id: 10005, name: "Pliers, Wrenches & Hammers", slug: "pliers-wrenches-hammers" },
          { id: 10006, name: "Measuring Tapes & Levels", slug: "measuring-tapes-levels" }
        ]
      },
      {
        id: 1003,
        name: "Power Tools & Hardware",
        slug: "power-tools-hardware",
        parent_slug: "tools-auto",
        child_subcategories: [
          { id: 10007, name: "Cordless Drills & Drivers", slug: "cordless-drills-drivers" },
          { id: 10008, name: "Hot Glue Guns & Soldering", slug: "glue-guns-soldering" }
        ]
      },
      {
        id: 1004,
        name: "Auto Care & Cleaning",
        slug: "auto-care-cleaning",
        parent_slug: "tools-auto",
        child_subcategories: [
          { id: 10009, name: "Microfiber Detailing Towels", slug: "microfiber-detailing-towels" },
          { id: 10010, name: "Tyre Inflators & Gauges", slug: "tyre-inflators-gauges" }
        ]
      }
    ]
  },
  {
    id: "CAT-11",
    name: "Stationery & Gifts",
    slug: "stationery-gifts",
    image_url: "/images/categories/stationery-gifts.webp",
    show_on_homepage: true,
    sort_order: 11,
    subcategories: [
      {
        id: 1101,
        name: "Art & Craft Supplies",
        slug: "art-craft-supplies",
        parent_slug: "stationery-gifts",
        child_subcategories: [
          { id: 11001, name: "Glitter Foam Sheets & Papers", slug: "glitter-foam-sheets" },
          { id: 11002, name: "Color Marker & Brush Sets", slug: "color-marker-brush-sets" },
          { id: 11003, name: "Acrylic Paints & Palettes", slug: "acrylic-paints-palettes" }
        ]
      },
      {
        id: 1102,
        name: "Office & School Stationery",
        slug: "office-school-stationery",
        parent_slug: "stationery-gifts",
        child_subcategories: [
          { id: 11004, name: "Diaries & Planner Notebooks", slug: "diaries-planner-notebooks" },
          { id: 11005, name: "Gel Pens & Highlighters", slug: "gel-pens-highlighters" },
          { id: 11006, name: "Calculators & Math Sets", slug: "calculators-math-sets" }
        ]
      },
      {
        id: 1103,
        name: "Gifts & Novelties",
        slug: "gifts-novelties",
        parent_slug: "stationery-gifts",
        child_subcategories: [
          { id: 11007, name: "Gift Wrapping & Boxes", slug: "gift-wrapping-boxes" },
          { id: 11008, name: "Cute Keychains & Badges", slug: "cute-keychains-badges" }
        ]
      }
    ]
  },
  {
    id: "CAT-12",
    name: "Pets & Garden",
    slug: "pets-garden",
    image_url: "/images/categories/pets-garden.webp",
    show_on_homepage: true,
    sort_order: 12,
    subcategories: [
      {
        id: 1201,
        name: "Pet Feeding & Accessories",
        slug: "pet-feeding-accessories",
        parent_slug: "pets-garden",
        child_subcategories: [
          { id: 12001, name: "Stainless Steel Pet Bowls", slug: "pet-bowls-feeders" },
          { id: 12002, name: "Collars, Harnesses & Leashes", slug: "pet-collars-leashes" },
          { id: 12003, name: "Interactive Pet Toys", slug: "interactive-pet-toys" }
        ]
      },
      {
        id: 1202,
        name: "Pet Grooming & Care",
        slug: "pet-grooming-care",
        parent_slug: "pets-garden",
        child_subcategories: [
          { id: 12004, name: "Pet Hair Brushes & Combs", slug: "pet-hair-brushes" },
          { id: 12005, name: "Pet Nail Clippers & Shampoos", slug: "pet-nail-clippers" }
        ]
      },
      {
        id: 1203,
        name: "Gardening Tools & Decor",
        slug: "gardening-tools-decor",
        parent_slug: "pets-garden",
        child_subcategories: [
          { id: 12006, name: "Watering Cans & Sprayers", slug: "watering-cans-sprayers" },
          { id: 12007, name: "Pruning Shears & Trowels", slug: "pruning-shears-trowels" },
          { id: 12008, name: "Indoor Planters & Pots", slug: "indoor-planters-pots" }
        ]
      }
    ]
  }
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
  admin_pin: "7e129bc9c65613c98cfb7597f43c5677140c05f84e61ceed714f96b3ced7bf18",
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
