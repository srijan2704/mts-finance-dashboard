# mts-finance-dashboard

Vanilla JavaScript UI for `mts-purchase-service`.

## Stack
- HTML
- CSS
- JavaScript (ES modules)
- Chart.js via CDN

## Features included
- Login page (username/password login)
- Landing page
  - Create purchase order
  - Product -> variant filtering
  - Unit auto-fill from selected variant
  - Current month history with draft/confirmed highlights
  - Confirm/delete actions for draft orders
- Maintenance page
  - Sellers
  - Units
  - Product types
  - Products + variants
- Reporting page
  - Daily purchase trend
  - Top products by units + variant drill-down
  - Top sellers by purchase value

## Run locally

### Option 1: Python static server
```bash
cd mts-finance-dashboard
python3 -m http.server 5500
```
Open: `http://localhost:5500`

### Option 2: Node static server
```bash
cd mts-finance-dashboard
npx serve .
```

## Backend environment switching
Frontend backend host is resolved using `assets/js/runtime-config.js`.

```js
window.__MTS_ENV__ = "uat"; // dev -> localhost, uat -> Render UAT, prod -> Render Prod
```

Mapped URLs:
- `dev` -> `http://localhost:8080`
- `uat` -> `https://mts-purchase-service-uat.onrender.com`
- `prod` -> `https://mts-purchase-service-1.onrender.com`

## Deploy on Render (Static Site)
Use **Static Site** (not Web Service).

Render settings:
- Service Type: `Static Site`
- Root Directory: repo root (`mts-finance-dashboard`)
- Build Command: *(leave empty)*
- Publish Directory: `.`

Before deploy:
1. Set `window.__MTS_ENV__ = "uat"` for UAT (or `"prod"` for production) in `assets/js/runtime-config.js`.
2. Commit and push.

After deploy:
1. Open the Render URL.
2. Hard refresh once to avoid cached JS/CSS (`Cmd+Shift+R`).

## Auth notes
- UI uses `/api/auth/login` token response.
- Session token is sent as `Authorization: Bearer <token>` for API calls.
- In backend `dev` profile, auth header is optional at interceptor level, but UI still follows login-first flow.
