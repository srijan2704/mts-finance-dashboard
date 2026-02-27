import { apiFetch } from "../api/client.js";
import { endpoints } from "../api/endpoints.js";
import { saveAuth } from "../state/store.js";
import { showToast } from "../components/toast.js";

function renderLoginPage() {
  return `
    <div class="login-wrap">
      <div class="login-card">
        <h1 class="login-title">MTS Finance Dashboard</h1>
        <p class="login-subtitle">Secure sign in for business operations</p>

        <form id="login-form" class="page-grid">
          <div>
            <label class="label" for="username">Username</label>
            <input class="input" id="username" name="username" required maxlength="100" autocomplete="username" />
          </div>
          <div>
            <label class="label" for="password">Password</label>
            <input class="input" id="password" name="password" type="password" required minlength="6" maxlength="100" autocomplete="current-password" />
          </div>
          <button class="btn btn-primary" type="submit">Login</button>
        </form>

        <hr style="border:none;border-top:1px solid var(--line);margin:14px 0" />

        <details>
          <summary>First-time setup (one-time)</summary>
          <form id="setup-form" class="page-grid" style="margin-top:10px">
            <div>
              <label class="label" for="setup-username">Setup Username</label>
              <input class="input" id="setup-username" name="setupUsername" required maxlength="100" />
            </div>
            <div>
              <label class="label" for="setup-password">Setup Password</label>
              <input class="input" id="setup-password" name="setupPassword" type="password" required minlength="6" maxlength="100" />
            </div>
            <button class="btn btn-secondary" type="submit">Create Initial Credential</button>
          </form>
        </details>
      </div>
    </div>
  `;
}

function bindLoginPage() {
  const loginForm = document.getElementById("login-form");
  const setupForm = document.getElementById("setup-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(loginForm);
      const payload = {
        username: String(formData.get("username") || "").trim(),
        password: String(formData.get("password") || ""),
      };

      try {
        const response = await apiFetch(endpoints.auth.login, {
          method: "POST",
          body: JSON.stringify(payload),
        });

        const session = response.data;
        saveAuth({
          username: session.username,
          token: session.token,
          expiresAt: session.expiresAt,
        });

        showToast("Login successful");
        window.location.hash = "#/landing";
      } catch (err) {
        showToast(err.message || "Login failed", "error");
      }
    });
  }

  if (setupForm) {
    setupForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(setupForm);
      const payload = {
        username: String(formData.get("setupUsername") || "").trim(),
        password: String(formData.get("setupPassword") || ""),
      };
      try {
        await apiFetch(endpoints.auth.setup, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        showToast("Initial credential setup completed");
      } catch (err) {
        showToast(err.message || "Setup failed", "error");
      }
    });
  }
}

export { renderLoginPage, bindLoginPage };
