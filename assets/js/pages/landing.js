import { apiFetch, withQuery } from "../api/client.js";
import { endpoints } from "../api/endpoints.js";
import { showToast } from "../components/toast.js";
import { escapeHtml, monthStartAndEnd, statusBadge } from "../utils.js";

let sellers = [];
let products = [];
let lineItems = [];
let orderHistory = [];
let monthlyTypeChart = null;
let activeSelectSearchModal = null;

const initialFormState = () => ({
  sellerId: "",
  orderDate: new Date().toISOString().slice(0, 10),
  invoiceNumber: "",
  remarks: "",
});

let formState = initialFormState();
let editState = null;
let postSubmitModalState = null;

/** Creates a new empty line item used by create/edit forms. */
function createEmptyLineItem() {
  return {
    productId: "",
    variantId: "",
    variants: [],
    unitName: "",
    quantity: "",
    ratePerUnit: "",
    lineTotal: "0.00",
  };
}

/** Loads seller and product masters once before rendering page. */
async function loadMasters() {
  const [sellerRes, productRes] = await Promise.all([
    apiFetch(endpoints.sellers),
    apiFetch(endpoints.products),
  ]);
  sellers = sellerRes.data || [];
  products = productRes.data || [];
}

/** Loads all orders for current month using one date-range API call. */
async function loadCurrentMonthHistory() {
  const month = monthStartAndEnd(new Date());
  const response = await apiFetch(withQuery(endpoints.purchaseOrders, {
    fromDate: month.start,
    toDate: month.end,
  }));
  orderHistory = response.data || [];

  // Extra safeguard sort in case backend sort changes in future.
  orderHistory.sort((a, b) => String(b.orderDate).localeCompare(String(a.orderDate)));
}

/** Recalculates the line total for one row based on quantity and rate. */
function recalcLine(item) {
  const q = Number(item.quantity || 0);
  const r = Number(item.ratePerUnit || 0);
  item.lineTotal = (q * r).toFixed(2);
}

/** Returns product select options for one row. */
function productOptions(item) {
  return ["<option value=\"\">Select product</option>"]
    .concat(
      products.map(
        (p) => `<option value="${p.productId}" ${String(item.productId) === String(p.productId) ? "selected" : ""}>${escapeHtml(p.productName)}</option>`,
      ),
    )
    .join("");
}

/** Returns variant select options for one row. */
function variantOptions(item) {
  return ["<option value=\"\">Select variant</option>"]
    .concat(
      (item.variants || []).map(
        (v) => `<option value="${v.variantId}" ${String(item.variantId) === String(v.variantId) ? "selected" : ""}>${escapeHtml(v.variantLabel)}</option>`,
      ),
    )
    .join("");
}

/** Builds one line item row HTML for create/edit forms. */
function buildLineItemRow(item, index) {
  return `
    <div class="item-row" data-index="${index}">
      <div class="form-grid">
        <div>
          <label class="label">Product</label>
          <select class="select item-product">${productOptions(item)}</select>
        </div>
        <div>
          <label class="label">Variant</label>
          <select class="select item-variant">${variantOptions(item)}</select>
        </div>
        <div>
          <label class="label">Unit (auto)</label>
          <input class="input item-unit" value="${escapeHtml(item.unitName || "")}" readonly />
        </div>
        <div>
          <label class="label">Quantity</label>
          <input class="input item-qty" type="number" step="0.001" min="0.001" value="${item.quantity || ""}" />
        </div>
        <div>
          <label class="label">Rate / Unit</label>
          <input class="input item-rate" type="number" step="0.01" min="0" value="${item.ratePerUnit || ""}" />
        </div>
        <div>
          <label class="label">Line Total</label>
          <input class="input item-line-total" value="${item.lineTotal || "0.00"}" readonly />
        </div>
        <div class="row" style="align-items:flex-end">
          <button class="btn btn-danger item-remove" type="button">Remove Line</button>
        </div>
      </div>
    </div>
  `;
}

