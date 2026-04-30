import { getAuth } from "./state/store.js";
import { renderNavbar, renderSidebar, updateSidebarFyPanel, bindNavbarHandlers } from "./components/navbar.js";
import { renderLoginPage, bindLoginPage } from "./pages/login.js";
import { mountLandingPage } from "./pages/landing.js";
import { mountMaintenancePage } from "./pages/maintenance.js";
import { mountReportsPage, unmountReportsPage } from "./pages/reports.js";
import { apiFetch } from "./api/client.js";
import { endpoints } from "./api/endpoints.js";

let currentView = null;

function appShell(content, hash) {
  return `
    <div class="app-shell">
      <div class="dashboard-shell">
        ${renderSidebar(hash)}
        <main class="main-panel">
          ${renderNavbar(hash)}
          <div id="route-root">${content}</div>
        </main>
      </div>
    </div>
  `;
}

/**
 * Fetches the current FY summary and updates the sidebar panel.
 * Always called after appShell() renders a fresh sidebar. Non-blocking —
 * a failure shows an error state in the panel but never affects page load.
 */
async function loadAndDisplayFySummary() {
  try {
    const response = await apiFetch(endpoints.purchaseOrdersFySummary);
    updateSidebarFyPanel(response.data || null);
  } catch {
    updateSidebarFyPanel(null);
  }
}

async function route() {
  const app = document.getElementById("app");
  const hash = window.location.hash || "#/login";
  const auth = getAuth();

  if (currentView === "reports") {
    unmountReportsPage();
  }

  if (!auth && hash !== "#/login") {
    window.location.hash = "#/login";
    return;
  }

  if (auth && hash === "#/login") {
    window.location.hash = "#/landing";
    return;
  }

  if (hash === "#/login") {
    currentView = "login";
    app.innerHTML = renderLoginPage();
    bindLoginPage();
    return;
  }

  app.innerHTML = appShell('<div class="card muted">Loading...</div>', hash);
  bindNavbarHandlers();
  // Non-blocking: sidebar is freshly rendered on every route change,
  // so the FY panel must be populated here for all authenticated routes.
  loadAndDisplayFySummary();

  if (hash === "#/landing") {
    currentView = "landing";
    await mountLandingPage();
    return;
  }

  if (hash === "#/maintenance") {
    currentView = "maintenance";
    await mountMaintenancePage();
    return;
  }

  if (hash === "#/reports") {
    currentView = "reports";
    await mountReportsPage();
    return;
  }

  currentView = "landing";
  window.location.hash = "#/landing";
}

function startRouter() {
  window.addEventListener("hashchange", route);
  route();
}

export { startRouter };
