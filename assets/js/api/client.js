import { API_BASE } from "./endpoints.js";
import { getAuth, saveAuth } from "../state/store.js";

const hasWindow = typeof window !== "undefined";

function isInsecureApiTransport(path, hasAuthToken) {
  if (!hasWindow) {
    return false;
  }

  const requiresSecureTransport = path?.startsWith("/api/auth/") || hasAuthToken;
  if (!requiresSecureTransport) {
    return false;
  }

  const host = window.location.hostname || "localhost";
  const isLocalHost = host === "localhost" || host === "127.0.0.1";
  if (isLocalHost) {
    return false;
  }

  const pageHttps = window.location.protocol === "https:";
  if (!pageHttps) {
    return true;
  }

  // Empty/relative API base means same-origin and therefore same HTTPS transport.
  if (!API_BASE || API_BASE.startsWith("/")) {
    return false;
  }

  return !API_BASE.startsWith("https://");
}

async function apiFetch(path, options = {}) {
  const auth = getAuth();
  if (isInsecureApiTransport(path, Boolean(auth?.token))) {
    throw new Error("Blocked insecure API request. Open dashboard over HTTPS.");
  }

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (auth?.token) {
    headers.Authorization = `Bearer ${auth.token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch (err) {
    payload = null;
  }

  if (response.status === 401) {
    saveAuth(null);
  }

  if (!response.ok) {
    const message = payload?.message || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

function withQuery(path, params) {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });
  const queryString = query.toString();
  return queryString ? `${path}?${queryString}` : path;
}

export { apiFetch, withQuery };
