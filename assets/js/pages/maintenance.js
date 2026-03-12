import { apiFetch, withQuery } from "../api/client.js";
import { endpoints } from "../api/endpoints.js";
import { showToast } from "../components/toast.js";
import { escapeHtml } from "../utils.js";

let activeTab = "sellers";
let variantsModalState = null;
const dataStore = {
  sellers: [],
  units: [],
  productTypes: [],
  products: [],
};

function tabButton(id, label) {
  return `<button class="tab-btn ${activeTab === id ? "active" : ""}" data-tab="${id}" type="button">${label}</button>`;
}

function getVariantCount(product) {
  return Array.isArray(product?.variants) ? product.variants.length : 0;
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

  const rows = dataStore.products.map((p) => `
    <tr>
      <td>${escapeHtml(p.productName)}</td>
      <td>${escapeHtml(p.typeName || "-")}</td>
      <td>
        <button
          class="product-variants-trigger"
          type="button"
          data-product-id="${p.productId}"
          aria-label="View variants for ${escapeHtml(p.productName)}"
        >${getVariantCount(p)}</button>
      </td>
    </tr>
  `).join("");

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

function renderVariantsModal() {
  if (!variantsModalState) {
    return "";
  }

  const title = escapeHtml(variantsModalState.productName || "Product");
  const loading = variantsModalState.loading === true;
  const error = variantsModalState.error ? escapeHtml(variantsModalState.error) : "";
  const variants = Array.isArray(variantsModalState.variants) ? variantsModalState.variants : [];

  const body = (() => {
    if (loading) {
      return '<div class="muted">Loading variants...</div>';
    }

    if (error) {
      return `<div class="muted">Failed to load variants: ${error}</div>`;
    }

    if (!variants.length) {
      return '<div class="muted">No active variants found for this product.</div>';
    }

    const rows = variants.map((v) => `
      <tr>
        <td>${escapeHtml(v.variantLabel)}</td>
        <td>${escapeHtml(v.unitName || "-")}</td>
        <td>${escapeHtml(v.packSize ?? "-")}</td>
        <td>${escapeHtml(v.piecesPerPack ?? "-")}</td>
        <td>${escapeHtml(v.barcode || "-")}</td>
      </tr>
    `).join("");

    return `
      <div class="table-wrap">
        <table class="table variant-modal-table">
          <thead>
            <tr>
              <th>Variant</th>
              <th>Unit</th>
              <th>Pack Size</th>
              <th>Pieces/Pack</th>
              <th>Barcode</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  })();

  return `
    <div class="modal-backdrop" id="product-variants-modal">
      <div class="modal-card variant-modal-card" role="dialog" aria-modal="true" aria-labelledby="product-variants-modal-title">
        <div class="section-title">
          <h3 id="product-variants-modal-title">Variants: ${title}</h3>
          <button class="btn btn-secondary" id="product-variants-modal-close" type="button">Close</button>
        </div>
        ${body}
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
    <div id="maintenance-modal-host">${renderVariantsModal()}</div>
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

async function openVariantsModal(productId) {
  const product = dataStore.products.find((p) => Number(p.productId) === Number(productId));
  if (!product) {
    showToast("Product not found", "error");
    return;
  }

  variantsModalState = {
    productId: Number(product.productId),
    productName: product.productName,
    loading: true,
    error: "",
    variants: [],
  };
  rerender();

  try {
    const response = await apiFetch(endpoints.productVariantsByProduct(product.productId));
    if (!variantsModalState || variantsModalState.productId !== Number(product.productId)) {
      return;
    }
    variantsModalState = {
      ...variantsModalState,
      loading: false,
      variants: response.data || [],
    };
  } catch (err) {
    if (!variantsModalState || variantsModalState.productId !== Number(product.productId)) {
      return;
    }
    variantsModalState = {
      ...variantsModalState,
      loading: false,
      error: err.message || "Unable to fetch variants",
      variants: [],
    };
  }

  rerender();
}

function closeVariantsModal() {
  if (!variantsModalState) {
    return;
  }
  variantsModalState = null;
  rerender();
}

function handleMaintenanceEscape(event) {
  if (event.key === "Escape" && variantsModalState) {
    closeVariantsModal();
  }
}

function bindVariantModal() {
  document.querySelectorAll(".product-variants-trigger").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = Number(btn.dataset.productId);
      if (Number.isFinite(productId)) {
        openVariantsModal(productId);
      }
    });
  });

  document.getElementById("product-variants-modal-close")?.addEventListener("click", closeVariantsModal);
  document.getElementById("product-variants-modal")?.addEventListener("click", (event) => {
    if (event.target.id === "product-variants-modal") {
      closeVariantsModal();
    }
  });
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
      variantsModalState = null;
      rerender();
    });
  });
  bindForms();
  bindVariantModal();
  document.removeEventListener("keydown", handleMaintenanceEscape);
  document.addEventListener("keydown", handleMaintenanceEscape);
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
