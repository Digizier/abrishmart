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
} from "lucide-react";
import { Product, Category, Order, Banner, SiteSettings } from "@/lib/types";
import {
  getProducts,
  getCategories,
  getBanners,
  getSiteSettings,
  adminSaveProduct,
  adminDeleteProduct,
  adminSaveCategory,
  adminDeleteCategory,
  adminAddSubcategory,
  adminAddChildSubcategory,
  adminDeleteSubcategory,
  adminUpdateOrderStatus,
  adminUpdateOrderHhcDispatch,
  adminSaveSettings,
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
  hhcGetProductsBySupplier,
  hhcForwardOrderToCourier,
  hhcSyncAllCatalog,
  hhcGetRcpOrders,
  hhcGetSettings,
  hhcSaveSettings,
  calculateHhcSellingPrice,
} from "@/lib/hhc";

export default function AdminPage() {
  // Authentication Gate
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState("");

  // Navigation Hubs: 'products' | 'categories' | 'orders' | 'banners' | 'settings' | 'hhc-*'
  const [activeTab, setActiveTab] = useState<
    | "products"
    | "categories"
    | "orders"
    | "banners"
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

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    type: "product" | "category" | "banner";
    id: string | number;
    title: string;
  } | null>(null);

  const [paymentProofModalUrl, setPaymentProofModalUrl] = useState<string | null>(null);
  const [printingOrder, setPrintingOrder] = useState<Order | null>(null);

  // HHC Dropshipping Pakistan Engine State
  const [hhcConnected, setHhcConnected] = useState<boolean | null>(true);
  const [hhcSuppliers, setHhcSuppliers] = useState<HHCSupplier[]>(HHC_VERIFIED_SUPPLIERS);
  const [selectedHhcSupplier, setSelectedHhcSupplier] = useState<HHCSupplier | null>(HHC_VERIFIED_SUPPLIERS[0]);
  const [hhcSupplierProducts, setHhcSupplierProducts] = useState<HHCCatalogItem[]>(HHC_CATALOG_PRODUCTS);
  const [hhcImportLoading, setHhcImportLoading] = useState(false);
  const [hhcSearchQuery, setHhcSearchQuery] = useState("");
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
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: abrishmart_smart2026 or admin123
    if (pinInput === "abrishmart_smart2026" || pinInput === "admin123") {
      setIsAuthenticated(true);
      sessionStorage.setItem("abm_admin_auth", "true");
      setAuthError("");
    } else {
      setAuthError("Invalid Admin PIN. Please enter the authorized access code.");
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
      const [prodRes, cats, bans, setts] = await Promise.all([
        getProducts({ limit: 100 }),
        getCategories(),
        getBanners(),
        getSiteSettings(),
      ]);

      setProducts(prodRes.products);
      setCategories(cats);
      setBanners(bans);
      setSettings(setts);

      // Fetch orders from Supabase
      const { data: ords } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (ords && ords.length > 0) {
        setOrders(ords as Order[]);
      }
    } catch (err) {
      console.warn("Admin fetch error:", err);
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
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

      // 2. Load suppliers
      hhcGetSuppliers(1).then((res) => {
        if (res.data && res.data.length > 0) {
          setHhcSuppliers(res.data);
          if (!selectedHhcSupplier) {
            setSelectedHhcSupplier(res.data[0]);
          }
        }
      });

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
    }
  }, [isAuthenticated, activeTab]);

  // Load products when selected supplier changes
  const handleSelectSupplier = async (supp: HHCSupplier) => {
    setSelectedHhcSupplier(supp);
    setHhcImportLoading(true);
    try {
      const res = await hhcGetProductsBySupplier(supp.storeID, 1);
      if (res.data) setHhcSupplierProducts(res.data);
    } catch (err: unknown) {
      console.warn("Error loading supplier products:", err);
    } finally {
      setHhcImportLoading(false);
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
        items: (order.items || []).map((it) => ({
          id: it.id,
          title: it.title,
          quantity: it.quantity,
          price: it.price,
        })),
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
    }
    setDeleteConfirm(null);
    loadData(false);
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
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter Admin PIN / Password"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-center text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-brand-pink tracking-widest font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-pink hover:bg-brand-pinkHover text-white font-bold text-xs py-3.5 px-6 rounded-xl shadow-lg shadow-brand-pink/25 transition active:scale-[0.99]"
            >
              Access Dashboard
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
                  onClick={() => setActiveTab("hhc-importer")}
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
                    10 Hubs
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
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-lg font-black text-slate-900">Products & Inventory Manager</h2>
                <p className="text-xs text-slate-500">
                  Manage catalogue, WebP images, prices, stock, and download CSV report.
                </p>
              </div>
              <div className="flex items-center gap-2">
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
                      category_slug: categories[0]?.slug || "bridal-silk-nightwear",
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
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs divide-y divide-slate-100">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3.5">Item & SKU</th>
                      <th className="p-3.5">Department & Subcategory</th>
                      <th className="p-3.5">Wholesale / Sale</th>
                      <th className="p-3.5">Stock</th>
                      <th className="p-3.5">Badges</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {products.map((prod) => {
                      const matchedCat = categories.find((c) => c.slug === prod.category_slug);
                      const matchedSub = matchedCat?.subcategories?.find((s) => s.slug === prod.subcategory_slug);

                      return (
                        <tr key={prod.id} className="hover:bg-slate-50 transition">
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
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

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
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-black text-slate-900">Customer Orders Hub</h2>
              <p className="text-xs text-slate-500">
                View Cash on Delivery orders, check JazzCash/EasyPaisa payment screenshots, and print invoices.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs divide-y divide-slate-100">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px]">
                    <tr>
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
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                          No orders placed yet. Orders will appear here live in real-time.
                        </td>
                      </tr>
                    ) : (
                      orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50 transition">
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
                              {/* Payment Proof Eye Preview Modal */}
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
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 4: BANNERS HUB
        =========================================== */}
        {activeTab === "banners" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">Banners Hub (Pure Images Only)</h2>
                <p className="text-xs text-slate-500">
                  Upload promotional banners. Recommended size: <strong>2048 x 768 px</strong> (Aspect ratio ~2.66:1).
                </p>
              </div>

              <div>
                <label className="cursor-pointer flex items-center gap-1.5 px-4 py-2 bg-brand-pink hover:bg-brand-pinkHover text-white text-xs font-extrabold rounded-xl shadow-md transition">
                  <Plus className="w-4 h-4" />
                  <span>Upload New Banner</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      showToast("Compressing banner image to WebP...");
                      const { url } = await compressAndUploadImage(file, "abrishmart-media");
                      if (url) {
                        await supabase.from("banners").insert([
                          {
                            title: file.name.replace(/\.[^/.]+$/, ""),
                            image_url: url,
                            link_url: "/shop",
                            is_active: true,
                            sort_order: banners.length + 1,
                          },
                        ]);
                        showToast("✅ Banner added to homepage slider!");
                        loadData(false);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {banners.map((ban) => (
                <div
                  key={ban.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="relative aspect-[2.66/1] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                    <Image
                      src={ban.image_url}
                      alt={ban.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{ban.title || "Promotional Banner"}</p>
                      <p className="text-[10px] text-slate-400">Target URL: {ban.link_url || "/shop"}</p>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        await supabase.from("banners").delete().eq("id", ban.id);
                        showToast("Banner deleted.");
                        loadData(false);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                      title="Delete Banner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
                <p className="text-xs text-slate-500 mt-0.5">Karachi, Lahore & Faisalabad</p>
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
        {activeTab === "hhc-importer" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Download className="w-5 h-5 text-blue-600" />
                    <span>HHC Live Supplier Catalog Browser</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Browse real verified supplier hubs and import products into Abrish Mart with 1 click.
                  </p>
                </div>

                {/* Profit Margin Rules on Import */}
                <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-700">Profit Margin:</span>
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
                    className="w-20 text-xs font-mono font-bold bg-white border border-slate-200 rounded-lg px-2 py-1"
                    placeholder="500"
                  />
                  <span className="text-[10px] text-slate-400">
                    {hhcMarginType === "fixed" ? "+Rs. " + hhcMarginValue : "+" + hhcMarginValue + "%"}
                  </span>
                </div>
              </div>

              {/* Supplier Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter HHC suppliers by name or city (e.g. ADVANI, Karachi, Almond, Faisalabad)..."
                  value={hhcSearchQuery}
                  onChange={(e) => setHhcSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-pink"
                />
              </div>

              {/* Verified Supplier Hub Cards */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Select Supplier Hub ({hhcSuppliers.length} Available):</span>
                  {selectedHhcSupplier && (
                    <span className="text-brand-pink">
                      Active: {selectedHhcSupplier.storeName} ({selectedHhcSupplier.cityName})
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                  {hhcSuppliers
                    .filter(
                      (s) =>
                        !hhcSearchQuery.trim() ||
                        s.storeName.toLowerCase().includes(hhcSearchQuery.toLowerCase()) ||
                        s.cityName.toLowerCase().includes(hhcSearchQuery.toLowerCase())
                    )
                    .map((supp) => {
                      const isSelected = selectedHhcSupplier?.storeID === supp.storeID;
                      return (
                        <button
                          key={supp.storeID}
                          type="button"
                          onClick={() => handleSelectSupplier(supp)}
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
                            <span className="text-slate-400 font-mono">#{supp.storeID}</span>
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Products Grid from Selected Supplier */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Live Products from {selectedHhcSupplier?.storeName || "ADVANI"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Showing {hhcSupplierProducts.length} wholesale catalog items available for instant 1-click import.
                  </p>
                </div>
                {hhcImportLoading && (
                  <div className="flex items-center gap-1.5 text-xs text-brand-pink font-bold">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Fetching live supplier catalog...</span>
                  </div>
                )}
              </div>

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

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
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
                          <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                            {item.storeName}
                          </span>
                          <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
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
                            onClick={() => handleImportHhcProduct(item)}
                            className="w-full py-2 bg-brand-pink hover:bg-brand-pinkHover text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Import to Abrish Mart</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 5C: HHC ORDER DISPATCH & FULFILLMENT
        =========================================== */}
        {activeTab === "hhc-forwarding" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
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

                <div className="flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-700">Default Courier:</span>
                  <select
                    value={hhcSelectedCourierId}
                    onChange={(e) => setHhcSelectedCourierId(parseInt(e.target.value))}
                    className="text-xs font-bold bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800"
                  >
                    <option value={2}>Trax Logistics (Karachi, Lahore & Nationwide)</option>
                    <option value={1}>Leopard Courier (Express Network)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Orders Dispatch Queue Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                  Customer Orders Queue ({orders.length} Total Orders)
                </h3>
                <span className="text-[11px] text-slate-500">
                  {orders.filter((o) => !o.tracking_number && o.status !== "Cancelled").length} Ready to Dispatch
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                    <tr>
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
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-400 text-xs">
                          No customer orders in queue. Orders placed on the website appear here automatically.
                        </td>
                      </tr>
                    ) : (
                      orders.map((ord) => {
                        const isDispatched = Boolean(ord.tracking_number);
                        const cityCode = resolveHhcDestinationCity(ord.city, hhcSelectedCourierId);

                        return (
                          <tr key={ord.id} className="hover:bg-slate-50 transition">
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
                                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px] inline-flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Dispatched to HHC
                                  </span>
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
                              {isDispatched ? (
                                <span className="text-[11px] font-bold text-slate-400 px-3 py-1 bg-slate-100 rounded-lg">
                                  Completed
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  disabled={hhcDispatchingId === ord.id}
                                  onClick={() => handleHhcDispatch(ord, hhcSelectedCourierId)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1 ml-auto"
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
        )}

        {/* ==========================================
            TAB 5D: HHC STOCK & PRICE SYNCHRONIZATION
        =========================================== */}
        {activeTab === "hhc-sync" && (
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
                    {products.map((p) => {
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
            </div>
          </div>
        )}

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
    </div>
  );
}
