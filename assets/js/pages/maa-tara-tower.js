/**
 * maa-tara-tower.js
 * Maa Tara Tower — business detail page (dark redesign).
 * Route: #/maa-tara-tower
 */

function renderMaaTaraTowerPage() {
  return `
    <div class="dp-root" style="--dp-accent-rgb:122,61,191; --dp-orb-a:#7a3dbf; --dp-orb-b:#2d1060;">

      <!-- Ambient background orbs -->
      <div class="dp-bg" aria-hidden="true">
        <div class="dp-orb dp-orb-1"></div>
        <div class="dp-orb dp-orb-2"></div>
      </div>

      <!-- Top nav bar -->
      <nav class="dp-nav">
        <a href="#/group-home" class="dp-back" id="tower-back-link">
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M13 4L7 10l6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Group Home
        </a>
        <div class="dp-nav-brand">
          <img src="assets/brand/mts-brand-mark.svg" alt="" class="dp-nav-logo" aria-hidden="true"/>
          <span>Sah &amp; Sons Group</span>
        </div>
      </nav>

      <!-- Hero banner -->
      <header class="dp-hero" style="background: linear-gradient(135deg, #130830 0%, #2d1060 50%, #7a3dbf 100%);">
        <div class="dp-hero-inner">
          <div class="dp-hero-icon" aria-hidden="true">
            <svg viewBox="0 0 72 72" fill="none">
              <rect width="72" height="72" rx="20" fill="rgba(255,255,255,0.12)"/>
              <rect x="22" y="10" width="28" height="50" rx="3" stroke="rgba(255,255,255,0.95)" stroke-width="2.8"/>
              <rect x="8" y="32" width="15" height="28" rx="2.5" stroke="rgba(255,255,255,0.9)" stroke-width="2.5"/>
              <rect x="49" y="38" width="15" height="22" rx="2.5" stroke="rgba(255,255,255,0.9)" stroke-width="2.5"/>
              <path d="M27 20h6M39 20h6M27 30h6M39 30h6M27 40h6M39 40h6" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round"/>
              <path d="M8 60h56" stroke="rgba(255,255,255,0.5)" stroke-width="2.2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="dp-hero-copy">
            <div class="dp-hero-pill">Real Estate Development</div>
            <h1 class="dp-hero-title">Maa Tara Tower</h1>
            <p class="dp-hero-sub">
              A landmark mixed-use real estate project by Sah &amp; Sons Group — 30,000+ sq ft of
              premium residential flats and commercial spaces under development.
            </p>
          </div>
        </div>
      </header>

      <div class="dp-content">
        <!-- Metrics -->
        <div class="dp-metrics">
          <div class="dp-metric">
            <span class="dp-metric-value">30,000+</span>
            <span class="dp-metric-label">Square Feet</span>
          </div>
          <div class="dp-metric">
            <span class="dp-metric-value">25+</span>
            <span class="dp-metric-label">Residential Flats</span>
          </div>
          <div class="dp-metric">
            <span class="dp-metric-value">Mixed Use</span>
            <span class="dp-metric-label">Development Type</span>
          </div>
        </div>

        <!-- About -->
        <section class="dp-section">
          <h2 class="dp-section-title">About Maa Tara Tower</h2>
          <p class="dp-section-body">
            Maa Tara Tower marks the group's expansion into premium property development. The project
            encompasses a thoughtfully designed mixed-use tower with:
          </p>
          <ul class="dp-list">
            <li>More than 30,000 sq ft of total developed area</li>
            <li>25+ premium residential apartments across multiple floors</li>
            <li>Commercial spaces on the lower levels for retail and office use</li>
            <li>Modern amenities and contemporary architectural design</li>
            <li>Thoughtful planning with ample natural light and ventilation</li>
            <li>Strategically located to maximise connectivity and value</li>
          </ul>
        </section>

        <!-- Status Banner -->
        <section class="dp-section dp-coming-soon">
          <div class="dp-coming-inner">
            <svg viewBox="0 0 24 24" fill="none" class="dp-coming-icon">
              <path d="M3 21l9-18 9 18H3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" fill="none"/>
              <path d="M12 10v5M12 17v1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            <div>
              <div class="dp-coming-title">Project Under Development</div>
              <div class="dp-coming-body">A dedicated portal with floor plans, unit listings, and booking details will be available soon.</div>
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

function mountMaaTaraTowerPage() {
  const root = document.getElementById("route-root");
  if (root) root.innerHTML = renderMaaTaraTowerPage();
}

export { mountMaaTaraTowerPage };
