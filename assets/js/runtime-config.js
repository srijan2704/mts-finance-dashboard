/*
 * Runtime environment configuration for frontend.
 *
 * Set env to:
 * - "dev"  -> localhost backend
 * - "prod" -> Render backend
 *
 * You can override base URLs if needed.
 */
window.__MTS_ENV__ = "prod";

window.__MTS_API_BASES__ = {
  dev: "http://localhost:8080",
  prod: "https://mts-purchase-service-1.onrender.com",
};
