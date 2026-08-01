/*
==========================================================
SafeIP
theme.js
Dark / Light Theme Manager
Version: 1.0.0
==========================================================
*/

const STORAGE_KEY = "safeip-theme";

export function initTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEY);

  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  }

  updateIcon();
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");

  const next = current === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", next);

  localStorage.setItem(STORAGE_KEY, next);

  updateIcon();
}

function updateIcon() {
  const button = document.getElementById("themeToggle");

  if (!button) return;

  const theme = document.documentElement.getAttribute("data-theme") || "light";

  button.textContent = theme === "dark" ? "☀️" : "🌙";
}
