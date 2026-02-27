import { apiFetch, withQuery } from "../api/client.js";
import { endpoints } from "../api/endpoints.js";
import { showToast } from "../components/toast.js";
import { escapeHtml } from "../utils.js";

let chart1;
let chart2;
let chart2Drill;
let chart3;

const MAX_VISIBLE_BARS = 5;
const BAR_HEIGHT = 54;
const BAR_PADDING = 34;

/** Sets canvas height so first five rows are visible and remaining rows can be scrolled. */
function setScrollableChartHeight(canvasId, rowCount) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const count = Math.max(rowCount, MAX_VISIBLE_BARS);
  canvas.height = (count * BAR_HEIGHT) + BAR_PADDING;
}

/** Sorts a list descending by numeric selector, defensive for inconsistent API ordering. */
function sortDescending(list, selector) {
  return [...list].sort((a, b) => Number(selector(b) || 0) - Number(selector(a) || 0));
}

function renderReportsPage() {
  const today = new Date().toISOString().slice(0, 10);
  return `
    <div class="page-grid">
      <section class="card">
        <h2>Reporting Dashboard</h2>
        <p class="muted">All reports include confirmed purchase orders only.</p>
      </section>

      <section class="card">
        <div class="section-title"><h3>Graph 1: Daily Purchase Trend</h3></div>
        <form id="trend1-form" class="form-grid-2">
          <div><label class="label">From</label><input class="input" type="date" name="from" /></div>
          <div><label class="label">To</label><input class="input" type="date" name="to" value="${today}" /></div>
          <div><button class="btn btn-primary" type="submit">Load Trend</button></div>
        </form>
        <div class="chart-box"><canvas id="chart-daily-trend"></canvas></div>
      </section>

      <section class="card">
        <div class="section-title"><h3>Graph 2: Top Products By Units</h3></div>
        <form id="trend2-form" class="form-grid-2">
          <div><label class="label">From</label><input class="input" type="date" name="from" /></div>
          <div><label class="label">To</label><input class="input" type="date" name="to" value="${today}" /></div>
          <div><button class="btn btn-primary" type="submit">Load Product Rank</button></div>
        </form>
        <div class="chart-grid">
          <div class="chart-box card" style="box-shadow:none">
            <p class="muted chart-hint">Top 5 visible. Scroll to see more products.</p>
            <div class="chart-scroll"><canvas id="chart-top-products"></canvas></div>
          </div>
          <div class="chart-box card" style="box-shadow:none">
            <canvas id="chart-variant-drill"></canvas>
          </div>
        </div>
      </section>

      <section class="card">
        <div class="section-title"><h3>Graph 3: Top Sellers By Purchase Value</h3></div>
        <form id="trend3-form" class="form-grid-2">
          <div><label class="label">From</label><input class="input" type="date" name="from" /></div>
          <div><label class="label">To</label><input class="input" type="date" name="to" value="${today}" /></div>
          <div><button class="btn btn-primary" type="submit">Load Seller Rank</button></div>
        </form>
        <p class="muted chart-hint">Top 5 visible. Scroll to see more sellers.</p>
        <div class="chart-scroll"><canvas id="chart-top-sellers"></canvas></div>
      </section>
    </div>
  `;
}

function destroyCharts() {
  [chart1, chart2, chart2Drill, chart3].forEach((c) => {
    if (c) c.destroy();
  });
  chart1 = chart2 = chart2Drill = chart3 = null;
}

async function loadDailyTrend(params = {}) {
  const response = await apiFetch(withQuery(endpoints.reportsDailyTrend, params));
  const points = response.data?.points || [];
  const labels = points.map((p) => p.date);
  const values = points.map((p) => Number(p.totalPurchase || 0));

  if (chart1) chart1.destroy();
  chart1 = new Chart(document.getElementById("chart-daily-trend"), {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Total Purchase",
        data: values,
        borderColor: "#0e67d0",
        backgroundColor: "rgba(14,103,208,0.18)",
        tension: 0.25,
        fill: true,
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true } },
    },
  });
}

async function loadTopProducts(params = {}) {
  const response = await apiFetch(withQuery(endpoints.reportsTopProducts, params));
  const products = sortDescending(response.data?.products || [], (p) => p.totalUnits);
  const labels = products.map((p) => p.productName);
  const values = products.map((p) => Number(p.totalUnits || 0));

  setScrollableChartHeight("chart-top-products", products.length);

  if (chart2) chart2.destroy();
  chart2 = new Chart(document.getElementById("chart-top-products"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Units",
        data: values,
        backgroundColor: "#0e67d0",
      }],
    },
    options: {
      indexAxis: "y",
      maintainAspectRatio: false,
      onClick: (_event, elements) => {
        if (!elements.length) return;
        const idx = elements[0].index;
        renderVariantDrill(products[idx]);
      },
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          ticks: {
            autoSkip: false,
          },
        },
      },
    },
  });

  if (products.length) {
    renderVariantDrill(products[0]);
  } else {
    renderVariantDrill(null);
  }
}

function renderVariantDrill(product) {
  if (chart2Drill) chart2Drill.destroy();

  const variants = sortDescending(product?.variants || [], (v) => v.totalUnits);
  const labels = variants.map((v) => v.variantLabel);
  const values = variants.map((v) => Number(v.totalUnits || 0));

  chart2Drill = new Chart(document.getElementById("chart-variant-drill"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: product ? `Variants: ${product.productName}` : "Variants",
        data: values,
        backgroundColor: "#29a36a",
      }],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: product ? `Variant Drill-down: ${product.productName}` : "No variant data",
        },
      },
    },
  });
}

async function loadTopSellers(params = {}) {
  const response = await apiFetch(withQuery(endpoints.reportsTopSellers, params));
  const sellers = sortDescending(response.data?.sellers || [], (s) => s.totalPurchase);
  const labels = sellers.map((s) => s.sellerName);
  const values = sellers.map((s) => Number(s.totalPurchase || 0));

  setScrollableChartHeight("chart-top-sellers", sellers.length);

  if (chart3) chart3.destroy();
  chart3 = new Chart(document.getElementById("chart-top-sellers"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Total Purchase",
        data: values,
        backgroundColor: "#8a5bd6",
      }],
    },
    options: {
      indexAxis: "y",
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          ticks: {
            autoSkip: false,
          },
        },
      },
    },
  });
}

function readRange(form) {
  const fd = new FormData(form);
  return {
    from: fd.get("from") || undefined,
    to: fd.get("to") || undefined,
  };
}

function bindReportsPage() {
  document.getElementById("trend1-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await loadDailyTrend(readRange(event.target));
    } catch (err) {
      showToast(err.message || "Failed to load trend", "error");
    }
  });

  document.getElementById("trend2-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await loadTopProducts(readRange(event.target));
    } catch (err) {
      showToast(err.message || "Failed to load products", "error");
    }
  });

  document.getElementById("trend3-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await loadTopSellers(readRange(event.target));
    } catch (err) {
      showToast(err.message || "Failed to load sellers", "error");
    }
  });
}

async function mountReportsPage() {
  const root = document.getElementById("route-root");
  root.innerHTML = renderReportsPage();
  bindReportsPage();

  try {
    await Promise.all([loadDailyTrend(), loadTopProducts(), loadTopSellers()]);
  } catch (err) {
    showToast(`Could not load some charts: ${escapeHtml(err.message)}`, "error");
  }
}

function unmountReportsPage() {
  destroyCharts();
}

export { mountReportsPage, unmountReportsPage };
