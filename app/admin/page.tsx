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
  adminUpdateOrderStatus,
  adminSaveSettings,
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
} from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { compressAndUploadImage } from "@/lib/image-compress";
import { hhcCheckConnection, hhcGetSuppliers, hhcGetProductsBySupplier, hhcDispatchOrder } from "@/lib/hhc";

export default function AdminPage() {
  // Authentication Gate
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState("");

  // Navigation Hubs: 'products' | 'categories' | 'orders' | 'banners' | 'settings' | 'hhc'
  const [activeTab, setActiveTab] = useState<
    "products" | "categories" | "orders" | "banners" | "settings" | "hhc"
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

  // HHC Dropshipping Hub State
  const [hhcConnected, setHhcConnected] = useState<boolean | null>(null);
  const [hhcSuppliers, setHhcSuppliers] = useState<any[]>([]);
  const [selectedHhcSupplier, setSelectedHhcSupplier] = useState<any>(null);
  const [hhcSupplierProducts, setHhcSupplierProducts] = useState<any[]>([]);
  const [hhcImportLoading, setHhcImportLoading] = useState(false);

  // File Upload States
  const [uploadingImage, setUploadingImage] = useState(false);

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

  // HHC check
  useEffect(() => {
    if (isAuthenticated && activeTab === "hhc") {
      hhcCheckConnection().then((res) => {
        setHhcConnected(res.success);
      });
      hhcGetSuppliers(1).then((res) => {
        if (res.data) setHhcSuppliers(res.data);
      });
    }
  }, [isAuthenticated, activeTab]);

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

  // Save product handler
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.title || !editingProduct?.price) {
      showToast("❌ Product title and price are required.");
      return;
    }

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
      stock: Number(editingProduct.stock || 10),
      category_slug: editingProduct.category_slug || categories[0]?.slug || "general",
      thumbnail_url: editingProduct.thumbnail_url || "/images/banners/hero-banner.png",
      gallery_urls: editingProduct.gallery_urls || [editingProduct.thumbnail_url || "/images/banners/hero-banner.png"],
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

          <button
            type="button"
            onClick={() => setActiveTab("hhc")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === "hhc"
                ? "bg-brand-pink text-white shadow-md shadow-brand-pink/20"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Truck className="w-4 h-4 text-emerald-400" />
            <span>HHC Dropship Hub</span>
          </button>

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
                      price: 0,
                      stock: 15,
                      category_slug: categories[0]?.slug || "bridal-silk-nightwear",
                      is_active: true,
                      is_featured: false,
                      is_flash_deal: false,
                    });
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
                      <th className="p-3.5">Item</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Price</th>
                      <th className="p-3.5">Stock</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {products.map((prod) => (
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
                          <div>
                            <p className="font-bold text-slate-900 line-clamp-1">{prod.title}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{prod.sku || prod.slug}</p>
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-600 capitalize">
                          {prod.category_slug.replace(/-/g, " ")}
                        </td>
                        <td className="p-3.5 font-bold text-brand-pink">
                          Rs. {prod.price.toLocaleString()}
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
                          {prod.is_active ? (
                            <span className="text-emerald-600 font-bold text-[11px]">Active</span>
                          ) : (
                            <span className="text-slate-400 font-bold text-[11px]">Draft</span>
                          )}
                        </td>
                        <td className="p-3.5 text-right space-x-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(prod);
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
                    ))}
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
                  Organize store departments, toggle homepage marquee appearance, and add sub-categories.
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
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <Image
                        src={cat.image_url || "/images/banners/hero-banner.png"}
                        alt={cat.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{cat.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">/{cat.slug}</p>
                      {cat.show_on_homepage && (
                        <span className="text-[9px] bg-brand-softPink text-brand-pink font-bold px-1.5 py-0.2 rounded mt-0.5 inline-block">
                          Top Marquee Active
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCategory(cat);
                        setCategoryModalOpen(true);
                      }}
                      className="p-1.5 text-slate-600 hover:text-brand-pink rounded-lg hover:bg-slate-100"
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
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
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
                          <td className="p-3.5 text-right space-x-1">
                            <button
                              type="button"
                              onClick={() => setPrintingOrder(ord)}
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
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
            TAB 5: HHC DROPSHIPPING INTEGRATION HUB
        =========================================== */}
        {activeTab === "hhc" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-emerald-600" />
                    <span>HHC Dropshipping Pakistan Engine</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live Dropshipping connection with HHC production gateway and couriers (Trax & Leopard).
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      hhcConnected
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {hhcConnected ? "● HHC API Connected" : "Checking HHC Status..."}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile & Courier Diagnostics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Connected Merchant Profile</span>
                <p className="text-sm font-black text-slate-900 mt-1">#76494 — Iknuz Trader</p>
                <p className="text-xs text-slate-500 mt-0.5">Usman Shah (0345-2086160)</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Couriers Integration</span>
                <p className="text-sm font-black text-emerald-700 mt-1">Trax (ID 2) & Leopard (ID 1)</p>
                <p className="text-xs text-slate-500 mt-0.5">2,784 destination cities matrix</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Profit Margin Setup</span>
                <p className="text-sm font-black text-brand-pink mt-1">+30% Default Markup</p>
                <p className="text-xs text-slate-500 mt-0.5">Applied automatically upon import</p>
              </div>
            </div>

            {/* Supplier Browser & 1-Click Import */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Live Supplier Catalog Browser (1-Click Import into Abrish Mart)
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {hhcSuppliers.slice(0, 8).map((supp) => (
                  <button
                    key={supp.storeID || supp.id}
                    type="button"
                    onClick={async () => {
                      setSelectedHhcSupplier(supp);
                      setHhcImportLoading(true);
                      const res = await hhcGetProductsBySupplier(supp.storeID || supp.id, 1);
                      if (res.data) setHhcSupplierProducts(res.data);
                      setHhcImportLoading(false);
                    }}
                    className={`p-3 rounded-xl border text-left text-xs transition ${
                      selectedHhcSupplier?.storeID === supp.storeID
                        ? "border-brand-pink bg-brand-softPink"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <p className="font-bold text-slate-900 truncate">{supp.store_name || supp.name}</p>
                    <p className="text-[10px] text-slate-400">{supp.total_products || 0} Products</p>
                  </button>
                ))}
              </div>

              {/* Products list from selected supplier */}
              {selectedHhcSupplier && (
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800">
                      Products from {selectedHhcSupplier.store_name || selectedHhcSupplier.name}
                    </h4>
                    {hhcImportLoading && <span className="text-xs text-brand-pink">Loading live products...</span>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {hhcSupplierProducts.slice(0, 6).map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                          <p className="text-[11px] text-slate-500">
                            Wholesale: Rs. {item.wholesalePrice} ➔ Sale: Rs. {Math.round(item.wholesalePrice * 1.3)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            const newProduct: Partial<Product> = {
                              title: item.name,
                              slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                              description: item.description || "Quality item imported via HHC Dropshipping.",
                              price: Math.round(item.wholesalePrice * 1.3),
                              original_price: Math.round(item.wholesalePrice * 1.6),
                              stock: item.quantity || 20,
                              thumbnail_url: item.product_thumbnail || "/images/banners/hero-banner.png",
                              gallery_urls: item.product_galleries || [item.product_thumbnail],
                              category_slug: categories[0]?.slug || "general",
                              is_active: true,
                              sku: `HHC-${item.id}`,
                            };
                            await adminSaveProduct(newProduct);
                            showToast(`✅ Imported "${item.name}" into Abrish Mart!`);
                            loadData(false);
                          }}
                          className="px-2.5 py-1.5 bg-brand-pink text-white rounded-lg text-[10px] font-bold shrink-0 hover:bg-brand-pinkHover shadow"
                        >
                          + Import
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="text-base font-black text-slate-900">
              {editingProduct?.id ? "Edit Product" : "Add New Product"}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={editingProduct?.title || ""}
                  onChange={(e) => setEditingProduct((p) => ({ ...(p || {}), title: e.target.value }))}
                  placeholder="e.g. Premium Bridal Silk Nighty Gown Set"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sale Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct?.price || ""}
                    onChange={(e) => setEditingProduct((p) => ({ ...(p || {}), price: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Original Price (PKR)</label>
                  <input
                    type="number"
                    value={editingProduct?.original_price || ""}
                    onChange={(e) =>
                      setEditingProduct((p) => ({ ...(p || {}), original_price: Number(e.target.value) }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingProduct?.category_slug || categories[0]?.slug}
                    onChange={(e) =>
                      setEditingProduct((p) => ({ ...(p || {}), category_slug: e.target.value }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={editingProduct?.stock ?? 15}
                    onChange={(e) => setEditingProduct((p) => ({ ...(p || {}), stock: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              {/* Direct Image Upload with auto-WebP compression */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Upload Product Image (Direct WebP Compressed Upload)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, false)}
                  className="w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-pink file:text-white"
                />
                {uploadingImage && <p className="text-[11px] text-brand-pink mt-1">Compressing to WebP & uploading...</p>}
                {editingProduct?.thumbnail_url && (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 mt-2">
                    <Image
                      src={editingProduct.thumbnail_url}
                      alt="Thumbnail preview"
                      fill
                      sizes="64px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={editingProduct?.description || ""}
                  onChange={(e) => setEditingProduct((p) => ({ ...(p || {}), description: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 resize-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct?.is_active ?? true}
                    onChange={(e) => setEditingProduct((p) => ({ ...(p || {}), is_active: e.target.checked }))}
                    className="rounded text-brand-pink"
                  />
                  <span>Active on Store</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct?.is_flash_deal ?? false}
                    onChange={(e) => setEditingProduct((p) => ({ ...(p || {}), is_flash_deal: e.target.checked }))}
                    className="rounded text-brand-pink"
                  />
                  <span>Flash Deal</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-pink hover:bg-brand-pinkHover text-white font-bold rounded-xl shadow"
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
