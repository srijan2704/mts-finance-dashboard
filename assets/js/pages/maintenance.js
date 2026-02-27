import { apiFetch, withQuery } from "../api/client.js";
import { endpoints } from "../api/endpoints.js";
import { showToast } from "../components/toast.js";
import { escapeHtml } from "../utils.js";

let activeTab = "sellers";
const dataStore = {
  sellers: [],
  units: [],
  productTypes: [],
  products: [],
};

function tabButton(id, label) {
  return `<button class="tab-btn ${activeTab === id ? "active" : ""}" data-tab="${id}" type="button">${label}</button>`;
}

function renderSellers() {
  const rows = dataStore.sellers.map((s) => `
    <tr>
      <td>${escapeHtml(s.name)}</td>
      <td>${escapeHtml(s.contactPerson)}</td>
      <td>${escapeHtml(s.phone || "-")}</td>
      <td>${s.active ? "Active" : "Inactive"}</td>
    </tr>
  `).join("");

  return `
    <div class="page-grid">
      <div class="card">
        <h3>Add Seller</h3>
        <form id="seller-form" class="form-grid">
          <div><label class="label">Name</label><input class="input" name="name" required /></div>
          <div><label class="label">Contact Person</label><input class="input" name="contactPerson" required /></div>
          <div><label class="label">Phone</label><input class="input" name="phone" /></div>
          <div><label class="label">Email</label><input class="input" name="email" type="email" /></div>
          <div style="grid-column:1/-1"><button class="btn btn-primary" type="submit">Save Seller</button></div>
        </form>
      </div>
      <div class="card">
        <h3>Seller List</h3>
        <div class="table-wrap"><table class="table"><thead><tr><th>Name</th><th>Contact</th><th>Phone</th><th>Status</th></tr></thead><tbody>${rows || '<tr><td colspan="4" class="muted">No sellers found</td></tr>'}</tbody></table></div>
      </div>
    </div>
  `;
}

function renderUnits() {
  const rows = dataStore.units.map((u) => `<tr><td>${escapeHtml(u.unitName)}</td><td>${escapeHtml(u.abbreviation)}</td><td>${escapeHtml(u.description || "-")}</td></tr>`).join("");

  return `
    <div class="page-grid">
      <div class="card">
        <h3>Add Unit</h3>
        <form id="unit-form" class="form-grid-2">
          <div><label class="label">Unit Name</label><input class="input" name="unitName" required /></div>
          <div><label class="label">Abbreviation</label><input class="input" name="abbreviation" required /></div>
          <div style="grid-column:1/-1"><label class="label">Description</label><input class="input" name="description" /></div>
          <div style="grid-column:1/-1"><button class="btn btn-primary" type="submit">Save Unit</button></div>
        </form>
      </div>
      <div class="card">
        <h3>Unit List</h3>
        <div class="table-wrap"><table class="table"><thead><tr><th>Unit</th><th>Abbreviation</th><th>Description</th></tr></thead><tbody>${rows || '<tr><td colspan="3" class="muted">No units found</td></tr>'}</tbody></table></div>
      </div>
    </div>
  `;
}

function renderProductTypes() {
  const rows = dataStore.productTypes.map((t) => `<tr><td>${escapeHtml(t.typeName)}</td><td>${escapeHtml(t.description || "-")}</td></tr>`).join("");

  return `
    <div class="page-grid">
      <div class="card">
        <h3>Add Product Type</h3>
        <form id="ptype-form" class="form-grid-2">
          <div><label class="label">Type Name</label><input class="input" name="typeName" required /></div>
          <div><label class="label">Description</label><input class="input" name="description" /></div>
          <div style="grid-column:1/-1"><button class="btn btn-primary" type="submit">Save Type</button></div>
        </form>
      </div>
      <div class="card">
        <h3>Product Type List</h3>
        <div class="table-wrap"><table class="table"><thead><tr><th>Type</th><th>Description</th></tr></thead><tbody>${rows || '<tr><td colspan="2" class="muted">No product types found</td></tr>'}</tbody></table></div>
      </div>
    </div>
  `;
}

