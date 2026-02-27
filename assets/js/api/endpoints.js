/**
 * Resolves API base URL.
 * Priority order:
 *   0) URL query param: ?apiBase=https://example.com
 *   1) window.__MTS_API_BASE__ (runtime override)
 *   2) localStorage key "mtsApiBase"
 *   3) Default: Render production backend
 */
const queryOverride = (() => {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("apiBase");
  return value && value.trim() ? value.trim() : null;
})();

const runtimeOverride = typeof window !== "undefined" ? window.__MTS_API_BASE__ : null;
const storageOverride = typeof window !== "undefined" ? window.localStorage?.getItem("mtsApiBase") : null;

const defaultApiBase = (() => {
  // Local backend reference (commented intentionally):
  // return "http://localhost:8080";
  return "https://mts-purchase-service-1.onrender.com";
})();

export const API_BASE = queryOverride || runtimeOverride || storageOverride || defaultApiBase;

export const endpoints = {
  auth: {
    setup: "/api/auth/setup",
    login: "/api/auth/login",
    me: "/api/auth/me",
    logout: "/api/auth/logout",
  },
  sellers: "/api/sellers",
  sellersAll: "/api/sellers/all",
  units: "/api/units",
  productTypes: "/api/product-types",
  products: "/api/products",
  productVariantsByProduct: (productId) => `/api/products/${productId}/variants`,
  addVariantToProduct: (productId) => `/api/products/${productId}/variants`,
  variantById: (variantId) => `/api/variants/${variantId}`,
  purchaseOrders: "/api/purchase-orders",
  purchaseOrderById: (id) => `/api/purchase-orders/${id}`,
  confirmPurchaseOrder: (id) => `/api/purchase-orders/${id}/confirm`,
  reportsDailyTrend: "/api/reports/trends/daily-purchase",
  reportsTopProducts: "/api/reports/trends/top-products",
  reportsTopSellers: "/api/reports/trends/top-sellers",
};
