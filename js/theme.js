/*
==========================================================
SafeIP
theme.js
Dark / Light Theme Manager
Version: 1.1.0
==========================================================
*/

import { STORAGE } from "./config.js";

const STORAGE_KEY = STORAGE.THEME;

export function initTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEY);

  if (savedTheme === "dark" || savedTheme === "light") {
    // User has an explicitly saved preference
    document.documentElement.setAttribute("data-theme", savedTheme);
  } else {
    // No saved preference → follow system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    const systemTheme = prefersDark ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", systemTheme);
  }

  updateIcon();
}

export function toggleTheme() {
  const current =
    document.documentElement.getAttribute("data-theme") || "light";

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