/** Creates seller options for header forms. */
function sellerOptions(selectedSellerId) {
  return ["<option value=\"\">Select seller</option>"]
    .concat(
      sellers.map(
        (s) => `<option value="${s.sellerId}" ${String(selectedSellerId) === String(s.sellerId) ? "selected" : ""}>${escapeHtml(s.name)}</option>`,
      ),
    )
    .join("");
}

/** Renders purchase history table rows and actions. */
function renderHistoryRows() {
  if (!orderHistory.length) {
    return '<tr><td colspan="6" class="muted">No purchase orders found for current month.</td></tr>';
  }

  return orderHistory
    .map((order) => {
      const isDraft = String(order.status || "").toUpperCase() === "DRAFT";
      return `
      <tr>
        <td>${escapeHtml(order.orderDate)}</td>
        <td>${escapeHtml(order.sellerName)}</td>
        <td>${escapeHtml(order.totalAmount)}</td>
        <td>${statusBadge(order.status)}</td>
        <td>${Array.isArray(order.items) ? order.items.length : "-"}</td>
        <td>
          <div class="row history-actions">
            ${isDraft ? `<button class="btn btn-info action-edit" data-id="${order.orderId}" type="button">Edit</button>` : ""}
            ${isDraft ? `<button class="btn btn-secondary action-confirm" data-id="${order.orderId}" type="button">Confirm</button>` : ""}
            ${isDraft ? `<button class="btn btn-danger action-delete" data-id="${order.orderId}" type="button">Delete</button>` : ""}
          </div>
        </td>
      </tr>
    `;
    })
    .join("");
}

