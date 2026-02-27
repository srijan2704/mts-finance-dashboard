/**
 * API base URL resolution priority:
 *   0) URL query param: ?apiBase=https://example.com
 *   1) window.__MTS_API_BASE__
 *   2) localStorage key "mtsApiBase"
 *   3) Environment mapping from env value (dev/prod)
 *   4) Hostname inference fallback
 *
 * Environment resolution priority:
 *   0) URL query param: ?env=dev|prod
 *   1) window.__MTS_ENV__
 *   2) localStorage key "mtsEnv"
 */
const queryParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;

const queryOverride = (() => {
  if (!queryParams) return null;
  const value = queryParams.get("apiBase");
  return value && value.trim() ? value.trim() : null;
})();

const runtimeOverride = typeof window !== "undefined" ? window.__MTS_API_BASE__ : null;
const storageOverride = typeof window !== "undefined" ? window.localStorage?.getItem("mtsApiBase") : null;

const normalizedEnv = (value) => {
  const env = String(value || "").trim().toLowerCase();
  return env === "dev" || env === "prod" ? env : null;
};

const queryEnv = normalizedEnv(queryParams?.get("env"));
const runtimeEnv = normalizedEnv(typeof window !== "undefined" ? window.__MTS_ENV__ : null);
const storageEnv = normalizedEnv(typeof window !== "undefined" ? window.localStorage?.getItem("mtsEnv") : null);

export const API_ENV = queryEnv || runtimeEnv || storageEnv || null;

const defaultEnvBases = {
  dev: "http://localhost:8080",
  prod: "https://mts-purchase-service-1.onrender.com",
};

const configuredEnvBases = (() => {
  if (typeof window === "undefined" || typeof window.__MTS_API_BASES__ !== "object" || window.__MTS_API_BASES__ === null) {
    return defaultEnvBases;
  }

  return {
    dev: window.__MTS_API_BASES__.dev || defaultEnvBases.dev,
    prod: window.__MTS_API_BASES__.prod || defaultEnvBases.prod,
  };
})();

const envMappedBase = API_ENV ? configuredEnvBases[API_ENV] : null;

const inferredApiBase = (() => {
  if (typeof window === "undefined") return defaultEnvBases.dev;

  const host = window.location.hostname || "localhost";

  if (host === "localhost" || host === "127.0.0.1") {
    return defaultEnvBases.dev;
  }

  if (host.endsWith("onrender.com")) {
    return defaultEnvBases.prod;
  }

  // Mobile/WiFi local testing fallback.
  return `http://${host}:8080`;
})();

export const API_BASE = queryOverride || runtimeOverride || storageOverride || envMappedBase || inferredApiBase;

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
