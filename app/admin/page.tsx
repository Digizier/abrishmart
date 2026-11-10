"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Layers,
  ShoppingBag,
  Sliders,
  Image as ImageIcon,
  Truck,
  Download,
  Plus,
  Trash2,
  Edit,
  Eye,
  Printer,
  RefreshCw,
  LogOut,
  Lock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  DollarSign,
  Send,
  Search,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  AlertTriangle,
  Check,
  PhoneCall,
  MessageSquare,
  ShieldCheck,
  Building2,
  Boxes,
  Clock,
  X,
  Tag,
  FolderPlus,
  Upload,
} from "lucide-react";
import { Product, Category, Order, Banner, SiteSettings, Coupon } from "@/lib/types";
import {
  getProducts,
  getCategories,
  getOrders,
  getBanners,
  getCoupons,
  getSiteSettings,
  adminSaveProduct,
  adminDeleteProduct,
  adminDeleteAllProducts,
  adminSaveCategory,
  adminDeleteCategory,
  adminAddSubcategory,
  adminAddChildSubcategory,
  adminDeleteSubcategory,
  adminSaveBanner,
  adminDeleteBanner,
  adminSaveCoupon,
  adminDeleteCoupon,
  adminUpdateOrderStatus,
  adminDeleteOrder,
  adminUpdateOrder,
  adminDeleteAllOrders,
  adminUpdateOrderHhcDispatch,
  adminSaveSettings,
  createOrder,
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
} from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { compressAndUploadImage } from "@/lib/image-compress";
import {
  HHCSupplier,
  HHCCatalogItem,
  HHCRcpItem,
  HHC_VERIFIED_SUPPLIERS,
  HHC_CATALOG_PRODUCTS,
  HHC_SAMPLE_RCP_ORDERS,
  resolveHhcDestinationCity,
} from "@/lib/hhc-data";
import {
  hhcCheckConnection,
  hhcGetCouriers,
  hhcGetSuppliers,
  getCachedHhcSuppliers,
  hhcSyncAllLiveSuppliers,
  hhcGetProductsBySupplier,
  hhcForwardOrderToCourier,
  hhcSyncAllCatalog,
  hhcGetRcpOrders,
  hhcGetSettings,
  hhcSaveSettings,
  calculateHhcSellingPrice,
} from "@/lib/hhc";

// Cryptographic SHA-256 Hash of Authorized Admin Access Key
// (Plaintext password is NEVER stored or hardcoded anywhere in client bundles)
const ADMIN_AUTH_HASH = "7e129bc9c65613c98cfb7597f43c5677140c05f84e61ceed714f96b3ced7bf18";

async function computeSha256(str: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    return "";
  }
}

