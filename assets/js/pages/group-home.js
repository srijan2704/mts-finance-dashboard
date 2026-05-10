/**
 * group-home.js
 * Sah & Sons Group — portfolio landing page (redesigned).
 *
 * Premium dark-hero design with glassmorphism company cards,
 * animated ambient orbs, and a rich footer.
 *
 * Route: #/group-home
 */

const COMPANIES = [
  {
    id: "maa-tara-store",
    hash: "#/maa-tara-store",
    name: "Maa Tara Store",
    tagline: "Wholesale Trading",
    description:
      "Wholesale trading of Sugar, Rice, Pulses, and all kinds of Edible Oils — Mustard, Soyabean, Rice Bran, Palmolein, Wheat Flour and more.",
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #0e67d0 100%)",
    accentRgb: "26, 111, 207",
    badge: "#3b82f6",
    stats: [
      { label: "Commodities", value: "20+" },
      { label: "Quality", value: "Premium" },
    ],
    icon: `<svg viewBox="0 0 56 56" fill="none">
      <rect width="56" height="56" rx="16" fill="rgba(255,255,255,0.12)"/>
      <path d="M10 22L28 12L46 22V44H10V22Z" stroke="rgba(255,255,255,0.9)" stroke-width="2.5" stroke-linejoin="round"/>
      <rect x="21" y="31" width="14" height="13" rx="2" stroke="rgba(255,255,255,0.9)" stroke-width="2.2"/>
      <path d="M23 27h10M28 25v4" stroke="rgba(255,255,255,0.75)" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: "maa-tara-sales",
    hash: "#/maa-tara-sales",
    name: "Maa Tara Sales",
    tagline: "Oil Distribution",
    description:
      "Authorised wholesale distributor for Saloni Kachchi Ghani Mustard Oil — managing bulk procurement, warehousing, and last-mile distribution.",
    gradient: "linear-gradient(135deg, #0d3d24 0%, #138a50 100%)",
    accentRgb: "19, 138, 80",
    badge: "#22c55e",
    stats: [
      { label: "Brand", value: "Saloni" },
      { label: "Coverage", value: "5+ Districts" },
    ],
    icon: `<svg viewBox="0 0 56 56" fill="none">
      <rect width="56" height="56" rx="16" fill="rgba(255,255,255,0.12)"/>
      <path d="M18 16h20l4 10H14l4-10Z" stroke="rgba(255,255,255,0.9)" stroke-width="2.2" stroke-linejoin="round"/>
      <rect x="13" y="26" width="30" height="16" rx="3" stroke="rgba(255,255,255,0.9)" stroke-width="2.2"/>
      <path d="M22 34h12M28 32v4" stroke="rgba(255,255,255,0.75)" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="20" cy="44" r="2.5" fill="rgba(255,255,255,0.85)"/>
      <circle cx="36" cy="44" r="2.5" fill="rgba(255,255,255,0.85)"/>
    </svg>`,
  },
  {
    id: "maa-tara-warehouse",
    hash: "#/maa-tara-warehouse",
    name: "Maa Tara Warehouse",
    tagline: "Storage & Logistics",
    description:
      "Modern warehousing facility spanning over 25,000 sq ft with state-of-the-art infrastructure and a weighing bridge for seamless logistics.",
    gradient: "linear-gradient(135deg, #3d2200 0%, #b06a00 100%)",
    accentRgb: "176, 106, 0",
    badge: "#f59e0b",
    stats: [
      { label: "Area", value: "25K+ sqft" },
      { label: "Weighbridge", value: "Available" },
    ],
    icon: `<svg viewBox="0 0 56 56" fill="none">
      <rect width="56" height="56" rx="16" fill="rgba(255,255,255,0.12)"/>
      <path d="M8 26L28 14L48 26V46H8V26Z" stroke="rgba(255,255,255,0.9)" stroke-width="2.5" stroke-linejoin="round"/>
      <rect x="14" y="33" width="10" height="13" rx="2" stroke="rgba(255,255,255,0.9)" stroke-width="2"/>
      <rect x="32" y="33" width="10" height="13" rx="2" stroke="rgba(255,255,255,0.9)" stroke-width="2"/>
      <path d="M8 46h40" stroke="rgba(255,255,255,0.75)" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: "maa-tara-tower",
    hash: "#/maa-tara-tower",
    name: "Maa Tara Tower",
    tagline: "Real Estate",
    description:
      "Premium real estate development covering 30,000+ sq ft with 25+ residential flats and dedicated commercial spaces.",
    gradient: "linear-gradient(135deg, #2d1060 0%, #7a3dbf 100%)",
    accentRgb: "122, 61, 191",
    badge: "#a855f7",
    stats: [
      { label: "Area", value: "30K+ sqft" },
      { label: "Flats", value: "25+" },
    ],
    icon: `<svg viewBox="0 0 56 56" fill="none">
      <rect width="56" height="56" rx="16" fill="rgba(255,255,255,0.12)"/>
      <rect x="18" y="10" width="20" height="36" rx="2.5" stroke="rgba(255,255,255,0.9)" stroke-width="2.2"/>
      <rect x="8" y="26" width="11" height="20" rx="2" stroke="rgba(255,255,255,0.9)" stroke-width="2"/>
      <rect x="37" y="31" width="11" height="15" rx="2" stroke="rgba(255,255,255,0.9)" stroke-width="2"/>
      <path d="M22 18h4M30 18h4M22 25h4M30 25h4M22 32h4M30 32h4" stroke="rgba(255,255,255,0.65)" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M8 46h40" stroke="rgba(255,255,255,0.75)" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  },
];

function renderCompanyCard(company, index) {
  return `
    <a
      class="gh-card"
      href="${company.hash}"
      id="gh-card-${company.id}"
      aria-label="View ${company.name} details"
      style="
        --card-gradient: ${company.gradient};
        --card-accent-rgb: ${company.accentRgb};
        --card-badge: ${company.badge};
        animation-delay: ${index * 0.08}s;
      "
    >
      <!-- Gloss shimmer layer -->
      <div class="gh-card-gloss" aria-hidden="true"></div>

      <!-- Top row: icon + arrow -->
      <div class="gh-card-top">
        <div class="gh-card-icon" aria-hidden="true">${company.icon}</div>
        <div class="gh-card-arrow" aria-hidden="true">
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M6 4l8 6-8 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <!-- Content -->
      <div class="gh-card-body">
        <div class="gh-card-tagline">${company.tagline}</div>
        <h2 class="gh-card-name">${company.name}</h2>
        <p class="gh-card-desc">${company.description}</p>
      </div>

      <!-- Stats chips -->
      <div class="gh-card-stats">
        ${company.stats.map((s) => `
          <div class="gh-card-stat">
            <span class="gh-card-stat-value">${s.value}</span>
            <span class="gh-card-stat-label">${s.label}</span>
          </div>
        `).join("")}
        <div class="gh-card-cta">Explore →</div>
      </div>
    </a>
  `;
}

function renderGroupHomePage() {
  return `
    <div class="gh-root">

      <!-- Animated ambient background orbs -->
      <div class="gh-bg" aria-hidden="true">
        <div class="gh-orb gh-orb-1"></div>
        <div class="gh-orb gh-orb-2"></div>
        <div class="gh-orb gh-orb-3"></div>
        <div class="gh-orb gh-orb-4"></div>
      </div>

      <!-- ── HERO ── -->
      <header class="gh-hero">
        <div class="gh-hero-inner">
          <div class="gh-hero-brand">
            <img
              src="assets/brand/mts-brand-mark.svg"
              alt="Sah and Sons Group mark"
              class="gh-hero-logo"
            />
            <div class="gh-hero-brand-text">
              <span class="gh-hero-brand-name">Sah and Sons Group</span>
              <span class="gh-hero-brand-sub">With blessings of Maa Tara</span>
            </div>
          </div>

          <div class="gh-hero-pill">
            <svg viewBox="0 0 12 12" fill="none" class="gh-hero-pill-dot">
              <circle cx="6" cy="6" r="4" fill="#22c55e"/>
              <circle cx="6" cy="6" r="2" fill="#fff"/>
            </svg>
            Trusted Since 1989
          </div>

          <h1 class="gh-hero-title">
            One Vision.<br/>
            <span class="gh-hero-title-accent">One Mission.</span>
          </h1>
          <p class="gh-hero-subtitle">
            A diversified business house operating across wholesale commodity trading,
            edible oil distribution, large-scale warehousing, and premium real estate.
          </p>

          <!-- Stat bar -->
          <div class="gh-hero-stats">
            <div class="gh-hero-stat">
              <span class="gh-hero-stat-value">4</span>
              <span class="gh-hero-stat-label">Business Entities</span>
            </div>
            <div class="gh-hero-stat-divider"></div>
            <div class="gh-hero-stat">
              <span class="gh-hero-stat-value">25K+</span>
              <span class="gh-hero-stat-label">Sq Ft Warehouse</span>
            </div>
            <div class="gh-hero-stat-divider"></div>
            <div class="gh-hero-stat">
              <span class="gh-hero-stat-value">30K+</span>
              <span class="gh-hero-stat-label">Sq Ft Real Estate</span>
            </div>
            <div class="gh-hero-stat-divider"></div>
            <div class="gh-hero-stat">
              <span class="gh-hero-stat-value">Saloni</span>
              <span class="gh-hero-stat-label">Brand Partner</span>
            </div>
          </div>
        </div>
      </header>

      <!-- ── CARDS SECTION ── -->
      <section class="gh-cards-section" aria-label="Portfolio companies">
        <div class="gh-cards-label">Our Portfolio</div>
        <div class="gh-cards-grid" id="gh-cards-grid">
          ${COMPANIES.map((c, i) => renderCompanyCard(c, i)).join("")}
        </div>
      </section>

      <!-- ── FOOTER ── -->
      <footer class="gh-footer">
        <div class="gh-footer-inner">
          <div class="gh-footer-brand">
            <img src="assets/brand/mts-brand-mark.svg" alt="" class="gh-footer-logo" aria-hidden="true"/>
            <div>
              <div class="gh-footer-name">Sah and Sons Group</div>
              <div class="gh-footer-sub">With blessings of Maa Tara</div>
            </div>
          </div>
          <div class="gh-footer-contact">
            <a href="tel:+918002590768" class="gh-footer-link">+91 8002590768</a>
            <span class="gh-footer-sep">·</span>
            <a href="mailto:bgp.maatarastore@gmail.com" class="gh-footer-link">bgp.maatarastore@gmail.com</a>
            <span class="gh-footer-sep">·</span>
            <span class="gh-footer-addr">Hat Road, Tilkamanjhi, Bhagalpur — 812001</span>
          </div>
          <div class="gh-footer-copy">&copy; ${new Date().getFullYear()} Sah and Sons Group. All rights reserved.</div>
        </div>
      </footer>

    </div>
  `;
}

function mountGroupHomePage() {
  const root = document.getElementById("route-root");
  if (root) root.innerHTML = renderGroupHomePage();
}

export { mountGroupHomePage };
