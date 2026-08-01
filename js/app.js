/*
==========================================================
SafeIP
app.js
Application Entry Point
Version: 1.3.0
==========================================================
*/

import { initTheme, toggleTheme } from "./theme.js";

import { createCountryOptions } from "./countries.js";

import { getNetworkInfo } from "./api.js";

import { validateNetwork } from "./validator.js";

import { validateQuickLink, isDuplicateURL } from "./quick-links-validator.js";

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
  copyIPAddress,
  openLinkModal,
  closeLinkModal,
  clearLinkForm,
  getLinkFormData,
  renderQuickLinks,
  onAddLink,
  onSaveLink,
  onCancelLink,
  onDeleteLink,
  onReorderLinks,
  showInputError,
  bindValidationInputEvents,
  onThemeToggle,
} from "./ui.js";

import {
  saveSelectedCountry,
  getSelectedCountry as loadSelectedCountry,
  getQuickLinks,
  addQuickLink,
  removeQuickLink,
  updateQuickLinks,
} from "./storage.js";

import { APP } from "./config.js";

/* ==========================================================
   Application State
========================================================== */

const state = {
  network: null,

  validation: null,

  selectedCountry: APP.DEFAULT_COUNTRY,

  quickLinks: [],
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
   Quick Links
========================================================== */

function loadQuickLinks() {
  state.quickLinks = getQuickLinks();

  renderQuickLinks(state.quickLinks);
}

/* ==========================================================
   Add Link
========================================================== */

function handleAddLink() {
  clearLinkForm();

  openLinkModal();
}

/* ==========================================================
   Save Link
========================================================== */

function handleSaveLink() {
  const data = getLinkFormData();

  const validation = validateQuickLink(data);

  /*
  Clear previous validation states
  */

  showInputError("linkTitle", "linkTitleError", null);

  showInputError("linkUrl", "linkUrlError", null);

  if (!validation.valid) {
    /*
    Show validation message near related field
    */

    if (validation.message.includes("Title")) {
      showInputError("linkTitle", "linkTitleError", validation.message);
    } else {
      showInputError("linkUrl", "linkUrlError", validation.message);
    }

    return;
  }

  /*
  Check duplicate URL
  */

  if (isDuplicateURL(validation.data.url, state.quickLinks)) {
    showInputError("linkUrl", "linkUrlError", "This link already exists.");

    return;
  }

  const link = {
    id: Date.now(),

    title: validation.data.title,

    url: validation.data.url,

    color: validation.data.color,
  };

  state.quickLinks = addQuickLink(link);

  renderQuickLinks(state.quickLinks);

  closeLinkModal();
}

/* ==========================================================
   Cancel Link
========================================================== */

function handleCancelLink() {
  closeLinkModal();
}

/* ==========================================================
   Delete Link
========================================================== */

function handleDeleteLink(id) {
  state.quickLinks = removeQuickLink(id);

  renderQuickLinks(state.quickLinks);
}

/* ==========================================================
   Reorder Quick Links
========================================================== */

function handleReorderLinks(event) {
  const ids = event.detail;

  state.quickLinks.sort(
    (a, b) => ids.indexOf(String(a.id)) - ids.indexOf(String(b.id)),
  );

  updateQuickLinks(state.quickLinks);
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
   Events
========================================================== */

function bindEvents() {
  onRefresh(handleRefresh);

  onCountryChange(handleCountryChange);

  onCopyIP(handleCopyIP);

  onAddLink(handleAddLink);

  onSaveLink(handleSaveLink);

  onCancelLink(handleCancelLink);

  onDeleteLink(handleDeleteLink);

  onReorderLinks(handleReorderLinks);

  /*
  Clear Quick Link validation
  messages while typing.
  */
  bindValidationInputEvents();

  /*
  Handles switching between dark and light themes.
  Theme preference is managed inside theme.js.
  */

  onThemeToggle(toggleTheme);
}

/* ==========================================================
   Initialize
========================================================== */

async function initialize() {
  initTheme();

  initializeUI();

  loadCountries();

  restoreCountry();

  loadQuickLinks();

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
