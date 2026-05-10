/**
 * maa-tara-sales.js
 * Maa Tara Sales — business detail page (dark redesign).
 * Route: #/maa-tara-sales
 */

const PRODUCT_IMAGES = [
  { src: "assets/brand/maa-tara-sales/images-1.jpeg", alt: "Saloni Kachchi Ghani Mustard Oil — 1L Pouch", label: "1 Litre Pouch" },
  { src: "assets/brand/maa-tara-sales/images-2.jpeg", alt: "Saloni Pure Mustard Oil — 500ml Bottle", label: "500ml Bottle" },
  { src: "assets/brand/maa-tara-sales/images-3.jpeg", alt: "Saloni Agmark Mustard Oil — 15 Litre Tin", label: "15 Litre Tin" },
  { src: "assets/brand/maa-tara-sales/images-4.jpg", alt: "Saloni Kachchi Ghani Pure Mustard Oil — 2 Litre Jar", label: "2 Litre Jar" },
];

function renderProductCard(img) {
  return `
    <div class="dp-product-card">
      <div class="dp-product-img-wrap">
        <img src="${img.src}" alt="${img.alt}" class="dp-product-img" loading="eager" decoding="async"/>
      </div>
      <div class="dp-product-label">${img.label}</div>
    </div>
  `;
}

function renderMaaTaraSalesPage() {
  return `
    <div class="dp-root" style="--dp-accent-rgb:19,138,80; --dp-orb-a:#138a50; --dp-orb-b:#0d3d24;">

      <!-- Ambient background orbs -->
      <div class="dp-bg" aria-hidden="true">
        <div class="dp-orb dp-orb-1"></div>
        <div class="dp-orb dp-orb-2"></div>
      </div>

      <!-- Top nav bar -->
      <nav class="dp-nav">
        <a href="#/group-home" class="dp-back" id="sales-back-link">
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M13 4L7 10l6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Home
        </a>
        <div class="dp-nav-brand">
          <img src="assets/brand/mts-brand-mark.svg" alt="" class="dp-nav-logo" aria-hidden="true"/>
          <span>Sah &amp; Sons Group</span>
        </div>
      </nav>

      <!-- Hero banner -->
      <header class="dp-hero" style="background: linear-gradient(135deg, #05200f 0%, #0d3d24 50%, #138a50 100%);">
        <div class="dp-hero-inner">
          <div class="dp-hero-icon dp-hero-brand-img" aria-hidden="true">
            <img
              src="assets/brand/maa-tara-sales/images-5.jpeg"
              alt="Saloni Kachchi Ghani Mustard Oil logo"
              class="dp-brand-logo-img"
            />
          </div>
          <div class="dp-hero-copy">
            <div class="dp-hero-pill">Authorised Wholesale Distributor</div>
            <h1 class="dp-hero-title">Maa Tara Sales</h1>
            <p class="dp-hero-sub">
              Primary wholesale distributor for <strong>Saloni Kachchi Ghani Mustard Oil</strong> —
              managing bulk procurement, warehousing, and last-mile distribution across Bhagalpur region.
            </p>
          </div>
        </div>
      </header>

      <div class="dp-content">
        <!-- Metrics -->
        <div class="dp-metrics">
          <div class="dp-metric">
            <span class="dp-metric-value">Saloni</span>
            <span class="dp-metric-label">Primary Brand</span>
          </div>
          <div class="dp-metric">
            <span class="dp-metric-value">Wholesale</span>
            <span class="dp-metric-label">Distribution Type</span>
          </div>
          <div class="dp-metric">
            <span class="dp-metric-value">B2B</span>
            <span class="dp-metric-label">Trade Segment</span>
          </div>
        </div>

        <!-- Feature / Ambassador Banner -->
        <div class="dp-feature-banner">
          <img
            src="assets/brand/maa-tara-sales/images-6.jpeg"
            alt="Saloni brand ambassador campaign"
            class="dp-feature-img"
            loading="eager"
          />
          <div class="dp-feature-overlay">
            <div class="dp-feature-badge">Official Distributor</div>
            <div class="dp-feature-tagline">Pure. Authentic. Trusted.</div>
          </div>
        </div>

        <!-- Product Range -->
        <section class="dp-section">
          <h2 class="dp-section-title">Product Range</h2>
          <p class="dp-section-body">
            We stock and distribute the complete Saloni brand portfolio across all pack sizes,
            catering to household, retail, and bulk commercial needs.
          </p>
          <div class="dp-product-grid">
            ${PRODUCT_IMAGES.map(renderProductCard).join("")}
          </div>
        </section>

        <!-- About -->
        <section class="dp-section">
          <h2 class="dp-section-title">About Maa Tara Sales</h2>
          <p class="dp-section-body">
            Maa Tara Sales is the dedicated oil distribution arm of Sah &amp; Sons Group. Core operations include:
          </p>
          <ul class="dp-list">
            <li>Receiving large bulk stocks directly from the manufacturer</li>
            <li>Managed storage in partnered warehousing infrastructure</li>
            <li>Timely distribution to distributors, sub-wholesalers, and retailers</li>
            <li>Supply to Modern Trade &amp; institutional outlets</li>
            <li>Maintaining consistent product availability across the supply chain</li>
          </ul>
        </section>

        <!-- Contact Us -->
        <section class="dp-section dp-contact-section">
          <h2 class="dp-section-title">Contact Us</h2>
          <p class="dp-section-body" style="margin-bottom:18px">
            For wholesale enquiries, bulk orders, or distribution partnership queries.
          </p>
          <div class="dp-contact-grid">

            <a href="tel:+918002590768" class="dp-contact-item" id="sales-contact-phone">
              <div class="dp-contact-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div>
                <div class="dp-contact-label">Phone</div>
                <div class="dp-contact-value">+91 8002590768</div>
              </div>
            </a>

            <a href="mailto:bgp.maatarastore@gmail.com" class="dp-contact-item" id="sales-contact-email">
              <div class="dp-contact-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="1.8"/>
                  <path d="m2 7 10 7 10-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
              </div>
              <div>
                <div class="dp-contact-label">Email</div>
                <div class="dp-contact-value">bgp.maatarastore@gmail.com</div>
              </div>
            </a>

            <div class="dp-contact-item dp-contact-address" id="sales-contact-address">
              <div class="dp-contact-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" stroke="currentColor" stroke-width="1.8"/>
                  <circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="1.8"/>
                </svg>
              </div>
              <div>
                <div class="dp-contact-label">Address</div>
                <div class="dp-contact-value">Hat Road, Tilkamanjhi<br/>Bhagalpur — 812001</div>
              </div>
            </div>

          </div>
        </section>

        <!-- Footer -->
        <footer class="dp-footer">
          <img src="assets/brand/mts-brand-mark.svg" alt="" class="dp-footer-logo" aria-hidden="true"/>
          <span>Sah &amp; Sons Group &mdash; <em>With blessings of Maa Tara</em></span>
        </footer>
      </div>
    </div>
  `;
}

function mountMaaTaraSalesPage() {
  const root = document.getElementById("route-root");
  if (root) root.innerHTML = renderMaaTaraSalesPage();
}

export { mountMaaTaraSalesPage };
