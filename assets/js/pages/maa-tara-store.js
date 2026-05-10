/**
 * maa-tara-store.js
 * Maa Tara Store — business detail page (dark redesign).
 * Route: #/maa-tara-store
 */
const STORE_PRODUCTS = [
  { src: "assets/brand/maa-tara-store/aashirvaad-atta-30-Kg.webp", srcSm: "assets/brand/maa-tara-store/aashirvaad-atta-30-Kg.webp", alt: "Aashirvaad Atta 30 Kg", label: "Aashirvaad Atta 30 Kg" },
  { src: "assets/brand/maa-tara-store/dhara-mustard-oil-5Litre.jpeg", srcSm: "assets/brand/maa-tara-store/dhara-mustard-oil-5Litre-sm.jpg", alt: "Dhara Mustard Oil 5L", label: "Dhara Mustard Oil 5L" },
  { src: "assets/brand/maa-tara-store/dhara-mustard-oil.webp", srcSm: "assets/brand/maa-tara-store/dhara-mustard-oil.webp", alt: "Dhara Mustard Oil", label: "Dhara Mustard Oil" },
  { src: "assets/brand/maa-tara-store/fortune-mustard-oil.webp", srcSm: "assets/brand/maa-tara-store/fortune-mustard-oil.webp", alt: "Fortune Mustard Oil", label: "Fortune Mustard Oil" },
  { src: "assets/brand/maa-tara-store/healthy-tasty-mustard-oil.webp", srcSm: "assets/brand/maa-tara-store/healthy-tasty-mustard-oil.webp", alt: "Healthy Tasty Mustard Oil", label: "Healthy Tasty Mustard Oil" },
  { src: "assets/brand/maa-tara-store/healthy-tasty-refined-oil.jpeg", srcSm: "assets/brand/maa-tara-store/healthy-tasty-refined-oil-sm.jpg", alt: "Healthy Tasty Refined Oil", label: "Healthy Tasty Refined Oil" },
  { src: "assets/brand/maa-tara-store/india-gate-20-kg-bag.webp", srcSm: "assets/brand/maa-tara-store/india-gate-20-kg-bag.webp", alt: "India Gate 20 Kg Bag", label: "India Gate 20 Kg Bag" },
  { src: "assets/brand/maa-tara-store/india-gate-white-sella-rice.jpeg", srcSm: "assets/brand/maa-tara-store/india-gate-white-sella-rice-sm.jpg", alt: "India Gate White Sella Rice", label: "India Gate White Sella Rice" },
  { src: "assets/brand/maa-tara-store/ladoshri-24-carat-rice.jpeg", srcSm: "assets/brand/maa-tara-store/ladoshri-24-carat-rice-sm.jpg", alt: "Ladoshri 24 Carat Rice", label: "Ladoshri 24 Carat Rice" },
  { src: "assets/brand/maa-tara-store/mangal-1-litre-pouch.webp", srcSm: "assets/brand/maa-tara-store/mangal-1-litre-pouch.webp", alt: "Mangal 1 Litre Pouch", label: "Mangal 1 Litre Pouch" },
  { src: "assets/brand/maa-tara-store/nature-fresh-refined-oil.jpeg", srcSm: "assets/brand/maa-tara-store/nature-fresh-refined-oil-sm.jpg", alt: "Nature Fresh Refined Oil", label: "Nature Fresh Refined Oil" },
  { src: "assets/brand/maa-tara-store/sharda-rice-25-kg-bag.jpeg", srcSm: "assets/brand/maa-tara-store/sharda-rice-25-kg-bag-sm.jpg", alt: "Sharda Rice 25 Kg Bag", label: "Sharda Rice 25 Kg Bag" },
  { src: "assets/brand/maa-tara-store/sugar.jpeg", srcSm: "assets/brand/maa-tara-store/sugar-sm.jpg", alt: "Premium Sugar", label: "Premium Sugar" },
  { src: "assets/brand/maa-tara-store/zabreen-biryani-rice.jpeg", srcSm: "assets/brand/maa-tara-store/zabreen-biryani-rice-sm.jpg", alt: "Zabreen Biryani Rice", label: "Zabreen Biryani Rice" },
];

