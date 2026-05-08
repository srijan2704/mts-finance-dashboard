/**
 * Formats a Date as "YYYY-MM-DD" using the browser's LOCAL timezone.
 * Never use .toISOString() for date-only strings: it converts to UTC first,
 * which shifts midnight IST (UTC+5:30) back to the previous calendar day.
 */
function localDateISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

function monthStartAndEnd(today = new Date()) {
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  const end   = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return {
    start: localDateISO(start),
    end:   localDateISO(end),
  };
}

function eachDate(fromISO, toISO) {
  const out = [];
  const cursor = new Date(`${fromISO}T00:00:00`);
  const end    = new Date(`${toISO}T00:00:00`);
  while (cursor <= end) {
    out.push(localDateISO(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return out;
}

function statusBadge(status) {
  const s = (status || "").toUpperCase();
  if (s === "CONFIRMED") {
    return '<span class="badge badge-confirmed">CONFIRMED</span>';
  }
  return '<span class="badge badge-draft">DRAFT</span>';
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export { eachDate, escapeHtml, formatDate, localDateISO, monthStartAndEnd, statusBadge };
