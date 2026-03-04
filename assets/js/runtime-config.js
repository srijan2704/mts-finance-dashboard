/*
 * Runtime environment configuration for frontend.
 *
 * Set env to:
 * - "dev"  -> local backend
 * - "uat"  -> UAT backend (same EC2 via Nginx reverse proxy)
 * - "prod" -> production backend
 */
window.__MTS_ENV__ = "uat";

window.__MTS_API_BASES__ = {
  dev: "http://localhost:8080",
  // FE and BE are hosted on the same EC2 host, so keep base empty and call /api/*.
  uat: "",
  prod: "https://mts-purchase-service-1.onrender.com",
};
