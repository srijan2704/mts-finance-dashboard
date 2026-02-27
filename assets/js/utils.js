function formatDate(value) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

function monthStartAndEnd(today = new Date()) {
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

function eachDate(fromISO, toISO) {
  const out = [];
  const cursor = new Date(`${fromISO}T00:00:00`);
  const end = new Date(`${toISO}T00:00:00`);
  while (cursor <= end) {
    out.push(cursor.toISOString().slice(0, 10));
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

export { eachDate, escapeHtml, formatDate, monthStartAndEnd, statusBadge };
