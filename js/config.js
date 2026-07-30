/*
==========================================================
SafeIP
config.js
Application Configuration
Version: 1.0.0
==========================================================
*/

/* ==========================================================
   Application
========================================================== */

export const APP = Object.freeze({
  NAME: "SafeIP",

  VERSION: "1.0.0",

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
   External Links
========================================================== */

export const LINKS = Object.freeze({
  LINKEDIN: "https://www.linkedin.com/login",
});

/* ==========================================================
   Local Storage Keys
========================================================== */

export const STORAGE = Object.freeze({
  COUNTRY: "safeip.selectedCountry",

  LAST_CHECK: "safeip.lastCheck",

  AUTO_REFRESH: "safeip.autoRefresh",
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

  LINKS,

  STORAGE,

  SECURITY_LEVEL,

  SCORE,

  UI,

  ICONS,

  REFRESH,
});
