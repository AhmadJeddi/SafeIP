/*
==========================================================
SafeIP
app.js
Application Entry Point
Version: 1.5.0
==========================================================
*/

import { initTheme, toggleTheme } from "./theme.js";

import { getNetworkInfo } from "./api.js";

import { validateNetwork } from "./validator.js";

import { validateQuickLink, isDuplicateURL } from "./quick-links-validator.js";

import {
  initializeUI,
  initializeCountrySelector,
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
  onExportSettings,
  onImportSettings,
  renderOfflineState,
  renderOnlineState,
  onNetworkStatusChange,
} from "./ui.js";

import {
  saveSelectedCountry,
  getSelectedCountry as loadSelectedCountry,
  getQuickLinks,
  addQuickLink,
  removeQuickLink,
  updateQuickLinks,
  exportStorage,
  importStorage,
} from "./storage.js";

import { APP } from "./config.js";

import { registerServiceWorker, initializePWA } from "./pwa.js";

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
   Export Settings
========================================================== */

function handleExportSettings() {
  const backup = exportStorage();

  if (!backup) {
    console.error("Unable to export settings.");

    return;
  }

  const json = JSON.stringify(backup, null, 2);

  const blob = new Blob([json], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = "safeip-settings.json";

  document.body.appendChild(link);

  link.click();

  link.remove();

  URL.revokeObjectURL(url);
}

/* ==========================================================
   Import Settings
========================================================== */

function handleImportSettings(file) {
  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const backup = JSON.parse(reader.result);

      const confirmed = window.confirm(
        "Importing settings will replace your current SafeIP settings. Continue?",
      );

      if (!confirmed) {
        return;
      }

      const success = importStorage(backup);

      if (!success) {
        window.alert("Unable to import SafeIP settings.");

        return;
      }

      /*
       * Reload application so all imported settings
       * are applied correctly.
       */
      window.location.reload();
    } catch (error) {
      console.error("Import Error:", error);

      window.alert("Invalid SafeIP settings file.");
    }
  };

  reader.onerror = () => {
    console.error("Unable to read settings file.");

    window.alert("Unable to read the selected file.");
  };

  reader.readAsText(file);
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

    if (!navigator.onLine) {
      renderOfflineState();
    } else {
      renderError(error.message || "Unable to retrieve network information.");
    }
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

  bindValidationInputEvents();

  onThemeToggle(toggleTheme);

  onExportSettings(handleExportSettings);

  onImportSettings(handleImportSettings);

  onNetworkStatusChange((online) => {
    if (online) {
      renderOnlineState();
    } else {
      renderOfflineState();
    }
  });
}

/* ==========================================================
   Initialize
========================================================== */

async function initialize() {
  initTheme();

  initializePWA();

  initializeUI();

  initializeCountrySelector();

  restoreCountry();

  loadQuickLinks();

  await refreshNetwork();
}

/* ==========================================================
   Start Application
========================================================== */

async function start() {
  registerServiceWorker();

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