function renderProducts() {
  const typeOptions = ['<option value="">Select type</option>'].concat(
    dataStore.productTypes.map((t) => `<option value="${t.typeId}">${escapeHtml(t.typeName)}</option>`)
  );
  const productOptions = ['<option value="">Select product</option>'].concat(
    dataStore.products.map((p) => `<option value="${p.productId}">${escapeHtml(p.productName)}</option>`)
  );
  const unitOptions = ['<option value="">Select unit</option>'].concat(
    dataStore.units.map((u) => `<option value="${u.unitId}">${escapeHtml(u.unitName)} (${escapeHtml(u.abbreviation)})</option>`)
  );

  const rows = dataStore.products.map((p) => `<tr><td>${escapeHtml(p.productName)}</td><td>${escapeHtml(p.typeName || "-")}</td><td>${Array.isArray(p.variants) ? p.variants.length : 0}</td></tr>`).join("");

  return `
    <div class="page-grid">
      <div class="card">
        <h3>Add Product</h3>
        <form id="product-form" class="form-grid">
          <div><label class="label">Product Name</label><input class="input" name="productName" required /></div>
          <div><label class="label">Type</label><select class="select" name="typeId" required>${typeOptions.join("")}</select></div>
          <div style="grid-column:1/-1"><label class="label">Description</label><input class="input" name="description" /></div>
          <div style="grid-column:1/-1"><button class="btn btn-primary" type="submit">Save Product</button></div>
        </form>
      </div>

      <div class="card">
        <h3>Add Product Variant</h3>
        <form id="variant-form" class="form-grid">
          <div><label class="label">Product</label><select class="select" name="productId" required>${productOptions.join("")}</select></div>
          <div><label class="label">Unit</label><select class="select" name="unitId" required>${unitOptions.join("")}</select></div>
          <div><label class="label">Variant Label</label><input class="input" name="variantLabel" required /></div>
          <div><label class="label">Pack Size</label><input class="input" name="packSize" type="number" step="0.001" required /></div>
          <div><label class="label">Pieces Per Pack</label><input class="input" name="piecesPerPack" type="number" min="1" required /></div>
          <div><label class="label">Barcode</label><input class="input" name="barcode" /></div>
          <div style="grid-column:1/-1"><button class="btn btn-primary" type="submit">Save Variant</button></div>
        </form>
      </div>

      <div class="card">
        <h3>Product List</h3>
        <div class="table-wrap"><table class="table"><thead><tr><th>Product</th><th>Type</th><th>Variants</th></tr></thead><tbody>${rows || '<tr><td colspan="3" class="muted">No products found</td></tr>'}</tbody></table></div>
      </div>
    </div>
  `;
}

function renderTabContent() {
  if (activeTab === "sellers") return renderSellers();
  if (activeTab === "units") return renderUnits();
  if (activeTab === "types") return renderProductTypes();
  return renderProducts();
}

function renderMaintenancePage() {
  return `
    <div class="page-grid">
      <section class="card">
        <div class="section-title"><h2>Maintenance</h2><span class="muted">Manage master records</span></div>
        <div class="tab-row">
          ${tabButton("sellers", "Sellers")}
          ${tabButton("units", "Units")}
          ${tabButton("types", "Product Types")}
          ${tabButton("products", "Products & Variants")}
        </div>
      </section>
      <section id="maintenance-content">${renderTabContent()}</section>
    </div>
  `;
}

async function refreshData() {
  const [sellersRes, unitsRes, typesRes, productsRes] = await Promise.all([
    apiFetch(endpoints.sellersAll),
    apiFetch(endpoints.units),
    apiFetch(endpoints.productTypes),
    apiFetch(withQuery(endpoints.products, { includeVariants: true })),
  ]);
  dataStore.sellers = sellersRes.data || [];
  dataStore.units = unitsRes.data || [];
  dataStore.productTypes = typesRes.data || [];
  dataStore.products = productsRes.data || [];
}

function bindForms() {
  document.getElementById("seller-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fd = new FormData(event.target);
    await submitAndRefresh(endpoints.sellers, {
      name: fd.get("name"),
      contactPerson: fd.get("contactPerson"),
      phone: fd.get("phone"),
      email: fd.get("email"),
    }, "Seller saved");
  });

  document.getElementById("unit-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fd = new FormData(event.target);
    await submitAndRefresh(endpoints.units, {
      unitName: fd.get("unitName"),
      abbreviation: fd.get("abbreviation"),
      description: fd.get("description"),
    }, "Unit saved");
  });

  document.getElementById("ptype-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fd = new FormData(event.target);
    await submitAndRefresh(endpoints.productTypes, {
      typeName: fd.get("typeName"),
      description: fd.get("description"),
    }, "Product type saved");
  });

  document.getElementById("product-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fd = new FormData(event.target);
    await submitAndRefresh(endpoints.products, {
      productName: fd.get("productName"),
      typeId: Number(fd.get("typeId")),
      description: fd.get("description"),
    }, "Product saved");
  });

  document.getElementById("variant-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fd = new FormData(event.target);
    const productId = Number(fd.get("productId"));
    await submitAndRefresh(endpoints.addVariantToProduct(productId), {
      unitId: Number(fd.get("unitId")),
      variantLabel: fd.get("variantLabel"),
      packSize: Number(fd.get("packSize")),
      piecesPerPack: Number(fd.get("piecesPerPack")),
      barcode: fd.get("barcode") || null,
    }, "Variant saved");
  });
}

async function submitAndRefresh(path, payload, successMsg) {
  try {
    await apiFetch(path, { method: "POST", body: JSON.stringify(payload) });
    showToast(successMsg);
    await refreshData();
    rerender();
  } catch (err) {
    showToast(err.message || "Save failed", "error");
  }
}

function bindMaintenancePage() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeTab = btn.dataset.tab;
      rerender();
    });
  });
  bindForms();
}

function rerender() {
  const root = document.getElementById("route-root");
  root.innerHTML = renderMaintenancePage();
  bindMaintenancePage();
}

async function mountMaintenancePage() {
  try {
    await refreshData();
    rerender();
  } catch (err) {
    const root = document.getElementById("route-root");
    root.innerHTML = `<div class="card">Failed to load maintenance data: ${escapeHtml(err.message)}</div>`;
  }
}

export { mountMaintenancePage };