/** Renders edit modal. */
function renderEditModal() {
  if (!editState) return "";

  return `
    <div class="modal-backdrop" id="edit-order-modal">
      <div class="modal-card">
        <div class="section-title">
          <h3>Edit Draft #${escapeHtml(editState.orderId)}</h3>
          <button class="btn btn-secondary" id="edit-close" type="button">Close</button>
        </div>

        <form id="edit-po-form" class="page-grid">
          <div class="form-grid">
            <div>
              <label class="label">Seller</label>
              <select class="select" id="edit-po-seller" required>${sellerOptions(editState.sellerId)}</select>
            </div>
            <div>
              <label class="label">Order Date</label>
              <input class="input" id="edit-po-date" type="date" value="${escapeHtml(editState.orderDate || "")}" required />
            </div>
            <div>
              <label class="label">Invoice Number</label>
              <input class="input" id="edit-po-invoice" maxlength="100" value="${escapeHtml(editState.invoiceNumber || "")}" />
            </div>
            <div>
              <label class="label">Remarks</label>
              <input class="input" id="edit-po-remarks" maxlength="4000" value="${escapeHtml(editState.remarks || "")}" />
            </div>
          </div>

          <div class="section-title">
            <h3>Items</h3>
            <button class="btn btn-secondary" id="edit-add-line-item" type="button">Add Item</button>
          </div>

          <div id="edit-line-items-wrap">${editState.lineItems.map((item, idx) => buildLineItemRow(item, idx)).join("")}</div>

          <div class="row">
            <button class="btn btn-secondary" id="edit-save-draft" type="button">Save Draft</button>
            <button class="btn btn-primary" id="edit-save-confirm" type="button">Save & Confirm</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

/** Renders post-submit confirmation modal for newly created drafts. */
function renderPostSubmitModal() {
  if (!postSubmitModalState) return "";

  const orderId = Number(postSubmitModalState.orderId);
  const loading = postSubmitModalState.loading === true;

  return `
    <div class="modal-backdrop" id="post-submit-modal">
      <div class="modal-card submit-confirm-modal-card" role="dialog" aria-modal="true" aria-labelledby="post-submit-title">
        <div class="section-title">
          <h3 id="post-submit-title">Draft #${escapeHtml(orderId)} created</h3>
          <button class="btn btn-secondary" id="post-submit-close" type="button" ${loading ? "disabled" : ""}>Close</button>
        </div>
        <p class="muted submit-confirm-note">Do you want to confirm this purchase order now?</p>
        <div class="row submit-confirm-actions">
          <button class="btn btn-secondary" id="post-submit-keep" type="button" ${loading ? "disabled" : ""}>Keep as Draft</button>
          <button class="btn btn-primary" id="post-submit-confirm" type="button" ${loading ? "disabled" : ""}>
            ${loading ? "Confirming..." : "Confirm Now"}
          </button>
        </div>
      </div>
    </div>
  `;
}

/** Renders full landing page content. */
function renderLandingPage() {
  return `
    <div class="page-grid">
      <section class="landing-top-grid">
        <div class="card">
          <div class="section-title">
            <h2>Current Month Split By Product Type</h2>
          </div>
          <p class="muted">Total purchase value distribution across product types.</p>
          <div class="pie-summary-layout">
            <div class="chart-box chart-box-compact">
              <canvas id="chart-monthly-type-split"></canvas>
            </div>
            <div class="pie-total-panel">
              <span class="muted">Total Purchase Value</span>
              <strong id="monthly-type-total-value">0.00</strong>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="section-title">
            <h2>Create Purchase Order</h2>
            <button class="btn btn-secondary" id="add-line-item" type="button">Add Item</button>
          </div>
          <form id="po-form" class="page-grid">
            <div class="form-grid">
              <div>
                <label class="label">Seller</label>
                <select class="select" id="po-seller" required>${sellerOptions(formState.sellerId)}</select>
              </div>
              <div>
                <label class="label">Order Date</label>
                <input class="input" id="po-date" type="date" value="${escapeHtml(formState.orderDate)}" required />
              </div>
              <div>
                <label class="label">Invoice Number</label>
                <input class="input" id="po-invoice" maxlength="100" value="${escapeHtml(formState.invoiceNumber)}" />
              </div>
              <div>
                <label class="label">Remarks</label>
                <input class="input" id="po-remarks" maxlength="4000" value="${escapeHtml(formState.remarks)}" />
              </div>
            </div>

            <div id="line-items-wrap">${lineItems.map((item, idx) => buildLineItemRow(item, idx)).join("")}</div>

            <div class="row">
              <button class="btn btn-primary" type="submit">Save Draft</button>
            </div>
          </form>
        </div>
      </section>

      <section class="card">
        <div class="section-title">
          <h2>Current Month Purchase History</h2>
          <span class="muted">All orders (green confirmed, yellow draft)</span>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Seller</th>
                <th>Total</th>
                <th>Status</th>
                <th>Items</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="history-body">${renderHistoryRows()}</tbody>
          </table>
        </div>
      </section>
    </div>
    <div id="modal-host">${renderEditModal()}${renderPostSubmitModal()}</div>
  `;
}

/** Returns month-level product type totals built from CONFIRMED orders only. */
function getMonthlyProductTypeTotals() {
  const typeByProductName = new Map(
    (products || []).map((p) => [String(p.productName || "").trim().toLowerCase(), p.typeName || "Others"]),
  );
  const totalsByType = new Map();

  (orderHistory || []).forEach((order) => {
    // Only count confirmed orders — drafts are not yet committed purchases.
    if (String(order.status || "").toUpperCase() !== "CONFIRMED") return;

    (order.items || []).forEach((item) => {
      const productKey = String(item.productName || "").trim().toLowerCase();
      const typeName = typeByProductName.get(productKey) || "Others";
      const lineValue = Number(item.lineTotal || 0);
      if (!Number.isFinite(lineValue) || lineValue <= 0) return;
      totalsByType.set(typeName, (totalsByType.get(typeName) || 0) + lineValue);
    });
  });

  return [...totalsByType.entries()]
    .map(([typeName, totalValue]) => ({ typeName, totalValue }))
    .sort((a, b) => b.totalValue - a.totalValue);
}

/** Renders current-month purchase split pie chart by product type. */
function renderMonthlyTypeSplitChart() {
  const canvas = document.getElementById("chart-monthly-type-split");
  if (!canvas || typeof Chart === "undefined") return;

  const points = getMonthlyProductTypeTotals();
  const labels = points.map((x) => x.typeName);
  const values = points.map((x) => Number(x.totalValue.toFixed(2)));

  const palette = [
    "#0e67d0",
    "#29a36a",
    "#d18b0e",
    "#8a5bd6",
    "#ca4f87",
    "#00a3a3",
    "#6c7a89",
  ];
  const totalValue = values.reduce((sum, val) => sum + Number(val || 0), 0);
  const formattedTotal = totalValue.toFixed(2);
  const totalLabel = document.getElementById("monthly-type-total-value");
  if (totalLabel) totalLabel.textContent = formattedTotal;

  if (monthlyTypeChart) monthlyTypeChart.destroy();
  monthlyTypeChart = new Chart(canvas, {
    type: "pie",
    data: {
      labels: labels.length ? labels : ["No Data"],
      datasets: [{
        data: values.length ? values : [1],
        backgroundColor: labels.length ? labels.map((_, idx) => palette[idx % palette.length]) : ["#d9e2ef"],
        borderColor: "#ffffff",
        borderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { boxWidth: 14 },
        },
        tooltip: {
          callbacks: {
            label(context) {
              if (!values.length) return "No current month purchases";
              const value = Number(context.raw || 0);
              const total = values.reduce((sum, val) => sum + val, 0);
              const pct = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
              return `${context.label}: ${value.toFixed(2)} (${pct}%)`;
            },
          },
        },
      },
    },
  });
}

/** Updates main form state from DOM fields. */
function syncMainFormState() {
  formState.sellerId = document.getElementById("po-seller")?.value || "";
  formState.orderDate = document.getElementById("po-date")?.value || "";
  formState.invoiceNumber = document.getElementById("po-invoice")?.value || "";
  formState.remarks = document.getElementById("po-remarks")?.value || "";
}

/** Normalizes option text for case-insensitive dropdown filtering. */
function normalizeSearchText(value) {
  return String(value || "").trim().toLowerCase();
}

/** Closes searchable dropdown modal used by create-order selects. */
function closeSelectSearchModal() {
  if (!activeSelectSearchModal) return;
  activeSelectSearchModal.remove();
  activeSelectSearchModal = null;
}

/** Opens centered searchable dropdown modal for one select control. */
function openSelectSearchModal(select) {
  if (!select) return;
  closeSelectSearchModal();

  const label = select.closest("div")?.querySelector(".label")?.textContent?.trim() || "Value";
  const optionData = Array.from(select.options)
    .filter((option) => !option.disabled)
    .map((option) => ({
      value: String(option.value || ""),
      label: String(option.textContent || "").trim(),
    }));

  const selectedValue = String(select.value || "");
  const modal = document.createElement("div");
  modal.id = "select-search-modal";
  modal.className = "modal-backdrop";
  modal.innerHTML = `
    <div class="modal-card select-search-modal-card" role="dialog" aria-modal="true" aria-label="${escapeHtml(label)} options">
      <div class="section-title">
        <h3>${escapeHtml(label)}</h3>
        <button class="btn btn-secondary select-search-close" type="button">Close</button>
      </div>
      <input class="input select-search-modal-input" type="text" placeholder="Search ${escapeHtml(label.toLowerCase())}" autocomplete="off" />
      <div class="select-search-list"></div>
    </div>
  `;

  const modalHost = document.getElementById("modal-host") || document.body;
  modalHost.append(modal);
  activeSelectSearchModal = modal;

  const searchInput = modal.querySelector(".select-search-modal-input");
  const listWrap = modal.querySelector(".select-search-list");

  function renderOptions(rawQuery) {
    if (!listWrap) return;
    const query = normalizeSearchText(rawQuery);
    const filtered = optionData.filter((item) => normalizeSearchText(item.label).includes(query));

    if (!filtered.length) {
      listWrap.innerHTML = '<p class="muted" style="padding:10px 12px;margin:0">No matching items found.</p>';
      return;
    }

    listWrap.innerHTML = filtered
      .map((item) => `
        <button class="select-search-option ${item.value === selectedValue ? "active" : ""}" type="button" data-value="${escapeHtml(item.value)}">
          ${escapeHtml(item.label)}
        </button>
      `)
      .join("");
  }

  renderOptions("");
  requestAnimationFrame(() => searchInput?.focus());

  searchInput?.addEventListener("input", (event) => {
    renderOptions(event.target.value || "");
  });

  searchInput?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    const firstOption = modal.querySelector(".select-search-option");
    if (!firstOption) return;
    event.preventDefault();
    firstOption.click();
  });

  listWrap?.addEventListener("click", (event) => {
    const optionBtn = event.target.closest(".select-search-option");
    if (!optionBtn) return;
    const selectedOptionValue = optionBtn.dataset.value || "";
    if (String(select.value || "") !== selectedOptionValue) {
      select.value = selectedOptionValue;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }
    closeSelectSearchModal();
    select.focus();
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target.closest(".select-search-close")) {
      closeSelectSearchModal();
      select.focus();
    }
  });
}

/** Binds searchable modal behavior to one select control. */
function bindSearchableDropdown(select) {
  if (!select || select.dataset.searchableDropdownBound === "true") return;
  select.dataset.searchableDropdownBound = "true";

  const open = (event) => {
    event.preventDefault();
    openSelectSearchModal(select);
  };

  select.addEventListener("mousedown", open);
  select.addEventListener("touchstart", open, { passive: false });
  select.addEventListener("keydown", (event) => {
    if (!["Enter", " ", "ArrowDown", "ArrowUp"].includes(event.key)) return;
    event.preventDefault();
    openSelectSearchModal(select);
  });
}

/** Binds searchable dropdown modal for create-order form controls. */
function bindCreateOrderDropdownSearch() {
  bindSearchableDropdown(document.getElementById("po-seller"));
  document.querySelectorAll("#line-items-wrap .item-product, #line-items-wrap .item-variant")
    .forEach((select) => bindSearchableDropdown(select));
}

/** Handles product selection and loads variants for that product. */
async function onProductChange(items, index, productId) {
  if (!productId) {
    items[index].productId = "";
    items[index].variantId = "";
    items[index].variants = [];
    items[index].unitName = "";
    return;
  }

  items[index].productId = productId;
  items[index].variantId = "";
  items[index].unitName = "";
  const response = await apiFetch(endpoints.productVariantsByProduct(productId));
  items[index].variants = response.data || [];
}

/** Handles variant selection and auto-fills unit name. */
function onVariantChange(items, index, variantId) {
  items[index].variantId = variantId;
  const variant = (items[index].variants || []).find((v) => String(v.variantId) === String(variantId));
  items[index].unitName = variant ? `${variant.unitName || ""}` : "";
}

/** Re-renders only one line-item wrapper to avoid full-page redraws. */
function redrawLineItems(wrapId, items) {
  const wrap = document.getElementById(wrapId);
  if (!wrap) return;
  wrap.innerHTML = items.map((item, idx) => buildLineItemRow(item, idx)).join("");
  bindCreateOrderDropdownSearch();
}

/** Creates purchase/update payload from form state + selected line items. */
function buildOrderPayload(state, items) {
  return {
    sellerId: Number(state.sellerId),
    orderDate: state.orderDate,
    invoiceNumber: state.invoiceNumber || null,
    remarks: state.remarks || null,
    items: items
      .filter((x) => x.variantId && x.quantity && x.ratePerUnit)
      .map((x) => ({
        variantId: Number(x.variantId),
        quantity: Number(x.quantity),
        ratePerUnit: Number(x.ratePerUnit),
      })),
  };
}

/** Validates minimum required purchase order fields. */
function validatePayload(payload) {
  if (!payload.sellerId || !payload.orderDate || !payload.items.length) {
    showToast("Please provide seller, date, and at least one valid item.", "error");
    return false;
  }
  return true;
}

/** Handles create order submission from top form. */
async function submitPurchaseOrder(event) {
  event.preventDefault();
  syncMainFormState();

  const payload = buildOrderPayload(formState, lineItems);
  if (!validatePayload(payload)) return;

  try {
    const response = await apiFetch(endpoints.purchaseOrders, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const created = response.data;
    showToast(`Purchase order ${created.orderId} saved as draft`);
    postSubmitModalState = {
      orderId: Number(created.orderId),
      loading: false,
    };
    lineItems = [createEmptyLineItem()];
    formState = initialFormState();
    await loadCurrentMonthHistory();
    rerender();
  } catch (err) {
    showToast(err.message || "Failed to save purchase order", "error");
  }
}

/** Closes post-submit modal and keeps created order as draft. */
function closePostSubmitModal() {
  if (!postSubmitModalState) return;
  postSubmitModalState = null;
  rerender();
}

/** Confirms the newly created draft order from post-submit modal. */
async function confirmCreatedDraftFromModal() {
  if (!postSubmitModalState || postSubmitModalState.loading) {
    return;
  }

  const orderId = Number(postSubmitModalState.orderId);
  postSubmitModalState = {
    ...postSubmitModalState,
    loading: true,
  };
  rerender();

  try {
    await apiFetch(endpoints.confirmPurchaseOrder(orderId), { method: "PATCH" });
    showToast("Purchase order confirmed");
    postSubmitModalState = null;
    await loadCurrentMonthHistory();
    rerender();
  } catch (err) {
    postSubmitModalState = {
      ...postSubmitModalState,
      loading: false,
    };
    rerender();
    showToast(err.message || "Failed to confirm purchase order", "error");
  }
}

/** Handles confirm/delete/edit actions in history table. */
async function handleHistoryAction(event) {
  const confirmBtn = event.target.closest(".action-confirm");
  const deleteBtn = event.target.closest(".action-delete");
  const editBtn = event.target.closest(".action-edit");
  if (!confirmBtn && !deleteBtn && !editBtn) return;

  const id = Number((confirmBtn || deleteBtn || editBtn).dataset.id);
  try {
    if (editBtn) {
      await openEditModal(id);
      return;
    }

    if (confirmBtn) {
      await apiFetch(endpoints.confirmPurchaseOrder(id), { method: "PATCH" });
      showToast("Order confirmed");
    }

    if (deleteBtn) {
      if (!window.confirm("Delete this draft order?")) return;
      await apiFetch(endpoints.purchaseOrderById(id), { method: "DELETE" });
      showToast("Draft order deleted");
    }

    await loadCurrentMonthHistory();
    redrawHistory();
  } catch (err) {
    showToast(err.message || "Action failed", "error");
  }
}

/** Draws only history table body when data changes. */
function redrawHistory() {
  const body = document.getElementById("history-body");
  if (!body) return;
  body.innerHTML = renderHistoryRows();
  renderMonthlyTypeSplitChart();
}

/** Builds edit modal state from order details and variant-product mapping. */
async function buildEditState(orderId) {
  const orderRes = await apiFetch(endpoints.purchaseOrderById(orderId));
  const order = orderRes.data;
  const variantCache = new Map();
  const productVariantCache = new Map();

  async function getVariantById(variantId) {
    if (!variantCache.has(variantId)) {
      variantCache.set(variantId, apiFetch(endpoints.variantById(variantId)).then((x) => x.data));
    }
    return variantCache.get(variantId);
  }

  async function getVariantsByProduct(productId) {
    if (!productVariantCache.has(productId)) {
      productVariantCache.set(productId, apiFetch(endpoints.productVariantsByProduct(productId)).then((x) => x.data || []));
    }
    return productVariantCache.get(productId);
  }

  const mappedItems = await Promise.all(
    (order.items || []).map(async (item) => {
      const variant = await getVariantById(item.variantId);
      const variants = await getVariantsByProduct(variant.productId);
      return {
        productId: String(variant.productId),
        variantId: String(item.variantId),
        variants,
        unitName: variant.unitName || item.unitAbbr || "",
        quantity: item.quantity,
        ratePerUnit: item.ratePerUnit,
        lineTotal: item.lineTotal || "0.00",
      };
    }),
  );

  return {
    orderId,
    sellerId: String(order.sellerId || ""),
    orderDate: String(order.orderDate || ""),
    invoiceNumber: order.invoiceNumber || "",
    remarks: order.remarks || "",
    lineItems: mappedItems.length ? mappedItems : [createEmptyLineItem()],
  };
}

/** Opens modal with editable draft purchase order fields. */
async function openEditModal(orderId) {
  editState = await buildEditState(orderId);
  const host = document.getElementById("modal-host");
  if (!host) return;
  host.innerHTML = renderEditModal();
  bindEditModalEvents();
}

/** Closes and clears the draft edit modal. */
function closeEditModal() {
  editState = null;
  const host = document.getElementById("modal-host");
  if (host) host.innerHTML = "";
}

/** Saves edited order as draft or confirms in one flow. */
async function saveEditedOrder(confirmAfterSave) {
  if (!editState) return;

  editState.sellerId = document.getElementById("edit-po-seller")?.value || "";
  editState.orderDate = document.getElementById("edit-po-date")?.value || "";
  editState.invoiceNumber = document.getElementById("edit-po-invoice")?.value || "";
  editState.remarks = document.getElementById("edit-po-remarks")?.value || "";

  const payload = buildOrderPayload(editState, editState.lineItems);
  if (!validatePayload(payload)) return;

  try {
    await apiFetch(endpoints.purchaseOrderById(editState.orderId), {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    if (confirmAfterSave) {
      await apiFetch(endpoints.confirmPurchaseOrder(editState.orderId), { method: "PATCH" });
      showToast("Draft saved and confirmed");
    } else {
      showToast("Draft order updated");
    }

    closeEditModal();
    await loadCurrentMonthHistory();
    redrawHistory();
  } catch (err) {
    showToast(err.message || "Failed to update draft", "error");
  }
}

/** Binds delegated events for line item block without resetting focus. */
function bindLineItemEvents(wrapId, items, onStructureChange) {
  const wrap = document.getElementById(wrapId);
  if (!wrap) return;

  wrap.addEventListener("change", async (event) => {
    const row = event.target.closest(".item-row");
    if (!row) return;
    const index = Number(row.dataset.index);

    if (event.target.classList.contains("item-product")) {
      await onProductChange(items, index, event.target.value);
      onStructureChange();
      return;
    }

    if (event.target.classList.contains("item-variant")) {
      onVariantChange(items, index, event.target.value);
      const unitInput = row.querySelector(".item-unit");
      if (unitInput) unitInput.value = items[index].unitName || "";
    }
  });

  wrap.addEventListener("input", (event) => {
    const row = event.target.closest(".item-row");
    if (!row) return;
    const index = Number(row.dataset.index);

    if (event.target.classList.contains("item-qty")) {
      items[index].quantity = event.target.value;
      recalcLine(items[index]);
      const totalInput = row.querySelector(".item-line-total");
      if (totalInput) totalInput.value = items[index].lineTotal;
      return;
    }

    if (event.target.classList.contains("item-rate")) {
      items[index].ratePerUnit = event.target.value;
      recalcLine(items[index]);
      const totalInput = row.querySelector(".item-line-total");
      if (totalInput) totalInput.value = items[index].lineTotal;
    }
  });

  wrap.addEventListener("click", (event) => {
    const removeBtn = event.target.closest(".item-remove");
    if (!removeBtn) return;

    const row = event.target.closest(".item-row");
    const index = Number(row.dataset.index);
    items.splice(index, 1);
    if (!items.length) items.push(createEmptyLineItem());
    onStructureChange();
  });
}

/** Binds events for edit modal controls and line items. */
function bindEditModalEvents() {
  if (!editState) return;

  document.getElementById("edit-close")?.addEventListener("click", closeEditModal);
  document.getElementById("edit-add-line-item")?.addEventListener("click", () => {
    editState.lineItems.push(createEmptyLineItem());
    redrawLineItems("edit-line-items-wrap", editState.lineItems);
  });
  document.getElementById("edit-save-draft")?.addEventListener("click", () => saveEditedOrder(false));
  document.getElementById("edit-save-confirm")?.addEventListener("click", () => saveEditedOrder(true));

  bindLineItemEvents("edit-line-items-wrap", editState.lineItems, () => {
    redrawLineItems("edit-line-items-wrap", editState.lineItems);
  });
}

/** Binds post-submit modal actions. */
function bindPostSubmitModalEvents() {
  document.getElementById("post-submit-close")?.addEventListener("click", closePostSubmitModal);
  document.getElementById("post-submit-keep")?.addEventListener("click", closePostSubmitModal);
  document.getElementById("post-submit-confirm")?.addEventListener("click", confirmCreatedDraftFromModal);

  document.getElementById("post-submit-modal")?.addEventListener("click", (event) => {
    if (event.target.id === "post-submit-modal" && !postSubmitModalState?.loading) {
      closePostSubmitModal();
    }
  });
}

/** Handles Escape key for active dashboard modals. */
function handleLandingModalEscape(event) {
  if (event.key !== "Escape") return;

  if (activeSelectSearchModal) {
    closeSelectSearchModal();
    return;
  }

  if (postSubmitModalState && !postSubmitModalState.loading) {
    closePostSubmitModal();
    return;
  }

  if (editState) {
    closeEditModal();
  }
}

/** Binds all create-form + history interactions for landing page. */
function bindLandingPage() {
  document.getElementById("add-line-item")?.addEventListener("click", () => {
    lineItems.push(createEmptyLineItem());
    redrawLineItems("line-items-wrap", lineItems);
  });

  document.getElementById("po-seller")?.addEventListener("change", syncMainFormState);
  document.getElementById("po-date")?.addEventListener("change", syncMainFormState);
  document.getElementById("po-invoice")?.addEventListener("input", syncMainFormState);
  document.getElementById("po-remarks")?.addEventListener("input", syncMainFormState);

  document.getElementById("po-form")?.addEventListener("submit", submitPurchaseOrder);
  document.getElementById("history-body")?.addEventListener("click", handleHistoryAction);

  bindLineItemEvents("line-items-wrap", lineItems, () => {
    redrawLineItems("line-items-wrap", lineItems);
  });
  bindCreateOrderDropdownSearch();

  bindEditModalEvents();
  bindPostSubmitModalEvents();
  document.removeEventListener("keydown", handleLandingModalEscape);
  document.addEventListener("keydown", handleLandingModalEscape);
}

/** Full rerender for initial mount and full data refresh cases. */
function rerender() {
  closeSelectSearchModal();
  const root = document.getElementById("route-root");
  root.innerHTML = renderLandingPage();
  bindLandingPage();
  renderMonthlyTypeSplitChart();
}

/** Mounts landing page and preloads all required master/history data. */
async function mountLandingPage() {
  if (!lineItems.length) lineItems.push(createEmptyLineItem());

  try {
    await Promise.all([loadMasters(), loadCurrentMonthHistory()]);
    rerender();
  } catch (err) {
    const root = document.getElementById("route-root");
    root.innerHTML = `<div class="card">Failed to load landing page data: ${escapeHtml(err.message)}</div>`;
  }
}

export { mountLandingPage };
