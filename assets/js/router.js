import { getAuth } from "./state/store.js";
import { renderNavbar, renderSidebar, updateSidebarFyPanel, bindNavbarHandlers } from "./components/navbar.js";
import { renderLoginPage, bindLoginPage } from "./pages/login.js";
import { apiFetch } from "./api/client.js";
import { endpoints } from "./api/endpoints.js";

let currentView = null;

function appShell(content, hash) {
  return `
    <div class="app-shell" style="--dp-orb-a:#60a5fa; --dp-orb-b:#34d399;">
      <!-- Ambient background orbs for dashboard -->
      <div class="dp-bg" aria-hidden="true" style="position:fixed; z-index:-1; pointer-events:none;">
        <div class="dp-orb dp-orb-1"></div>
        <div class="dp-orb dp-orb-2"></div>
      </div>
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

/**
 * Routes accessible without authentication (public portfolio pages).
 * Protected routes (#/landing, #/maintenance, #/reports) still require login.
 */
const PUBLIC_ROUTES = new Set([
  "#/group-home",
  "#/maa-tara-store",
  "#/maa-tara-sales",
  "#/maa-tara-warehouse",
  "#/maa-tara-tower",
]);

async function route() {
  const app = document.getElementById("app");
  const hash = window.location.hash || "#/group-home";
  const auth = getAuth();

  if (currentView === "reports") {
    const { unmountReportsPage } = await import("./pages/reports.js");
    unmountReportsPage();
  }

  // Redirect unauthenticated users away from protected routes only.
  if (!auth && hash !== "#/login" && !PUBLIC_ROUTES.has(hash)) {
    window.location.hash = "#/login";
    return;
  }

  // Authenticated users arriving at login go straight to group home.
  if (auth && hash === "#/login") {
    window.location.hash = "#/group-home";
    return;
  }

  if (hash === "#/login") {
    currentView = "login";
    app.innerHTML = renderLoginPage();
    bindLoginPage();
    return;
  }

  // Public routes render directly — no sidebar or topbar shell.
  if (PUBLIC_ROUTES.has(hash)) {
    app.innerHTML = '<div id="route-root"></div>';

    if (hash === "#/group-home") {
      currentView = "group-home";
      const { mountGroupHomePage } = await import("./pages/group-home.js");
      mountGroupHomePage();
      return;
    }
    if (hash === "#/maa-tara-store") {
      currentView = "maa-tara-store";
      const { mountMaaTaraStorePage } = await import("./pages/maa-tara-store.js");
      mountMaaTaraStorePage();
      return;
    }
    if (hash === "#/maa-tara-sales") {
      currentView = "maa-tara-sales";
      const { mountMaaTaraSalesPage } = await import("./pages/maa-tara-sales.js");
      mountMaaTaraSalesPage();
      return;
    }
    if (hash === "#/maa-tara-warehouse") {
      currentView = "maa-tara-warehouse";
      const { mountMaaTaraWarehousePage } = await import("./pages/maa-tara-warehouse.js");
      mountMaaTaraWarehousePage();
      return;
    }
    if (hash === "#/maa-tara-tower") {
      currentView = "maa-tara-tower";
      const { mountMaaTaraTowerPage } = await import("./pages/maa-tara-tower.js");
      mountMaaTaraTowerPage();
      return;
    }
  }

  // Protected routes — render inside the full dashboard shell.
  app.innerHTML = appShell('<div class="card muted">Loading...</div>', hash);
  bindNavbarHandlers();
  if (auth) loadAndDisplayFySummary();

  if (hash === "#/landing") {
    currentView = "landing";
    const { mountLandingPage } = await import("./pages/landing.js");
    await mountLandingPage();
    return;
  }

  if (hash === "#/maintenance") {
    currentView = "maintenance";
    const { mountMaintenancePage } = await import("./pages/maintenance.js");
    await mountMaintenancePage();
    return;
  }

  if (hash === "#/reports") {
    currentView = "reports";
    const { mountReportsPage } = await import("./pages/reports.js");
    await mountReportsPage();
    return;
  }

  currentView = "group-home";
  window.location.hash = "#/group-home";
}

function startRouter() {
  window.addEventListener("hashchange", route);
  route();
}

export { startRouter };
