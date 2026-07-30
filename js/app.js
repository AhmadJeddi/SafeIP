/*
==========================================================
SafeIP
app.js
Application Entry Point
Version: 1.1.0
==========================================================
*/

import { createCountryOptions } from "./countries.js";

import { getNetworkInfo } from "./api.js";

import { validateNetwork } from "./validator.js";

import {
  initializeUI,
  renderNetworkInfo,
  renderStatus,
  renderChecklist,
  renderError,
  startLoadingState,
  stopLoadingState,
  updateLastChecked,
  getSelectedCountry,
  setSelectedCountry,
  onRefresh,
  onCountryChange,
  onCopyIP,
  onLinkedIn,
  copyIPAddress,
} from "./ui.js";

import {
  saveSelectedCountry,
  getSelectedCountry as loadSelectedCountry,
} from "./storage.js";

import { APP, LINKS } from "./config.js";

/* ==========================================================
   Application State
========================================================== */

const state = {
  network: null,

  validation: null,

  selectedCountry: APP.DEFAULT_COUNTRY,
};

/* ==========================================================
   Countries
========================================================== */

function loadCountries() {
  const select = document.getElementById("countrySelect");

  if (!select) {
    throw new Error("Country selector not found.");
  }

  select.innerHTML = createCountryOptions();
}

/* ==========================================================
   Restore Country
========================================================== */

function restoreCountry() {
  const savedCountry = loadSelectedCountry();

  state.selectedCountry = savedCountry || APP.DEFAULT_COUNTRY;

  setSelectedCountry(state.selectedCountry);
}

/* ==========================================================
   Save Country
========================================================== */

function saveCountry() {
  state.selectedCountry = getSelectedCountry();

  saveSelectedCountry(state.selectedCountry);
}

/* ==========================================================
   Network Refresh
========================================================== */

async function refreshNetwork() {
  startLoadingState();

  try {
    state.network = await getNetworkInfo();

    renderNetworkInfo(state.network);

    state.validation = validateNetwork(state.selectedCountry, state.network);

    renderStatus(state.validation);

    renderChecklist(state.validation.checks);

    updateLastChecked();
  } catch (error) {
    console.error("Network refresh failed:", error);

    renderError(error.message || "Unable to retrieve network information.");
  } finally {
    stopLoadingState();
  }
}

/* ==========================================================
   Country Change
========================================================== */

async function handleCountryChange() {
  saveCountry();

  await refreshNetwork();
}

/* ==========================================================
   Refresh Button
========================================================== */

async function handleRefresh() {
  await refreshNetwork();
}

/* ==========================================================
   Copy IP
========================================================== */

async function handleCopyIP() {
  const copied = await copyIPAddress();

  if (copied) {
    console.log("IP copied.");
  } else {
    console.warn("Copy failed.");
  }
}

/* ==========================================================
   LinkedIn
========================================================== */

function handleLinkedIn() {
  if (!state.validation || !state.validation.safe) {
    return;
  }

  window.open(
    LINKS.LINKEDIN,

    "_blank",

    "noopener,noreferrer",
  );
}

/* ==========================================================
   Events
========================================================== */

function bindEvents() {
  onRefresh(handleRefresh);

  onCountryChange(handleCountryChange);

  onCopyIP(handleCopyIP);

  onLinkedIn(handleLinkedIn);
}

/* ==========================================================
   Initialize
========================================================== */

async function initialize() {
  initializeUI();

  loadCountries();

  restoreCountry();

  await refreshNetwork();
}

/* ==========================================================
   Start Application
========================================================== */

async function start() {
  try {
    bindEvents();

    await initialize();

    console.log(`${APP.NAME} started successfully.`);
  } catch (error) {
    console.error("Application startup failed:", error);

    renderError("Application failed to start.");
  }
}

/* ==========================================================
   DOM Ready
========================================================== */

document.addEventListener(
  "DOMContentLoaded",

  () => {
    start();
  },
);

/* ==========================================================
   Debug API
========================================================== */

if (import.meta.env?.MODE !== "production") {
  window.SafeIP = {
    state,

    refreshNetwork,

    initialize,

    start,
  };
}