function renderStoreProduct(img) {
  return `
    <div class="dp-product-card">
      <div class="dp-product-img-wrap">
        <img src="${img.srcSm}" srcset="${img.srcSm} 400w, ${img.src} 800w" sizes="(max-width: 600px) 400px, 800px" alt="${img.alt}" class="dp-product-img" loading="lazy" decoding="async"/>
      </div>
      <div class="dp-product-label">${img.label}</div>
    </div>
  `;
}
function renderMaaTaraStorePage() {
  return `
    <div class="dp-root" style="--dp-accent-rgb:26,111,207; --dp-orb-a:#1a6fcf; --dp-orb-b:#0e3a6e;">

      <!-- Ambient background orbs -->
      <div class="dp-bg" aria-hidden="true">
        <div class="dp-orb dp-orb-1"></div>
        <div class="dp-orb dp-orb-2"></div>
      </div>

      <!-- Top nav bar -->
      <nav class="dp-nav">
        <a href="#/group-home" class="dp-back" id="store-back-link">
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M13 4L7 10l6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Home
        </a>
        <div class="dp-nav-brand">
          <img src="assets/brand/mts-brand-mark.svg" alt="" class="dp-nav-logo" aria-hidden="true"/>
          <span>Sah &amp; Sons Group</span>
        </div>
        <a href="#/landing" target="_blank" rel="noopener noreferrer" class="dp-nav-action" id="store-admin-portal-nav" title="MTS Purchase Dashboard">
          <svg viewBox="0 0 20 20" fill="none">
            <rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="1.4"/>
            <rect x="11" y="2" width="7" height="7" rx="1.5" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="1.4"/>
            <rect x="2" y="11" width="7" height="7" rx="1.5" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="1.4"/>
            <rect x="11" y="11" width="7" height="7" rx="1.5" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="1.4"/>
          </svg>
        </a>
      </nav>

      <!-- Hero banner -->
      <header class="dp-hero" style="background: linear-gradient(135deg, #0b1e3d 0%, #0e3d6e 50%, #1a6fcf 100%);">
        <div class="dp-hero-inner">
          <div class="dp-hero-icon" aria-hidden="true">
            <svg viewBox="0 0 72 72" fill="none">
              <rect width="72" height="72" rx="20" fill="rgba(255,255,255,0.12)"/>
              <path d="M12 28L36 14L60 28V56H12V28Z" stroke="rgba(255,255,255,0.95)" stroke-width="3" stroke-linejoin="round"/>
              <rect x="27" y="40" width="18" height="16" rx="2.5" stroke="rgba(255,255,255,0.95)" stroke-width="2.5"/>
              <path d="M29 34h14M36 31v5" stroke="rgba(255,255,255,0.7)" stroke-width="2.2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="dp-hero-copy">
            <div class="dp-hero-pill">Wholesale Trading</div>
            <h1 class="dp-hero-title">Maa Tara Store</h1>
            <p class="dp-hero-sub">
              Flagship wholesale trading entity of Sah &amp; Sons Group — supplying Sugar, Rice, Pulses
              and Edible Oils across the region with trust built over decades.
            </p>
          </div>
        </div>
      </header>

      <!-- Metrics -->
      <div class="dp-content">
        <div class="dp-metrics">
          <div class="dp-metric">
            <span class="dp-metric-value">10+</span>
            <span class="dp-metric-label">Commodities</span>
          </div>
          <div class="dp-metric">
            <span class="dp-metric-value">Wholesale</span>
            <span class="dp-metric-label">License Type</span>
          </div>
          <div class="dp-metric">
            <span class="dp-metric-value">Regional</span>
            <span class="dp-metric-label">Coverage</span>
          </div>
        </div>

        <!-- About -->
        <section class="dp-section">
          <h2 class="dp-section-title">About Maa Tara Store</h2>
          <p class="dp-section-body">
            Maa Tara Store is a wholesale trading entity dealing in a broad portfolio of
            essential food commodities, serving distributors, sub-wholesalers, and retailers
            with reliable supply at competitive prices.
          </p>
          <ul class="dp-list">
            <li>Sugar &amp; Wheat Flour</li>
            <li>Rice (various grades)</li>
            <li>Pulses — Chana, Moong, Masoor, Urad, Toor</li>
            <li>Mustard Oil &amp; Soyabean Oil</li>
            <li>Rice Bran Oil &amp; Palmolein Oil</li>
            <li>Other edible oils and allied food items</li>
          </ul>
        </section>

        <!-- Product Portfolio -->
        <section class="dp-section">
          <h2 class="dp-section-title">Product Portfolio</h2>
          <p class="dp-section-body">
            A diverse range of premium wholesale commodities distributed to retailers and sub-wholesalers across the region.
          </p>
          <div class="dp-product-scroll-row">
            ${STORE_PRODUCTS.map(renderStoreProduct).join("")}
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

function mountMaaTaraStorePage() {
  const root = document.getElementById("route-root");
  if (root) root.innerHTML = renderMaaTaraStorePage();
}

export { mountMaaTaraStorePage };
