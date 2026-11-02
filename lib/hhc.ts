// ==========================================
// HHC DROPSHIPPING API INTEGRATION LAYER
// ==========================================

const HHC_BASE_URL = "https://api.hhcdropshipping.com/api/dropshipper/open";
const DEFAULT_APP_KEY = "y4whA0TGxXRBlcHiEm9pd0WEGQKJp06R";
const DEFAULT_BP_ID = 76494; // Iknuz Trader (Usman Shah)

function getHeaders(customKey?: string) {
  const key = customKey || (typeof window !== "undefined" ? localStorage.getItem("hhc_app_key") : null) || DEFAULT_APP_KEY;
  return {
    "app-key": key,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

export async function hhcCheckConnection(customKey?: string) {
  try {
    const res = await fetch(`${HHC_BASE_URL}/businessProfiles`, {
      method: "GET",
      headers: getHeaders(customKey),
    });
    const data = await res.json();
    return { success: res.ok, data };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Connection failed";
    return { success: false, error: msg };
  }
}

export async function hhcGetCouriers() {
  try {
    const res = await fetch(`${HHC_BASE_URL}/couriers`, {
      method: "GET",
      headers: getHeaders(),
    });
    const data = await res.json();
    return data;
  } catch {
    return [
      { id: 1, name: "Leopard Courier" },
      { id: 2, name: "Trax Logistics" },
      { id: 3, name: "Postex" },
    ];
  }
}

export async function hhcGetSuppliers(page: number = 1, search: string = "") {
  try {
    const url = `${HHC_BASE_URL}/store_wise_products?page=${page}&search=${encodeURIComponent(search)}`;
    const res = await fetch(url, { method: "GET", headers: getHeaders() });
    return await res.json();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch suppliers";
    return { error: msg };
  }
}

export async function hhcGetCategories(page: number = 1, search: string = "") {
  try {
    const url = `${HHC_BASE_URL}/category_wise_products?page=${page}&search=${encodeURIComponent(search)}`;
    const res = await fetch(url, { method: "GET", headers: getHeaders() });
    return await res.json();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch categories";
    return { error: msg };
  }
}

export async function hhcGetProductsBySupplier(storeId: number | string, page: number = 1) {
  try {
    const url = `${HHC_BASE_URL}/products?storeID=${storeId}&page=${page}`;
    const res = await fetch(url, { method: "GET", headers: getHeaders() });
    return await res.json();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch products";
    return { error: msg };
  }
}

export async function hhcGetProductsByCategory(catId: number | string, page: number = 1) {
  try {
    const url = `${HHC_BASE_URL}/products?catID=${catId}&page=${page}`;
    const res = await fetch(url, { method: "GET", headers: getHeaders() });
    return await res.json();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch products";
    return { error: msg };
  }
}

export interface HHCOrderDispatchPayload {
  products: Array<{ productID: number; quantity: number }>;
  fullName: string;
  phone: string;
  address: string;
  destinationCity: string; // e.g. "2-223" for Trax Lahore
  paymentMethod: "cod";
  shpType: number;
  channel: string;
  allowToOpen: number;
  not_clear_cart: boolean;
  bpID: number;
  courierID: number; // 1: Leopard, 2: Trax, 3: Postex
  orderRefID: number;
  [key: string]: unknown;
}

export async function hhcDispatchOrder(payload: Partial<HHCOrderDispatchPayload>) {
  try {
    const completePayload: HHCOrderDispatchPayload = {
      products: payload.products || [],
      fullName: payload.fullName || "",
      phone: payload.phone || "",
      address: payload.address || "",
      destinationCity: payload.destinationCity || "2-202",
      paymentMethod: "cod",
      shpType: 1,
      channel: "DS-NEXTJS",
      allowToOpen: 1,
      not_clear_cart: true,
      bpID: DEFAULT_BP_ID,
      courierID: payload.courierID || 2,
      orderRefID: payload.orderRefID || Date.now(),
      ...payload,
    };

    const res = await fetch(`${HHC_BASE_URL}/orders`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(completePayload),
    });

    const data = await res.json();
    return { success: res.ok, data };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Order dispatch failed";
    return { success: false, error: msg };
  }
}

export async function hhcGetRcpOrders(page: number = 1) {
  try {
    const url = `${HHC_BASE_URL}/rcp_orders?page=${page}`;
    const res = await fetch(url, { method: "GET", headers: getHeaders() });
    return await res.json();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch RCP orders";
    return { error: msg };
  }
}
