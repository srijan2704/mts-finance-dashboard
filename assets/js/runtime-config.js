/*
 * Runtime environment configuration for frontend.
 *
 * Set env to:
 * - "dev"  -> local backend
 * - "uat"  -> UAT backend
 * - "prod" -> production backend
 *
 * You can override base URLs if needed.
 */
window.__MTS_ENV__ = "uat";

window.__MTS_API_BASES__ = {
  dev: "http://localhost:8080",
  uat: "https://mts-purchase-service-uat.onrender.com",
  prod: "https://mts-purchase-service-1.onrender.com",
};
