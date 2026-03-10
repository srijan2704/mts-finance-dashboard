# MTS Finance Dashboard

Vanilla JavaScript frontend for `mts-purchase-service`.

## 1. Public URL

- UAT (EC2): `https://ec2-16-16-77-180.eu-north-1.compute.amazonaws.com/`

## 2. Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES modules)
- Chart.js (CDN)

## 3. Functional Scope

- Authentication
  - login
  - logout
  - session validation (`/api/auth/me`)
- Landing page
  - create purchase order
  - view/update/confirm/delete draft orders
  - product -> variant filtering
- Maintenance page
  - sellers
  - units
  - product types
  - products + variants
- Reports page
  - daily purchase trend
  - top products (with variant drill-down)
  - top sellers

## 4. Project Structure

```text
assets/
  css/
    base.css
    components.css
    pages.css
  js/
    app.js
    router.js
    utils.js
    runtime-config.js
    api/
      client.js
      endpoints.js
    components/
      navbar.js
      toast.js
    pages/
      login.js
      landing.js
      maintenance.js
      reports.js
index.html
```

## 5. Local Development

Serve as static files (recommended port: `5500`).

Option 1: Python

```bash
cd mts-finance-dashboard
python3 -m http.server 5500
```

Option 2: Node

```bash
cd mts-finance-dashboard
npx serve .
```

Open:
- `http://localhost:5500`

## 6. API Base and Environment Config

Runtime config is in:
- `assets/js/runtime-config.js`

Current environment mapping:
- `dev` -> `http://localhost:8080`
- `uat` -> `""` (same-origin; calls `/api/*` through Nginx reverse proxy)
- `prod` -> `https://mts-purchase-service-1.onrender.com`

Security behavior:
- Query/localStorage API-base overrides are disabled.
- HTTPS API calls are enforced outside localhost.
- For EC2 deployment where FE and BE are behind same Nginx host, keep `uat` base empty (`""`).

## 7. Backend Dependency

This UI expects `mts-purchase-service` APIs to be available at `/api/*` (or configured base URL).

Core auth endpoints used:
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `POST /api/auth/register/request-otp`
- `POST /api/auth/register/verify-otp`

## 8. Deployment to EC2

This repository includes frontend-only deploy automation:

- Workflow: `.github/workflows/deploy-ec2-frontend.yml`
- Script: `scripts/ec2-deploy-frontend.sh`
- Deployment doc: `docs/github-actions-ec2-deploy.md`

Deployment flow:
1. Upload source from GitHub Actions runner to EC2.
2. Sync to `/opt/mts-finance-dashboard`.
3. Publish to `/var/www/mts-finance-dashboard`.
4. Validate Nginx (`nginx -t`, optional).
5. Restart Nginx.
6. Health-check `http://127.0.0.1/`.

## 9. Nginx Expectations

- Static root should point to:
  - `/var/www/mts-finance-dashboard`
- `/api/` must proxy to backend service (typically `http://127.0.0.1:8080`).
- HTTP should redirect to HTTPS in UAT/PROD.

## 10. Security Notes

- Do not commit secrets, private keys, or server credentials.
- Keep FE and API traffic on HTTPS in UAT/PROD.
- If self-signed TLS is used in UAT, browsers may show trust warnings.
- Keep backend CORS allowlist restricted to trusted frontend origins only.
