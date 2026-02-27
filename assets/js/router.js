import { getAuth } from "./state/store.js";
import { renderNavbar, bindNavbarHandlers } from "./components/navbar.js";
import { renderLoginPage, bindLoginPage } from "./pages/login.js";
import { mountLandingPage } from "./pages/landing.js";
import { mountMaintenancePage } from "./pages/maintenance.js";
import { mountReportsPage, unmountReportsPage } from "./pages/reports.js";

let currentView = null;

function appShell(content, hash) {
  return `
    <div class="app-shell">
      ${renderNavbar(hash)}
      <div id="route-root">${content}</div>
    </div>
  `;
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
