import { getAuth, saveAuth } from "../state/store.js";

function pageTitle(activeHash) {
  if (activeHash === "#/maintenance") return "Maintenance";
  if (activeHash === "#/reports") return "Reporting Dashboard";
  return "Purchase Dashboard";
}

function navLink(hash, activeHash, label) {
  return `
    <a class="sidebar-link ${activeHash === hash ? "active" : ""}" href="${hash}">
      <span class="sidebar-link-dot" aria-hidden="true"></span>
      <span>${label}</span>
    </a>
  `;
}

function renderSidebar(activeHash) {
  return `
    <aside class="sidebar">
      <div class="sidebar-brand-wrap">
        <img class="sidebar-logo-mark" src="assets/brand/mts-brand-mark.svg?v=2" alt="Sah and Sons Group mark" />
        <div class="sidebar-brand-title">Sah and Sons Group</div>
        <div class="sidebar-brand-divider" aria-hidden="true"></div>
        <div class="sidebar-brand-sub">With blessings of Maa Tara</div>
      </div>
      <div class="sidebar-group">
        <div class="sidebar-group-title">Menu</div>
        ${navLink("#/landing", activeHash, "Landing")}
        ${navLink("#/maintenance", activeHash, "Maintenance")}
        ${navLink("#/reports", activeHash, "Reporting")}
      </div>
    </aside>
  `;
}

function renderNavbar(activeHash) {
  const auth = getAuth();
  const username = auth?.username || "User";

  return `
    <header class="nav topbar">
      <div class="topbar-copy">
        <div class="nav-title">${pageTitle(activeHash)}</div>
        <div class="muted">MTS purchase operations and analytics</div>
      </div>
      <div class="topbar-actions">
        <span class="user-chip" title="${username}">
          <svg class="user-chip-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z"></path>
          </svg>
          <span class="user-chip-name">${username}</span>
        </span>
        <button class="icon-btn" id="logout-btn" type="button" title="Logout" aria-label="Logout" data-tooltip="Logout">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10 3a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0V5H5v14h4v-2a1 1 0 1 1 2 0v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm6.59 4.59a1 1 0 0 1 1.41 0l3.7 3.7a1 1 0 0 1 0 1.42l-3.7 3.7a1 1 0 1 1-1.41-1.42L18.58 13H9a1 1 0 1 1 0-2h9.58l-1.99-1.99a1 1 0 0 1 0-1.42Z"></path>
          </svg>
        </button>
      </div>
    </header>
  `;
}

function bindNavbarHandlers() {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      saveAuth(null);
      window.location.hash = "#/login";
    });
  }
}

export { renderNavbar, renderSidebar, bindNavbarHandlers };
