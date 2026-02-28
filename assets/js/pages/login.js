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
          <label class="label" for="login-show-password">
            <input id="login-show-password" type="checkbox" /> Show password
          </label>
          <button class="btn btn-primary" type="submit">Login</button>
        </form>

        <details class="login-register-wrap" id="register-wrap">
          <summary>Create New User (OTP approval)</summary>

          <form id="register-request-form" class="page-grid login-register-grid">
            <div>
              <label class="label" for="register-username">New Username</label>
              <input class="input" id="register-username" name="username" required maxlength="100" autocomplete="off" />
            </div>
            <div>
              <label class="label" for="register-password">New Password</label>
              <input class="input" id="register-password" name="password" type="password" required minlength="6" maxlength="100" autocomplete="new-password" />
            </div>
            <button class="btn btn-secondary" type="submit">Send OTP To Admin Email</button>
          </form>

          <form id="register-verify-form" class="page-grid login-register-grid hidden" autocomplete="off">
            <input type="hidden" id="verify-username" name="username" />
            <div>
              <label class="label" for="verify-otp">Enter OTP</label>
              <input class="input" id="verify-otp" name="otp" required minlength="6" maxlength="6" inputmode="numeric" pattern="[0-9]{6}" placeholder="6-digit OTP" />
            </div>
            <button class="btn btn-primary" type="submit">Verify OTP & Create User</button>
          </form>

          <p class="login-register-help" id="register-help-text">
            OTP will be sent to configured admin email for approval.
          </p>
        </details>
      </section>
    </div>
  `;
}

function bindLoginPage() {
  const loginForm = document.getElementById("login-form");
  const loginPasswordInput = document.getElementById("password");
  const loginShowPasswordCheckbox = document.getElementById("login-show-password");
  const registerRequestForm = document.getElementById("register-request-form");
  const registerVerifyForm = document.getElementById("register-verify-form");
  const verifyUsernameInput = document.getElementById("verify-username");
  const registerHelpText = document.getElementById("register-help-text");

  if (loginForm) {
    if (loginPasswordInput && loginShowPasswordCheckbox) {
      loginShowPasswordCheckbox.checked = false;
      loginPasswordInput.type = "password";
      loginShowPasswordCheckbox.addEventListener("change", () => {
        loginPasswordInput.type = loginShowPasswordCheckbox.checked ? "text" : "password";
      });
    }
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

  if (registerRequestForm && registerVerifyForm && verifyUsernameInput && registerHelpText) {
    registerRequestForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(registerRequestForm);
      const payload = {
        username: String(formData.get("username") || "").trim(),
        password: String(formData.get("password") || ""),
      };

      try {
        const response = await apiFetch(endpoints.auth.registerRequestOtp, {
          method: "POST",
          body: JSON.stringify(payload),
        });

        verifyUsernameInput.value = payload.username;
        registerVerifyForm.classList.remove("hidden");

        const delivery = response?.data?.deliveryEmailMasked;
        const expiry = response?.data?.expiresAt;
        registerHelpText.textContent = delivery
          ? `OTP sent to ${delivery}. ${expiry ? "Please verify before expiry." : ""}`
          : "OTP sent to admin email. Please verify to complete registration.";

        showToast("OTP sent successfully");
      } catch (err) {
        showToast(err.message || "Failed to send OTP", "error");
      }
    });

    registerVerifyForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(registerVerifyForm);
      const payload = {
        username: String(formData.get("username") || "").trim(),
        otp: String(formData.get("otp") || "").trim(),
      };

      try {
        await apiFetch(endpoints.auth.registerVerifyOtp, {
          method: "POST",
          body: JSON.stringify(payload),
        });

        registerVerifyForm.classList.add("hidden");
        registerRequestForm.reset();
        registerVerifyForm.reset();
        registerHelpText.textContent = "User created successfully. Login with new credentials.";
        showToast("User registration completed");
      } catch (err) {
        showToast(err.message || "OTP verification failed", "error");
      }
    });
  }
}

export { renderLoginPage, bindLoginPage };
