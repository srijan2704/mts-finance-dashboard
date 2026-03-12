/**
 * API base URL resolution policy:
 * - Runtime config (`runtime-config.js`) controls environment and API base.
 * - URL query/localStorage overrides are intentionally disabled to prevent credential/token exfiltration.
 */
const hasWindow = typeof window !== "undefined";
const host = hasWindow ? (window.location.hostname || "localhost") : "localhost";
const isLocalHost = host === "localhost" || host === "127.0.0.1";

const normalizedEnv = (value) => {
  const env = String(value || "").trim().toLowerCase();
  return env === "dev" || env === "uat" || env === "prod" ? env : null;
};

const runtimeEnv = normalizedEnv(hasWindow ? window.__MTS_ENV__ : null);
export const API_ENV = runtimeEnv || (isLocalHost ? "dev" : null);

const defaultEnvBases = {
  dev: "http://localhost:8080",
  uat: "",
  prod: "https://mts-purchase-service-1.onrender.com",
};

const configuredEnvBases = (() => {
  if (!hasWindow || typeof window.__MTS_API_BASES__ !== "object" || window.__MTS_API_BASES__ === null) {
    return defaultEnvBases;
  }

  const hasOwn = (key) => Object.prototype.hasOwnProperty.call(window.__MTS_API_BASES__, key);
  return {
    // Preserve explicit empty-string values so deployed apps can enforce same-origin /api calls.
    dev: hasOwn("dev") ? window.__MTS_API_BASES__.dev : defaultEnvBases.dev,
    uat: hasOwn("uat") ? window.__MTS_API_BASES__.uat : defaultEnvBases.uat,
    prod: hasOwn("prod") ? window.__MTS_API_BASES__.prod : defaultEnvBases.prod,
  };
})();

const normalizeApiBase = (value) => {
  if (value === null || value === undefined) return null;

  const trimmed = String(value).trim();
  if (!trimmed) return "";

  // Support same-origin base-path deployments.
  if (trimmed.startsWith("/")) {
    return trimmed.replace(/\/+$/, "");
  }

  try {
    const url = new URL(trimmed);
    const protocol = url.protocol.toLowerCase();

    if (protocol === "https:") {
      return url.origin;
    }

    // HTTP is allowed only for localhost development.
    if (
      protocol === "http:" &&
      isLocalHost &&
      (url.hostname === "localhost" || url.hostname === "127.0.0.1")
    ) {
      return url.origin;
    }

    return null;
  } catch (_) {
    return null;
  }
};

const runtimeOverride = hasWindow ? window.__MTS_API_BASE__ : null;
const manualOverride = normalizeApiBase(runtimeOverride);

const envMappedBase = normalizeApiBase(API_ENV ? configuredEnvBases[API_ENV] : null);

const inferredApiBase = () => {
  if (!hasWindow) return defaultEnvBases.dev;

  if (isLocalHost) {
    return defaultEnvBases.dev;
  }

  if (host.endsWith("onrender.com")) {
    if (host.includes("-uat")) {
      return defaultEnvBases.uat;
    }
    return defaultEnvBases.prod;
  }

  // Deployed frontend/backend on same host should use relative /api routes.
  return "";
};

const inferredBase = normalizeApiBase(inferredApiBase());
const resolvedBase = [manualOverride, envMappedBase, inferredBase].find(
  (value) => value !== null && value !== undefined
);

export const API_BASE = resolvedBase ?? "";

export const endpoints = {
  auth: {
    setup: "/api/auth/setup",
    registerRequestOtp: "/api/auth/register/request-otp",
    registerVerifyOtp: "/api/auth/register/verify-otp",
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
