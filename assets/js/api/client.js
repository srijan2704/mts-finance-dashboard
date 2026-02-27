import { API_BASE } from "./endpoints.js";
import { getAuth, saveAuth } from "../state/store.js";

async function apiFetch(path, options = {}) {
  const auth = getAuth();
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
