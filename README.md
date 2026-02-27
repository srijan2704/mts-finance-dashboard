# mts-finance-dashboard

Vanilla JavaScript UI for `mts-purchase-service`.

## Stack
- HTML
- CSS
- JavaScript (ES modules)
- Chart.js via CDN

## Features included
- Login page (supports initial credential setup + login)
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

## Backend requirement
Spring Boot backend should be running on:
- `http://localhost:8080`

If backend runs on different host/port, update:
- `assets/js/api/endpoints.js` (`API_BASE`)

## Auth notes
- UI uses `/api/auth/login` token response.
- Session token is sent as `Authorization: Bearer <token>` for API calls.
- In backend `dev` profile, auth header is optional at interceptor level, but UI still follows login-first flow.
