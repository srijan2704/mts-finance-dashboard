/**
 * maa-tara-warehouse.js
 * Maa Tara Warehouse — business detail page (dark redesign).
 * Route: #/maa-tara-warehouse
 */

function renderMaaTaraWarehousePage() {
  return `
    <div class="dp-root" style="--dp-accent-rgb:176,106,0; --dp-orb-a:#b06a00; --dp-orb-b:#5c3600;">

      <!-- Ambient background orbs -->
      <div class="dp-bg" aria-hidden="true">
        <div class="dp-orb dp-orb-1"></div>
        <div class="dp-orb dp-orb-2"></div>
      </div>

      <!-- Top nav bar -->
      <nav class="dp-nav">
        <a href="#/group-home" class="dp-back" id="warehouse-back-link">
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
      <header class="dp-hero" style="background: linear-gradient(135deg, #1e0f00 0%, #5c3200 50%, #b06a00 100%);">
        <div class="dp-hero-inner">
          <div class="dp-hero-icon" aria-hidden="true">
            <svg viewBox="0 0 72 72" fill="none">
              <rect width="72" height="72" rx="20" fill="rgba(255,255,255,0.12)"/>
              <path d="M8 32L36 16L64 32V60H8V32Z" stroke="rgba(255,255,255,0.95)" stroke-width="3" stroke-linejoin="round"/>
              <rect x="14" y="42" width="14" height="18" rx="2" stroke="rgba(255,255,255,0.95)" stroke-width="2.5"/>
              <rect x="44" y="42" width="14" height="18" rx="2" stroke="rgba(255,255,255,0.95)" stroke-width="2.5"/>
              <path d="M8 60h56" stroke="rgba(255,255,255,0.6)" stroke-width="2.2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="dp-hero-copy">
            <div class="dp-hero-pill">Storage &amp; Logistics</div>
            <h1 class="dp-hero-title">Maa Tara Warehouse</h1>
            <p class="dp-hero-sub">
              Over 25,000 sq ft of modern warehousing infrastructure with a full-capacity weighing
              bridge — the logistics backbone of Sah &amp; Sons Group.
            </p>
          </div>
        </div>
      </header>

      <div class="dp-content">
        <!-- Metrics -->
        <div class="dp-metrics">
          <div class="dp-metric">
            <span class="dp-metric-value">25,000+</span>
            <span class="dp-metric-label">Square Feet</span>
          </div>
          <div class="dp-metric">
            <span class="dp-metric-value">Modern</span>
            <span class="dp-metric-label">Infrastructure</span>
          </div>
          <div class="dp-metric">
            <span class="dp-metric-value">Yes</span>
            <span class="dp-metric-label">Weighing Bridge</span>
          </div>
        </div>

        <!-- About -->
        <section class="dp-section">
          <h2 class="dp-section-title">About Maa Tara Warehouse</h2>
          <p class="dp-section-body">
            Maa Tara Warehouse provides dedicated storage and handling solutions for the group's
            trading operations as well as for third-party logistics clients. Key features include:
          </p>
          <ul class="dp-list">
            <li>Over 25,000 sq ft of covered storage space</li>
            <li>Modern material handling equipment</li>
            <li>Weighing bridge for accurate truck-load measurement</li>
            <li>Temperature-managed sections for sensitive commodities</li>
            <li>24/7 security and inventory monitoring</li>
            <li>Strategic location for efficient inbound and outbound logistics</li>
          </ul>
        </section>

        <!-- Infrastructure Gallery -->
        <section class="dp-section">
          <h2 class="dp-section-title">Infrastructure Gallery</h2>
          <p class="dp-section-body">
            A glimpse into our modern 25,000+ sq ft warehousing facilities.
          </p>
          <div class="dp-gallery-grid">
            <div class="dp-gallery-item" style="cursor: pointer;" onclick="openWarehouseLightbox('image', 'assets/brand/maa-tara-warehouse/warehouse-1.jpg')">
              <img src="assets/brand/maa-tara-warehouse/warehouse-1-sm.jpg" srcset="assets/brand/maa-tara-warehouse/warehouse-1-sm.jpg 600w, assets/brand/maa-tara-warehouse/warehouse-1-md.jpg 1200w" sizes="(max-width: 768px) 100vw, 33vw" alt="Warehouse Facility View 1" class="dp-gallery-media" loading="lazy" decoding="async"/>
            </div>
            <div class="dp-gallery-item" style="cursor: pointer;" onclick="openWarehouseLightbox('image', 'assets/brand/maa-tara-warehouse/warehouse-2.JPG')">
              <img src="assets/brand/maa-tara-warehouse/warehouse-2-sm.jpg" srcset="assets/brand/maa-tara-warehouse/warehouse-2-sm.jpg 600w, assets/brand/maa-tara-warehouse/warehouse-2-md.jpg 1200w" sizes="(max-width: 768px) 100vw, 33vw" alt="Warehouse Facility View 2" class="dp-gallery-media" loading="lazy" decoding="async"/>
            </div>
            <div class="dp-gallery-item dp-gallery-video" style="cursor: pointer;" onclick="openWarehouseLightbox('video', 'assets/brand/maa-tara-warehouse/warehouse-video.mp4')">
              <video src="assets/brand/maa-tara-warehouse/warehouse-video.mp4" class="dp-gallery-media" preload="metadata" muted></video>
              <div style="position:absolute; background:rgba(0,0,0,0.5); border-radius:50%; width:48px; height:48px; display:flex; align-items:center; justify-content:center;">
                <svg viewBox="0 0 24 24" fill="white" style="width:24px;height:24px;margin-left:4px;"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
          </div>
        </section>

        <!-- Coming Soon -->
        <section class="dp-section dp-coming-soon">
          <div class="dp-coming-inner">
            <svg viewBox="0 0 24 24" fill="none" class="dp-coming-icon">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8" fill="none"/>
              <path d="M12 7v5l3 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            <div>
              <div class="dp-coming-title">Warehouse Management Portal — Coming Soon</div>
              <div class="dp-coming-body">A dedicated portal for warehouse management and weighbridge operations is being planned.</div>
            </div>
          </div>
        </section>

        <!-- Contact Us -->
        <section class="dp-section dp-contact-section">
          <h2 class="dp-section-title">Contact Us</h2>
          <p class="dp-section-body" style="margin-bottom:18px">
            Reach out to our facility for storage availability, dispatch tracking, or business queries.
          </p>
          <div class="dp-contact-grid">

            <a href="tel:+918002590768" class="dp-contact-item" id="warehouse-contact-phone">
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

            <a href="mailto:bgp.maatarastore@gmail.com" class="dp-contact-item" id="warehouse-contact-email">
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

            <div class="dp-contact-item dp-contact-address" id="warehouse-contact-address">
              <div class="dp-contact-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" stroke="currentColor" stroke-width="1.8"/>
                  <circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="1.8"/>
                </svg>
              </div>
              <div>
                <div class="dp-contact-label">Address</div>
                <div class="dp-contact-value">Vill- Dumrama, Amarpur<br/>Banka, Bihar</div>
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

      <!-- Lightbox Overlay -->
      <div class="dp-lightbox" id="warehouse-lightbox" onclick="closeWarehouseLightbox(event)">
        <div class="dp-lightbox-close" onclick="closeWarehouseLightbox(event, true)">
          <svg viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <!-- Content gets injected here by JS -->
        <div id="warehouse-lightbox-container"></div>
      </div>

    </div>
  `;
}

// Global handlers for lightbox
window.openWarehouseLightbox = function(type, src) {
  const lightbox = document.getElementById("warehouse-lightbox");
  const container = document.getElementById("warehouse-lightbox-container");
  if (!lightbox || !container) return;

  if (type === 'image') {
    container.innerHTML = `<img src="${src}" class="dp-lightbox-content" />`;
  } else if (type === 'video') {
    container.innerHTML = `<video src="${src}" class="dp-lightbox-content" controls autoplay></video>`;
  }

  lightbox.classList.add("active");
};

window.closeWarehouseLightbox = function(e, force = false) {
  const lightbox = document.getElementById("warehouse-lightbox");
  const container = document.getElementById("warehouse-lightbox-container");
  
  // Close if clicked on background or close button
  if (force || e.target === lightbox) {
    lightbox.classList.remove("active");
    // Clear content to stop video playing
    setTimeout(() => { container.innerHTML = ""; }, 300);
  }
};

function mountMaaTaraWarehousePage() {
  const root = document.getElementById("route-root");
  if (root) root.innerHTML = renderMaaTaraWarehousePage();
}

export { mountMaaTaraWarehousePage };
