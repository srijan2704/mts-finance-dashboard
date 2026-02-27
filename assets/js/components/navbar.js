import { getAuth, saveAuth } from "../state/store.js";

function renderNavbar(activeHash) {
  const auth = getAuth();
  const username = auth?.username || "User";
  return `
    <nav class="nav">
      <div>
        <div class="nav-title">MTS Finance Dashboard</div>
        <div class="muted">Purchase, masters, and reporting in one place</div>
      </div>
      <div class="nav-links">
        <span class="user-chip" title="${username}">
          <svg class="user-chip-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z"></path>
          </svg>
          <span class="user-chip-name">${username}</span>
        </span>
        <a class="nav-link ${activeHash === "#/landing" ? "active" : ""}" href="#/landing">Landing</a>
        <a class="nav-link ${activeHash === "#/maintenance" ? "active" : ""}" href="#/maintenance">Maintenance</a>
        <a class="nav-link ${activeHash === "#/reports" ? "active" : ""}" href="#/reports">Reporting</a>
        <button class="icon-btn" id="logout-btn" type="button" title="Logout" aria-label="Logout" data-tooltip="Logout">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10 3a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0V5H5v14h4v-2a1 1 0 1 1 2 0v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm6.59 4.59a1 1 0 0 1 1.41 0l3.7 3.7a1 1 0 0 1 0 1.42l-3.7 3.7a1 1 0 1 1-1.41-1.42L18.58 13H9a1 1 0 1 1 0-2h9.58l-1.99-1.99a1 1 0 0 1 0-1.42Z"></path>
          </svg>
        </button>
      </div>
    </nav>
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

export { renderNavbar, bindNavbarHandlers };
