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
  category?: string;
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
    "storeID": 42766,
    "storeName": "File Cabinet",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 435,
    "category": "Kitchen"
  },
  {
    "storeID": 119018,
    "storeName": "spocket",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 389,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 158482,
    "storeName": "Mylonite",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 370,
    "category": "Fashion"
  },
  {
    "storeID": 43676,
    "storeName": "Sheet",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 324,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 158053,
    "storeName": "Library",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 321,
    "category": "Home & Living"
  },
  {
    "storeID": 145444,
    "storeName": "BANEBERRY",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 279,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 66135,
    "storeName": "Rolling Pin",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 265,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 153991,
    "storeName": "Aronia",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 258,
    "category": "Fashion"
  },
  {
    "storeID": 124938,
    "storeName": "Color Box",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 250,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 24764,
    "storeName": "Calculator",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 246,
    "category": "Fashion"
  },
  {
    "storeID": 126415,
    "storeName": "Apple",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 236,
    "category": "Health & Fitness"
  },
  {
    "storeID": 146580,
    "storeName": "Joe Pye",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 211,
    "category": "Toys"
  },
  {
    "storeID": 119897,
    "storeName": "night bulb",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 201,
    "category": "Baby & Kids"
  },
  {
    "storeID": 142454,
    "storeName": "Eggshell",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 189,
    "category": "Toys"
  },
  {
    "storeID": 92939,
    "storeName": "Scanner",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 189,
    "category": "Fashion"
  },
  {
    "storeID": 67193,
    "storeName": "Plate",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 188,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 127448,
    "storeName": "JAMUN",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 162,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 127149,
    "storeName": "GRAPEFRUIT",
    "cityName": "Peshawar",
    "hubName": "PESHAWAR HUB",
    "productsCount": 155,
    "category": "Fashion"
  },
  {
    "storeID": 157826,
    "storeName": "Suno",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 151,
    "category": "Baby & Kids"
  },
  {
    "storeID": 38482,
    "storeName": "Pen",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 144,
    "category": "Kitchen"
  },
  {
    "storeID": 48974,
    "storeName": "Star",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 138,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 157853,
    "storeName": "Skyline",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 128,
    "category": "Toys"
  },
  {
    "storeID": 158736,
    "storeName": "Danta",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 124,
    "category": "Tools & Auto"
  },
  {
    "storeID": 131639,
    "storeName": "RED",
    "cityName": "Peshawar",
    "hubName": "PESHAWAR HUB",
    "productsCount": 124,
    "category": "Toys"
  },
  {
    "storeID": 121162,
    "storeName": "hard disk",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 110,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 157914,
    "storeName": "Baobab",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 109,
    "category": "Toys"
  },
  {
    "storeID": 132614,
    "storeName": "TAUPE",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 107,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 157810,
    "storeName": "Wheel",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 106,
    "category": "Toys"
  },
  {
    "storeID": 158414,
    "storeName": "DEEP FREEZER",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 100,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 157799,
    "storeName": "Stain",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 99,
    "category": "Home & Living"
  },
  {
    "storeID": 158396,
    "storeName": "North",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 97,
    "category": "Kitchen"
  },
  {
    "storeID": 157949,
    "storeName": "Sand",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 97,
    "category": "Fashion"
  },
  {
    "storeID": 128376,
    "storeName": "PEA",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 94,
    "category": "Toys"
  },
  {
    "storeID": 108329,
    "storeName": "Shopping Bag",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 89,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 69710,
    "storeName": "Ayso",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 88,
    "category": "Stationery & Gifts"
  },
  {
    "storeID": 158765,
    "storeName": "Mica",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 88,
    "category": "Fashion"
  },
  {
    "storeID": 145970,
    "storeName": "CELAMATICS",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 86,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 137733,
    "storeName": "Citrine",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 86,
    "category": "Home & Living"
  },
  {
    "storeID": 157691,
    "storeName": "Red Rose",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 77,
    "category": "Toys"
  },
  {
    "storeID": 157991,
    "storeName": "Almond",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 74,
    "category": "Baby & Kids"
  },
  {
    "storeID": 157770,
    "storeName": "Cloud",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 72,
    "category": "Toys"
  },
  {
    "storeID": 158760,
    "storeName": "Kauri",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 72,
    "category": "Fashion"
  },
  {
    "storeID": 159190,
    "storeName": "Stripboard",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 72,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 32848,
    "storeName": "Banana",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 69,
    "category": "Toys"
  },
  {
    "storeID": 155986,
    "storeName": "redbud",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 69,
    "category": "Fashion"
  },
  {
    "storeID": 158621,
    "storeName": "Eupatorium",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 66,
    "category": "Stationery & Gifts"
  },
  {
    "storeID": 158967,
    "storeName": "Flask",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 65,
    "category": "Fashion"
  },
  {
    "storeID": 158372,
    "storeName": "Harbor",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 64,
    "category": "Fashion"
  },
  {
    "storeID": 134960,
    "storeName": "ZIDELLO",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 62,
    "category": "Kitchen"
  },
  {
    "storeID": 158261,
    "storeName": "Earthon",
    "cityName": "Islamabad",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 59,
    "category": "Toys"
  },
  {
    "storeID": 157975,
    "storeName": "Copper",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 58,
    "category": "Kitchen"
  },
  {
    "storeID": 133094,
    "storeName": "mandarin",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 58,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 157942,
    "storeName": "Feijoa",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 56,
    "category": "Baby & Kids"
  },
  {
    "storeID": 129928,
    "storeName": "Celeriac",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 54,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 91333,
    "storeName": "moon touch cosmetics",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 53,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 30438,
    "storeName": "COMB",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 52,
    "category": "Home & Living"
  },
  {
    "storeID": 139887,
    "storeName": "Glaucous",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 52,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 97442,
    "storeName": "Punch",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 52,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 138355,
    "storeName": "Chartreuse",
    "cityName": "Peshawar",
    "hubName": "PESHAWAR HUB",
    "productsCount": 51,
    "category": "Toys"
  },
  {
    "storeID": 158547,
    "storeName": "Moth",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 49,
    "category": "Toys"
  },
  {
    "storeID": 144957,
    "storeName": "REBELZA",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 49,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 156642,
    "storeName": "Trees",
    "cityName": "Peshawar",
    "hubName": "PESHAWAR HUB",
    "productsCount": 47,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 52533,
    "storeName": "Mirror",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 45,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 158423,
    "storeName": "white",
    "cityName": "Islamabad",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 44,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 143540,
    "storeName": "Carmine",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 41,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 126853,
    "storeName": "gooseberry",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 40,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 44390,
    "storeName": "Chow chow",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 39,
    "category": "Home & Living"
  },
  {
    "storeID": 158408,
    "storeName": "Tower",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 39,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 150385,
    "storeName": "Artemisia",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 38,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 158606,
    "storeName": "Thyme",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 37,
    "category": "Fashion"
  },
  {
    "storeID": 158189,
    "storeName": "Sonic",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 34,
    "category": "Baby & Kids"
  },
  {
    "storeID": 58782,
    "storeName": "Backpack",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 33,
    "category": "Kitchen"
  },
  {
    "storeID": 158764,
    "storeName": "Juniper",
    "cityName": "Peshawar",
    "hubName": "PESHAWAR HUB",
    "productsCount": 33,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 129170,
    "storeName": "EUCALYPTUS",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 32,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 158446,
    "storeName": "FABRICS",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 32,
    "category": "Fashion"
  },
  {
    "storeID": 157984,
    "storeName": "Sumbul",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 32,
    "category": "Bags & Footwear"
  },
  {
    "storeID": 144605,
    "storeName": "Asiatic Lily",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 31,
    "category": "Fashion"
  },
  {
    "storeID": 136901,
    "storeName": "Dodger",
    "cityName": "Peshawar",
    "hubName": "PESHAWAR HUB",
    "productsCount": 31,
    "category": "Fashion"
  },
  {
    "storeID": 158306,
    "storeName": "ADVANI",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 30,
    "category": "Toys"
  },
  {
    "storeID": 150868,
    "storeName": "Athyrium",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 29,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 93532,
    "storeName": "Table",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 29,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 157806,
    "storeName": "central",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 28,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 124087,
    "storeName": "MUG",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 28,
    "category": "Fashion"
  },
  {
    "storeID": 158434,
    "storeName": "Diatomite",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 27,
    "category": "Pets & Garden"
  },
  {
    "storeID": 157971,
    "storeName": "Lavender",
    "cityName": "Peshawar",
    "hubName": "PESHAWAR HUB",
    "productsCount": 27,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 158105,
    "storeName": "Oregano",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 27,
    "category": "Fashion"
  },
  {
    "storeID": 134903,
    "storeName": "Wedgwood",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 26,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 134276,
    "storeName": "Henna",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 25,
    "category": "Home & Living"
  },
  {
    "storeID": 158489,
    "storeName": "SPARE PARTS",
    "cityName": "Peshawar",
    "hubName": "PESHAWAR HUB",
    "productsCount": 25,
    "category": "Toys"
  },
  {
    "storeID": 159337,
    "storeName": "Broom",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 24,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 130950,
    "storeName": "INDIGO",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 24,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 158059,
    "storeName": "Sarwana & Sohzsihm (pvt). Ltd",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 24,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 158055,
    "storeName": "Venture",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 24,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 158049,
    "storeName": "KARACHI PAINT",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 23,
    "category": "Tools & Auto"
  },
  {
    "storeID": 158576,
    "storeName": "KHAN",
    "cityName": "Peshawar",
    "hubName": "PESHAWAR HUB",
    "productsCount": 23,
    "category": "Fashion"
  },
  {
    "storeID": 54402,
    "storeName": "MOON STAR",
    "cityName": "Peshawar",
    "hubName": "PESHAWAR HUB",
    "productsCount": 23,
    "category": "Fashion"
  },
  {
    "storeID": 158215,
    "storeName": "Rootex",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 23,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 158724,
    "storeName": "Aspen",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 22,
    "category": "Fashion"
  },
  {
    "storeID": 152192,
    "storeName": "bee balm",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 21,
    "category": "Fashion"
  },
  {
    "storeID": 127161,
    "storeName": "CHERRY",
    "cityName": "Peshawar",
    "hubName": "PESHAWAR HUB",
    "productsCount": 21,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 159459,
    "storeName": "Mold",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 21,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 128551,
    "storeName": "MIDRIB",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 20,
    "category": "Toys"
  },
  {
    "storeID": 85136,
    "storeName": "Pencil",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 20,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 158716,
    "storeName": "COLA",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 19,
    "category": "Health & Fitness"
  },
  {
    "storeID": 158554,
    "storeName": "Alpine",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 18,
    "category": "Baby & Kids"
  },
  {
    "storeID": 159024,
    "storeName": "Curtainrod",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 17,
    "category": "Home & Living"
  },
  {
    "storeID": 129610,
    "storeName": "Daffodil",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 17,
    "category": "Baby & Kids"
  },
  {
    "storeID": 158550,
    "storeName": "Woodland",
    "cityName": "Peshawar",
    "hubName": "PESHAWAR HUB",
    "productsCount": 17,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 158747,
    "storeName": "Duranta",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 15,
    "category": "Kitchen"
  },
  {
    "storeID": 158863,
    "storeName": "Engine",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 15,
    "category": "Fashion"
  },
  {
    "storeID": 157649,
    "storeName": "FILTER",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 15,
    "category": "Home & Living"
  },
  {
    "storeID": 158321,
    "storeName": "Grace",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 15,
    "category": "Baby & Kids"
  },
  {
    "storeID": 123882,
    "storeName": "Papaya",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 15,
    "category": "Bags & Footwear"
  },
  {
    "storeID": 158976,
    "storeName": "Webcam",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 15,
    "category": "Fashion"
  },
  {
    "storeID": 158023,
    "storeName": "CUSHION",
    "cityName": "Islamabad",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 14,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 158701,
    "storeName": "Nemesia",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 14,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 158698,
    "storeName": "Primula",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 14,
    "category": "Pets & Garden"
  },
  {
    "storeID": 158661,
    "storeName": "Ptilotus",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 14,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 157928,
    "storeName": "Alfalfa",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 13,
    "category": "Bags & Footwear"
  },
  {
    "storeID": 157974,
    "storeName": "Beige",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 13,
    "category": "Tools & Auto"
  },
  {
    "storeID": 157814,
    "storeName": "Boltix",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 13,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 158528,
    "storeName": "Cattley",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 13,
    "category": "Pets & Garden"
  },
  {
    "storeID": 158995,
    "storeName": "Crate",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 13,
    "category": "Toys"
  },
  {
    "storeID": 158133,
    "storeName": "CREST",
    "cityName": "Peshawar",
    "hubName": "PESHAWAR HUB",
    "productsCount": 13,
    "category": "Home & Living"
  },
  {
    "storeID": 69163,
    "storeName": "ECRIN ENTERPRISES",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 13,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 158450,
    "storeName": "Phyllite",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 13,
    "category": "Stationery & Gifts"
  },
  {
    "storeID": 158877,
    "storeName": "Ratchet",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 13,
    "category": "Toys"
  },
  {
    "storeID": 158001,
    "storeName": "wooden",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 13,
    "category": "Health & Fitness"
  },
  {
    "storeID": 158628,
    "storeName": "Andrographis",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 12,
    "category": "Tools & Auto"
  },
  {
    "storeID": 158472,
    "storeName": "Apex",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 12,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 158432,
    "storeName": "Felsite",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 12,
    "category": "Fashion"
  },
  {
    "storeID": 158265,
    "storeName": "Martigo",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 12,
    "category": "Stationery & Gifts"
  },
  {
    "storeID": 158653,
    "storeName": "Seseli",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 12,
    "category": "Fashion"
  },
  {
    "storeID": 158745,
    "storeName": "Azobe",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 11,
    "category": "Fashion"
  },
  {
    "storeID": 8996,
    "storeName": "Belt",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 11,
    "category": "Toys"
  },
  {
    "storeID": 147071,
    "storeName": "festuca",
    "cityName": "Peshawar",
    "hubName": "PESHAWAR HUB",
    "productsCount": 11,
    "category": "Tools & Auto"
  },
  {
    "storeID": 158221,
    "storeName": "Perfashions",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 11,
    "category": "Fashion"
  },
  {
    "storeID": 157863,
    "storeName": "Prosper",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 11,
    "category": "Bags & Footwear"
  },
  {
    "storeID": 158663,
    "storeName": "THE HOME SHOP",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 11,
    "category": "Baby & Kids"
  },
  {
    "storeID": 139512,
    "storeName": "Crimson",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 10,
    "category": "Pets & Garden"
  },
  {
    "storeID": 146585,
    "storeName": "dickieana",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 10,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 158351,
    "storeName": "NATURAL",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 10,
    "category": "Fashion"
  },
  {
    "storeID": 157944,
    "storeName": "Sapphire",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 10,
    "category": "Toys"
  },
  {
    "storeID": 134545,
    "storeName": "Silica",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 10,
    "category": "Fashion"
  },
  {
    "storeID": 147340,
    "storeName": "Alcea",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 9,
    "category": "Kitchen"
  },
  {
    "storeID": 158684,
    "storeName": "Arbutus",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 9,
    "category": "Toys"
  },
  {
    "storeID": 158150,
    "storeName": "Battery",
    "cityName": "Islamabad",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 9,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 159325,
    "storeName": "Cast",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 9,
    "category": "Fashion"
  },
  {
    "storeID": 158608,
    "storeName": "Chives",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 9,
    "category": "Home & Living"
  },
  {
    "storeID": 158445,
    "storeName": "Eclogite",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 9,
    "category": "Home & Living"
  },
  {
    "storeID": 158500,
    "storeName": "Epidote",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 9,
    "category": "Home & Living"
  },
  {
    "storeID": 147206,
    "storeName": "Evening",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 9,
    "category": "Toys"
  },
  {
    "storeID": 158513,
    "storeName": "Field",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 9,
    "category": "Tools & Auto"
  },
  {
    "storeID": 158032,
    "storeName": "Grass Green",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 9,
    "category": "Bags & Footwear"
  },
  {
    "storeID": 159282,
    "storeName": "Handrail",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 9,
    "category": "Baby & Kids"
  },
  {
    "storeID": 158418,
    "storeName": "Journey",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 9,
    "category": "Fashion"
  },
  {
    "storeID": 157829,
    "storeName": "Luxury",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 9,
    "category": "Bags & Footwear"
  },
  {
    "storeID": 157769,
    "storeName": "Snap",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 9,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 117844,
    "storeName": "stove",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 9,
    "category": "Stationery & Gifts"
  },
  {
    "storeID": 157889,
    "storeName": "TIME",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 9,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 159430,
    "storeName": "Winch",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 9,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 158629,
    "storeName": "Zonamya",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 9,
    "category": "Baby & Kids"
  },
  {
    "storeID": 158682,
    "storeName": "ARENCIA",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 8,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 157809,
    "storeName": "Cardo",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 8,
    "category": "Kitchen"
  },
  {
    "storeID": 127415,
    "storeName": "FLORENCE",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 8,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 44516,
    "storeName": "Frying Pan",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 8,
    "category": "Toys"
  },
  {
    "storeID": 158232,
    "storeName": "Greena",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 8,
    "category": "Toys"
  },
  {
    "storeID": 32022,
    "storeName": "HEMP",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 8,
    "category": "Tools & Auto"
  },
  {
    "storeID": 150938,
    "storeName": "perennial",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 8,
    "category": "Toys"
  },
  {
    "storeID": 158362,
    "storeName": "Potential",
    "cityName": "Peshawar",
    "hubName": "PESHAWAR HUB",
    "productsCount": 8,
    "category": "Fashion"
  },
  {
    "storeID": 159316,
    "storeName": "Vacuum",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 8,
    "category": "Bags & Footwear"
  },
  {
    "storeID": 159431,
    "storeName": "Walker",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 8,
    "category": "Fashion"
  },
  {
    "storeID": 157979,
    "storeName": "Wheat",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 8,
    "category": "Baby & Kids"
  },
  {
    "storeID": 158073,
    "storeName": "Alabaster",
    "cityName": "Peshawar",
    "hubName": "PESHAWAR HUB",
    "productsCount": 7,
    "category": "Kitchen"
  },
  {
    "storeID": 128921,
    "storeName": "Barberry",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 7,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 159245,
    "storeName": "Carabiner",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 7,
    "category": "Health & Fitness"
  },
  {
    "storeID": 127663,
    "storeName": "CAULIFLOWER",
    "cityName": "Karachi",
    "hubName": "PESHAWAR HUB",
    "productsCount": 7,
    "category": "Toys"
  },
  {
    "storeID": 130506,
    "storeName": "Denebola",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 7,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 127446,
    "storeName": "Dijon",
    "cityName": "Peshawar",
    "hubName": "PESHAWAR HUB",
    "productsCount": 7,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 158043,
    "storeName": "Governance",
    "cityName": "Peshawar",
    "hubName": "PESHAWAR HUB",
    "productsCount": 7,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 151813,
    "storeName": "Juncus",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 7,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 137019,
    "storeName": "Majorelle",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 7,
    "category": "Home & Living"
  },
  {
    "storeID": 130962,
    "storeName": "PINK",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 7,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 159278,
    "storeName": "Sandpaper",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 7,
    "category": "Health & Fitness"
  },
  {
    "storeID": 158131,
    "storeName": "Upsdell",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 7,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 98773,
    "storeName": "Bag",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 6,
    "category": "Bags & Footwear"
  },
  {
    "storeID": 158275,
    "storeName": "Bioa",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 6,
    "category": "Toys"
  },
  {
    "storeID": 158020,
    "storeName": "Camel",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 6,
    "category": "Kitchen"
  },
  {
    "storeID": 158556,
    "storeName": "FINEZO",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 6,
    "category": "Tools & Auto"
  },
  {
    "storeID": 121288,
    "storeName": "HUNTER",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 6,
    "category": "Home & Living"
  },
  {
    "storeID": 157920,
    "storeName": "Maple",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 6,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 158467,
    "storeName": "Moonstone",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 6,
    "category": "Home & Living"
  },
  {
    "storeID": 158310,
    "storeName": "Nexio",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 6,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 145640,
    "storeName": "officianlis",
    "cityName": "Karachi",
    "hubName": "PESHAWAR HUB",
    "productsCount": 6,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 158588,
    "storeName": "Pomelo",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 6,
    "category": "Toys"
  },
  {
    "storeID": 159257,
    "storeName": "Scooter",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 6,
    "category": "Home & Living"
  },
  {
    "storeID": 158932,
    "storeName": "Statue",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 6,
    "category": "Fashion"
  },
  {
    "storeID": 159448,
    "storeName": "Trinket",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 6,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 157968,
    "storeName": "TULIP",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 6,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 158291,
    "storeName": "Verita",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 6,
    "category": "Home & Living"
  },
  {
    "storeID": 157690,
    "storeName": "WIRE",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 6,
    "category": "Toys"
  },
  {
    "storeID": 158999,
    "storeName": "Afara",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 5,
    "category": "Bags & Footwear"
  },
  {
    "storeID": 158686,
    "storeName": "Albizia",
    "cityName": "Peshawar",
    "hubName": "PESHAWAR HUB",
    "productsCount": 5,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 125674,
    "storeName": "CAPSICUM",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 5,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 157948,
    "storeName": "Caramel",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 5,
    "category": "Bags & Footwear"
  },
  {
    "storeID": 158119,
    "storeName": "Cinnamon",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 5,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 126536,
    "storeName": "COSMOS",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 5,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 147381,
    "storeName": "effusus",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 5,
    "category": "Home & Living"
  },
  {
    "storeID": 148417,
    "storeName": "Fescue",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 5,
    "category": "Pets & Garden"
  },
  {
    "storeID": 157894,
    "storeName": "folk",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 5,
    "category": "Home & Living"
  },
  {
    "storeID": 158664,
    "storeName": "Nigella",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 5,
    "category": "Tools & Auto"
  },
  {
    "storeID": 107846,
    "storeName": "Notepad",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 5,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 158259,
    "storeName": "Ocotillo",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 5,
    "category": "Toys"
  },
  {
    "storeID": 157847,
    "storeName": "Pilot",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 5,
    "category": "Toys"
  },
  {
    "storeID": 158064,
    "storeName": "Pineapple",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 5,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 158370,
    "storeName": "Revolution",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 5,
    "category": "Toys"
  },
  {
    "storeID": 44164,
    "storeName": "Sabahat garments",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 5,
    "category": "Fashion"
  },
  {
    "storeID": 158794,
    "storeName": "Sulfur",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 5,
    "category": "Toys"
  },
  {
    "storeID": 146409,
    "storeName": "Thistle",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 5,
    "category": "Stationery & Gifts"
  },
  {
    "storeID": 159520,
    "storeName": "Tunic",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 5,
    "category": "Fashion"
  },
  {
    "storeID": 158047,
    "storeName": "Vision",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 5,
    "category": "Health & Fitness"
  },
  {
    "storeID": 159261,
    "storeName": "Wateringcan",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 5,
    "category": "Toys"
  },
  {
    "storeID": 159023,
    "storeName": "Armchair",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 4,
    "category": "Toys"
  },
  {
    "storeID": 158754,
    "storeName": "Cane",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 4,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 136216,
    "storeName": "CAVIAR",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 4,
    "category": "Toys"
  },
  {
    "storeID": 157980,
    "storeName": "Charcoal",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 4,
    "category": "Home & Living"
  },
  {
    "storeID": 157752,
    "storeName": "Cube",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 4,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 157768,
    "storeName": "Dash",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 4,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 159320,
    "storeName": "Drillbit",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 4,
    "category": "Tools & Auto"
  },
  {
    "storeID": 158780,
    "storeName": "Fluorite",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 4,
    "category": "Home & Living"
  },
  {
    "storeID": 158172,
    "storeName": "GLASS CORNER",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 4,
    "category": "Fashion"
  },
  {
    "storeID": 158827,
    "storeName": "Hawthorn",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 4,
    "category": "Kitchen"
  },
  {
    "storeID": 157884,
    "storeName": "HERBAL",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 4,
    "category": "Home & Living"
  },
  {
    "storeID": 158862,
    "storeName": "Magnet",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 4,
    "category": "Fashion"
  },
  {
    "storeID": 158497,
    "storeName": "MANZOOR COLLECTION",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 4,
    "category": "Home & Living"
  },
  {
    "storeID": 157646,
    "storeName": "MAT",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 4,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 158665,
    "storeName": "NORSPORTS",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 4,
    "category": "Toys"
  },
  {
    "storeID": 158564,
    "storeName": "Palm Fruit",
    "cityName": "Peshawar",
    "hubName": "PESHAWAR HUB",
    "productsCount": 4,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 158655,
    "storeName": "Pentas",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 4,
    "category": "Fashion"
  },
  {
    "storeID": 158391,
    "storeName": "Resource",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 4,
    "category": "Fashion"
  },
  {
    "storeID": 100319,
    "storeName": "SLICE",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 4,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 158680,
    "storeName": "Astrantia",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 3,
    "category": "Toys"
  },
  {
    "storeID": 159387,
    "storeName": "Bearing",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 3,
    "category": "Home & Living"
  },
  {
    "storeID": 159004,
    "storeName": "Blackboard",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 3,
    "category": "Pets & Garden"
  },
  {
    "storeID": 158922,
    "storeName": "Candleholder",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 3,
    "category": "Fashion"
  },
  {
    "storeID": 130429,
    "storeName": "CELERY",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 3,
    "category": "Home & Living"
  },
  {
    "storeID": 158130,
    "storeName": "CYCLON",
    "cityName": "Peshawar",
    "hubName": "PESHAWAR HUB",
    "productsCount": 3,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 158437,
    "storeName": "GANODERMA",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 3,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 158066,
    "storeName": "GLOWRY",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 3,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 157618,
    "storeName": "GRID",
    "cityName": "Karachi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 3,
    "category": "Home & Living"
  },
  {
    "storeID": 159063,
    "storeName": "Icebox",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 3,
    "category": "Stationery & Gifts"
  },
  {
    "storeID": 157940,
    "storeName": "Jasmine",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 3,
    "category": "Kitchen"
  },
  {
    "storeID": 157628,
    "storeName": "Lock",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 3,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 158662,
    "storeName": "Oxalis",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 3,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 123912,
    "storeName": "Pomegranate",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 3,
    "category": "Health & Fitness"
  },
  {
    "storeID": 139529,
    "storeName": "Porcelain",
    "cityName": "Karachi",
    "hubName": "PESHAWAR HUB",
    "productsCount": 3,
    "category": "Kitchen"
  },
  {
    "storeID": 158778,
    "storeName": "Riwaya",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 3,
    "category": "Home & Living"
  },
  {
    "storeID": 159356,
    "storeName": "Sandal",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 3,
    "category": "Baby & Kids"
  },
  {
    "storeID": 158876,
    "storeName": "Socket",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 3,
    "category": "Home & Living"
  },
  {
    "storeID": 159407,
    "storeName": "Sticker",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 3,
    "category": "Toys"
  },
  {
    "storeID": 157955,
    "storeName": "Tomorrow",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 3,
    "category": "Fashion"
  },
  {
    "storeID": 157992,
    "storeName": "Vanilla",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 3,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 157820,
    "storeName": "wallet",
    "cityName": "Peshawar",
    "hubName": "PESHAWAR HUB",
    "productsCount": 3,
    "category": "Fashion"
  },
  {
    "storeID": 158734,
    "storeName": "Zebrano",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 3,
    "category": "Home & Living"
  },
  {
    "storeID": 158641,
    "storeName": "Zingiber",
    "cityName": "Peshawar",
    "hubName": "PESHAWAR HUB",
    "productsCount": 3,
    "category": "Toys"
  },
  {
    "storeID": 158637,
    "storeName": "Ziziphus",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 3,
    "category": "Kitchen"
  },
  {
    "storeID": 158630,
    "storeName": "Aristolochia",
    "cityName": "Peshawar",
    "hubName": "PESHAWAR HUB",
    "productsCount": 2,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 158770,
    "storeName": "Banksia",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 2,
    "category": "Bags & Footwear"
  },
  {
    "storeID": 159414,
    "storeName": "Brooch",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 2,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 159185,
    "storeName": "Bushing",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 2,
    "category": "Stationery & Gifts"
  },
  {
    "storeID": 158675,
    "storeName": "Calotropis",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 2,
    "category": "Kitchen"
  },
  {
    "storeID": 158673,
    "storeName": "Cassia",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 2,
    "category": "Fashion"
  },
  {
    "storeID": 106114,
    "storeName": "Fan",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 2,
    "category": "Home & Living"
  },
  {
    "storeID": 134748,
    "storeName": "Flame",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 2,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 157952,
    "storeName": "Flamingo",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 2,
    "category": "Home & Living"
  },
  {
    "storeID": 84260,
    "storeName": "Folder",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 2,
    "category": "Fashion"
  },
  {
    "storeID": 158169,
    "storeName": "Growza",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 2,
    "category": "Fashion"
  },
  {
    "storeID": 157808,
    "storeName": "HONEY",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 2,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 158028,
    "storeName": "JORDIA",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 2,
    "category": "Kitchen"
  },
  {
    "storeID": 158021,
    "storeName": "Khaki",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 2,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 158245,
    "storeName": "Larkspur",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 2,
    "category": "Toys"
  },
  {
    "storeID": 158441,
    "storeName": "Latite",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 2,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 157947,
    "storeName": "Lychee",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 2,
    "category": "Health & Fitness"
  },
  {
    "storeID": 158899,
    "storeName": "Magazine",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 2,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 158984,
    "storeName": "Mahogany",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 2,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 158518,
    "storeName": "Marsh",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 2,
    "category": "Home & Living"
  },
  {
    "storeID": 158849,
    "storeName": "Merbau",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 2,
    "category": "Home & Living"
  },
  {
    "storeID": 158865,
    "storeName": "Meter",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 2,
    "category": "Fashion"
  },
  {
    "storeID": 136594,
    "storeName": "Obsidian",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 2,
    "category": "Tools & Auto"
  },
  {
    "storeID": 158768,
    "storeName": "Osage",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 2,
    "category": "Home & Living"
  },
  {
    "storeID": 157978,
    "storeName": "Pistachio",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 2,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 158378,
    "storeName": "Realm",
    "cityName": "Peshawar",
    "hubName": "PESHAWAR HUB",
    "productsCount": 2,
    "category": "Kitchen"
  },
  {
    "storeID": 158464,
    "storeName": "Shale",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 2,
    "category": "Fashion"
  },
  {
    "storeID": 158425,
    "storeName": "Shungite",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 2,
    "category": "Home & Living"
  },
  {
    "storeID": 138025,
    "storeName": "Sienna",
    "cityName": "Abbottabad",
    "hubName": "PESHAWAR HUB",
    "productsCount": 2,
    "category": "Fashion"
  },
  {
    "storeID": 157626,
    "storeName": "sunny",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 2,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 158050,
    "storeName": "Titan",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 2,
    "category": "Tools & Auto"
  },
  {
    "storeID": 158298,
    "storeName": "Universal",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 2,
    "category": "Fashion"
  },
  {
    "storeID": 158666,
    "storeName": "12w2",
    "cityName": "Kot Addu",
    "hubName": "Saddar, Karachi",
    "productsCount": 1,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 158885,
    "storeName": "Anvil",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 1,
    "category": "Toys"
  },
  {
    "storeID": 125644,
    "storeName": "APRICOT",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 1,
    "category": "Home & Living"
  },
  {
    "storeID": 144758,
    "storeName": "Aster",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 1,
    "category": "Home & Living"
  },
  {
    "storeID": 144968,
    "storeName": "Autumn fern",
    "cityName": "Karachi",
    "hubName": "PESHAWAR HUB",
    "productsCount": 1,
    "category": "Home & Living"
  },
  {
    "storeID": 138745,
    "storeName": "Azure",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 1,
    "category": "Health & Fitness"
  },
  {
    "storeID": 158440,
    "storeName": "Basalt",
    "cityName": "Islamabad",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 1,
    "category": "Home & Living"
  },
  {
    "storeID": 158690,
    "storeName": "BIN AMIN",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 1,
    "category": "Home & Living"
  },
  {
    "storeID": 158738,
    "storeName": "Blackwood",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 1,
    "category": "Tools & Auto"
  },
  {
    "storeID": 129142,
    "storeName": "Canistel",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 1,
    "category": "Kitchen"
  },
  {
    "storeID": 159157,
    "storeName": "Capacitor",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 1,
    "category": "Toys"
  },
  {
    "storeID": 136827,
    "storeName": "Carnation",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 1,
    "category": "Tools & Auto"
  },
  {
    "storeID": 157643,
    "storeName": "cattle",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 1,
    "category": "Pets & Garden"
  },
  {
    "storeID": 158084,
    "storeName": "Celadon",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 1,
    "category": "Home & Living"
  },
  {
    "storeID": 157976,
    "storeName": "Chocolate",
    "cityName": "Islamabad",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 1,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 124882,
    "storeName": "Coin",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 1,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 159254,
    "storeName": "Cooler",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 1,
    "category": "Bags & Footwear"
  },
  {
    "storeID": 159191,
    "storeName": "Core",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 1,
    "category": "Home & Living"
  },
  {
    "storeID": 158289,
    "storeName": "Corera",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 1,
    "category": "Health & Fitness"
  },
  {
    "storeID": 152185,
    "storeName": "Cranesbill",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 1,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 159171,
    "storeName": "Crown",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 1,
    "category": "Home & Living"
  },
  {
    "storeID": 158743,
    "storeName": "Desert",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 1,
    "category": "Bags & Footwear"
  },
  {
    "storeID": 159119,
    "storeName": "Dishrack",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 1,
    "category": "Home & Living"
  },
  {
    "storeID": 158623,
    "storeName": "Dombeya",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 1,
    "category": "Toys"
  },
  {
    "storeID": 147367,
    "storeName": "Dryopteris",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 1,
    "category": "Toys"
  },
  {
    "storeID": 151704,
    "storeName": "Feather",
    "cityName": "Karachi",
    "hubName": "PESHAWAR HUB",
    "productsCount": 1,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 158502,
    "storeName": "Flagstone",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 1,
    "category": "Home & Living"
  },
  {
    "storeID": 141183,
    "storeName": "Flax",
    "cityName": "Karachi",
    "hubName": "PESHAWAR HUB",
    "productsCount": 1,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 159342,
    "storeName": "Footrest",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 1,
    "category": "Home & Living"
  },
  {
    "storeID": 158024,
    "storeName": "Grapevine",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 1,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 131633,
    "storeName": "GREY",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 1,
    "category": "Kitchen"
  },
  {
    "storeID": 159039,
    "storeName": "Hairband",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 1,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 158353,
    "storeName": "Highline",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 1,
    "category": "Home & Living"
  },
  {
    "storeID": 157987,
    "storeName": "Ivory",
    "cityName": "Islamabad",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 1,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 158726,
    "storeName": "Jatoba",
    "cityName": "Peshawar",
    "hubName": "PESHAWAR HUB",
    "productsCount": 1,
    "category": "Toys"
  },
  {
    "storeID": 64308,
    "storeName": "KEYBOARD",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 1,
    "category": "Fashion"
  },
  {
    "storeID": 159096,
    "storeName": "Keypad",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 1,
    "category": "Home & Living"
  },
  {
    "storeID": 157695,
    "storeName": "LIGHT",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 1,
    "category": "Home & Living"
  },
  {
    "storeID": 158014,
    "storeName": "Lilac",
    "cityName": "Peshawar",
    "hubName": "PESHAWAR HUB",
    "productsCount": 1,
    "category": "Tools & Auto"
  },
  {
    "storeID": 158658,
    "storeName": "Linaria",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 1,
    "category": "Toys"
  },
  {
    "storeID": 122710,
    "storeName": "Mango",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 1,
    "category": "Kitchen"
  },
  {
    "storeID": 158525,
    "storeName": "MIAN",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 1,
    "category": "Home & Living"
  },
  {
    "storeID": 158961,
    "storeName": "Modem",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 1,
    "category": "Home & Living"
  },
  {
    "storeID": 157841,
    "storeName": "Nexo",
    "cityName": "Peshawar",
    "hubName": "PESHAWAR HUB",
    "productsCount": 1,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 158571,
    "storeName": "NOORINEX",
    "cityName": "Peshawar",
    "hubName": "PESHAWAR HUB",
    "productsCount": 1,
    "category": "Home & Living"
  },
  {
    "storeID": 158209,
    "storeName": "Omni",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 1,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 158454,
    "storeName": "Oolite",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 1,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 158953,
    "storeName": "PAUSE",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 1,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 159219,
    "storeName": "Persimmon",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 1,
    "category": "Home & Living"
  },
  {
    "storeID": 158511,
    "storeName": "PETIZA",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 1,
    "category": "Pets & Garden"
  },
  {
    "storeID": 158594,
    "storeName": "Pulasan",
    "cityName": "Islamabad",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 1,
    "category": "Home & Living"
  },
  {
    "storeID": 132104,
    "storeName": "PURPLE",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 1,
    "category": "Home & Living"
  },
  {
    "storeID": 159400,
    "storeName": "Rotor",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 1,
    "category": "Home & Living"
  },
  {
    "storeID": 159370,
    "storeName": "Saw",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 1,
    "category": "Electronics & Mobile"
  },
  {
    "storeID": 158696,
    "storeName": "Scilla",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 1,
    "category": "Baby & Kids"
  },
  {
    "storeID": 158488,
    "storeName": "Scout",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 1,
    "category": "Home & Living"
  },
  {
    "storeID": 159228,
    "storeName": "Sharpener",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 1,
    "category": "Stationery & Gifts"
  },
  {
    "storeID": 159485,
    "storeName": "Shim",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 1,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 152375,
    "storeName": "Shrubs",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 1,
    "category": "Beauty & Personal Care"
  },
  {
    "storeID": 159107,
    "storeName": "Skewer",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 1,
    "category": "Fashion"
  },
  {
    "storeID": 158439,
    "storeName": "STATION",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 1,
    "category": "Home & Living"
  },
  {
    "storeID": 158555,
    "storeName": "Striped",
    "cityName": "Faisalabad",
    "hubName": "Faisalabad Hub",
    "productsCount": 1,
    "category": "Home & Living"
  },
  {
    "storeID": 159326,
    "storeName": "Taillight",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 1,
    "category": "Home & Living"
  },
  {
    "storeID": 158597,
    "storeName": "Tangelo",
    "cityName": "Lahore",
    "hubName": "Lahore Hub",
    "productsCount": 1,
    "category": "Home & Living"
  },
  {
    "storeID": 158356,
    "storeName": "Upgrade",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 1,
    "category": "Toys"
  },
  {
    "storeID": 130965,
    "storeName": "VIOLET",
    "cityName": "Rawalpindi",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 1,
    "category": "Home & Living"
  },
  {
    "storeID": 157858,
    "storeName": "WATER",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 1,
    "category": "Home & Living"
  },
  {
    "storeID": 158148,
    "storeName": "Wattle",
    "cityName": "Islamabad",
    "hubName": "Pindi/ISB HUB",
    "productsCount": 1,
    "category": "Toys"
  },
  {
    "storeID": 158783,
    "storeName": "Zavelle",
    "cityName": "Karachi",
    "hubName": "Saddar, Karachi",
    "productsCount": 1,
    "category": "Home & Living"
  }
];

// --------------------------------------------------------------
// // 2. REAL HHC WHOLESALE PRODUCTS (High Res DigitalOcean CDN)
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
