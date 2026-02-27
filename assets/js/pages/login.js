import { apiFetch } from "../api/client.js";
import { endpoints } from "../api/endpoints.js";
import { saveAuth } from "../state/store.js";
import { showToast } from "../components/toast.js";

function renderLoginPage() {
  return `
    <div class="login-wrap">
      <section class="login-card login-card-compact">
        <h1 class="login-title">MTS Finance Dashboard</h1>
        <p class="login-subtitle">Secure sign in for business operations</p>
        <p class="login-brand-line">Sah and Sons Group · With blessings of Maa Tara</p>

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
      </section>
    </div>
  `;
}

function bindLoginPage() {
  const loginForm = document.getElementById("login-form");

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
}

export { renderLoginPage, bindLoginPage };