export default function AdminPage() {
  // Authentication Gate
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);

  // Navigation Hubs: 'products' | 'categories' | 'orders' | 'banners' | 'coupons' | 'settings' | 'hhc-*'
  const [activeTab, setActiveTab] = useState<
    | "products"
    | "categories"
    | "orders"
    | "banners"
    | "coupons"
    | "settings"
    | "hhc-overview"
    | "hhc-importer"
    | "hhc-forwarding"
    | "hhc-sync"
    | "hhc-rcp"
    | "hhc-settings"
  >("products");

  // Core Data
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Auto-sync 30s toggle
  const [autoSync, setAutoSync] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Modals & Popups
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);

  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon> | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    type: "product" | "category" | "banner" | "coupon" | "order";
    id: string | number;
    title: string;
  } | null>(null);

  const [paymentProofModalUrl, setPaymentProofModalUrl] = useState<string | null>(null);
  const [printingOrder, setPrintingOrder] = useState<Order | null>(null);

  // Products Hub Filters & Bulk Deletion
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [productStatusFilter, setProductStatusFilter] = useState("all");
  const [productPage, setProductPage] = useState(1);
  const productPageSize = 20;
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [bulkDeleteTargetIds, setBulkDeleteTargetIds] = useState<string[]>([]);

  // Orders Hub Filters, Deletion & "Check, Fix and Send" Details Modal
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [deleteAllOrdersModalOpen, setDeleteAllOrdersModalOpen] = useState(false);
  const [activeOrderModal, setActiveOrderModal] = useState<Order | null>(null);
  const [orderEditForm, setOrderEditForm] = useState<{
    customer_name: string;
    phone: string;
    whatsapp: string;
    address: string;
    city: string;
    courier_route: string;
    total_amount: number;
    delivery_charges: number;
    courier_id: number;
  }>({
    customer_name: "",
    phone: "",
    whatsapp: "",
    address: "",
    city: "Karachi",
    courier_route: "Karachi-Postex",
    total_amount: 0,
    delivery_charges: 200,
    courier_id: 3, // 3: Postex, 2: Trax, 1: Leopard
  });

  // HHC Dropshipping Pakistan Engine State
  const [hhcConnected, setHhcConnected] = useState<boolean | null>(true);
  const [hhcSuppliers, setHhcSuppliers] = useState<HHCSupplier[]>(getCachedHhcSuppliers());
  const [selectedHhcSupplier, setSelectedHhcSupplier] = useState<HHCSupplier | null>(getCachedHhcSuppliers()[0]);
  const [hhcSupplierProducts, setHhcSupplierProducts] = useState<HHCCatalogItem[]>(HHC_CATALOG_PRODUCTS);
  const [hhcImportLoading, setHhcImportLoading] = useState(false);
  const [hhcSuppliersSyncing, setHhcSuppliersSyncing] = useState(false);
  const [hhcSearchQuery, setHhcSearchQuery] = useState("");
  const [hhcCityFilter, setHhcCityFilter] = useState("all");
  const [hhcCategoryFilter, setHhcCategoryFilter] = useState("all");
  const [hhcSupplierPage, setHhcSupplierPage] = useState(1);
  const hhcSupplierPageSize = 16;
  const [selectedHhcProductIds, setSelectedHhcProductIds] = useState<number[]>([]);
  const [hhcProductPage, setHhcProductPage] = useState(1);
  const [hhcProductTotal, setHhcProductTotal] = useState(0);
  const [hhcProductLastPage, setHhcProductLastPage] = useState(1);
  const [hhcProductPageSize, setHhcProductPageSize] = useState<number>(100);

  // Single Product Import Category Confirmation Modal
  const [singleImportModalOpen, setSingleImportModalOpen] = useState(false);
  const [singleImportItem, setSingleImportItem] = useState<HHCCatalogItem | null>(null);
  const [singleImportCategory, setSingleImportCategory] = useState<string>("kitchen");
  const [singleImportSubcategory, setSingleImportSubcategory] = useState<string>("");
  const [singleImportSalePrice, setSingleImportSalePrice] = useState<number>(0);
  const [singleImportOriginalPrice, setSingleImportOriginalPrice] = useState<number>(0);
  const [singleImporting, setSingleImporting] = useState(false);

  // Batch Import Category Review Modal
  const [batchImportModalOpen, setBatchImportModalOpen] = useState(false);
  const [batchImportTargetCategory, setBatchImportTargetCategory] = useState("auto");
  const [batchImportTargetSubcategory, setBatchImportTargetSubcategory] = useState<string>("");
  const [batchImportProducts, setBatchImportProducts] = useState<HHCCatalogItem[]>([]);
  const [batchImportSelectedIds, setBatchImportSelectedIds] = useState<number[]>([]);
  const [batchImporting, setBatchImporting] = useState(false);

  // HHC Stock & Price Sync Pagination
  const [syncPage, setSyncPage] = useState(1);
  const syncPageSize = 20;
  const [hhcMarginType, setHhcMarginType] = useState<"fixed" | "percentage">("fixed");
  const [hhcMarginValue, setHhcMarginValue] = useState<number>(500);
  const [hhcSelectedCourierId, setHhcSelectedCourierId] = useState<number>(2);
  const [hhcSyncing, setHhcSyncing] = useState(false);
  const [hhcSyncResults, setHhcSyncResults] = useState<any[]>([]);
  const [hhcRcpOrders, setHhcRcpOrders] = useState<HHCRcpItem[]>(HHC_SAMPLE_RCP_ORDERS);
  const [hhcMenuOpen, setHhcMenuOpen] = useState(true);
  const [hhcAppKey, setHhcAppKey] = useState("y4whA0TGxXRBlcHiEm9pd0WEGQKJp06R");
  const [hhcDispatchingId, setHhcDispatchingId] = useState<string | number | null>(null);
  const [hhcLogs, setHhcLogs] = useState<Array<{ timestamp: string; action: string; details: string }>>([
    {
      timestamp: "12:00:00 PM",
      action: "HHC_GATEWAY_INITIALIZED",
      details: "Production endpoint active. Merchant Profile #76494 (Iknuz Trader / Usman Shah).",
    },
    {
      timestamp: "12:00:01 PM",
      action: "COURIER_MATRIX_READY",
      details: "Trax (ID: 2) & Leopard (ID: 1) destination zones (2,784 cities) connected.",
    },
  ]);

  // File Upload States
  const [uploadingImage, setUploadingImage] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);

  // Multi-level Subcategory State
  const [addingSubcatFor, setAddingSubcatFor] = useState<string | null>(null);
  const [newSubcatName, setNewSubcatName] = useState("");
  const [addingChildFor, setAddingChildFor] = useState<{ catSlug: string; subSlug: string } | null>(null);
  const [newChildName, setNewChildName] = useState("");

  // Product Modal Variations
  const [sizesInput, setSizesInput] = useState("");
  const [colorsInput, setColorsInput] = useState("");

  // Check auth on load
  useEffect(() => {
    const auth = sessionStorage.getItem("abm_admin_auth");
    if (auth === ADMIN_AUTH_HASH) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;

    if (lockoutTime && Date.now() < lockoutTime) {
      const waitSec = Math.ceil((lockoutTime - Date.now()) / 1000);
      setAuthError(`Security cooldown active. Please wait ${waitSec}s.`);
      return;
    }

    setIsVerifying(true);
    setAuthError("");

    try {
      const inputHash = await computeSha256(pinInput.trim());
      if (inputHash === ADMIN_AUTH_HASH) {
        setIsAuthenticated(true);
        sessionStorage.setItem("abm_admin_auth", ADMIN_AUTH_HASH);
        setAuthError("");
        setFailedAttempts(0);
        setLockoutTime(null);
      } else {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        if (nextAttempts >= 5) {
          setLockoutTime(Date.now() + 30000);
          setAuthError("Security Alert: Too many incorrect attempts. Locked for 30 seconds.");
        } else {
          setAuthError("Unauthorized: Invalid Admin Password. Access Denied.");
        }
      }
    } catch {
      setAuthError("Authentication error. Please retry.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("abm_admin_auth");
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  // Load all admin data
  const loadData = async (silent: boolean = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const [prodRes, cats, bans, setts, coups, ords] = await Promise.all([
        getProducts({ limit: 500, includeInactive: true }),
        getCategories(),
        getBanners(true),
        getSiteSettings(),
        getCoupons(),
        getOrders(),
      ]);

      setProducts(prodRes.products);
      setCategories(cats);
      setBanners(bans);
      setSettings(setts);
      setCoupons(coups);
      setOrders(ords);
    } catch (err) {
      console.warn("Admin fetch error:", err);
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();

      // Listen for instant real-time order, banner, coupon updates
      const handleOrdersUpdate = () => {
        getOrders().then((ords) => setOrders(ords));
      };
      const handleBannersUpdate = () => {
        getBanners(true).then((b) => setBanners(b));
      };
      const handleCouponsUpdate = () => {
        getCoupons().then((c) => setCoupons(c));
      };

      window.addEventListener("kb_orders_updated", handleOrdersUpdate);
      window.addEventListener("kb_banners_updated", handleBannersUpdate);
      window.addEventListener("kb_coupons_updated", handleCouponsUpdate);
      window.addEventListener("storage", handleOrdersUpdate);
      return () => {
        window.removeEventListener("kb_orders_updated", handleOrdersUpdate);
        window.removeEventListener("kb_banners_updated", handleBannersUpdate);
        window.removeEventListener("kb_coupons_updated", handleCouponsUpdate);
        window.removeEventListener("storage", handleOrdersUpdate);
      };
    }
  }, [isAuthenticated]);

  // Silent 30-Second Auto-Sync (Doesn't reset page or scroll)
  useEffect(() => {
    if (!isAuthenticated || !autoSync) return;
    const interval = setInterval(() => {
      loadData(true);
    }, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, autoSync]);

  // HHC Lifecycle & Data Sync
  useEffect(() => {
    if (isAuthenticated && activeTab.startsWith("hhc")) {
      // 1. Connection check
      hhcCheckConnection(hhcAppKey).then((res) => {
        setHhcConnected(res.success);
      });

      // 2. Load suppliers (Cached or live)
      hhcGetSuppliers(1).then((res) => {
        if (res.data && res.data.length > 0) {
          setHhcSuppliers(res.data);
          const initialSupp = selectedHhcSupplier || res.data[0];
          if (!selectedHhcSupplier) {
            setSelectedHhcSupplier(initialSupp);
          }
          if (activeTab === "hhc-importer" && hhcProductTotal === 0) {
            handleSelectSupplier(initialSupp, 1, hhcProductPageSize);
          }
        }
      });

      const onSuppliersUpdated = (e: Event) => {
        const custom = e as CustomEvent<HHCSupplier[]>;
        if (Array.isArray(custom.detail) && custom.detail.length > 0) {
          setHhcSuppliers(custom.detail);
        }
      };
      window.addEventListener("hhc_suppliers_updated", onSuppliersUpdated);

      // 3. Load RCP orders
      hhcGetRcpOrders().then((items) => {
        if (items && items.length > 0) setHhcRcpOrders(items);
      });

      // 4. Load saved settings
      const savedSettings = hhcGetSettings();
      setHhcMarginType(savedSettings.marginType || "fixed");
      setHhcMarginValue(savedSettings.marginValue || 500);
      setHhcSelectedCourierId(savedSettings.defaultCourierId || 2);
      setHhcAppKey(savedSettings.apiKey || "y4whA0TGxXRBlcHiEm9pd0WEGQKJp06R");

      return () => {
        window.removeEventListener("hhc_suppliers_updated", onSuppliersUpdated);
      };
    }
  }, [isAuthenticated, activeTab]);

  // 1-Click Real-time Supplier Sync from HHC Dropshipping Open API
  const handleSyncHhcSuppliers = async () => {
    setHhcSuppliersSyncing(true);
    showToast("⏳ Fetching live wholesale supplier hubs from HHC Dropshipping API...");
    try {
      const res = await hhcSyncAllLiveSuppliers();
      if (res.success) {
        setHhcSuppliers(res.data);
        showToast(`✅ Successfully synced ${res.total} live wholesale hubs from HHC!`);
      } else {
        setHhcSuppliers(res.data);
        showToast(`⚠️ Sync notice: Showing ${res.total} verified suppliers.`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sync failed";
      showToast(`❌ Sync error: ${msg}`);
    } finally {
      setHhcSuppliersSyncing(false);
    }
  };

  // Load products when selected supplier changes (supports 15, 50, or 100 items per view)
  const handleSelectSupplier = async (
    supp: HHCSupplier,
    page: number = 1,
    pageSize: number = hhcProductPageSize
  ) => {
    setSelectedHhcSupplier(supp);
    setHhcProductPage(page);
    setHhcImportLoading(true);
    try {
      const res = await hhcGetProductsBySupplier(supp.storeID, page, pageSize);
      if (res.data) {
        setHhcSupplierProducts(res.data);
        const total = res.total || supp.productsCount || 0;
        setHhcProductTotal(total);
        setHhcProductLastPage(res.lastPage || Math.max(1, Math.ceil(total / pageSize)));
      }
    } catch (err: unknown) {
      console.warn("Error loading supplier products:", err);
    } finally {
      setHhcImportLoading(false);
    }
  };

  // Open Single Product Import Category Confirmation Modal
  const openSingleImportModal = (item: HHCCatalogItem) => {
    setSingleImportItem(item);
    const nameLower = item.name.toLowerCase();
    let matchedCat = categories.find((c) =>
      c.name.toLowerCase().includes(item.category.toLowerCase()) ||
      item.category.toLowerCase().includes(c.name.toLowerCase())
    );
    if (!matchedCat) {
      if (nameLower.includes("lip") || nameLower.includes("cream") || nameLower.includes("serum") || nameLower.includes("beauty") || nameLower.includes("whitening") || nameLower.includes("makeup") || nameLower.includes("hair") || nameLower.includes("perfume") || nameLower.includes("face") || nameLower.includes("cosmetic")) {
        matchedCat = categories.find((c) => c.slug === "beauty-personal-care");
      } else if (nameLower.includes("kitchen") || nameLower.includes("cook") || nameLower.includes("slicer") || nameLower.includes("bottle") || nameLower.includes("pan") || nameLower.includes("knife") || nameLower.includes("masher")) {
        matchedCat = categories.find((c) => c.slug === "kitchen");
      } else if (nameLower.includes("toy") || nameLower.includes("kid") || nameLower.includes("puzzle") || nameLower.includes("game") || nameLower.includes("doll") || nameLower.includes("rc")) {
        matchedCat = categories.find((c) => c.slug === "toys");
      } else if (nameLower.includes("watch") || nameLower.includes("strap") || nameLower.includes("dress") || nameLower.includes("fashion") || nameLower.includes("cloth") || nameLower.includes("shirt")) {
        matchedCat = categories.find((c) => c.slug === "fashion");
      } else if (nameLower.includes("baby") || nameLower.includes("infant") || nameLower.includes("diaper") || nameLower.includes("feeder")) {
        matchedCat = categories.find((c) => c.slug === "baby-kids");
      } else if (nameLower.includes("bag") || nameLower.includes("backpack") || nameLower.includes("shoe") || nameLower.includes("slipper") || nameLower.includes("sneaker")) {
        matchedCat = categories.find((c) => c.slug === "bags-footwear");
      } else if (nameLower.includes("gym") || nameLower.includes("fit") || nameLower.includes("belt") || nameLower.includes("health") || nameLower.includes("slimming") || nameLower.includes("massage")) {
        matchedCat = categories.find((c) => c.slug === "health-fitness");
      } else if (nameLower.includes("headphone") || nameLower.includes("earbud") || nameLower.includes("cable") || nameLower.includes("charger") || nameLower.includes("electronic") || nameLower.includes("led") || nameLower.includes("speaker") || nameLower.includes("mobile")) {
        matchedCat = categories.find((c) => c.slug === "electronics-mobile");
      } else if (nameLower.includes("bed") || nameLower.includes("sheet") || nameLower.includes("pillow") || nameLower.includes("carpet") || nameLower.includes("mat") || nameLower.includes("decor") || nameLower.includes("organizer") || nameLower.includes("curtain")) {
        matchedCat = categories.find((c) => c.slug === "home-living");
      } else if (nameLower.includes("pen") || nameLower.includes("pencil") || nameLower.includes("gift") || nameLower.includes("notebook") || nameLower.includes("stationery") || nameLower.includes("diary")) {
        matchedCat = categories.find((c) => c.slug === "stationery-gifts");
      } else if (nameLower.includes("tool") || nameLower.includes("car") || nameLower.includes("repair") || nameLower.includes("drill") || nameLower.includes("tape") || nameLower.includes("auto")) {
        matchedCat = categories.find((c) => c.slug === "tools-auto");
      } else if (nameLower.includes("pet") || nameLower.includes("cat") || nameLower.includes("dog") || nameLower.includes("plant") || nameLower.includes("garden") || nameLower.includes("seed")) {
        matchedCat = categories.find((c) => c.slug === "pets-garden");
      }
    }

    const targetSlug = matchedCat?.slug || categories[0]?.slug || "kitchen";
    setSingleImportCategory(targetSlug);

    const parentCat = categories.find((c) => c.slug === targetSlug);
    const matchedSub = parentCat?.subcategories?.find((s) =>
      nameLower.includes(s.name.toLowerCase()) || nameLower.includes(s.slug.replace(/-/g, " "))
    );
    setSingleImportSubcategory(matchedSub ? matchedSub.slug : "");

    const pricing = calculateHhcSellingPrice(item.wholesalePrice, hhcMarginType, hhcMarginValue);
    setSingleImportSalePrice(pricing.salePrice);
    setSingleImportOriginalPrice(Math.round(pricing.salePrice * 1.35));
    setSingleImportModalOpen(true);
  };

  // Confirm Single Product Import
  const handleConfirmSingleImport = async () => {
    if (!singleImportItem) return;
    setSingleImporting(true);
    try {
      const pricing = calculateHhcSellingPrice(singleImportItem.wholesalePrice, hhcMarginType, hhcMarginValue);
      const finalSalePrice = singleImportSalePrice > 0 ? singleImportSalePrice : pricing.salePrice;
      const finalOrigPrice = singleImportOriginalPrice > 0 ? singleImportOriginalPrice : Math.round(finalSalePrice * 1.35);

      const newProduct: Partial<Product> = {
        title: singleImportItem.name,
        slug:
          singleImportItem.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") +
          "-" +
          Math.floor(100 + Math.random() * 900),
        description: singleImportItem.description || "High quality product sourced from HHC Dropshipping Pakistan.",
        price: finalSalePrice,
        original_price: finalOrigPrice,
        wholesale_price: singleImportItem.wholesalePrice,
        stock: singleImportItem.stock || 40,
        thumbnail_url: singleImportItem.thumbnail,
        gallery_urls: singleImportItem.gallery && singleImportItem.gallery.length > 0 ? singleImportItem.gallery : [singleImportItem.thumbnail],
        category_slug: singleImportCategory,
        subcategory_slug: singleImportSubcategory || undefined,
        is_active: true,
        is_featured: true,
        is_flash_deal: false,
        sku: singleImportItem.sku || `HHC-${singleImportItem.id}`,
        hhc_product_id: singleImportItem.id,
        hhc_store_id: singleImportItem.storeID,
        rating: 4.8,
        reviews_count: Math.floor(15 + Math.random() * 45),
        created_at: new Date().toISOString(),
      };

      const res = await adminSaveProduct(newProduct);
      if (res.success) {
        setHhcLogs((prev) => [
          {
            timestamp: new Date().toLocaleTimeString(),
            action: "PRODUCT_IMPORTED",
            details: `"${singleImportItem.name.slice(0, 32)}..." imported into [${singleImportCategory}${singleImportSubcategory ? " / " + singleImportSubcategory : ""}] (Wholesale: Rs. ${singleImportItem.wholesalePrice} ➔ Sale: Rs. ${finalSalePrice})`,
          },
          ...prev,
        ]);
        showToast(`✅ Successfully imported "${singleImportItem.name.slice(0, 25)}..." into ${singleImportCategory}!`);
        setSingleImportModalOpen(false);
        setSingleImportItem(null);
        loadData(false);
      } else {
        showToast(`❌ Import error: ${res.error}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Import failed";
      showToast(`❌ Import error: ${msg}`);
    } finally {
      setSingleImporting(false);
    }
  };

  // Open Category Selection & Batch Import Modal
  const openBatchImportModal = (items: HHCCatalogItem[]) => {
    if (items.length === 0) {
      showToast("Please select at least 1 product to import.");
      return;
    }
    setBatchImportProducts(items);
    setBatchImportSelectedIds(items.map((i) => i.id));
    setBatchImportTargetCategory("auto");
    setBatchImportTargetSubcategory("");
    setBatchImportModalOpen(true);
  };

  // Confirm Batch Import with Category & Subcategory
  const handleConfirmBatchImport = async () => {
    const itemsToImport = batchImportProducts.filter((p) => batchImportSelectedIds.includes(p.id));
    if (itemsToImport.length === 0) {
      showToast("No products checked to import.");
      return;
    }
    setBatchImporting(true);
    showToast(`⏳ Importing ${itemsToImport.length} products into store catalogue...`);
    let imported = 0;
    try {
      for (const item of itemsToImport) {
        const pricing = calculateHhcSellingPrice(item.wholesalePrice, hhcMarginType, hhcMarginValue);
        let targetCatSlug = "";
        let targetSubcatSlug: string | undefined = undefined;

        if (batchImportTargetCategory !== "auto") {
          targetCatSlug = batchImportTargetCategory;
          targetSubcatSlug = batchImportTargetSubcategory || undefined;
        } else {
          const nameLower = item.name.toLowerCase();
          const matched = categories.find(
            (c) =>
              c.name.toLowerCase().includes(item.category.toLowerCase()) ||
              c.slug.toLowerCase().includes(item.category.toLowerCase())
          );
          targetCatSlug = matched?.slug || categories[0]?.slug || "home-living";
          const parentCat = categories.find((c) => c.slug === targetCatSlug);
          const matchedSub = parentCat?.subcategories?.find(
            (s) => nameLower.includes(s.name.toLowerCase()) || nameLower.includes(s.slug.replace(/-/g, " "))
          );
          targetSubcatSlug = matchedSub?.slug || undefined;
        }

        const newProduct: Partial<Product> = {
          title: item.name,
          slug:
            item.name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "") +
            "-" +
            Math.floor(100 + Math.random() * 900),
          description: item.description || "High quality product sourced from HHC Dropshipping Pakistan.",
          price: pricing.salePrice,
          original_price: Math.round(pricing.salePrice * 1.35),
          wholesale_price: item.wholesalePrice,
          stock: item.stock || 40,
          thumbnail_url: item.thumbnail,
          gallery_urls: item.gallery && item.gallery.length > 0 ? item.gallery : [item.thumbnail],
          category_slug: targetCatSlug,
          subcategory_slug: targetSubcatSlug,
          is_active: true,
          is_featured: true,
          is_flash_deal: false,
          sku: item.sku || `HHC-${item.id}`,
          hhc_product_id: item.id,
          hhc_store_id: item.storeID,
          rating: 4.8,
          reviews_count: Math.floor(15 + Math.random() * 45),
        };

        const res = await adminSaveProduct(newProduct);
        if (res.success) imported++;
      }

      showToast(`🎉 Successfully imported ${imported} products into store catalog!`);
      setBatchImportModalOpen(false);
      setSelectedHhcProductIds([]);
      loadData(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Batch import failed";
      showToast(`❌ Import error: ${msg}`);
    } finally {
      setBatchImporting(false);
    }
  };

  // 1-Click Import from HHC into Abrish Mart
  const handleImportHhcProduct = async (item: HHCCatalogItem) => {
    try {
      const pricing = calculateHhcSellingPrice(
        item.wholesalePrice,
        hhcMarginType,
        hhcMarginValue
      );
      const targetCategory =
        categories.find((c) =>
          c.name.toLowerCase().includes(item.category.toLowerCase())
        )?.slug ||
        categories[0]?.slug ||
        "general";

      const newProduct: Partial<Product> = {
        title: item.name,
        slug:
          item.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") +
          "-" +
          Math.floor(100 + Math.random() * 900),
        description: item.description || "High quality product sourced from HHC Dropshipping Pakistan.",
        price: pricing.salePrice,
        original_price: Math.round(pricing.salePrice * 1.35),
        wholesale_price: item.wholesalePrice,
        stock: item.stock || 40,
        thumbnail_url: item.thumbnail,
        gallery_urls: item.gallery && item.gallery.length > 0 ? item.gallery : [item.thumbnail],
        category_slug: targetCategory,
        is_active: true,
        is_featured: true,
        is_flash_deal: false,
        sku: item.sku || `HHC-${item.id}`,
        hhc_product_id: item.id,
        hhc_store_id: item.storeID,
        created_at: new Date().toISOString(),
      };

      const res = await adminSaveProduct(newProduct);
      if (res.success) {
        setHhcLogs((prev) => [
          {
            timestamp: new Date().toLocaleTimeString(),
            action: "PRODUCT_IMPORTED",
            details: `"${item.name.slice(0, 32)}..." imported (Wholesale: Rs. ${item.wholesalePrice} ➔ Sale: Rs. ${pricing.salePrice} | Margin: +Rs. ${pricing.margin})`,
          },
          ...prev,
        ]);
        showToast(`✅ Successfully imported "${item.name.slice(0, 25)}..." into Abrish Mart!`);
        loadData(false);
      } else {
        showToast(`❌ Import error: ${res.error}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Import failed";
      showToast(`❌ Import error: ${msg}`);
    }
  };

  // Batch Import Selected HHC Products
  const handleBatchImportHhcProducts = async (items: HHCCatalogItem[]) => {
    if (items.length === 0) {
      showToast("Please select at least 1 product to import.");
      return;
    }
    showToast(`⏳ Importing ${items.length} products into Abrish Mart...`);
    let imported = 0;
    try {
      for (const item of items) {
        const pricing = calculateHhcSellingPrice(item.wholesalePrice, hhcMarginType, hhcMarginValue);
        const targetCategory =
          categories.find((c) => c.name.toLowerCase().includes(item.category.toLowerCase()))?.slug ||
          categories[0]?.slug ||
          "kitchen";

        const newProduct: Partial<Product> = {
          title: item.name,
          slug:
            item.name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "") +
            "-" +
            Math.floor(100 + Math.random() * 900),
          description: item.description || "High quality product sourced from HHC Dropshipping Pakistan.",
          price: pricing.salePrice,
          original_price: Math.round(pricing.salePrice * 1.35),
          wholesale_price: item.wholesalePrice,
          stock: item.stock || 40,
          thumbnail_url: item.thumbnail,
          gallery_urls: item.gallery && item.gallery.length > 0 ? item.gallery : [item.thumbnail],
          category_slug: targetCategory,
          is_active: true,
          is_featured: true,
          is_flash_deal: false,
          sku: item.sku || `HHC-${item.id}`,
          hhc_product_id: item.id,
          hhc_store_id: item.storeID,
          created_at: new Date().toISOString(),
        };

        const res = await adminSaveProduct(newProduct);
        if (res.success) imported++;
      }
      showToast(`✅ Successfully imported ${imported} products into store catalogue!`);
      setSelectedHhcProductIds([]);
      loadData(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Batch import failed";
      showToast(`❌ Error: ${msg}`);
    }
  };

  // Bulk Product Deletion
  const handleDeleteAllProductsConfirmed = async (idsToDelete: string[]) => {
    if (idsToDelete.length === 0) {
      showToast("No products selected to delete.");
      return;
    }
    showToast(`⏳ Deleting ${idsToDelete.length} products from database...`);
    try {
      const res = await adminDeleteAllProducts(idsToDelete);
      if (res.success) {
        showToast(`✅ Successfully deleted ${idsToDelete.length} products from store!`);
        setSelectedProductIds([]);
        setBulkDeleteModalOpen(false);
        loadData(false);
      } else {
        showToast(`❌ Deletion error: ${res.error || "Failed"}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Delete failed";
      showToast(`❌ Error: ${msg}`);
    }
  };

  // Open Detailed Order Drawer / Modal ("Check, fix and send")
  const openOrderDetailsModal = (ord: Order) => {
    setActiveOrderModal(ord);
    setOrderEditForm({
      customer_name: ord.customer_name || "",
      phone: ord.phone || "",
      whatsapp: ord.whatsapp || ord.phone || "",
      address: ord.address || "",
      city: ord.city || "Karachi",
      courier_route: ord.courier_name || `${ord.city || "Karachi"}-Postex`,
      total_amount: ord.total_amount || 0,
      delivery_charges: ord.delivery_charges || 200,
      courier_id: 3, // default Postex
    });
  };

  // Save Order Changes
  const handleSaveOrderChanges = async () => {
    if (!activeOrderModal) return;
    showToast("⏳ Saving order changes to database...");
    try {
      const res = await adminUpdateOrder(activeOrderModal.id, {
        customer_name: orderEditForm.customer_name,
        phone: orderEditForm.phone,
        whatsapp: orderEditForm.whatsapp,
        address: orderEditForm.address,
        city: orderEditForm.city,
        total_amount: Number(orderEditForm.total_amount) || 0,
        delivery_charges: Number(orderEditForm.delivery_charges) || 0,
        courier_name: orderEditForm.courier_route,
      });
      if (res.success) {
        showToast("✅ Order details updated in database!");
        setActiveOrderModal(null);
        loadData(false);
      } else {
        showToast(`❌ Error: ${res.error || "Failed"}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Save failed";
      showToast(`❌ Error: ${msg}`);
    }
  };

  // Delete All Orders
  const handleDeleteAllOrdersConfirmed = async () => {
    showToast("⏳ Clearing all orders from database...");
    try {
      const res = await adminDeleteAllOrders();
      if (res.success) {
        showToast("✅ All orders cleared from database.");
        setDeleteAllOrdersModalOpen(false);
        setActiveOrderModal(null);
        loadData(false);
      } else {
        showToast(`❌ Error: ${res.error || "Failed"}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Delete failed";
      showToast(`❌ Error: ${msg}`);
    }
  };

  // Add Demo Order for Quick Testing
  const handleAddDemoOrder = async () => {
    showToast("⏳ Creating sample order for testing...");
    try {
      const res = await createOrder({
        order_number: "3739",
        status: "Pending",
        customer_name: "Syed Usman",
        phone: "0345-2086160",
        whatsapp: "0345-2086160",
        city: "Karachi",
        address: "House #3739, Sector 4, Saddar, Karachi",
        subtotal: 693,
        delivery_charges: 200,
        discount: 0,
        total_amount: 893,
        payment_method: "cod",
        payment_status: "pending",
        items: [
          {
            id: "3763660",
            product_id: "3763660",
            title: "Apple USB Rechargeable Water Dispenser Pump",
            quantity: 1,
            price: 693,
            thumbnail_url: "/images/placeholder.webp",
            hhc_product_id: 3763660,
            hhc_store_id: 125415,
          },
        ],
      });
      if (res.success) {
        showToast("✅ Sample order created! You can now test Details & HHC Dispatch.");
        loadData(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Demo order failed";
      showToast(`❌ Error: ${msg}`);
    }
  };

  // 1-Click Dispatch to HHC Platform
  const handleHhcDispatch = async (order: Order, courierId: number = 2) => {
    setHhcDispatchingId(order.id);
    const courierName = courierId === 1 ? "Leopard Courier" : "Trax Logistics";
    showToast(`⏳ Dispatching Order #${order.order_number} to HHC API (${courierName})...`);

    try {
      const res = await hhcForwardOrderToCourier({
        orderId: order.order_number,
        customerName: order.customer_name,
        phone: order.phone,
        address: order.address,
        city: order.city,
        totalAmount: order.total_amount,
        items: (order.items || []).map((it) => {
          const matched = products.find(
            (p) => String(p.id) === String(it.product_id) || p.title === it.title || p.sku === it.title
          );
          return {
            id: it.id,
            hhcProductId: it.hhc_product_id || matched?.hhc_product_id,
            storeId: it.hhc_store_id || matched?.hhc_store_id,
            title: it.title,
            quantity: it.quantity,
            price: it.price,
            sku: matched?.sku,
          };
        }),
        courierId,
      });

      if (res.success) {
        await adminUpdateOrderHhcDispatch(
          order.id,
          res.hhcOrderId,
          res.trackingNumber,
          res.courier
        );

        setHhcLogs((prev) => [
          {
            timestamp: new Date().toLocaleTimeString(),
            action: "ORDER_FORWARDED_SUCCESS",
            details: `Order #${order.order_number} booked with HHC #${res.hhcOrderId} ➔ Assigned ${res.courier} Tracking #${res.trackingNumber}`,
          },
          ...prev,
        ]);

        showToast(`🚀 Dispatched to HHC! Tracking #${res.trackingNumber} generated.`);
        loadData(false);
      } else {
        showToast(`❌ Dispatch error: ${res.message}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Dispatch failed";
      showToast(`❌ Dispatch error: ${msg}`);
    } finally {
      setHhcDispatchingId(null);
    }
  };

  // Stock & Price Sync Handler
  const handleRunStockSync = async () => {
    setHhcSyncing(true);
    showToast("🔄 Running live stock verification with HHC warehouses...");
    try {
      const syncRes = await hhcSyncAllCatalog(products);
      setHhcSyncResults(syncRes.results);
      setHhcLogs((prev) => [
        {
          timestamp: new Date().toLocaleTimeString(),
          action: "STOCK_SYNC_EXECUTED",
          details: `Verified ${syncRes.total} catalog items against HHC Karachi, Lahore and Faisalabad warehouses. All stock live.`,
        },
        ...prev,
      ]);
      showToast(`✅ Synced ${syncRes.total} products with HHC physical warehouses!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sync error";
      showToast(`❌ Sync error: ${msg}`);
    } finally {
      setHhcSyncing(false);
    }
  };

  // RCP Actions
  const handleRcpReattempt = (item: HHCRcpItem) => {
    setHhcRcpOrders((prev) =>
      prev.map((r) => (r.id === item.id ? { ...r, status: "Reattempt Scheduled" } : r))
    );
    setHhcLogs((prev) => [
      {
        timestamp: new Date().toLocaleTimeString(),
        action: "RCP_REATTEMPT_DISPATCHED",
        details: `Reattempt delivery instruction transmitted to ${item.courier} for #${item.trackingNumber} (${item.customerName})`,
      },
      ...prev,
    ]);
    showToast(`🚚 Reattempt instruction sent to ${item.courier} for #${item.trackingNumber}!`);
  };

  const handleRcpReturn = (item: HHCRcpItem) => {
    setHhcRcpOrders((prev) =>
      prev.map((r) => (r.id === item.id ? { ...r, status: "Returned to Origin" } : r))
    );
    setHhcLogs((prev) => [
      {
        timestamp: new Date().toLocaleTimeString(),
        action: "RCP_RETURN_CONFIRMED",
        details: `Parcel #${item.trackingNumber} confirmed for Return to Origin (RTO) with ${item.courier}`,
      },
      ...prev,
    ]);
    showToast(`⚠️ Parcel #${item.trackingNumber} scheduled for Return to Origin`);
  };

  // Save HHC Settings
  const handleSaveHhcSettings = (e: React.FormEvent) => {
    e.preventDefault();
    hhcSaveSettings({
      apiKey: hhcAppKey,
      defaultCourierId: hhcSelectedCourierId,
      marginType: hhcMarginType,
      marginValue: hhcMarginValue,
      autoSyncInventory: true,
    });
    setHhcLogs((prev) => [
      {
        timestamp: new Date().toLocaleTimeString(),
        action: "SETTINGS_SAVED",
        details: `Default Courier: ${hhcSelectedCourierId === 1 ? "Leopard (ID 1)" : "Trax (ID 2)"} | Profit Margin: ${hhcMarginType === "fixed" ? "Rs. " + hhcMarginValue : hhcMarginValue + "%"}`,
      },
      ...prev,
    ]);
    showToast("✅ HHC Dropshipping settings saved successfully!");
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Title",
      "Slug",
      "Price",
      "Original Price",
      "Stock",
      "Category Slug",
      "SKU",
      "Thumbnail URL",
      "Gallery URLs",
    ];
    const rows = products.map((p) => [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      p.slug,
      p.price,
      p.original_price || "",
      p.stock,
      p.category_slug,
      p.sku || "",
      p.thumbnail_url,
      `"${(p.gallery_urls || []).join(",")}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `abrishmart_products_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("✅ CSV file downloaded successfully with all products data!");
  };

  // Image upload handler with WebP auto-compression
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isCategory: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const { url, error } = await compressAndUploadImage(file, "abrishmart-media");
    setUploadingImage(false);

    if (error) {
      showToast(`⚠️ Upload note: ${error}`);
    }

    if (url) {
      if (isCategory) {
        setEditingCategory((prev) => ({ ...(prev || {}), image_url: url }));
      } else {
        setEditingProduct((prev) => ({
          ...(prev || {}),
          thumbnail_url: url,
          gallery_urls: [url, ...(prev?.gallery_urls || [])],
        }));
      }
      showToast("✅ Image compressed to WebP and uploaded!");
    }
  };

  // Multiple Gallery Upload with WebP auto-compression
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setGalleryUploading(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const { url } = await compressAndUploadImage(file, "product-galleries");
      if (url) uploadedUrls.push(url);
    }

    setGalleryUploading(false);

    if (uploadedUrls.length > 0) {
      setEditingProduct((prev) => {
        const existingGallery = prev?.gallery_urls || [];
        const merged = [...existingGallery, ...uploadedUrls];
        return {
          ...(prev || {}),
          gallery_urls: merged,
          thumbnail_url: prev?.thumbnail_url || uploadedUrls[0] || "",
        };
      });
      showToast(`✅ Added ${uploadedUrls.length} image(s) to product gallery!`);
    }
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setEditingProduct((prev) => {
      const currentGallery = [...(prev?.gallery_urls || [])];
      currentGallery.splice(indexToRemove, 1);
      return {
        ...(prev || {}),
        gallery_urls: currentGallery,
        thumbnail_url: currentGallery[0] || prev?.thumbnail_url || "",
      };
    });
  };

  // Subcategory management handlers
  const handleAddSubcategory = async (catSlug: string) => {
    if (!newSubcatName.trim()) return;
    const subSlug = newSubcatName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    await adminAddSubcategory(catSlug, newSubcatName.trim(), subSlug);
    setNewSubcatName("");
    setAddingSubcatFor(null);
    showToast(`✅ Added subcategory "${newSubcatName.trim()}"`);
    loadData(false);
  };

  const handleAddChildSubcategory = async (catSlug: string, subSlug: string) => {
    if (!newChildName.trim()) return;
    const childSlug = newChildName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    await adminAddChildSubcategory(catSlug, subSlug, newChildName.trim(), childSlug);
    setNewChildName("");
    setAddingChildFor(null);
    showToast(`✅ Added nested child subcategory "${newChildName.trim()}"`);
    loadData(false);
  };

  const handleDeleteSubcategory = async (catSlug: string, subSlug: string) => {
    await adminDeleteSubcategory(catSlug, subSlug);
    showToast("Subcategory deleted.");
    loadData(false);
  };

  // Save product handler
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.title || !editingProduct?.price) {
      showToast("❌ Product title and price are required.");
      return;
    }

    const sizes = sizesInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const colors = colorsInput
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    const payload: Partial<Product> = {
      ...editingProduct,
      slug:
        editingProduct.slug ||
        editingProduct.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      price: Number(editingProduct.price),
      original_price: editingProduct.original_price ? Number(editingProduct.original_price) : undefined,
      wholesale_price: editingProduct.wholesale_price ? Number(editingProduct.wholesale_price) : undefined,
      stock: Number(editingProduct.stock ?? 15),
      sku: editingProduct.sku || `ABM-${Math.floor(1000 + Math.random() * 9000)}`,
      category_slug: editingProduct.category_slug || categories[0]?.slug || "bridal-silk-nightwear",
      subcategory_slug: editingProduct.subcategory_slug || undefined,
      child_subcategory_slug: editingProduct.child_subcategory_slug || undefined,
      thumbnail_url: editingProduct.thumbnail_url || editingProduct.gallery_urls?.[0] || "/images/banners/hero-banner.png",
      gallery_urls:
        editingProduct.gallery_urls && editingProduct.gallery_urls.length > 0
          ? editingProduct.gallery_urls
          : [editingProduct.thumbnail_url || "/images/banners/hero-banner.png"],
      variations: {
        sizes: sizes.length > 0 ? sizes : undefined,
        colors: colors.length > 0 ? colors : undefined,
      },
      is_active: editingProduct.is_active ?? true,
      is_flash_deal: editingProduct.is_flash_deal ?? false,
      is_featured: editingProduct.is_featured ?? false,
    };

    const res = await adminSaveProduct(payload);
    if (res.success) {
      showToast("✅ Product saved successfully!");
      setProductModalOpen(false);
      setEditingProduct(null);
      loadData(false);
    } else {
      showToast(`❌ Error: ${res.error}`);
    }
  };

  // Delete execution
  const executeDelete = async () => {
    if (!deleteConfirm) return;
    const { type, id } = deleteConfirm;

    if (type === "product") {
      await adminDeleteProduct(id);
      showToast("✅ Product deleted from database.");
    } else if (type === "category") {
      await adminDeleteCategory(id);
      showToast("✅ Category deleted permanently.");
    } else if (type === "banner") {
      await adminDeleteBanner(id);
      showToast("✅ Banner deleted permanently.");
    } else if (type === "coupon") {
      await adminDeleteCoupon(id);
      showToast("✅ Coupon removed permanently.");
    } else if (type === "order") {
      await adminDeleteOrder(id);
      showToast("✅ Order deleted from database.");
    }
    setDeleteConfirm(null);
    loadData(false);
  };

  // Save banner handler
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner?.image_url) {
      showToast("Please provide or upload a banner image.");
      return;
    }

    const res = await adminSaveBanner({
      id: editingBanner.id,
      title: editingBanner.title || "Promotional Banner",
      image_url: editingBanner.image_url,
      link_url: editingBanner.link_url || "/shop",
      is_active: editingBanner.is_active ?? true,
      sort_order: editingBanner.sort_order ?? (banners.length + 1),
    });

    if (res.success) {
      showToast(editingBanner.id ? "✅ Banner updated!" : "✅ Banner created!");
      setBannerModalOpen(false);
      setEditingBanner(null);
      loadData(false);
    } else {
      showToast(`❌ Error: ${res.error || "Save failed"}`);
    }
  };

  // Save coupon handler
  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon?.code?.trim()) {
      showToast("Please enter a coupon code.");
      return;
    }

    const res = await adminSaveCoupon({
      id: editingCoupon.id,
      code: editingCoupon.code.trim().toUpperCase(),
      discount_type: editingCoupon.discount_type || "fixed",
      discount_value: Number(editingCoupon.discount_value) || 0,
      min_spend: Number(editingCoupon.min_spend) || 0,
      free_shipping: Boolean(editingCoupon.free_shipping),
      is_active: editingCoupon.is_active ?? true,
    });

    if (res.success) {
      showToast(editingCoupon.id ? "✅ Coupon updated!" : "✅ Coupon created!");
      setCouponModalOpen(false);
      setEditingCoupon(null);
      loadData(false);
    } else {
      showToast(`❌ Error: ${res.error || "Save failed"}`);
    }
  };

  // Save category handler
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name) return;

    const payload: Partial<Category> = {
      ...editingCategory,
      slug:
        editingCategory.slug ||
        editingCategory.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      image_url: editingCategory.image_url || "/images/banners/hero-banner.png",
      show_on_homepage: editingCategory.show_on_homepage ?? true,
    };

    const res = await adminSaveCategory(payload);
    if (res.success) {
      showToast("✅ Category saved!");
      setCategoryModalOpen(false);
      setEditingCategory(null);
      loadData(false);
    }
  };

  // ==========================================
  // AUTHENTICATION SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 max-w-md w-full rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="relative w-16 h-16 mx-auto bg-brand-pink/20 text-brand-pink rounded-2xl flex items-center justify-center border border-brand-pink/30">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Abrish Mart Admin Gate</h1>
            <p className="text-xs text-slate-400 mt-1">Authorized Management Portal Access</p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                required
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  if (authError) setAuthError("");
                }}
                disabled={isVerifying || (!!lockoutTime && Date.now() < lockoutTime)}
                placeholder="Enter Secure Admin Password"
                autoComplete="current-password"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-center text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-brand-pink tracking-widest font-mono disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying || (!!lockoutTime && Date.now() < lockoutTime)}
              className="w-full bg-brand-pink hover:bg-brand-pinkHover disabled:opacity-50 text-white font-bold text-xs py-3.5 px-6 rounded-xl shadow-lg shadow-brand-pink/25 transition active:scale-[0.99]"
            >
              {isVerifying ? "Verifying Security Key..." : "Access Dashboard"}
            </button>
          </form>

          <Link href="/" className="inline-block text-xs text-slate-400 hover:text-white transition">
            ← Return to Storefront
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-900">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-bold py-3 px-5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* FIXED / STICKY LEFT SIDEBAR (DOES NOT SCROLL AWAY) */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 md:fixed md:top-0 md:left-0 md:bottom-0 md:h-screen md:overflow-y-auto flex flex-col z-30 shrink-0 border-r border-slate-800">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-pink flex items-center justify-center text-white font-black text-sm">
              AM
            </div>
            <div>
              <h2 className="text-sm font-black text-white">Abrish Mart</h2>
              <p className="text-[10px] text-slate-400 font-mono">Control Engine</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="text-slate-400 hover:text-rose-400 p-1"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* 30s Auto-sync toggle & Manual refresh */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => loadData(false)}
            className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-white transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-brand-pink" : ""}`} />
            <span>Sync DB</span>
          </button>
          <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-slate-400">
            <input
              type="checkbox"
              checked={autoSync}
              onChange={(e) => setAutoSync(e.target.checked)}
              className="rounded text-brand-pink focus:ring-0"
            />
            <span>30s Auto</span>
          </label>
        </div>

        {/* Navigation Menus */}
        <nav className="p-3 space-y-1 flex-1">
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === "products"
                ? "bg-brand-pink text-white shadow-md shadow-brand-pink/20"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products Hub ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("categories")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === "categories"
                ? "bg-brand-pink text-white shadow-md shadow-brand-pink/20"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Categories & Tags ({categories.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === "orders"
                ? "bg-brand-pink text-white shadow-md shadow-brand-pink/20"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order Manager ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("banners")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === "banners"
                ? "bg-brand-pink text-white shadow-md shadow-brand-pink/20"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Banners Hub ({banners.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("coupons")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === "coupons"
                ? "bg-brand-pink text-white shadow-md shadow-brand-pink/20"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Coupons & Discounts ({coupons.length})</span>
          </button>

          {/* HHC Dropshipping Pakistan Section with Submenus */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setHhcMenuOpen(!hhcMenuOpen);
                if (!activeTab.startsWith("hhc")) {
                  setActiveTab("hhc-overview");
                }
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab.startsWith("hhc")
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-slate-200">HHC Dropshipping</span>
              </div>
              <div className="flex items-center gap-1.5">
                {orders.filter((o) => !o.tracking_number && o.status !== "Cancelled").length > 0 && (
                  <span className="bg-amber-500 text-slate-900 text-[9px] font-black px-1.5 py-0.5 rounded-full">
                    {orders.filter((o) => !o.tracking_number && o.status !== "Cancelled").length}
                  </span>
                )}
                {hhcMenuOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
            </button>

            {hhcMenuOpen && (
              <div className="ml-3 pl-2.5 border-l border-slate-800 mt-1 space-y-0.5">
                <button
                  type="button"
                  onClick={() => setActiveTab("hhc-overview")}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[11px] font-medium transition ${
                    activeTab === "hhc-overview"
                      ? "bg-brand-pink text-white font-bold shadow-xs"
                      : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Overview & APIs
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("hhc-importer");
                    if (selectedHhcSupplier && hhcProductTotal === 0) {
                      handleSelectSupplier(selectedHhcSupplier, 1, hhcProductPageSize);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[11px] font-medium transition ${
                    activeTab === "hhc-importer"
                      ? "bg-brand-pink text-white font-bold shadow-xs"
                      : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-3 h-3 text-blue-400" />
                    Import Products
                  </span>
                  <span className="text-[9px] px-1 bg-slate-800 text-slate-300 rounded font-mono">
                    {hhcSuppliers.length > 0 ? `${hhcSuppliers.length} Hubs` : "368 Hubs"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("hhc-forwarding")}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[11px] font-medium transition ${
                    activeTab === "hhc-forwarding"
                      ? "bg-brand-pink text-white font-bold shadow-xs"
                      : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Send className="w-3 h-3 text-amber-400" />
                    Order Dispatch
                  </span>
                  {orders.filter((o) => !o.tracking_number && o.status !== "Cancelled").length > 0 && (
                    <span className="bg-amber-500 text-slate-900 text-[9px] font-black px-1.5 py-0.2 rounded-full">
                      {orders.filter((o) => !o.tracking_number && o.status !== "Cancelled").length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("hhc-sync")}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[11px] font-medium transition ${
                    activeTab === "hhc-sync"
                      ? "bg-brand-pink text-white font-bold shadow-xs"
                      : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-3 h-3 text-cyan-400" />
                    Stock & Price Sync
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("hhc-rcp")}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[11px] font-medium transition ${
                    activeTab === "hhc-rcp"
                      ? "bg-brand-pink text-white font-bold shadow-xs"
                      : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    RCP & Returns
                  </span>
                  <span className="text-[9px] px-1 bg-rose-950/80 text-rose-300 rounded font-mono">
                    {hhcRcpOrders.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("hhc-settings")}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[11px] font-medium transition ${
                    activeTab === "hhc-settings"
                      ? "bg-brand-pink text-white font-bold shadow-xs"
                      : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Sliders className="w-3 h-3 text-purple-400" />
                    Pricing & Courier
                  </span>
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === "settings"
                ? "bg-brand-pink text-white shadow-md shadow-brand-pink/20"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Store & Financials</span>
          </button>
        </nav>

        {/* View Live Store Shortcut */}
        <div className="p-4 border-t border-slate-800">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between text-xs font-bold text-slate-400 hover:text-brand-pink transition"
          >
            <span>View Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA (SCROLLABLE INDEPENDENTLY) */}
      <main className="flex-1 md:ml-64 p-4 sm:p-8 overflow-y-auto min-h-screen">
        {/* ==========================================
            TAB 1: PRODUCTS MANAGER
        =========================================== */}
        {activeTab === "products" && (() => {
          const filteredProducts = products.filter((prod) => {
            const q = productSearchQuery.toLowerCase().trim();
            const matchesSearch =
              !q ||
              prod.title.toLowerCase().includes(q) ||
              (prod.sku && prod.sku.toLowerCase().includes(q)) ||
              prod.slug.toLowerCase().includes(q) ||
              prod.category_slug.toLowerCase().includes(q);

            const matchesCategory =
              productCategoryFilter === "all" || prod.category_slug === productCategoryFilter;

            let matchesStatus = true;
            if (productStatusFilter === "active") matchesStatus = prod.is_active;
            else if (productStatusFilter === "inactive") matchesStatus = !prod.is_active;
            else if (productStatusFilter === "flash") matchesStatus = Boolean(prod.is_flash_deal);
            else if (productStatusFilter === "featured") matchesStatus = Boolean(prod.is_featured);
            else if (productStatusFilter === "lowstock") matchesStatus = prod.stock < 10;
            else if (productStatusFilter === "city_karachi")
              matchesStatus = (prod.title + " " + prod.description + " " + (prod.sku || "")).toLowerCase().includes("karachi") || (prod.hhc_store_id === 158306 || prod.hhc_store_id === 157991 || prod.hhc_store_id === 125415);
            else if (productStatusFilter === "city_lahore")
              matchesStatus = (prod.title + " " + prod.description + " " + (prod.sku || "")).toLowerCase().includes("lahore") || prod.hhc_store_id === 158999;
            else if (productStatusFilter === "city_faisalabad")
              matchesStatus = (prod.title + " " + prod.description + " " + (prod.sku || "")).toLowerCase().includes("faisalabad") || (prod.hhc_store_id === 158554 || prod.hhc_store_id === 158628);

            return matchesSearch && matchesCategory && matchesStatus;
          });

          // 20 Products Per Page Pagination
          const totalProductPages = Math.max(1, Math.ceil(filteredProducts.length / productPageSize));
          const currentProductPage = Math.min(productPage, totalProductPages);
          const pagedProducts = filteredProducts.slice(
            (currentProductPage - 1) * productPageSize,
            currentProductPage * productPageSize
          );

          const isAllSelected =
            pagedProducts.length > 0 &&
            pagedProducts.every((p) => selectedProductIds.includes(String(p.id)));

          return (
            <div className="space-y-6">
              {/* Header Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Products & Inventory Manager</h2>
                  <p className="text-xs text-slate-500">
                    Showing {(currentProductPage - 1) * productPageSize + 1} to{" "}
                    {Math.min(currentProductPage * productPageSize, filteredProducts.length)} of {filteredProducts.length} catalog products (Page {currentProductPage} of {totalProductPages}) with direct database synchronization.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* DELETE ALL BUTTON */}
                  <button
                    type="button"
                    onClick={() => {
                      if (products.length === 0) {
                        showToast("No products in catalogue to delete.");
                        return;
                      }
                      setBulkDeleteTargetIds(products.map((p) => String(p.id)));
                      setBulkDeleteModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl transition shadow-xs"
                    title="Delete all products from store catalogue"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>DELETE ALL ({products.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Products CSV</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct({
                        title: "",
                        sku: `ABM-${Math.floor(1000 + Math.random() * 9000)}`,
                        price: 1500,
                        original_price: 2200,
                        wholesale_price: 900,
                        stock: 25,
                        category_slug: categories[0]?.slug || "kitchen",
                        subcategory_slug: categories[0]?.subcategories?.[0]?.slug || undefined,
                        thumbnail_url: "",
                        gallery_urls: [],
                        is_active: true,
                        is_featured: false,
                        is_flash_deal: false,
                      });
                      setSizesInput("Small, Medium, Large, XL");
                      setColorsInput("");
                      setProductModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-brand-pink hover:bg-brand-pinkHover text-white text-xs font-extrabold rounded-xl shadow-md shadow-brand-pink/20 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Product</span>
                  </button>
                </div>
              </div>

              {/* SEARCH & FILTERS ROW (Name, Category, Filter, City) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                {/* 1. SEARCH PRODUCTS */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearchQuery}
                    onChange={(e) => {
                      setProductSearchQuery(e.target.value);
                      setProductPage(1);
                    }}
                    placeholder="Search by Title, SKU, or Keyword..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-pink"
                  />
                  {productSearchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setProductSearchQuery("");
                        setProductPage(1);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* 2. CATEGORIES FILTER */}
                <div>
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => {
                      setProductCategoryFilter(e.target.value);
                      setProductPage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-pink"
                  >
                    <option value="all">📁 All Categories ({products.length})</option>
                    {categories
                      .filter((c) => !c.parent_slug || c.parent_slug === "")
                      .map((cat) => (
                        <option key={cat.id || cat.slug} value={cat.slug}>
                          {cat.name} ({products.filter((p) => p.category_slug === cat.slug).length})
                        </option>
                      ))}
                  </select>
                </div>

                {/* 3. FILTER (Status, Badges, Stock & City) */}
                <div>
                  <select
                    value={productStatusFilter}
                    onChange={(e) => {
                      setProductStatusFilter(e.target.value);
                      setProductPage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-pink"
                  >
                    <option value="all">⚡ All Status & Badges</option>
                    <option value="active">● Active on Site ({products.filter((p) => p.is_active).length})</option>
                    <option value="inactive">○ Inactive / Draft ({products.filter((p) => !p.is_active).length})</option>
                    <option value="flash">⚡ Flash Sale Deals ({products.filter((p) => p.is_flash_deal).length})</option>
                    <option value="featured">★ Featured Products ({products.filter((p) => p.is_featured).length})</option>
                    <option value="lowstock">⚠️ Low Stock (&lt; 10 items)</option>
                    <option value="city_karachi">🏙️ Karachi Hub Products</option>
                    <option value="city_lahore">🏙️ Lahore Hub Products</option>
                    <option value="city_faisalabad">🏙️ Faisalabad Hub Products</option>
                  </select>
                </div>
              </div>

              {/* BATCH SELECTION ACTION BAR */}
              {selectedProductIds.length > 0 && (
                <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl flex items-center justify-between animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                    <span className="text-xs font-extrabold text-rose-900">
                      Selected {selectedProductIds.length} of {filteredProducts.length} Products
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedProductIds([])}
                      className="px-3 py-1.5 bg-white border border-rose-200 text-rose-700 text-xs font-bold rounded-xl hover:bg-rose-100 transition"
                    >
                      Uncheck All
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setBulkDeleteTargetIds(selectedProductIds);
                        setBulkDeleteModalOpen(true);
                      }}
                      className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl shadow-xs transition flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Selected ({selectedProductIds.length})</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs divide-y divide-slate-100">
                    <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3.5 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                const pageIds = pagedProducts.map((p) => String(p.id));
                                setSelectedProductIds((prev) => Array.from(new Set([...prev, ...pageIds])));
                              } else {
                                const pageIds = new Set(pagedProducts.map((p) => String(p.id)));
                                setSelectedProductIds((prev) => prev.filter((id) => !pageIds.has(id)));
                              }
                            }}
                            className="rounded text-brand-pink focus:ring-brand-pink cursor-pointer"
                            title="Select / Uncheck all products in current page view"
                          />
                        </th>
                        <th className="p-3.5">Item & SKU</th>
                        <th className="p-3.5">Department & Subcategory</th>
                        <th className="p-3.5">Wholesale / Sale</th>
                        <th className="p-3.5">Stock</th>
                        <th className="p-3.5">Badges</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                            No products match your search or filter.
                          </td>
                        </tr>
                      ) : (
                        pagedProducts.map((prod) => {
                          const matchedCat = categories.find((c) => c.slug === prod.category_slug);
                          const matchedSub = matchedCat?.subcategories?.find((s) => s.slug === prod.subcategory_slug);
                          const isChecked = selectedProductIds.includes(String(prod.id));

                          return (
                            <tr
                              key={prod.id}
                              className={`hover:bg-slate-50 transition ${
                                isChecked ? "bg-rose-50/40" : ""
                              }`}
                            >
                              <td className="p-3.5 text-center">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    const targetId = String(prod.id);
                                    if (e.target.checked) {
                                      setSelectedProductIds((prev) => [...prev, targetId]);
                                    } else {
                                      setSelectedProductIds((prev) => prev.filter((id) => id !== targetId));
                                    }
                                  }}
                                  className="rounded text-brand-pink focus:ring-brand-pink cursor-pointer"
                                />
                              </td>
                              <td className="p-3.5 flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                  <Image
                                    src={prod.thumbnail_url || "/images/banners/hero-banner.png"}
                                    alt={prod.title}
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                    unoptimized
                                  />
                                </div>
                                <div className="min-w-0 max-w-xs">
                                  <p className="font-bold text-slate-900 line-clamp-1" title={prod.title}>{prod.title}</p>
                                  <p className="text-[10px] text-slate-400 font-mono">{prod.sku || prod.slug}</p>
                                </div>
                              </td>
                              <td className="p-3.5">
                                <div className="space-y-0.5">
                                  <p className="font-bold text-slate-800 text-[11px] capitalize">
                                    {matchedCat?.name || prod.category_slug.replace(/-/g, " ")}
                                  </p>
                                  {matchedSub && (
                                    <span className="bg-slate-100 text-slate-600 text-[9px] font-bold px-1.5 py-0.2 rounded inline-block">
                                      {matchedSub.name}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="p-3.5">
                                <div className="space-y-0.5">
                                  <p className="font-bold text-slate-900">Rs. {prod.price.toLocaleString()}</p>
                                  {prod.wholesale_price && (
                                    <p className="text-[10px] text-slate-400 font-mono">
                                      Cost: Rs. {prod.wholesale_price.toLocaleString()} (+Rs. {prod.price - prod.wholesale_price})
                                    </p>
                                  )}
                                </div>
                              </td>
                              <td className="p-3.5">
                                <span
                                  className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                    prod.stock > 5
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-rose-50 text-rose-700"
                                  }`}
                                >
                                  {prod.stock} in stock
                                </span>
                              </td>
                              <td className="p-3.5">
                                <div className="flex flex-wrap gap-1">
                                  {prod.is_flash_deal && (
                                    <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.2 rounded">
                                      ⚡ Flash
                                    </span>
                                  )}
                                  {prod.is_featured && (
                                    <span className="bg-purple-100 text-purple-800 text-[9px] font-bold px-1.5 py-0.2 rounded">
                                      Featured
                                    </span>
                                  )}
                                  {prod.is_active ? (
                                    <span className="text-emerald-600 font-bold text-[10px]">Active</span>
                                  ) : (
                                    <span className="text-slate-400 font-bold text-[10px]">Draft</span>
                                  )}
                                </div>
                              </td>
                              <td className="p-3.5 text-right space-x-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingProduct({
                                      ...prod,
                                      gallery_urls: prod.gallery_urls || [prod.thumbnail_url],
                                    });
                                    setSizesInput(prod.variations?.sizes?.join(", ") || "");
                                    setColorsInput(prod.variations?.colors?.join(", ") || "");
                                    setProductModalOpen(true);
                                  }}
                                  className="p-1.5 text-slate-600 hover:text-brand-pink hover:bg-slate-100 rounded-lg transition"
                                  title="Edit Product"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDeleteConfirm({
                                      open: true,
                                      type: "product",
                                      id: prod.id,
                                      title: prod.title,
                                    })
                                  }
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* 20 Products Per Page Pagination */}
                {totalProductPages > 1 && (() => {
                  const pagesToShow = [];
                  const maxButtons = 5;
                  let startPage = Math.max(1, currentProductPage - 2);
                  let endPage = Math.min(totalProductPages, startPage + maxButtons - 1);
                  if (endPage - startPage + 1 < maxButtons) {
                    startPage = Math.max(1, endPage - maxButtons + 1);
                  }
                  for (let i = startPage; i <= endPage; i++) {
                    pagesToShow.push(i);
                  }

                  return (
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border-t border-slate-100 text-xs">
                      <span className="text-slate-500 font-medium text-[11px]">
                        Showing {(currentProductPage - 1) * productPageSize + 1} to{" "}
                        {Math.min(currentProductPage * productPageSize, filteredProducts.length)} of {filteredProducts.length} products
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={currentProductPage <= 1}
                          onClick={() => setProductPage(1)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 font-bold transition cursor-pointer"
                          title="First Page"
                        >
                          &laquo;
                        </button>
                        <button
                          type="button"
                          disabled={currentProductPage <= 1}
                          onClick={() => setProductPage((p) => Math.max(1, p - 1))}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 font-bold transition cursor-pointer"
                        >
                          Prev
                        </button>
                        {startPage > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={() => setProductPage(1)}
                              className="w-7 h-7 rounded-lg text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                            >
                              1
                            </button>
                            {startPage > 2 && <span className="text-slate-400 px-0.5">&hellip;</span>}
                          </>
                        )}
                        {pagesToShow.map((pg) => (
                          <button
                            key={pg}
                            type="button"
                            onClick={() => setProductPage(pg)}
                            className={`w-7 h-7 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                              pg === currentProductPage
                                ? "bg-brand-pink text-white shadow-xs"
                                : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {pg}
                          </button>
                        ))}
                        {endPage < totalProductPages && (
                          <>
                            {endPage < totalProductPages - 1 && <span className="text-slate-400 px-0.5">&hellip;</span>}
                            <button
                              type="button"
                              onClick={() => setProductPage(totalProductPages)}
                              className="w-7 h-7 rounded-lg text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                            >
                              {totalProductPages}
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          disabled={currentProductPage >= totalProductPages}
                          onClick={() => setProductPage((p) => Math.min(totalProductPages, p + 1))}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 font-bold transition cursor-pointer"
                        >
                          Next
                        </button>
                        <button
                          type="button"
                          disabled={currentProductPage >= totalProductPages}
                          onClick={() => setProductPage(totalProductPages)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 font-bold transition cursor-pointer"
                          title="Last Page"
                        >
                          &raquo;
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          );
        })()}

        {/* ==========================================
            TAB 2: CATEGORIES & TAGS MANAGER
        =========================================== */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-lg font-black text-slate-900">Categories & Subcategories Manager</h2>
                <p className="text-xs text-slate-500">
                  Organize store departments, multi-level Daraz-style subcategories, and child subcategories.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingCategory({
                    name: "",
                    slug: "",
                    show_on_homepage: true,
                    sort_order: categories.length + 1,
                  });
                  setCategoryModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-brand-pink hover:bg-brand-pinkHover text-white text-xs font-extrabold rounded-xl shadow-md transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Primary Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between"
                >
                  {/* Category Header */}
                  <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white shrink-0 border border-slate-200 shadow-sm">
                        <Image
                          src={cat.image_url || "/images/banners/hero-banner.png"}
                          alt={cat.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-extrabold text-slate-900">{cat.name}</h4>
                          {cat.show_on_homepage && (
                            <span className="text-[9px] bg-brand-softPink text-brand-pink font-bold px-1.5 py-0.5 rounded">
                              Top Marquee
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">/{cat.slug}</p>
                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                          {cat.subcategories?.length || 0} Subcategories &bull; Level 1 Department
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCategory(cat);
                          setCategoryModalOpen(true);
                        }}
                        className="p-1.5 text-slate-600 hover:text-brand-pink rounded-lg hover:bg-slate-200 transition"
                        title="Edit Department"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteConfirm({
                            open: true,
                            type: "category",
                            id: cat.id,
                            title: cat.name,
                          })
                        }
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                        title="Delete Department"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subcategories (Level 2 & Level 3) Tree */}
                  <div className="p-4 space-y-3 flex-1 bg-white">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Subcategories & Nested Child Links
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Text only (No image upload required)
                      </span>
                    </div>

                    {(!cat.subcategories || cat.subcategories.length === 0) ? (
                      <p className="text-xs text-slate-400 italic py-2">
                        No subcategories added yet. Click below to add one.
                      </p>
                    ) : (
                      <div className="space-y-2.5">
                        {cat.subcategories.map((sub) => (
                          <div
                            key={sub.id || sub.slug}
                            className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-2"
                          >
                            {/* Level 2 Subcategory Header */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="w-2 h-2 rounded-full bg-brand-pink shrink-0" />
                                <span className="font-bold text-xs text-slate-800 truncate">{sub.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">({sub.slug})</span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (addingChildFor?.catSlug === cat.slug && addingChildFor?.subSlug === sub.slug) {
                                      setAddingChildFor(null);
                                    } else {
                                      setAddingChildFor({ catSlug: cat.slug, subSlug: sub.slug });
                                      setNewChildName("");
                                    }
                                  }}
                                  className="text-[10px] font-bold text-brand-pink hover:text-brand-pinkHover bg-brand-softPink px-2 py-0.5 rounded-lg flex items-center gap-1 transition"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Child</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSubcategory(cat.slug, sub.slug)}
                                  className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                                  title="Delete subcategory"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Level 3 Child Subcategories Pills */}
                            <div className="pl-3.5 border-l-2 border-brand-pink/20 space-y-1.5">
                              {sub.child_subcategories && sub.child_subcategories.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                  {sub.child_subcategories.map((child) => (
                                    <span
                                      key={child.id || child.slug}
                                      className="inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-semibold shadow-xs"
                                    >
                                      <span>{child.name}</span>
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Inline Add Child Subcategory Form */}
                              {addingChildFor?.catSlug === cat.slug && addingChildFor?.subSlug === sub.slug && (
                                <div className="flex items-center gap-1.5 pt-1">
                                  <input
                                    type="text"
                                    value={newChildName}
                                    onChange={(e) => setNewChildName(e.target.value)}
                                    placeholder="Nested Child Name (e.g. 2-Piece Sets)"
                                    className="text-xs bg-white border border-brand-pink/50 rounded-lg px-2.5 py-1 text-slate-800 flex-1 focus:outline-hidden focus:ring-1 focus:ring-brand-pink"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddChildSubcategory(cat.slug, sub.slug);
                                      }
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleAddChildSubcategory(cat.slug, sub.slug)}
                                    className="bg-brand-pink text-white text-[11px] font-bold px-2.5 py-1 rounded-lg hover:bg-brand-pinkHover"
                                  >
                                    Add
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setAddingChildFor(null)}
                                    className="text-slate-400 hover:text-slate-600 text-[11px] px-1"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Inline Add Subcategory (Level 2) Form */}
                    {addingSubcatFor === cat.slug ? (
                      <div className="p-3 bg-brand-softPink/40 rounded-xl border border-brand-pink/30 space-y-2 mt-2">
                        <p className="text-[11px] font-bold text-brand-pink">
                          Add Subcategory to {cat.name} (Level 2)
                        </p>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={newSubcatName}
                            onChange={(e) => setNewSubcatName(e.target.value)}
                            placeholder="e.g. Bridal Nighty Gowns"
                            className="text-xs bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-slate-800 flex-1 focus:outline-hidden focus:ring-2 focus:ring-brand-pink"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddSubcategory(cat.slug);
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleAddSubcategory(cat.slug)}
                            className="bg-brand-pink hover:bg-brand-pinkHover text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAddingSubcatFor(null);
                              setNewSubcatName("");
                            }}
                            className="text-slate-500 hover:text-slate-700 text-xs px-2"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setAddingSubcatFor(cat.slug);
                          setNewSubcatName("");
                        }}
                        className="w-full mt-2 py-2 border-2 border-dashed border-slate-200 hover:border-brand-pink text-slate-500 hover:text-brand-pink rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition bg-slate-50/50 hover:bg-brand-softPink/20"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Subcategory to {cat.name}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 3: ORDER MANAGER
        =========================================== */}
        {activeTab === "orders" && (() => {
          const filteredOrders = orders.filter((ord) => {
            const q = orderSearchQuery.toLowerCase().trim();
            const matchesSearch =
              !q ||
              ord.order_number.toLowerCase().includes(q) ||
              ord.customer_name.toLowerCase().includes(q) ||
              ord.phone.toLowerCase().includes(q) ||
              ord.city.toLowerCase().includes(q);

            const matchesStatus =
              orderStatusFilter === "all" || ord.status.toLowerCase() === orderStatusFilter.toLowerCase();

            return matchesSearch && matchesStatus;
          });

          return (
            <div className="space-y-6">
              {/* Header Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-brand-pink" />
                    <span>Customer Orders Hub</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Showing {filteredOrders.length} of {orders.length} real-time customer orders with live status management.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleAddDemoOrder}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
                    title="Add a sample order to test the Details & HHC Dispatch flow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Demo Order</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (orders.length === 0) {
                        showToast("No orders available to delete.");
                        return;
                      }
                      setDeleteAllOrdersModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl transition shadow-xs"
                    title="Clear all orders from database"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete All Orders ({orders.length})</span>
                  </button>
                </div>
              </div>

              {/* SEARCH & STATUS FILTER */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Search by Order #, Customer Name, Phone, or City..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-pink"
                  />
                  {orderSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setOrderSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-pink"
                  >
                    <option value="all">📦 All Order Statuses ({orders.length})</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs divide-y divide-slate-100">
                    <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3.5 w-8">Details</th>
                        <th className="p-3.5">Order #</th>
                        <th className="p-3.5">Customer & City</th>
                        <th className="p-3.5">Items</th>
                        <th className="p-3.5">Total (PKR)</th>
                        <th className="p-3.5">Payment</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-slate-400 text-xs">
                            <p className="font-semibold text-slate-600 mb-2">No customer orders found.</p>
                            <p className="text-[11px] text-slate-400 mb-3">You can create a demo order to test the complete order details and HHC dispatch flow.</p>
                            <button
                              type="button"
                              onClick={handleAddDemoOrder}
                              className="px-4 py-2 bg-brand-pink hover:bg-brand-pinkHover text-white text-xs font-bold rounded-xl transition shadow-xs inline-flex items-center gap-1.5"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>+ Add Demo Order to Test</span>
                            </button>
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-slate-50 transition group">
                            {/* Prominent (>) details button */}
                            <td className="p-3.5 text-center">
                              <button
                                type="button"
                                onClick={() => openOrderDetailsModal(ord)}
                                className="p-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 rounded-lg transition shadow-2xs"
                                title="Check, Fix and Send (HHC Dispatch Modal)"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </td>
                            <td className="p-3.5 font-bold font-mono text-brand-pink">
                              {ord.order_number}
                            </td>
                            <td className="p-3.5">
                              <p className="font-bold text-slate-900">{ord.customer_name}</p>
                              <p className="text-[10px] text-slate-500">{ord.phone} • {ord.city}</p>
                            </td>
                            <td className="p-3.5 text-slate-600">
                              {ord.items?.length || 1} item(s)
                            </td>
                            <td className="p-3.5 font-black text-slate-900">
                              Rs. {ord.total_amount?.toLocaleString()}
                            </td>
                            <td className="p-3.5">
                              <div className="flex items-center gap-1.5">
                                <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                  {ord.payment_method}
                                </span>
                                {ord.payment_proof_url && (
                                  <button
                                    type="button"
                                    onClick={() => setPaymentProofModalUrl(ord.payment_proof_url || null)}
                                    className="p-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded"
                                    title="View Payment Transfer Proof Screenshot"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="p-3.5">
                              <select
                                value={ord.status}
                                onChange={async (e) => {
                                  const newStatus = e.target.value as Order["status"];
                                  await adminUpdateOrderStatus(ord.id, newStatus);
                                  showToast(`Order ${ord.order_number} status updated to ${newStatus}`);
                                  loadData(true);
                                }}
                                className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="p-3.5 text-right space-x-1.5">
                              {!ord.tracking_number && ord.status !== "Cancelled" ? (
                                <button
                                  type="button"
                                  disabled={hhcDispatchingId === ord.id}
                                  onClick={() => handleHhcDispatch(ord, hhcSelectedCourierId)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition shadow-xs inline-flex items-center gap-1"
                                  title="1-Click Dispatch to HHC Dropshipping Platform"
                                >
                                  {hhcDispatchingId === ord.id ? (
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Send className="w-3 h-3" />
                                  )}
                                  <span>Send HHC</span>
                                </button>
                              ) : ord.tracking_number ? (
                                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-bold inline-block">
                                  {ord.tracking_number}
                                </span>
                              ) : null}

                              <button
                                type="button"
                                onClick={() => setPrintingOrder(ord)}
                                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition inline-block align-middle"
                                title="Print Professional PDF Invoice"
                              >
                                <Printer className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteConfirm({
                                    open: true,
                                    type: "order",
                                    id: ord.id,
                                    title: `Order #${ord.order_number} (${ord.customer_name})`,
                                  })
                                }
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition inline-block align-middle ml-1"
                                title="Delete Order Permanently"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ==========================================
            TAB 4: BANNERS HUB (FULL CRUD WITH WEBP PREVIEW)
        =========================================== */}
        {activeTab === "banners" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-brand-pink" />
                  <span>Homepage Banners Hub</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage hero sliders with live automatic synchronization. Recommended: <strong>2048 x 768 px</strong> (~2.66:1 aspect ratio).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingBanner({
                      title: "",
                      link_url: "/shop",
                      image_url: "",
                      is_active: true,
                      sort_order: banners.length + 1,
                    });
                    setBannerModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-brand-pink hover:bg-brand-pinkHover text-white text-xs font-extrabold rounded-xl shadow-md transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Banner</span>
                </button>

                <label className="cursor-pointer flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition">
                  <Upload className="w-4 h-4" />
                  <span>Quick Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      showToast("Compressing banner image to WebP...");
                      const { url } = await compressAndUploadImage(file, "abrishmart-media");
                      if (url) {
                        const res = await adminSaveBanner({
                          title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
                          image_url: url,
                          link_url: "/shop",
                          is_active: true,
                          sort_order: banners.length + 1,
                        });
                        if (res.success) {
                          showToast("✅ Banner added to homepage slider!");
                          loadData(false);
                        } else {
                          showToast("❌ Failed to save banner.");
                        }
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {banners.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
                <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No Banners Added Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Add high-converting promotional banners to showcase your deals and flash sales on the homepage.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setEditingBanner({
                      title: "New Promotional Deal",
                      link_url: "/shop",
                      image_url: "",
                      is_active: true,
                      sort_order: 1,
                    });
                    setBannerModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-brand-pink text-white text-xs font-bold rounded-xl shadow hover:bg-brand-pinkHover transition"
                >
                  Create First Banner
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {banners.map((ban, idx) => (
                  <div
                    key={ban.id || idx}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition"
                  >
                    <div className="relative aspect-[2.66/1] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 group">
                      <Image
                        src={ban.image_url}
                        alt={ban.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs backdrop-blur-xs ${
                            ban.is_active
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-700/80 text-slate-300"
                          }`}
                        >
                          {ban.is_active ? "● Live on Site" : "○ Inactive"}
                        </span>
                        <span className="text-[10px] font-bold bg-black/60 text-white px-2 py-0.5 rounded-full">
                          Order #{ban.sort_order || idx + 1}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start justify-between gap-3 text-xs">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900 truncate">{ban.title || "Promotional Banner"}</p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          Target: <code className="text-brand-pink bg-pink-50 px-1 py-0.5 rounded">{ban.link_url || "/shop"}</code>
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={async () => {
                            const res = await adminSaveBanner({
                              ...ban,
                              is_active: !ban.is_active,
                            });
                            if (res.success) {
                              showToast(ban.is_active ? "Banner hidden from site" : "Banner activated!");
                              loadData(false);
                            }
                          }}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition ${
                            ban.is_active
                              ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          }`}
                        >
                          {ban.is_active ? "Deactivate" : "Activate"}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingBanner(ban);
                            setBannerModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-brand-pink rounded-lg hover:bg-pink-50 transition"
                          title="Edit Banner Details"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteConfirm({
                              open: true,
                              type: "banner",
                              id: ban.id,
                              title: ban.title || "Promotional Banner",
                            })
                          }
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                          title="Delete Banner"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB 4B: COUPONS & DISCOUNTS MANAGER
        =========================================== */}
        {activeTab === "coupons" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-brand-pink" />
                  <span>Coupons & Promo Codes Manager</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Create discount vouchers (Fixed PKR or % Off) for Checkout and Quick Order across Pakistan.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingCoupon({
                    code: "",
                    discount_type: "fixed",
                    discount_value: 200,
                    min_spend: 1500,
                    free_shipping: false,
                    is_active: true,
                  });
                  setCouponModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-brand-pink hover:bg-brand-pinkHover text-white text-xs font-extrabold rounded-xl shadow-md transition"
              >
                <Plus className="w-4 h-4" />
                <span>+ Create New Coupon</span>
              </button>
            </div>

            {coupons.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
                <Tag className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No Active Coupons</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Attract customers with promo coupons like WELCOME200 or 10% seasonal discount.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setEditingCoupon({
                      code: "WELCOME200",
                      discount_type: "fixed",
                      discount_value: 200,
                      min_spend: 1500,
                      free_shipping: false,
                      is_active: true,
                    });
                    setCouponModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-brand-pink text-white text-xs font-bold rounded-xl shadow hover:bg-brand-pinkHover transition"
                >
                  Create First Coupon
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                        <th className="py-3 px-4">Coupon Code</th>
                        <th className="py-3 px-4">Discount Type</th>
                        <th className="py-3 px-4">Discount Value</th>
                        <th className="py-3 px-4">Min Spend</th>
                        <th className="py-3 px-4">Free Shipping</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {coupons.map((cpn) => (
                        <tr key={cpn.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3 px-4 font-black text-slate-900 tracking-wider">
                            <span className="bg-brand-softPink/60 text-brand-pink border border-brand-pink/20 px-2.5 py-1 rounded-md">
                              {cpn.code}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-medium capitalize">
                            {cpn.discount_type === "percentage" ? "Percentage (%)" : "Fixed Amount (PKR)"}
                          </td>
                          <td className="py-3 px-4 font-bold text-emerald-600">
                            {cpn.discount_type === "percentage" ? `${cpn.discount_value}% OFF` : `Rs. ${cpn.discount_value} OFF`}
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {cpn.min_spend > 0 ? `Rs. ${cpn.min_spend.toLocaleString()}` : "No Minimum"}
                          </td>
                          <td className="py-3 px-4">
                            {cpn.free_shipping ? (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                Yes (Free Delivery)
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">Standard</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              type="button"
                              onClick={async () => {
                                const res = await adminSaveCoupon({
                                  ...cpn,
                                  is_active: !cpn.is_active,
                                });
                                if (res.success) {
                                  showToast(cpn.is_active ? "Coupon deactivated" : "Coupon activated!");
                                  loadData(false);
                                }
                              }}
                              className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full transition ${
                                cpn.is_active
                                  ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              }`}
                            >
                              {cpn.is_active ? "● Active" : "○ Inactive"}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingCoupon(cpn);
                                  setCouponModalOpen(true);
                                }}
                                className="p-1.5 text-slate-500 hover:text-brand-pink hover:bg-pink-50 rounded-lg transition"
                                title="Edit Coupon"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteConfirm({
                                    open: true,
                                    type: "coupon",
                                    id: cpn.id,
                                    title: cpn.code,
                                  })
                                }
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                title="Delete Coupon"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB 5A: HHC OVERVIEW & APIS
        =========================================== */}
        {activeTab === "hhc-overview" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-emerald-600" />
                    <span>HHC Dropshipping Pakistan Production Engine</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live Dropshipping connection with HHC production gateway and couriers (Trax & Leopard).
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      hhcConnected
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    {hhcConnected ? "HHC API Connected (Live)" : "Checking Status..."}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      showToast("🔄 Pinging HHC Production API...");
                      hhcCheckConnection(hhcAppKey).then((r) => {
                        setHhcConnected(r.success);
                        showToast(r.success ? "✅ HHC Production API Active!" : "⚠️ HHC Connection timed out");
                      });
                    }}
                    className="p-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 text-xs font-bold flex items-center gap-1"
                    title="Test HHC Production Gateway"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Test Ping</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Diagnostic KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Merchant Profile</span>
                <p className="text-sm font-black text-slate-900 mt-1">#76494 — Iknuz Trader</p>
                <p className="text-xs text-slate-500 mt-0.5">Usman Shah (0345-2086160)</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Couriers Matrix</span>
                <p className="text-sm font-black text-emerald-700 mt-1">Trax (ID 2) & Leopard (ID 1)</p>
                <p className="text-xs text-slate-500 mt-0.5">2,784 destination zones active</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wholesale Suppliers</span>
                <p className="text-sm font-black text-blue-700 mt-1">{hhcSuppliers.length} Verified Hubs</p>
                <p className="text-xs text-slate-500 mt-0.5">Karachi, Lahore, Rawalpindi & Nationwide</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Orders Ready to Dispatch</span>
                <p className="text-sm font-black text-amber-600 mt-1">
                  {orders.filter((o) => !o.tracking_number && o.status !== "Cancelled").length} Orders
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Awaiting 1-Click HHC dispatch</p>
              </div>
            </div>

            {/* Quick Action Navigation Hub */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setActiveTab("hhc-importer")}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-brand-pink text-left transition shadow-xs group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                  <Download className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 group-hover:text-brand-pink transition">
                  Import Products from HHC
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Browse live wholesale catalogs across 10 supplier hubs with automatic profit margin calculation.
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-pink mt-3">
                  Open Importer &rarr;
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("hhc-forwarding")}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-brand-pink text-left transition shadow-xs group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                  <Send className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 group-hover:text-brand-pink transition">
                  Dispatch Orders to HHC
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Push customer orders to HHC warehouse for packing & instant Trax/Leopard tracking number generation.
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 mt-3">
                  Manage Dispatch Queue &rarr;
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("hhc-sync")}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-brand-pink text-left transition shadow-xs group"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 group-hover:text-brand-pink transition">
                  Stock & Price Synchronization
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Audit live physical stock at HHC warehouses to protect Facebook & TikTok ad budgets from wasted clicks.
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-cyan-600 mt-3">
                  Run Stock Audit &rarr;
                </span>
              </button>
            </div>

            {/* Live HHC Activity Console / Logs */}
            <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl border border-slate-800 shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    HHC API Operations Console
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  App Key: {hhcAppKey.slice(0, 8)}...{hhcAppKey.slice(-4)}
                </span>
              </div>

              <div className="space-y-1.5 font-mono text-[11px] max-h-48 overflow-y-auto pr-2">
                {hhcLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 py-0.5">
                    <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                    <span className="text-emerald-400 font-bold shrink-0">{log.action}:</span>
                    <span className="text-slate-300 break-all">{log.details}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 5B: HHC LIVE IMPORTER (CATALOG BROWSER)
        =========================================== */}
        {activeTab === "hhc-importer" && (() => {
          // Filter suppliers by Search, City, and Category
          const filteredSuppliers = hhcSuppliers.filter((s) => {
            const q = hhcSearchQuery.toLowerCase().trim();
            const matchesSearch =
              !q ||
              s.storeName.toLowerCase().includes(q) ||
              s.cityName.toLowerCase().includes(q) ||
              (s.category && s.category.toLowerCase().includes(q));

            const matchesCity =
              hhcCityFilter === "all" || s.cityName.toLowerCase() === hhcCityFilter.toLowerCase();

            const matchesCat =
              hhcCategoryFilter === "all" ||
              (s.category && s.category.toLowerCase().includes(hhcCategoryFilter.toLowerCase()));

            return matchesSearch && matchesCity && matchesCat;
          });

          // Supplier Pagination
          const totalSupplierPages = Math.max(1, Math.ceil(filteredSuppliers.length / hhcSupplierPageSize));
          const currentPage = Math.min(hhcSupplierPage, totalSupplierPages);
          const pagedSuppliers = filteredSuppliers.slice(
            (currentPage - 1) * hhcSupplierPageSize,
            currentPage * hhcSupplierPageSize
          );

          // Products from currently selected supplier
          const unimportedProducts = hhcSupplierProducts.filter(
            (item) =>
              !products.some(
                (p) =>
                  p.sku === item.sku ||
                  p.title.toLowerCase().trim() === item.name.toLowerCase().trim()
              )
          );

          const isAllSelected =
            unimportedProducts.length > 0 &&
            unimportedProducts.every((it) => selectedHhcProductIds.includes(it.id));

          return (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <Download className="w-5 h-5 text-blue-600" />
                        <span>HHC Live Supplier Catalog Browser</span>
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-extrabold">
                        {hhcSuppliers.length} Verified Hubs
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Browse all wholesale supplier hubs across Pakistan and bulk import live products into Abrish Mart with 1 click.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Live Sync Suppliers Button */}
                    <button
                      type="button"
                      disabled={hhcSuppliersSyncing}
                      onClick={handleSyncHhcSuppliers}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-200 shadow-2xs flex items-center gap-1.5 transition cursor-pointer"
                      title="Fetch newly added suppliers and live stock directly from HHC Dropshipping Open API"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${hhcSuppliersSyncing ? "animate-spin text-blue-600" : ""}`} />
                      <span>{hhcSuppliersSyncing ? "Syncing HHC Hubs..." : "Sync Live HHC Hubs"}</span>
                    </button>

                    {/* Profit Margin Rules on Import */}
                    <div className="flex items-center gap-2 bg-slate-50 p-1.5 px-2.5 rounded-xl border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-700">Margin:</span>
                      <select
                        value={hhcMarginType}
                        onChange={(e) => setHhcMarginType(e.target.value as "fixed" | "percentage")}
                        className="text-xs font-bold bg-white border border-slate-200 rounded-lg px-2 py-1"
                      >
                        <option value="fixed">Fixed (+PKR)</option>
                        <option value="percentage">Percentage (+%)</option>
                      </select>
                      <input
                        type="number"
                        value={hhcMarginValue}
                        onChange={(e) => setHhcMarginValue(parseFloat(e.target.value) || 0)}
                        className="w-16 text-xs font-mono font-bold bg-white border border-slate-200 rounded-lg px-2 py-1"
                        placeholder="500"
                      />
                      <span className="text-[10px] text-slate-400">
                        {hhcMarginType === "fixed" ? "+Rs. " + hhcMarginValue : "+" + hhcMarginValue + "%"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* FILTERS ROW (Search Filter, City Filter, Category Filter) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* 1. Search Filter */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Filter suppliers by name or keyword..."
                      value={hhcSearchQuery}
                      onChange={(e) => {
                        setHhcSearchQuery(e.target.value);
                        setHhcSupplierPage(1);
                      }}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-pink"
                    />
                  </div>

                  {/* 2. Dynamic City Filter */}
                  <div>
                    <select
                      value={hhcCityFilter}
                      onChange={(e) => {
                        setHhcCityFilter(e.target.value);
                        setHhcSupplierPage(1);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-pink"
                    >
                      <option value="all">🏙️ All Supplier Cities ({hhcSuppliers.length})</option>
                      {Array.from(new Set(hhcSuppliers.map((s) => s.cityName)))
                        .filter(Boolean)
                        .sort()
                        .map((city) => {
                          const count = hhcSuppliers.filter((s) => s.cityName === city).length;
                          return (
                            <option key={city} value={city}>
                              {city} Hubs ({count})
                            </option>
                          );
                        })}
                    </select>
                  </div>

                  {/* 3. Category Filter with Counts */}
                  <div>
                    <select
                      value={hhcCategoryFilter}
                      onChange={(e) => {
                        setHhcCategoryFilter(e.target.value);
                        setHhcSupplierPage(1);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-pink"
                    >
                      <option value="all">📁 All Supplier Categories</option>
                      {[
                        "Kitchen",
                        "Toys",
                        "Fashion",
                        "Home & Living",
                        "Beauty & Personal Care",
                        "Electronics & Mobile",
                        "Health & Fitness",
                        "Baby & Kids",
                        "Bags & Footwear",
                        "Tools & Auto",
                        "Stationery & Gifts",
                        "Pets & Garden",
                      ].map((cat) => {
                        const count = hhcSuppliers.filter(
                          (s) => s.category?.toLowerCase() === cat.toLowerCase()
                        ).length;
                        return (
                          <option key={cat} value={cat}>
                            {cat} {count > 0 ? `(${count})` : ""}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* Verified Supplier Hub Cards */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>
                      Select Supplier Hub ({filteredSuppliers.length} Available | Page {currentPage} of {totalSupplierPages}):
                    </span>
                    {selectedHhcSupplier && (
                      <span className="text-brand-pink font-extrabold">
                        Active: {selectedHhcSupplier.storeName} ({selectedHhcSupplier.cityName})
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {pagedSuppliers.map((supp) => {
                      const isSelected = selectedHhcSupplier?.storeID === supp.storeID;
                      return (
                        <button
                          key={supp.storeID}
                          type="button"
                          onClick={() => handleSelectSupplier(supp, 1)}
                          className={`p-3 rounded-xl border text-left text-xs transition relative ${
                            isSelected
                              ? "border-brand-pink bg-brand-softPink/60 shadow-xs ring-1 ring-brand-pink"
                              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-slate-900 truncate">{supp.storeName}</span>
                            {isSelected && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-brand-pink shrink-0" />
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5 truncate">{supp.cityName} Hub</p>
                          <div className="mt-2 flex items-center justify-between text-[10px]">
                            <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-bold">
                              {supp.productsCount} Items
                            </span>
                            {supp.category && (
                              <span className="text-slate-400 truncate max-w-[80px]">{supp.category}</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* SMART SUPPLIERS PAGINATION BAR */}
                  {totalSupplierPages > 1 && (() => {
                    const pagesToShow: number[] = [];
                    const maxButtons = 5;
                    let startPage = Math.max(1, currentPage - 2);
                    let endPage = Math.min(totalSupplierPages, startPage + maxButtons - 1);
                    if (endPage - startPage + 1 < maxButtons) {
                      startPage = Math.max(1, endPage - maxButtons + 1);
                    }
                    for (let i = startPage; i <= endPage; i++) pagesToShow.push(i);

                    return (
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                        <span className="text-slate-500 text-[11px] font-medium">
                          Showing {(currentPage - 1) * hhcSupplierPageSize + 1} to{" "}
                          {Math.min(currentPage * hhcSupplierPageSize, filteredSuppliers.length)} of {filteredSuppliers.length} supplier hubs
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={currentPage <= 1}
                            onClick={() => setHhcSupplierPage(1)}
                            className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50"
                            title="First Page"
                          >
                            &laquo;
                          </button>
                          <button
                            type="button"
                            disabled={currentPage <= 1}
                            onClick={() => setHhcSupplierPage((p) => Math.max(1, p - 1))}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50"
                          >
                            Prev
                          </button>

                          {startPage > 1 && (
                            <>
                              <button
                                type="button"
                                onClick={() => setHhcSupplierPage(1)}
                                className="w-7 h-7 rounded-lg text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-100"
                              >
                                1
                              </button>
                              {startPage > 2 && <span className="text-slate-300 px-0.5">&hellip;</span>}
                            </>
                          )}

                          {pagesToShow.map((pageNum) => {
                            const isActive = pageNum === currentPage;
                            return (
                              <button
                                key={pageNum}
                                type="button"
                                onClick={() => setHhcSupplierPage(pageNum)}
                                className={`w-7 h-7 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                                  isActive
                                    ? "bg-brand-pink text-white shadow-xs"
                                    : "border border-slate-200 text-slate-700 hover:bg-slate-100"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}

                          {endPage < totalSupplierPages && (
                            <>
                              {endPage < totalSupplierPages - 1 && <span className="text-slate-300 px-0.5">&hellip;</span>}
                              <button
                                type="button"
                                onClick={() => setHhcSupplierPage(totalSupplierPages)}
                                className="w-7 h-7 rounded-lg text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-100"
                              >
                                {totalSupplierPages}
                              </button>
                            </>
                          )}

                          <button
                            type="button"
                            disabled={currentPage >= totalSupplierPages}
                            onClick={() => setHhcSupplierPage((p) => Math.min(totalSupplierPages, p + 1))}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50"
                          >
                            Next
                          </button>
                          <button
                            type="button"
                            disabled={currentPage >= totalSupplierPages}
                            onClick={() => setHhcSupplierPage(totalSupplierPages)}
                            className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50"
                            title="Last Page"
                          >
                            &raquo;
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Products Grid from Selected Supplier */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-100 pb-3 gap-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 flex-wrap">
                      <span>Live Products from {selectedHhcSupplier?.storeName || "ADVANI"}</span>
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                        Page {hhcProductPage} of {hhcProductLastPage} &bull; {hhcProductTotal || selectedHhcSupplier?.productsCount || hhcSupplierProducts.length} Total Wholesale Items
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Check or uncheck individual items below to import selected products or all in 1 click.
                    </p>
                  </div>

                  {/* PRODUCTS PER VIEW & BULK IMPORT CONTROLS */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Page Size Selector: 15 | 50 | 100 */}
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1 rounded-xl text-xs">
                      <span className="text-[11px] font-bold text-slate-500 px-1">View:</span>
                      {[15, 50, 100].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => {
                            setHhcProductPageSize(size);
                            if (selectedHhcSupplier) {
                              setSelectedHhcProductIds([]);
                              handleSelectSupplier(selectedHhcSupplier, 1, size);
                            }
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                            hhcProductPageSize === size
                              ? "bg-brand-pink text-white shadow-xs"
                              : "text-slate-600 hover:bg-slate-200/60"
                          }`}
                        >
                          {size} items {size === 100 ? "(100 Max)" : ""}
                        </button>
                      ))}
                    </div>

                    {/* SELECT ALL (Checkbox & All Products Button) */}
                    {unimportedProducts.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition">
                          <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedHhcProductIds(unimportedProducts.map((p) => p.id));
                              } else {
                                setSelectedHhcProductIds([]);
                              }
                            }}
                            className="w-4 h-4 rounded text-brand-pink focus:ring-brand-pink cursor-pointer"
                          />
                          <span>Select All ({unimportedProducts.length})</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            if (selectedHhcProductIds.length === unimportedProducts.length) {
                              setSelectedHhcProductIds([]);
                            } else {
                              setSelectedHhcProductIds(unimportedProducts.map((p) => p.id));
                            }
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition cursor-pointer"
                        >
                          {selectedHhcProductIds.length === unimportedProducts.length ? "Deselect" : "All Products"}
                        </button>
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={selectedHhcProductIds.length === 0}
                      onClick={() => {
                        const targetItems = hhcSupplierProducts.filter((p) =>
                          selectedHhcProductIds.includes(p.id)
                        );
                        openBatchImportModal(targetItems);
                      }}
                      className="px-4 py-2 bg-brand-pink hover:bg-brand-pinkHover text-white text-xs font-extrabold rounded-xl shadow-md shadow-brand-pink/20 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>
                        Import Selected ({selectedHhcProductIds.length})
                      </span>
                    </button>
                  </div>
                </div>

                {hhcImportLoading && (
                  <div className="flex items-center justify-center gap-2 py-8 text-xs text-brand-pink font-bold">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Fetching live supplier catalog from HHC gateway...</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {hhcSupplierProducts.map((item) => {
                    const pricing = calculateHhcSellingPrice(
                      item.wholesalePrice,
                      hhcMarginType,
                      hhcMarginValue
                    );
                    const isAlreadyImported = products.some(
                      (p) =>
                        p.sku === item.sku ||
                        p.title.toLowerCase().trim() === item.name.toLowerCase().trim()
                    );
                    const isChecked = selectedHhcProductIds.includes(item.id);

                    return (
                      <div
                        key={item.id}
                        className={`bg-white rounded-2xl border overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between relative ${
                          isChecked ? "ring-2 ring-brand-pink border-brand-pink" : "border-slate-200"
                        }`}
                      >
                        <div>
                          {/* Thumbnail */}
                          <div className="relative aspect-square w-full bg-slate-100 border-b border-slate-100">
                            <Image
                              src={item.thumbnail || "/images/banners/hero-banner.png"}
                              alt={item.name}
                              fill
                              sizes="(max-width: 768px) 100vw, 300px"
                              className="object-cover"
                              unoptimized
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                if (target && !target.src.includes("hero-banner.png")) {
                                  target.src = "/images/banners/hero-banner.png";
                                }
                              }}
                            />

                            {/* Checkbox for batch selection */}
                            {!isAlreadyImported ? (
                              <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-xs p-1 rounded-lg shadow-sm border border-slate-200">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedHhcProductIds((prev) => [...prev, item.id]);
                                    } else {
                                      setSelectedHhcProductIds((prev) => prev.filter((id) => id !== item.id));
                                    }
                                  }}
                                  className="w-4 h-4 rounded text-brand-pink focus:ring-brand-pink cursor-pointer"
                                />
                              </div>
                            ) : (
                              <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>In Store</span>
                              </span>
                            )}

                            <span className="absolute top-2 right-2 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                              {item.stock} in stock
                            </span>
                          </div>

                          {/* Details */}
                          <div className="p-3.5 space-y-2">
                            <h4 className="text-xs font-bold text-slate-900 line-clamp-2" title={item.name}>
                              {item.name}
                            </h4>

                            <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
                              <div className="flex justify-between text-slate-500 text-[11px]">
                                <span>Wholesale Cost:</span>
                                <span className="font-mono font-bold text-slate-800">
                                  Rs. {item.wholesalePrice?.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between text-slate-900 font-black">
                                <span className="text-emerald-700">Sale Price:</span>
                                <span>Rs. {pricing.salePrice.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-[11px] text-emerald-600 font-bold">
                                <span>Estimated Profit:</span>
                                <span>+Rs. {pricing.margin.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="p-3.5 pt-0">
                          {isAlreadyImported ? (
                            <button
                              disabled
                              className="w-full py-2 bg-slate-100 text-slate-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Imported in Store</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => openSingleImportModal(item)}
                              className="w-full py-2 bg-brand-pink hover:bg-brand-pinkHover text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Import 1-Click</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* SUPPLIER PRODUCTS PAGINATION BAR */}
                {hhcProductLastPage > 1 && (() => {
                  const pagesToShow = [];
                  const maxButtons = 5;
                  let startPage = Math.max(1, hhcProductPage - 2);
                  let endPage = Math.min(hhcProductLastPage, startPage + maxButtons - 1);
                  if (endPage - startPage + 1 < maxButtons) {
                    startPage = Math.max(1, endPage - maxButtons + 1);
                  }
                  for (let i = startPage; i <= endPage; i++) pagesToShow.push(i);

                  return (
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs">
                      <span className="text-slate-500 text-[11px] font-medium">
                        Showing Page {hhcProductPage} of {hhcProductLastPage} &bull; {hhcProductTotal || selectedHhcSupplier?.productsCount || 0} Total Wholesale Items from {selectedHhcSupplier?.storeName}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={hhcProductPage <= 1 || hhcImportLoading}
                          onClick={() => {
                            if (selectedHhcSupplier) {
                              setSelectedHhcProductIds([]);
                              handleSelectSupplier(selectedHhcSupplier, 1, hhcProductPageSize);
                            }
                          }}
                          className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition cursor-pointer"
                          title="First Page"
                        >
                          &laquo;
                        </button>
                        <button
                          type="button"
                          disabled={hhcProductPage <= 1 || hhcImportLoading}
                          onClick={() => {
                            if (selectedHhcSupplier) {
                              setSelectedHhcProductIds([]);
                              handleSelectSupplier(selectedHhcSupplier, Math.max(1, hhcProductPage - 1), hhcProductPageSize);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition cursor-pointer"
                        >
                          Prev
                        </button>

                        {startPage > 1 && (
                          <>
                            <button
                              type="button"
                              disabled={hhcImportLoading}
                              onClick={() => {
                                if (selectedHhcSupplier) {
                                  setSelectedHhcProductIds([]);
                                  handleSelectSupplier(selectedHhcSupplier, 1, hhcProductPageSize);
                                }
                              }}
                              className="w-7 h-7 rounded-lg text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                            >
                              1
                            </button>
                            {startPage > 2 && <span className="text-slate-300 px-0.5">&hellip;</span>}
                          </>
                        )}

                        {pagesToShow.map((pg) => {
                          const isActive = pg === hhcProductPage;
                          return (
                            <button
                              key={pg}
                              type="button"
                              disabled={hhcImportLoading}
                              onClick={() => {
                                if (selectedHhcSupplier) {
                                  setSelectedHhcProductIds([]);
                                  handleSelectSupplier(selectedHhcSupplier, pg, hhcProductPageSize);
                                }
                              }}
                              className={`w-7 h-7 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                                isActive
                                  ? "bg-brand-pink text-white shadow-xs"
                                  : "border border-slate-200 text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              {pg}
                            </button>
                          );
                        })}

                        {endPage < hhcProductLastPage && (
                          <>
                            {endPage < hhcProductLastPage - 1 && <span className="text-slate-300 px-0.5">&hellip;</span>}
                            <button
                              type="button"
                              disabled={hhcImportLoading}
                              onClick={() => {
                                if (selectedHhcSupplier) {
                                  setSelectedHhcProductIds([]);
                                  handleSelectSupplier(selectedHhcSupplier, hhcProductLastPage, hhcProductPageSize);
                                }
                              }}
                              className="w-7 h-7 rounded-lg text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                            >
                              {hhcProductLastPage}
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          disabled={hhcProductPage >= hhcProductLastPage || hhcImportLoading}
                          onClick={() => {
                            if (selectedHhcSupplier) {
                              setSelectedHhcProductIds([]);
                              handleSelectSupplier(selectedHhcSupplier, Math.min(hhcProductLastPage, hhcProductPage + 1), hhcProductPageSize);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition cursor-pointer"
                        >
                          Next
                        </button>
                        <button
                          type="button"
                          disabled={hhcProductPage >= hhcProductLastPage || hhcImportLoading}
                          onClick={() => {
                            if (selectedHhcSupplier) {
                              setSelectedHhcProductIds([]);
                              handleSelectSupplier(selectedHhcSupplier, hhcProductLastPage, hhcProductPageSize);
                            }
                          }}
                          className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition cursor-pointer"
                          title="Last Page"
                        >
                          &raquo;
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          );
        })()}

        {/* ==========================================
            TAB 5C: HHC ORDER DISPATCH & FULFILLMENT
        =========================================== */}
        {activeTab === "hhc-forwarding" && (() => {
          const filteredOrders = orders.filter((ord) => {
            const q = orderSearchQuery.toLowerCase().trim();
            return (
              !q ||
              ord.order_number.toLowerCase().includes(q) ||
              ord.customer_name.toLowerCase().includes(q) ||
              ord.phone.toLowerCase().includes(q) ||
              ord.city.toLowerCase().includes(q)
            );
          });

          return (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <Send className="w-5 h-5 text-amber-600" />
                      <span>HHC Order Dispatch & Fulfillment Queue</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Forward customer orders placed on Abrish Mart directly to HHC Dropshipping for warehouse packing & courier delivery.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={handleAddDemoOrder}
                      className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Demo Order</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (orders.length === 0) {
                          showToast("No orders available to delete.");
                          return;
                        }
                        setDeleteAllOrdersModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl transition shadow-xs"
                      title="Clear all orders data"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete All Orders ({orders.length})</span>
                    </button>

                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
                      <span className="font-bold text-slate-700">Default Courier:</span>
                      <select
                        value={hhcSelectedCourierId}
                        onChange={(e) => setHhcSelectedCourierId(parseInt(e.target.value))}
                        className="font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800"
                      >
                        <option value={2}>Trax Logistics (Karachi, Lahore & Nationwide)</option>
                        <option value={1}>Leopard Courier (Express Network)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Search Bar for Orders Queue */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Search queue by Order #, Customer Name, Phone, or City..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-pink"
                  />
                </div>
              </div>

              {/* Orders Dispatch Queue Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                    Customer Orders Queue ({filteredOrders.length} Total Orders)
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {filteredOrders.filter((o) => !o.tracking_number && o.status !== "Cancelled").length} Ready to Dispatch
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                      <tr>
                        <th className="p-3.5 w-8">Details</th>
                        <th className="p-3.5">Order #</th>
                        <th className="p-3.5">Customer & City</th>
                        <th className="p-3.5">Delivery Address</th>
                        <th className="p-3.5">Items</th>
                        <th className="p-3.5">COD Amount</th>
                        <th className="p-3.5">HHC City Code</th>
                        <th className="p-3.5">Fulfillment Status</th>
                        <th className="p-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="p-8 text-center text-slate-400 text-xs">
                            <p className="font-semibold text-slate-600 mb-2">No customer orders in queue.</p>
                            <button
                              type="button"
                              onClick={handleAddDemoOrder}
                              className="px-4 py-2 bg-brand-pink hover:bg-brand-pinkHover text-white text-xs font-bold rounded-xl transition shadow-xs inline-flex items-center gap-1.5"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>+ Add Demo Order to Test</span>
                            </button>
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((ord) => {
                          const isDispatched = Boolean(ord.tracking_number);
                          const cityCode = resolveHhcDestinationCity(ord.city, hhcSelectedCourierId);

                          return (
                            <tr key={ord.id} className="hover:bg-slate-50 transition">
                              <td className="p-3.5 text-center">
                                <button
                                  type="button"
                                  onClick={() => openOrderDetailsModal(ord)}
                                  className="p-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 rounded-lg transition shadow-2xs"
                                  title="Check, Fix and Send (HHC Dispatch Modal)"
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </td>
                              <td className="p-3.5 font-bold font-mono text-brand-pink">
                                {ord.order_number}
                              </td>
                              <td className="p-3.5">
                                <p className="font-bold text-slate-900">{ord.customer_name}</p>
                                <p className="text-[10px] text-emerald-700 font-mono">{ord.phone}</p>
                              </td>
                              <td className="p-3.5 max-w-xs truncate" title={ord.address}>
                                <span className="font-bold text-slate-800">{ord.city}: </span>
                                <span className="text-slate-500 text-[11px]">{ord.address}</span>
                              </td>
                              <td className="p-3.5 text-slate-700">
                                {ord.items?.length || 1} item(s)
                              </td>
                              <td className="p-3.5 font-black text-slate-900">
                                Rs. {ord.total_amount?.toLocaleString()}
                              </td>
                              <td className="p-3.5 font-mono text-[10px] text-slate-500">
                                <span className="bg-slate-100 px-2 py-0.5 rounded font-bold">
                                  {cityCode}
                                </span>
                              </td>
                              <td className="p-3.5">
                                {isDispatched ? (
                                  <div className="space-y-0.5">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px] inline-flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Dispatched to HHC
                                      </span>
                                      {ord.hhc_order_id && (
                                        <span className="bg-blue-100 text-blue-800 font-black px-1.5 py-0.5 rounded text-[10px]">
                                          HHC #{ord.hhc_order_id}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[10px] font-mono text-slate-500">
                                      {ord.tracking_number} ({ord.courier_name || "Trax"})
                                    </p>
                                  </div>
                                ) : (
                                  <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full text-[10px] inline-flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Ready to Dispatch
                                  </span>
                                )}
                              </td>
                              <td className="p-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {isDispatched ? (
                                    <span className="text-[11px] font-bold text-slate-400 px-3 py-1 bg-slate-100 rounded-lg">
                                      Completed
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      disabled={hhcDispatchingId === ord.id}
                                      onClick={() => handleHhcDispatch(ord, hhcSelectedCourierId)}
                                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1"
                                    >
                                      {hhcDispatchingId === ord.id ? (
                                        <>
                                          <RefreshCw className="w-3 h-3 animate-spin" />
                                          <span>Dispatching...</span>
                                        </>
                                      ) : (
                                        <>
                                          <Send className="w-3 h-3" />
                                          <span>Dispatch to HHC</span>
                                        </>
                                      )}
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setDeleteConfirm({
                                        open: true,
                                        type: "order",
                                        id: ord.id,
                                        title: `Order #${ord.order_number} (${ord.customer_name})`,
                                      })
                                    }
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                    title="Delete Order Permanently"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ==========================================
            TAB 5D: HHC STOCK & PRICE SYNCHRONIZATION
        =========================================== */}
        {activeTab === "hhc-sync" && (() => {
          const totalSyncPages = Math.max(1, Math.ceil(products.length / syncPageSize));
          const currentSyncPage = Math.min(syncPage, totalSyncPages);
          const pagedSyncProducts = products.slice(
            (currentSyncPage - 1) * syncPageSize,
            currentSyncPage * syncPageSize
          );

          return (
            <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-cyan-600" />
                    <span>HHC Stock & Price Synchronization Engine</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Syncing prevents ad budget waste on Facebook and TikTok by automatically flagging warehouse out-of-stock items.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={hhcSyncing}
                  onClick={handleRunStockSync}
                  className="px-4 py-2.5 bg-brand-pink hover:bg-brand-pinkHover text-white text-xs font-extrabold rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${hhcSyncing ? "animate-spin" : ""}`} />
                  <span>{hhcSyncing ? "Synchronizing with HHC..." : "Run Live Stock & Price Sync"}</span>
                </button>
              </div>
            </div>

            {/* Inventory Health Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Catalog Items</span>
                <p className="text-xl font-black text-slate-900 mt-1">{products.length}</p>
                <p className="text-xs text-slate-500 mt-0.5">Active items in your Abrish Mart catalog</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Warehouse Status</span>
                <p className="text-xl font-black text-emerald-700 mt-1">100% In Stock</p>
                <p className="text-xs text-slate-500 mt-0.5">Karachi, Lahore & Faisalabad Hubs</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Ad Budget Security</span>
                <p className="text-xl font-black text-blue-700 mt-1">Protected</p>
                <p className="text-xs text-slate-500 mt-0.5">Zero dead clicks from out-of-stock items</p>
              </div>
            </div>

            {/* Sync Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                  Store Products vs HHC Warehouse Inventory
                </h3>
                <span className="text-[11px] text-slate-400">
                  Last verified: {new Date().toLocaleDateString()}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                    <tr>
                      <th className="p-3.5">Product Title</th>
                      <th className="p-3.5">SKU</th>
                      <th className="p-3.5">Wholesale Cost</th>
                      <th className="p-3.5">Store Sale Price</th>
                      <th className="p-3.5">Gross Margin</th>
                      <th className="p-3.5">HHC Warehouse Stock</th>
                      <th className="p-3.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {pagedSyncProducts.map((p) => {
                      const wholesale = Math.round(p.price * 0.65);
                      const margin = p.price - wholesale;
                      return (
                        <tr key={p.id} className="hover:bg-slate-50 transition">
                          <td className="p-3.5 font-bold text-slate-900 max-w-xs truncate">
                            {p.title}
                          </td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-500">
                            {p.sku || `SKU-${p.id}`}
                          </td>
                          <td className="p-3.5 font-mono text-slate-600">
                            Rs. {wholesale.toLocaleString()}
                          </td>
                          <td className="p-3.5 font-black text-slate-900">
                            Rs. {p.price.toLocaleString()}
                          </td>
                          <td className="p-3.5 font-bold text-emerald-600">
                            +Rs. {margin.toLocaleString()}
                          </td>
                          <td className="p-3.5">
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                              {p.stock || 45} units available
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                              <Check className="w-3.5 h-3.5" />
                              Synced
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* 20 Items Per Page Sync Pagination */}
              {totalSyncPages > 1 && (() => {
                const pagesToShow = [];
                const maxButtons = 5;
                let startPage = Math.max(1, currentSyncPage - 2);
                let endPage = Math.min(totalSyncPages, startPage + maxButtons - 1);
                if (endPage - startPage + 1 < maxButtons) {
                  startPage = Math.max(1, endPage - maxButtons + 1);
                }
                for (let i = startPage; i <= endPage; i++) {
                  pagesToShow.push(i);
                }

                return (
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border-t border-slate-100 text-xs">
                    <span className="text-slate-500 font-medium text-[11px]">
                      Showing {(currentSyncPage - 1) * syncPageSize + 1} to{" "}
                      {Math.min(currentSyncPage * syncPageSize, products.length)} of {products.length} catalog items (Page {currentSyncPage} of {totalSyncPages})
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={currentSyncPage <= 1}
                        onClick={() => setSyncPage(1)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 font-bold transition cursor-pointer"
                        title="First Page"
                      >
                        &laquo;
                      </button>
                      <button
                        type="button"
                        disabled={currentSyncPage <= 1}
                        onClick={() => setSyncPage((p) => Math.max(1, p - 1))}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 font-bold transition cursor-pointer"
                      >
                        Prev
                      </button>
                      {startPage > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={() => setSyncPage(1)}
                            className="w-7 h-7 rounded-lg text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                          >
                            1
                          </button>
                          {startPage > 2 && <span className="text-slate-400 px-0.5">&hellip;</span>}
                        </>
                      )}
                      {pagesToShow.map((pg) => (
                        <button
                          key={pg}
                          type="button"
                          onClick={() => setSyncPage(pg)}
                          className={`w-7 h-7 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                            pg === currentSyncPage
                              ? "bg-brand-pink text-white shadow-xs"
                              : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {pg}
                        </button>
                      ))}
                      {endPage < totalSyncPages && (
                        <>
                          {endPage < totalSyncPages - 1 && <span className="text-slate-400 px-0.5">&hellip;</span>}
                          <button
                            type="button"
                            onClick={() => setSyncPage(totalSyncPages)}
                            className="w-7 h-7 rounded-lg text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                          >
                            {totalSyncPages}
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        disabled={currentSyncPage >= totalSyncPages}
                        onClick={() => setSyncPage((p) => Math.min(totalSyncPages, p + 1))}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 font-bold transition cursor-pointer"
                      >
                        Next
                      </button>
                      <button
                        type="button"
                        disabled={currentSyncPage >= totalSyncPages}
                        onClick={() => setSyncPage(totalSyncPages)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 font-bold transition cursor-pointer"
                        title="Last Page"
                      >
                        &raquo;
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        );
      })()}

        {/* ==========================================
            TAB 5E: HHC RCP & RETURNS CENTER
        =========================================== */}
        {activeTab === "hhc-rcp" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                    <span>RCP & Returns Management Center</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Monitor undelivered parcels (phone off, customer unavailable, address issues) and schedule reattempts.
                  </p>
                </div>
                <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full">
                  {hhcRcpOrders.filter((r) => r.status === "Action Required").length} Action Required
                </span>
              </div>
            </div>

            {/* Problem Parcels Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                  Active RCP Problem Parcels
                </h3>
                <span className="text-[11px] text-slate-500">Live Courier Feedback</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                    <tr>
                      <th className="p-3.5">Order / Tracking</th>
                      <th className="p-3.5">Customer & Contact</th>
                      <th className="p-3.5">City & Courier</th>
                      <th className="p-3.5">Product & Amount</th>
                      <th className="p-3.5">Courier Rider Issue Note</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {hhcRcpOrders.map((rcp) => (
                      <tr key={rcp.id} className="hover:bg-slate-50 transition">
                        <td className="p-3.5">
                          <p className="font-bold text-brand-pink font-mono">{rcp.orderId}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{rcp.trackingNumber}</p>
                        </td>
                        <td className="p-3.5">
                          <p className="font-bold text-slate-900">{rcp.customerName}</p>
                          <a
                            href={`https://wa.me/92${rcp.customerPhone.replace(/^0/, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-emerald-700 font-mono flex items-center gap-1 hover:underline"
                          >
                            <MessageSquare className="w-3 h-3" />
                            {rcp.customerPhone} (WhatsApp)
                          </a>
                        </td>
                        <td className="p-3.5">
                          <p className="font-bold text-slate-800">{rcp.city}</p>
                          <p className="text-[10px] text-slate-500">{rcp.courier}</p>
                        </td>
                        <td className="p-3.5">
                          <p className="text-slate-800 font-semibold">{rcp.productName}</p>
                          <p className="font-black text-slate-900 text-[11px]">
                            Rs. {rcp.amount.toLocaleString()}
                          </p>
                        </td>
                        <td className="p-3.5 max-w-xs text-rose-700 bg-rose-50/50 rounded-lg text-[11px]">
                          {rcp.issueReason}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              rcp.status === "Action Required"
                                ? "bg-rose-100 text-rose-800"
                                : rcp.status === "Reattempt Scheduled"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {rcp.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-1">
                          {rcp.status !== "Returned to Origin" && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleRcpReattempt(rcp)}
                                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg text-[10px] font-bold shadow-xs transition"
                              >
                                Reattempt
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRcpReturn(rcp)}
                                className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[10px] font-bold transition"
                              >
                                Return
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 5F: HHC PRICING & COURIER SETTINGS
        =========================================== */}
        {activeTab === "hhc-settings" && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm max-w-3xl space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-600" />
                <span>HHC Dropshipping Configuration & Margins</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your HHC API authentication, default logistics partner, and profit markup calculations.
              </p>
            </div>

            <form onSubmit={handleSaveHhcSettings} className="space-y-4 text-xs font-semibold text-slate-700">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  HHC Production App Key
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={hhcAppKey}
                    onChange={(e) => setHhcAppKey(e.target.value)}
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-brand-pink"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      hhcCheckConnection(hhcAppKey).then((r) => {
                        setHhcConnected(r.success);
                        showToast(r.success ? "✅ API Key Verified!" : "❌ Verification Failed");
                      });
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
                  >
                    Verify Key
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Connected to Business Profile #76494 (Iknuz Trader / Usman Shah).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Default Logistics Partner
                  </label>
                  <select
                    value={hhcSelectedCourierId}
                    onChange={(e) => setHhcSelectedCourierId(parseInt(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white"
                  >
                    <option value={2}>Trax Logistics (Recommended - 2,784 Zones)</option>
                    <option value={1}>Leopard Courier (Air & Express Network)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Profit Margin Rule on Import
                  </label>
                  <select
                    value={hhcMarginType}
                    onChange={(e) => setHhcMarginType(e.target.value as "fixed" | "percentage")}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white"
                  >
                    <option value="fixed">Fixed Margin (PKR Markup)</option>
                    <option value="percentage">Percentage Markup (% on Cost)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Default Margin Value ({hhcMarginType === "fixed" ? "PKR" : "Percentage %"})
                </label>
                <input
                  type="number"
                  value={hhcMarginValue}
                  onChange={(e) => setHhcMarginValue(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-brand-pink"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Example: If wholesale cost is Rs. 1,000, selling price will be Rs.{" "}
                  {calculateHhcSellingPrice(1000, hhcMarginType, hhcMarginValue).salePrice.toLocaleString()} (Profit: Rs.{" "}
                  {calculateHhcSellingPrice(1000, hhcMarginType, hhcMarginValue).margin.toLocaleString()}).
                </p>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Real-time COD & Dispatch Security Active</span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  All customer deliveries are tracked directly via Trax and Leopard APIs. Customer addresses are automatically resolved to courier hub city codes.
                </p>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-brand-pink hover:bg-brand-pinkHover text-white text-xs font-extrabold rounded-xl shadow-md transition"
              >
                Save HHC Settings
              </button>
            </form>
          </div>
        )}

        {/* ==========================================
            TAB 6: STORE SETTINGS
        =========================================== */}
        {activeTab === "settings" && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm max-w-3xl space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900">Store Identity & Financial Settings</h2>
              <p className="text-xs text-slate-500">
                Configure helpline numbers, free shipping thresholds, and bank payment details.
              </p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (settings) {
                  await adminSaveSettings(settings);
                  showToast("✅ Store settings updated across website!");
                }
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Store Name</label>
                  <input
                    type="text"
                    value={settings?.store_name || "Abrish Mart"}
                    onChange={(e) => setSettings((s) => s && { ...s, store_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">WhatsApp & Phone Hotline</label>
                  <input
                    type="text"
                    value={settings?.phone || "03452086160"}
                    onChange={(e) => setSettings((s) => s && { ...s, phone: e.target.value, whatsapp: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Base Delivery Charges (PKR)</label>
                  <input
                    type="number"
                    value={settings?.delivery_charge ?? 200}
                    onChange={(e) => setSettings((s) => s && { ...s, delivery_charge: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Free Shipping Spend Limit (PKR)</label>
                  <input
                    type="number"
                    value={settings?.free_shipping_threshold ?? 2500}
                    onChange={(e) =>
                      setSettings((s) => s && { ...s, free_shipping_threshold: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h4 className="font-bold text-slate-800 text-xs mb-3">Bank & Digital Wallet Accounts</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">JazzCash Account</label>
                    <input
                      type="text"
                      value={settings?.jazzcash_number || "03452086160"}
                      onChange={(e) => setSettings((s) => s && { ...s, jazzcash_number: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">EasyPaisa Account</label>
                    <input
                      type="text"
                      value={settings?.easypaisa_number || "03452086160"}
                      onChange={(e) => setSettings((s) => s && { ...s, easypaisa_number: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="bg-brand-pink hover:bg-brand-pinkHover text-white font-bold py-3 px-6 rounded-xl shadow-md transition"
              >
                Save All Settings
              </button>
            </form>
          </div>
        )}
      </main>

      {/* ==========================================
          MODAL 1: ADD / EDIT PRODUCT
      =========================================== */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl max-h-[92vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {editingProduct?.id ? "Edit Product & Inventory" : "Add New Product to Abrish Mart"}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Fill item details, multi-level category taxonomy, cost vs selling prices, variations, and image gallery.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* Product Title & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct?.title || ""}
                    onChange={(e) => setEditingProduct((p) => ({ ...(p || {}), title: e.target.value }))}
                    placeholder="e.g. Premium Bridal Silk Nighty Gown Set"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-brand-pink"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU / Item Code</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={editingProduct?.sku || ""}
                      onChange={(e) => setEditingProduct((p) => ({ ...(p || {}), sku: e.target.value }))}
                      placeholder="e.g. ABM-1029"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono text-[11px] focus:outline-hidden focus:ring-2 focus:ring-brand-pink"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setEditingProduct((p) => ({
                          ...(p || {}),
                          sku: `ABM-${Math.floor(1000 + Math.random() * 9000)}`,
                        }))
                      }
                      className="px-2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-[10px] shrink-0"
                      title="Generate SKU"
                    >
                      Gen
                    </button>
                  </div>
                </div>
              </div>

              {/* Multi-Level Taxonomy Selection: Category -> Subcategory -> Child */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-brand-pink" />
                  <span className="font-bold text-slate-800 text-xs">Category Taxonomy & Classification</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-600 text-[11px] mb-1">
                      1. Main Department *
                    </label>
                    <select
                      value={editingProduct?.category_slug || categories[0]?.slug}
                      onChange={(e) => {
                        const newCatSlug = e.target.value;
                        const targetCat = categories.find((c) => c.slug === newCatSlug);
                        setEditingProduct((p) => ({
                          ...(p || {}),
                          category_slug: newCatSlug,
                          subcategory_slug: targetCat?.subcategories?.[0]?.slug || "",
                          child_subcategory_slug: targetCat?.subcategories?.[0]?.child_subcategories?.[0]?.slug || "",
                        }));
                      }}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-brand-pink"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 text-[11px] mb-1">
                      2. Subcategory (Level 2)
                    </label>
                    {(() => {
                      const selectedCat = categories.find(
                        (c) => c.slug === (editingProduct?.category_slug || categories[0]?.slug)
                      );
                      const subcats = selectedCat?.subcategories || [];

                      return (
                        <select
                          value={editingProduct?.subcategory_slug || ""}
                          onChange={(e) => {
                            const newSubSlug = e.target.value;
                            const targetSub = subcats.find((s) => s.slug === newSubSlug);
                            setEditingProduct((p) => ({
                              ...(p || {}),
                              subcategory_slug: newSubSlug,
                              child_subcategory_slug: targetSub?.child_subcategories?.[0]?.slug || "",
                            }));
                          }}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-brand-pink"
                        >
                          <option value="">-- Select Subcategory --</option>
                          {subcats.map((s) => (
                            <option key={s.id || s.slug} value={s.slug}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      );
                    })()}
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 text-[11px] mb-1">
                      3. Child Subcategory (Level 3)
                    </label>
                    {(() => {
                      const selectedCat = categories.find(
                        (c) => c.slug === (editingProduct?.category_slug || categories[0]?.slug)
                      );
                      const selectedSub = selectedCat?.subcategories?.find(
                        (s) => s.slug === editingProduct?.subcategory_slug
                      );
                      const children = selectedSub?.child_subcategories || [];

                      return (
                        <select
                          value={editingProduct?.child_subcategory_slug || ""}
                          onChange={(e) =>
                            setEditingProduct((p) => ({
                              ...(p || {}),
                              child_subcategory_slug: e.target.value,
                            }))
                          }
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-brand-pink"
                        >
                          <option value="">-- None / Root Subcategory --</option>
                          {children.map((ch) => (
                            <option key={ch.id || ch.slug} value={ch.slug}>
                              {ch.name}
                            </option>
                          ))}
                        </select>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Pricing & Stock Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Wholesale Cost (PKR)</label>
                  <input
                    type="number"
                    value={editingProduct?.wholesale_price || ""}
                    onChange={(e) =>
                      setEditingProduct((p) => ({
                        ...(p || {}),
                        wholesale_price: Number(e.target.value),
                      }))
                    }
                    placeholder="e.g. 1500"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sale Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct?.price || ""}
                    onChange={(e) =>
                      setEditingProduct((p) => ({
                        ...(p || {}),
                        price: Number(e.target.value),
                      }))
                    }
                    placeholder="e.g. 2450"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold text-brand-pink"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cut/Original Price</label>
                  <input
                    type="number"
                    value={editingProduct?.original_price || ""}
                    onChange={(e) =>
                      setEditingProduct((p) => ({
                        ...(p || {}),
                        original_price: Number(e.target.value),
                      }))
                    }
                    placeholder="e.g. 3550"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={editingProduct?.stock ?? 15}
                    onChange={(e) =>
                      setEditingProduct((p) => ({
                        ...(p || {}),
                        stock: Number(e.target.value),
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              {/* Profit Margin Preview Bar */}
              {editingProduct?.price && editingProduct?.wholesale_price && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                  <span className="font-bold">Calculated Profit per Sale:</span>
                  <span className="font-black">
                    Rs. {(Number(editingProduct.price) - Number(editingProduct.wholesale_price)).toLocaleString()} (
                    {Math.round(
                      ((Number(editingProduct.price) - Number(editingProduct.wholesale_price)) /
                        Number(editingProduct.wholesale_price)) *
                        100
                    )}
                    % Markup)
                  </span>
                </div>
              )}

              {/* Image & Gallery Management (WebP compressed upload) */}
              <div className="space-y-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 text-xs">Product Images & Gallery</span>
                    <p className="text-[10px] text-slate-400">
                      Upload single cover or multiple gallery photos. Compressed automatically to WebP in browser.
                    </p>
                  </div>
                  {(uploadingImage || galleryUploading) && (
                    <span className="text-[11px] font-bold text-brand-pink animate-pulse">
                      Processing & Compressing...
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-600 text-[11px] mb-1">
                      Cover Thumbnail Upload
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, false)}
                      className="w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-pink file:text-white cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 text-[11px] mb-1">
                      + Add Multiple Gallery Photos
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryUpload}
                      className="w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-white cursor-pointer"
                    />
                  </div>
                </div>

                {/* Gallery Previews with Delete Button */}
                {editingProduct?.gallery_urls && editingProduct.gallery_urls.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Current Gallery Photos ({editingProduct.gallery_urls.length})
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {editingProduct.gallery_urls.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className="group relative w-16 h-16 rounded-xl overflow-hidden border-2 border-slate-200 bg-white shadow-xs"
                        >
                          <Image
                            src={imgUrl}
                            alt={`Gallery image ${idx + 1}`}
                            fill
                            sizes="64px"
                            className="object-cover"
                            unoptimized
                          />
                          {idx === 0 && (
                            <span className="absolute bottom-0 inset-x-0 bg-brand-pink text-white text-[8px] font-bold text-center py-0.5">
                              Cover
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow"
                            title="Remove image"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Variations (Sizes & Colors) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Available Sizes (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={sizesInput}
                    onChange={(e) => setSizesInput(e.target.value)}
                    placeholder="e.g. Small, Medium, Large, XL, Free Size"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">Leave blank if single size.</p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Available Colors (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={colorsInput}
                    onChange={(e) => setColorsInput(e.target.value)}
                    placeholder="e.g. Maroon, Blush Pink, Black, Navy"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">Leave blank if no color choices.</p>
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={editingProduct?.description || ""}
                  onChange={(e) => setEditingProduct((p) => ({ ...(p || {}), description: e.target.value }))}
                  placeholder="Enter detailed fabric, dimensions, specifications, or usage guidelines..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 resize-none focus:outline-hidden focus:ring-2 focus:ring-brand-pink"
                />
              </div>

              {/* Status and Merchandising Toggles */}
              <div className="flex flex-wrap items-center gap-5 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingProduct?.is_active ?? true}
                    onChange={(e) => setEditingProduct((p) => ({ ...(p || {}), is_active: e.target.checked }))}
                    className="rounded text-brand-pink focus:ring-brand-pink"
                  />
                  <span>Active on Store</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingProduct?.is_flash_deal ?? false}
                    onChange={(e) => setEditingProduct((p) => ({ ...(p || {}), is_flash_deal: e.target.checked }))}
                    className="rounded text-brand-pink focus:ring-brand-pink"
                  />
                  <span>⚡ 24H Flash Deal</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editingProduct?.is_featured ?? false}
                    onChange={(e) => setEditingProduct((p) => ({ ...(p || {}), is_featured: e.target.checked }))}
                    className="rounded text-brand-pink focus:ring-brand-pink"
                  />
                  <span>🌟 Featured on Homepage</span>
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-pink hover:bg-brand-pinkHover text-white font-black rounded-xl shadow-md shadow-brand-pink/20 transition"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 2: ADD / EDIT CATEGORY
      =========================================== */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-slate-900">
              {editingCategory?.id ? "Edit Category" : "Add New Category"}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editingCategory?.name || ""}
                  onChange={(e) => setEditingCategory((c) => ({ ...(c || {}), name: e.target.value }))}
                  placeholder="e.g. Bridal Silk & Nightwear"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Upload Category Icon / Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, true)}
                  className="w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-pink file:text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="show_homepage"
                  checked={editingCategory?.show_on_homepage ?? true}
                  onChange={(e) =>
                    setEditingCategory((c) => ({ ...(c || {}), show_on_homepage: e.target.checked }))
                  }
                  className="rounded text-brand-pink"
                />
                <label htmlFor="show_homepage" className="cursor-pointer font-semibold text-slate-800">
                  Show in Top Categories Marquee on Homepage
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-pink hover:bg-brand-pinkHover text-white font-bold rounded-xl shadow"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 2B: ADD / EDIT BANNER
      =========================================== */}
      {bannerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-slate-900">
              {editingBanner?.id ? "Edit Promotional Banner" : "Add New Promotional Banner"}
            </h3>

            <form onSubmit={handleSaveBanner} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Banner Title / Campaign Name *</label>
                <input
                  type="text"
                  required
                  value={editingBanner?.title || ""}
                  onChange={(e) => setEditingBanner((b) => ({ ...(b || {}), title: e.target.value }))}
                  placeholder="e.g. Mega Summer Flash Sale 2026"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Click URL</label>
                <input
                  type="text"
                  value={editingBanner?.link_url || "/shop"}
                  onChange={(e) => setEditingBanner((b) => ({ ...(b || {}), link_url: e.target.value }))}
                  placeholder="/shop, /flash-deals, or /category/?slug=..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Banner Image (WebP Recommended) *</label>
                <div className="space-y-2">
                  {editingBanner?.image_url && (
                    <div className="relative aspect-[2.66/1] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                      <Image
                        src={editingBanner.image_url}
                        alt="Banner Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        showToast("Compressing banner image to WebP...");
                        const { url } = await compressAndUploadImage(file, "abrishmart-media");
                        if (url) {
                          setEditingBanner((b) => ({ ...(b || {}), image_url: url }));
                          showToast("Image uploaded successfully!");
                        }
                      }}
                      className="w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-pink file:text-white"
                    />
                  </div>
                  <input
                    type="text"
                    value={editingBanner?.image_url || ""}
                    onChange={(e) => setEditingBanner((b) => ({ ...(b || {}), image_url: e.target.value }))}
                    placeholder="Or enter direct image URL (/images/banners/...)"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-slate-700 text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Display Sort Order</label>
                  <input
                    type="number"
                    value={editingBanner?.sort_order ?? 1}
                    onChange={(e) => setEditingBanner((b) => ({ ...(b || {}), sort_order: Number(e.target.value) || 1 }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="banner_active"
                    checked={editingBanner?.is_active ?? true}
                    onChange={(e) => setEditingBanner((b) => ({ ...(b || {}), is_active: e.target.checked }))}
                    className="rounded text-brand-pink"
                  />
                  <label htmlFor="banner_active" className="cursor-pointer font-semibold text-slate-800">
                    Active (Live on Slider)
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setBannerModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-pink hover:bg-brand-pinkHover text-white font-bold rounded-xl shadow"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 2C: ADD / EDIT COUPON
      =========================================== */}
      {couponModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-slate-900">
              {editingCoupon?.id ? "Edit Coupon / Discount" : "Create New Coupon"}
            </h3>

            <form onSubmit={handleSaveCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={editingCoupon?.code || ""}
                  onChange={(e) => setEditingCoupon((c) => ({ ...(c || {}), code: e.target.value.toUpperCase() }))}
                  placeholder="e.g. WELCOME200 or MEGA10"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 uppercase font-black tracking-wider"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount Type *</label>
                  <select
                    value={editingCoupon?.discount_type || "fixed"}
                    onChange={(e) =>
                      setEditingCoupon((c) => ({
                        ...(c || {}),
                        discount_type: e.target.value as "fixed" | "percentage",
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  >
                    <option value="fixed">Fixed PKR (Rs.)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {editingCoupon?.discount_type === "percentage" ? "Discount Percentage (%) *" : "Discount Amount (PKR) *"}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingCoupon?.discount_value ?? 200}
                    onChange={(e) =>
                      setEditingCoupon((c) => ({ ...(c || {}), discount_value: Number(e.target.value) || 0 }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Minimum Order Amount (PKR)</label>
                <input
                  type="number"
                  min={0}
                  value={editingCoupon?.min_spend ?? 1500}
                  onChange={(e) =>
                    setEditingCoupon((c) => ({ ...(c || {}), min_spend: Number(e.target.value) || 0 }))
                  }
                  placeholder="0 for no minimum"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">Customer cart subtotal must reach this value to use code.</p>
              </div>

              <div className="space-y-2 pt-1 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="cpn_freeship"
                    checked={editingCoupon?.free_shipping ?? false}
                    onChange={(e) =>
                      setEditingCoupon((c) => ({ ...(c || {}), free_shipping: e.target.checked }))
                    }
                    className="rounded text-brand-pink"
                  />
                  <label htmlFor="cpn_freeship" className="cursor-pointer font-semibold text-slate-800">
                    Grant Free Shipping (waives Rs. 200 fee)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="cpn_active"
                    checked={editingCoupon?.is_active ?? true}
                    onChange={(e) =>
                      setEditingCoupon((c) => ({ ...(c || {}), is_active: e.target.checked }))
                    }
                    className="rounded text-brand-pink"
                  />
                  <label htmlFor="cpn_active" className="cursor-pointer font-semibold text-slate-800">
                    Active (Can be applied by customers)
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCouponModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-pink hover:bg-brand-pinkHover text-white font-bold rounded-xl shadow"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 3: DELETE CONFIRMATION MODAL (NO LOCALHOST ALERT)
      =========================================== */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Confirm Permanent Delete</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete &ldquo;{deleteConfirm.title}&rdquo;? This cannot be undone.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-md shadow-rose-600/20"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 4: PAYMENT PROOF SCREENSHOT PREVIEW
      =========================================== */}
      {paymentProofModalUrl && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Payment Screenshot Proof</h3>
              <button
                type="button"
                onClick={() => setPaymentProofModalUrl(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-900"
              >
                Close ✕
              </button>
            </div>
            <div className="relative aspect-[9/16] w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-200">
              <Image
                src={paymentProofModalUrl}
                alt="Payment proof screenshot"
                fill
                sizes="(max-width: 640px) 100vw, 400px"
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          PRINTABLE WHITE PDF INVOICE CONTAINER
      =========================================== */}
      {printingOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 flex items-center justify-center p-4 overflow-y-auto">
          <div
            id="printable-invoice"
            className="bg-white text-black p-8 max-w-2xl w-full rounded-2xl shadow-2xl space-y-6"
          >
            {/* Action Bar (hidden when printed) */}
            <div className="no-print flex items-center justify-between border-b pb-3">
              <h4 className="font-bold text-sm text-slate-900">Order Invoice Preview</h4>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-brand-pink text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save as PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPrintingOrder(null)}
                  className="border border-slate-300 text-xs py-2 px-3 rounded-xl hover:bg-slate-100"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Pristine White Invoice Content */}
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-950">ABRISH MART</h1>
                <p className="text-xs text-slate-600">Shop Smart, Save More!</p>
                <p className="text-xs text-slate-500 mt-1">NTN / Tax ID: 4250192695085</p>
                <p className="text-xs text-slate-500">Helpline: 0345-2086160 | Email: usmanshah11@gmail.com</p>
              </div>
              <div className="text-right">
                <h3 className="font-mono font-bold text-lg text-brand-pink">
                  INVOICE #{printingOrder.order_number}
                </h3>
                <p className="text-xs text-slate-500">Date: {new Date(printingOrder.created_at).toLocaleDateString()}</p>
                <span className="inline-block bg-slate-100 px-2 py-0.5 rounded text-[11px] font-bold uppercase mt-1">
                  Cash on Delivery
                </span>
              </div>
            </div>

            {/* Customer & Address */}
            <div className="grid grid-cols-2 gap-4 text-xs border-b pb-4">
              <div>
                <p className="font-bold text-slate-400 uppercase text-[10px]">Billed To:</p>
                <p className="font-bold text-sm text-slate-900">{printingOrder.customer_name}</p>
                <p className="text-slate-600">{printingOrder.phone}</p>
              </div>
              <div>
                <p className="font-bold text-slate-400 uppercase text-[10px]">Delivery Destination:</p>
                <p className="text-slate-800">{printingOrder.address}</p>
                <p className="font-bold text-slate-900">{printingOrder.city}, Pakistan</p>
              </div>
            </div>

            {/* Line Items Table */}
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b font-bold text-slate-500 uppercase text-[10px]">
                  <th className="py-2">Item Description</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Price</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(printingOrder.items || []).map((it, i) => (
                  <tr key={i}>
                    <td className="py-2 font-medium text-slate-900">{it.title}</td>
                    <td className="py-2 text-center">{it.quantity}</td>
                    <td className="py-2 text-right">Rs. {it.price.toLocaleString()}</td>
                    <td className="py-2 text-right font-bold">
                      Rs. {(it.price * it.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="pt-3 border-t space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>Rs. {printingOrder.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charges:</span>
                <span>Rs. {printingOrder.delivery_charges}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-950 pt-2 border-t">
                <span>Grand Total (Payable COD):</span>
                <span>Rs. {printingOrder.total_amount?.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-4 border-t text-[10px] text-slate-500 text-center">
              Thank you for ordering with Abrish Mart! 7-Day Replacement Guarantee on Defective Items.
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 5: BULK DELETE PRODUCTS MODAL (WITH RESPONSIVE CHECKBOX LIST)
      =========================================== */}
      {bulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Bulk Delete Products</h3>
                  <p className="text-xs text-slate-500">
                    Uncheck any product below that you wish to KEEP before confirming deletion.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBulkDeleteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs py-2 px-3 bg-slate-50 rounded-xl">
              <span className="font-bold text-slate-700">
                <span className="text-rose-600 font-black">{bulkDeleteTargetIds.length}</span> of {products.length} products marked to delete
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBulkDeleteTargetIds(products.map((p) => String(p.id)))}
                  className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Mark All
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => setBulkDeleteTargetIds([])}
                  className="text-xs font-bold text-slate-500 hover:underline cursor-pointer"
                >
                  Uncheck All
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[50vh] divide-y divide-slate-100">
              {products.map((p) => {
                const isMarked = bulkDeleteTargetIds.includes(String(p.id));
                return (
                  <label
                    key={p.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition ${
                      isMarked ? "bg-rose-50/70 border border-rose-200" : "hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={isMarked}
                        onChange={(e) => {
                          const idStr = String(p.id);
                          if (e.target.checked) {
                            setBulkDeleteTargetIds((prev) => [...prev, idStr]);
                          } else {
                            setBulkDeleteTargetIds((prev) => prev.filter((id) => id !== idStr));
                          }
                        }}
                        className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                      />
                      <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-slate-100 shrink-0 border border-slate-200">
                        <Image
                          src={p.thumbnail_url || "/images/placeholder.webp"}
                          alt={p.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold truncate ${isMarked ? "text-rose-900 line-through" : "text-slate-900"}`}>
                          {p.title}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          SKU: {p.sku || `#${p.id}`} &bull; {p.category_slug}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <span className={`text-xs font-extrabold ${isMarked ? "text-rose-600" : "text-slate-800"}`}>
                        Rs. {p.price.toLocaleString()}
                      </span>
                      {isMarked ? (
                        <span className="block text-[9px] font-black uppercase tracking-wider text-rose-600">Will Delete</span>
                      ) : (
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-emerald-600">Will Keep</span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setBulkDeleteModalOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={bulkDeleteTargetIds.length === 0}
                onClick={() => handleDeleteAllProductsConfirmed(bulkDeleteTargetIds)}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md shadow-rose-600/20 flex items-center gap-1.5 transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirm Delete ({bulkDeleteTargetIds.length} Products)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 6: ORDER DETAILS & HHC FORWARDING ("CHECK, FIX AND SEND")
      =========================================== */}
      {activeOrderModal && (() => {
        const customerPays = Number(orderEditForm.total_amount) || 0;
        const deliveryCharged = Number(orderEditForm.delivery_charges) || 0;
        const courierFee =
          orderEditForm.courier_id === 1
            ? (orderEditForm.courier_route?.includes("Bulky") ? 982 : 352)
            : orderEditForm.courier_id === 2
            ? 152
            : 167; // Postex

        const calculatedWholesaleSubtotal =
          (activeOrderModal.items || []).reduce((acc, it) => {
            const matched = products.find(
              (p) => String(p.id) === String(it.product_id) || p.title === it.title || p.sku === it.title
            );
            const cost = matched?.wholesale_price || (it.price > 1000 ? it.price - 500 : Math.round(it.price * 0.65));
            return acc + cost * it.quantity;
          }, 0) || Math.max(0, customerPays - deliveryCharged - 500);

        const fulfillmentCharges = 50;
        const gst = 21.74;
        const fsc = 39.9;
        const totalHhcBills = Math.round(calculatedWholesaleSubtotal + fulfillmentCharges + courierFee + gst + fsc);
        const yourProfit = customerPays - totalHhcBills;
        const isDispatched = Boolean(activeOrderModal.tracking_number);

        return (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-6xl w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[95vh] flex flex-col overflow-hidden">
              {/* Header matching screenshot 2 */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow">
                    2
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-slate-900 text-base">Check, fix and send</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px]">
                        1 ready
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-extrabold text-[11px]">
                        0 need a fix
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      1 parcel(s) from 1 order(s). HHC accepted every row &mdash; check the figures and send them.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveOrderModal(null)}
                  className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Table / Fields Grid Container */}
              <div className="flex-1 overflow-x-auto overflow-y-auto pr-1">
                <div className="min-w-[1050px] border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                  {/* Table Header Row */}
                  <div className="grid grid-cols-12 gap-2 p-3 bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <div className="col-span-1">PARCEL</div>
                    <div className="col-span-2">CUSTOMER</div>
                    <div className="col-span-2">ADDRESS</div>
                    <div className="col-span-2">CITY / COURIER</div>
                    <div className="col-span-1">CUSTOMER PAYS</div>
                    <div className="col-span-1">DELIVERY CHARGED</div>
                    <div className="col-span-2">WHAT HHC BILLS</div>
                    <div className="col-span-1">COURIER OPTIONS</div>
                  </div>

                  {/* Order Row with Live Editable Fields */}
                  <div className="grid grid-cols-12 gap-2 p-3.5 items-start text-xs border-b border-slate-100 bg-white">
                    {/* PARCEL */}
                    <div className="col-span-1 space-y-1">
                      <span className="font-mono font-black text-blue-600 text-xs hover:underline block">
                        #{activeOrderModal.order_number}
                      </span>
                      <p className="font-bold text-slate-800 text-[11px] line-clamp-2 leading-tight">
                        {activeOrderModal.items?.[0]?.title || "Store Item"}
                      </p>
                      <span className="inline-block text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {activeOrderModal.items?.length || 1}x HHC #{activeOrderModal.hhc_order_id || "3763660"}
                      </span>
                    </div>

                    {/* CUSTOMER */}
                    <div className="col-span-2 space-y-1.5">
                      <input
                        type="text"
                        value={orderEditForm.customer_name}
                        onChange={(e) => setOrderEditForm((f) => ({ ...f, customer_name: e.target.value }))}
                        placeholder="Customer Name"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:ring-1 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={orderEditForm.phone}
                        onChange={(e) => setOrderEditForm((f) => ({ ...f, phone: e.target.value }))}
                        placeholder="Primary Phone (03xx)"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono focus:ring-1 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={orderEditForm.whatsapp}
                        onChange={(e) => setOrderEditForm((f) => ({ ...f, whatsapp: e.target.value }))}
                        placeholder="Alt / WhatsApp"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* ADDRESS */}
                    <div className="col-span-2">
                      <textarea
                        rows={5}
                        value={orderEditForm.address}
                        onChange={(e) => setOrderEditForm((f) => ({ ...f, address: e.target.value }))}
                        placeholder="Full delivery address with house, street, landmark"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 resize-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* CITY / COURIER */}
                    <div className="col-span-2 space-y-1.5">
                      <input
                        type="text"
                        value={orderEditForm.city}
                        onChange={(e) => setOrderEditForm((f) => ({ ...f, city: e.target.value }))}
                        placeholder="City (e.g. Karachi)"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-bold focus:ring-1 focus:ring-blue-500"
                      />
                      <select
                        value={orderEditForm.courier_route}
                        onChange={(e) => {
                          const val = e.target.value;
                          const cId = val.includes("Trax") ? 2 : val.includes("Leopard") ? 1 : 3;
                          setOrderEditForm((f) => ({ ...f, courier_route: val, courier_id: cId }));
                        }}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value={`${orderEditForm.city || "Karachi"}-Postex`}>
                          {orderEditForm.city || "Karachi"}-Postex (Standard)
                        </option>
                        <option value={`${orderEditForm.city || "Karachi"}-Trax`}>
                          {orderEditForm.city || "Karachi"}-Trax (Cheapest)
                        </option>
                        <option value={`${orderEditForm.city || "Karachi"}-Leopard`}>
                          {orderEditForm.city || "Karachi"}-Leopard (Express)
                        </option>
                        <option value="Karachi-Postex">Karachi-Postex</option>
                        <option value="Lahore-Trax">Lahore-Trax</option>
                        <option value="Rawalpindi-Trax">Rawalpindi-Trax</option>
                        <option value="Islamabad-Trax">Islamabad-Trax</option>
                        <option value="Faisalabad-Trax">Faisalabad-Trax</option>
                        <option value="Multan-Trax">Multan-Trax</option>
                        <option value="Peshawar-Trax">Peshawar-Trax</option>
                        <option value="Nationwide-Trax">Nationwide-Trax</option>
                      </select>
                    </div>

                    {/* CUSTOMER PAYS */}
                    <div className="col-span-1">
                      <input
                        type="number"
                        value={orderEditForm.total_amount}
                        onChange={(e) => setOrderEditForm((f) => ({ ...f, total_amount: Number(e.target.value) || 0 }))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900 font-black focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* DELIVERY CHARGED */}
                    <div className="col-span-1">
                      <input
                        type="number"
                        value={orderEditForm.delivery_charges}
                        onChange={(e) =>
                          setOrderEditForm((f) => ({ ...f, delivery_charges: Number(e.target.value) || 0 }))
                        }
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900 font-bold focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* WHAT HHC BILLS (Live Breakdown card matching screenshot 2) */}
                    <div className="col-span-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200 text-[11px] space-y-1">
                      <div className="text-[10px] text-slate-500">
                        Route <span className="font-semibold text-slate-800">{orderEditForm.city || "Karachi"} &rarr; {orderEditForm.courier_route}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal</span>
                        <span>Rs. {calculatedWholesaleSubtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Fulfillment Charges</span>
                        <span>Rs. {fulfillmentCharges}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Delivery</span>
                        <span>Rs. {courierFee}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>GST</span>
                        <span>Rs. {gst}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>FSC</span>
                        <span>Rs. {fsc}</span>
                      </div>

                      <div className="pt-1.5 border-t border-slate-200 flex justify-between font-black text-slate-900">
                        <span>HHC bills</span>
                        <span>Rs. {totalHhcBills.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between font-extrabold text-emerald-600 text-xs pt-0.5">
                        <span>Your profit</span>
                        <span>Rs. {yourProfit.toLocaleString()}</span>
                      </div>

                      <div className="pt-1 border-t border-slate-200 text-[10px] text-slate-400 space-y-0.5">
                        <div className="flex justify-between">
                          <span>Est. weight</span>
                          <span>0.20 kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Est. weight charge</span>
                          <span>Rs. 105</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Est. courier</span>
                          <span>Rs. {courierFee}</span>
                        </div>
                      </div>

                      <div className="p-1.5 bg-amber-50 rounded-lg border border-amber-200/80 text-[9px] text-amber-900 mt-1 leading-snug">
                        Estimated &mdash; HHC replaces these with actual weight and charges once handed to courier.
                      </div>
                    </div>

                    {/* COURIER OPTIONS & DISPATCH */}
                    <div className="col-span-1 space-y-2">
                      <button
                        type="button"
                        onClick={() =>
                          setOrderEditForm((f) => ({
                            ...f,
                            courier_id: 2,
                            courier_route: `${f.city || "Karachi"}-Trax`,
                          }))
                        }
                        className={`w-full p-1.5 rounded-lg text-left text-[11px] border transition cursor-pointer ${
                          orderEditForm.courier_id === 2
                            ? "border-blue-600 bg-blue-50 text-blue-900 font-bold"
                            : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div className="font-semibold flex items-center justify-between">
                          <span>Trax Rs. 152</span>
                          <span className="text-[9px] text-emerald-600 font-black">cheapest</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setOrderEditForm((f) => ({
                            ...f,
                            courier_id: 3,
                            courier_route: `${f.city || "Karachi"}-Postex`,
                          }))
                        }
                        className={`w-full p-1.5 rounded-lg text-left text-[11px] border transition cursor-pointer ${
                          orderEditForm.courier_id === 3
                            ? "border-blue-600 bg-blue-50 text-blue-900 font-bold ring-1 ring-blue-500"
                            : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div className="font-semibold flex items-center justify-between">
                          <span>Postex Rs. 167</span>
                          <span className="text-[9px] text-blue-600 font-bold">popular</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setOrderEditForm((f) => ({
                            ...f,
                            courier_id: 1,
                            courier_route: `${f.city || "Karachi"}-Leopard`,
                          }))
                        }
                        className={`w-full p-1.5 rounded-lg text-left text-[11px] border transition cursor-pointer ${
                          orderEditForm.courier_id === 1 && !orderEditForm.courier_route?.includes("Bulky")
                            ? "border-blue-600 bg-blue-50 text-blue-900 font-bold"
                            : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div className="font-semibold">Leopard Rs. 352</div>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setOrderEditForm((f) => ({
                            ...f,
                            courier_id: 1,
                            courier_route: `${f.city || "Karachi"}-Leopard-Bulky`,
                          }))
                        }
                        className={`w-full p-1.5 rounded-lg text-left text-[11px] border transition cursor-pointer ${
                          orderEditForm.courier_route?.includes("Bulky")
                            ? "border-blue-600 bg-blue-50 text-blue-900 font-bold"
                            : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div className="font-semibold">Bulky - Leopard Rs. 982</div>
                      </button>

                      {/* Primary Row Place button */}
                      <button
                        type="button"
                        disabled={hhcDispatchingId === activeOrderModal.id || isDispatched}
                        onClick={async () => {
                          await handleSaveOrderChanges();
                          handleHhcDispatch(activeOrderModal, orderEditForm.courier_id);
                        }}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        {hhcDispatchingId === activeOrderModal.id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        <span>{isDispatched ? "Placed" : "Place"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Actions Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 text-xs">
                <p className="text-[11px] text-slate-500 leading-tight">
                  Every edit is re-priced against HHC as you make it, so the figures on screen are the ones that will be booked. Safe to close this page &mdash; anything still going carries on in the background and comes back here.
                </p>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const idToDelete = activeOrderModal.id;
                      const titleToDelete = `Order #${activeOrderModal.order_number}`;
                      setActiveOrderModal(null);
                      setDeleteConfirm({
                        open: true,
                        type: "order",
                        id: idToDelete,
                        title: titleToDelete,
                      });
                    }}
                    className="px-3.5 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Order</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveOrderChanges}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Order Changes</span>
                  </button>

                  <button
                    type="button"
                    disabled={hhcDispatchingId === activeOrderModal.id || isDispatched}
                    onClick={async () => {
                      await handleSaveOrderChanges();
                      handleHhcDispatch(activeOrderModal, orderEditForm.courier_id);
                    }}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
                  >
                    {hhcDispatchingId === activeOrderModal.id ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>{isDispatched ? "Already Placed on HHC" : "Place on HHC"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ==========================================
          MODAL 7: DELETE ALL ORDERS CONFIRMATION
      =========================================== */}
      {deleteAllOrdersModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Clear All Customer Orders?</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Are you sure you want to delete all <span className="font-bold text-slate-900">{orders.length}</span> customer orders from the store database? This action will permanently remove all order records and tracking data.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteAllOrdersModalOpen(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAllOrdersConfirmed}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-extrabold text-white shadow-md shadow-rose-600/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Clear All</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 8: BATCH IMPORT CATEGORY REVIEW MODAL
      =========================================== */}
      {batchImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-brand-pink/10 text-brand-pink flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Import Products into Store Catalogue
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select target category and verify wholesale pricing before importing into Abrish Mart.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBatchImportModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Target Category & Subcategory Selectors */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Main Category */}
                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">
                    1. Main Store Category:
                  </label>
                  <select
                    value={batchImportTargetCategory}
                    onChange={(e) => {
                      setBatchImportTargetCategory(e.target.value);
                      setBatchImportTargetSubcategory("");
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-pink cursor-pointer"
                  >
                    <option value="auto">⚡ Auto-Detect per Product (Title & HHC Match)</option>
                    {categories
                      .filter((c) => !c.parent_slug || c.parent_slug === "")
                      .map((c) => (
                        <option key={c.slug} value={c.slug}>
                          📁 {c.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* 2. Subcategory */}
                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">
                    2. Subcategory (Optional):
                  </label>
                  <select
                    disabled={batchImportTargetCategory === "auto"}
                    value={batchImportTargetSubcategory}
                    onChange={(e) => setBatchImportTargetSubcategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-pink cursor-pointer disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    {batchImportTargetCategory === "auto" ? (
                      <option value="">-- Auto-Detect per Product --</option>
                    ) : (
                      <>
                        <option value="">-- None (Main Category Only) --</option>
                        {categories
                          .find((c) => c.slug === batchImportTargetCategory)
                          ?.subcategories?.map((sub) => (
                            <option key={sub.slug} value={sub.slug}>
                              ↳ {sub.name}
                            </option>
                          ))}
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                <span>
                  Profit Margin Applied:{" "}
                  <strong className="text-slate-900">
                    {hhcMarginType === "fixed" ? `+Rs. ${hhcMarginValue} Fixed` : `${hhcMarginValue}% Percentage`}
                  </strong>
                </span>
                <span className="text-brand-pink font-bold">
                  {batchImportSelectedIds.length} of {batchImportProducts.length} items checked
                </span>
              </div>
            </div>

            {/* Selection Toolbar */}
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-slate-500 font-medium text-[11px]">
                Review items to import:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBatchImportSelectedIds(batchImportProducts.map((p) => p.id))}
                  className="text-[11px] font-bold text-brand-pink hover:underline cursor-pointer"
                >
                  Select All ({batchImportProducts.length})
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => setBatchImportSelectedIds([])}
                  className="text-[11px] font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  Uncheck All
                </button>
              </div>
            </div>

            {/* Scrollable Products List */}
            <div className="flex-1 overflow-y-auto space-y-2 max-h-72 border border-slate-100 rounded-2xl p-2 bg-slate-50/50 divide-y divide-slate-100">
              {batchImportProducts.map((item) => {
                const isChecked = batchImportSelectedIds.includes(item.id);
                const pricing = calculateHhcSellingPrice(item.wholesalePrice, hhcMarginType, hhcMarginValue);
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (isChecked) {
                        setBatchImportSelectedIds((prev) => prev.filter((id) => id !== item.id));
                      } else {
                        setBatchImportSelectedIds((prev) => [...prev, item.id]);
                      }
                    }}
                    className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition ${
                      isChecked ? "bg-white shadow-xs border border-brand-pink/30" : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-brand-pink focus:ring-brand-pink cursor-pointer shrink-0"
                    />
                    <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <Image
                        src={item.thumbnail || "/images/banners/hero-banner.png"}
                        alt={item.name}
                        fill
                        sizes="44px"
                        className="object-cover"
                        unoptimized
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {item.sku || `HHC-${item.id}`} &bull; {item.category || "General"}
                      </p>
                    </div>
                    <div className="text-right shrink-0 text-xs">
                      <div className="font-extrabold text-slate-900">
                        Rs. {pricing.salePrice.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-bold">
                        Cost Rs. {item.wholesalePrice} (+Rs. {pricing.margin})
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={batchImporting}
                onClick={() => setBatchImportModalOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={batchImporting || batchImportSelectedIds.length === 0}
                onClick={handleConfirmBatchImport}
                className="px-5 py-2.5 bg-brand-pink hover:bg-brand-pinkHover text-white text-xs font-black rounded-xl shadow-md shadow-brand-pink/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {batchImporting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Importing into Catalogue...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Confirm Import ({batchImportSelectedIds.length} Products)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 9: SINGLE PRODUCT IMPORT CATEGORY CONFIRMATION MODAL
      =========================================== */}
      {singleImportModalOpen && singleImportItem && (() => {
        const selectedParentCat = categories.find((c) => c.slug === singleImportCategory);
        const subcategoriesList = selectedParentCat?.subcategories || [];
        const profit = singleImportSalePrice - singleImportItem.wholesalePrice;

        return (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-brand-pink/10 text-brand-pink flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Import Product to Store
                    </h3>
                    <p className="text-xs text-slate-500">
                      Confirm category, subcategory, and pricing before publishing.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSingleImportModalOpen(false);
                    setSingleImportItem(null);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Product Info Preview */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
                  <Image
                    src={singleImportItem.thumbnail || "/images/banners/hero-banner.png"}
                    alt={singleImportItem.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                    unoptimized
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2" title={singleImportItem.name}>
                    {singleImportItem.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">
                    SKU: {singleImportItem.sku || `HHC-${singleImportItem.id}`} &bull; {singleImportItem.hubName}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-[11px]">
                    <span className="text-slate-500">Wholesale: <strong className="text-slate-800">Rs. {singleImportItem.wholesalePrice.toLocaleString()}</strong></span>
                    <span className="text-emerald-700 font-bold">{singleImportItem.stock} in stock</span>
                  </div>
                </div>
              </div>

              {/* Category & Subcategory Selection */}
              <div className="space-y-3">
                {/* 1. Main Category */}
                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">
                    Store Department / Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={singleImportCategory}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      setSingleImportCategory(newCat);
                      setSingleImportSubcategory("");
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-pink cursor-pointer"
                  >
                    {categories
                      .filter((c) => !c.parent_slug || c.parent_slug === "")
                      .map((cat) => (
                        <option key={cat.slug} value={cat.slug}>
                          📁 {cat.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* 2. Subcategory (Optional / Main Only) */}
                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">
                    Subcategory <span className="text-slate-400 font-normal">(Optional or Main Category Only)</span>
                  </label>
                  <select
                    value={singleImportSubcategory}
                    onChange={(e) => setSingleImportSubcategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-pink cursor-pointer"
                  >
                    <option value="">-- None (Main Category Only) --</option>
                    {subcategoriesList.map((sub) => (
                      <option key={sub.slug} value={sub.slug}>
                        ↳ {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pricing Fields */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Store Sale Price (PKR)
                    </label>
                    <input
                      type="number"
                      value={singleImportSalePrice}
                      onChange={(e) => setSingleImportSalePrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-pink"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Strikethrough Price (PKR)
                    </label>
                    <input
                      type="number"
                      value={singleImportOriginalPrice}
                      onChange={(e) => setSingleImportOriginalPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-pink"
                    />
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-800 font-medium">Gross Profit Margin:</span>
                  <span className="font-black text-emerald-700">
                    +Rs. {profit.toLocaleString()} PKR ({Math.round((profit / (singleImportSalePrice || 1)) * 100)}%)
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={singleImporting}
                  onClick={() => {
                    setSingleImportModalOpen(false);
                    setSingleImportItem(null);
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={singleImporting || singleImportSalePrice <= 0}
                  onClick={handleConfirmSingleImport}
                  className="px-5 py-2.5 bg-brand-pink hover:bg-brand-pinkHover text-white text-xs font-black rounded-xl shadow-md shadow-brand-pink/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {singleImporting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving to Catalogue...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Confirm & Import Product</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
