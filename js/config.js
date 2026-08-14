/*
==========================================================
SafeIP
config.js
Application Configuration
Version: 1.2.0
==========================================================
*/

/* ==========================================================
   Application
========================================================== */

export const APP = Object.freeze({
  NAME: "SafeIP",

  VERSION: "1.4.0",

  DEFAULT_COUNTRY: "IR",
});

/* ==========================================================
   API Configuration
========================================================== */

export const API = Object.freeze({
  PRIMARY_URL: "https://ipwho.is/",

  FALLBACK_URL: "https://ipapi.is/",

  TIMEOUT: 8000,

  CACHE: "no-store",
});

/* ==========================================================
   Quick Links
========================================================== */

export const QUICK_LINKS = Object.freeze({
  MAX_TITLE_LENGTH: 14,

  MAX_URL_LENGTH: 200,

  DEFAULT_PROTOCOL: "https://",

  COLORS: [
    "#2563eb",
    "#16a34a",
    "#dc2626",
    "#7c3aed",
    "#ea580c",
    "#0891b2",
    "#e11d48",
    "#475569",
    "#0f766e",
    "#65a30d",
    "#ca8a04",
    "#9333ea",
    "#c026d3",
    "#db2777",
    "#0284c7",
    "#4f46e5",
    "#059669",
    "#b91c1c",
    "#854d0e",
    "#334155",
  ],
});

/* ==========================================================
   Local Storage Keys
========================================================== */

export const STORAGE = Object.freeze({
  COUNTRY: "safeip.selectedCountry",

  LAST_CHECK: "safeip.lastCheck",

  AUTO_REFRESH: "safeip.autoRefresh",

  QUICK_LINKS: "safeip.quickLinks",

  THEME: "safeip-theme",
});

/* ==========================================================
   Security Levels
========================================================== */

export const SECURITY_LEVEL = Object.freeze({
  SAFE: "SAFE",

  WARNING: "WARNING",

  DANGER: "DANGER",
});

/* ==========================================================
   Security Score
========================================================== */

export const SCORE = Object.freeze({
  SAFE: 100,

  WARNING: 50,

  DANGER: 0,
});

/* ==========================================================
   UI Defaults
========================================================== */

export const UI = Object.freeze({
  LOADING_TEXT: "Checking your network...",

  EMPTY_TEXT: "Please select a country.",

  ERROR_TEXT: "Unable to retrieve network information.",

  DEFAULT_IP: "Loading...",

  DEFAULT_COUNTRY: "Loading...",

  DEFAULT_COUNTRY_CODE: "--",

  DEFAULT_REGION: "Loading...",

  DEFAULT_CITY: "Loading...",

  DEFAULT_TIMEZONE: "Loading...",

  DEFAULT_ISP: "Loading...",

  DEFAULT_LAST_CHECK: "Never",

  UNAVAILABLE_COUNTRY: "Unavailable",

  UNAVAILABLE_COUNTRY_CODE: "--",

  UNAVAILABLE_REGION: "Unavailable",

  UNAVAILABLE_CITY: "Unavailable",

  UNAVAILABLE_TIMEZONE: "Unavailable",

  UNAVAILABLE_ISP: "Unavailable",
});

/* ==========================================================
   Icons
========================================================== */

export const ICONS = Object.freeze({
  SUCCESS: "🟢",

  WARNING: "🟡",

  DANGER: "🔴",

  LOADING: "⏳",

  CHECK: "✔",

  CROSS: "✖",
});

/* ==========================================================
   Refresh Configuration
========================================================== */

export const REFRESH = Object.freeze({
  AUTO_REFRESH: false,

  INTERVAL: 300000,
});

/* ==========================================================
   Default Export
========================================================== */

export default Object.freeze({
  APP,

  API,

  QUICK_LINKS,

  STORAGE,

  SECURITY_LEVEL,

  SCORE,

  UI,

  ICONS,

  REFRESH,
});
