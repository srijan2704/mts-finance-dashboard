function showToast(message, type = "success") {
  const root = document.getElementById("toast-root");
  if (!root) return;

  const el = document.createElement("div");
  el.className = `toast ${type === "error" ? "toast-error" : "toast-success"}`;
  el.textContent = message;
  root.appendChild(el);

  setTimeout(() => {
    el.remove();
  }, 3200);
}

export { showToast };
