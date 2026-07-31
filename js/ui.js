/*
==========================================================
SafeIP
ui.js
UI Layer
Version: 1.2.0
==========================================================
*/

import { ICONS, UI, QUICK_LINKS } from "./config.js";

let copyFeedbackTimer = null;
let quickLinksEnabled = false;

/* ==========================================================
   DOM Cache
========================================================== */

const elements = {
  countrySelect: document.getElementById("countrySelect"),

  ipAddress: document.getElementById("ipAddress"),

  countryName: document.getElementById("countryName"),

  countryCode: document.getElementById("countryCode"),

  cityName: document.getElementById("cityName"),

  regionName: document.getElementById("regionName"),

  ispName: document.getElementById("ispName"),

  timezone: document.getElementById("timezone"),

  statusCard: document.getElementById("statusCard"),

  statusIcon: document.getElementById("statusIcon"),

  statusTitle: document.getElementById("statusTitle"),

  statusMessage: document.getElementById("statusMessage"),

  checkCountry: document.getElementById("checkCountry"),

  checkInternet: document.getElementById("checkConnection"),

  checkApi: document.getElementById("checkApi"),

  checkLogin: document.getElementById("checkLogin"),

  refreshButton: document.getElementById("refreshButton"),

  copyButton: document.getElementById("copyButton"),

  lastChecked: document.getElementById("lastChecked"),

  quickLinksContainer: document.getElementById("quickLinksContainer"),

  addLinkButton: document.getElementById("addLinkButton"),

  linkModal: document.getElementById("linkModal"),

  linkTitle: document.getElementById("linkTitle"),

  linkUrl: document.getElementById("linkUrl"),

  linkColor: document.getElementById("linkColor"),

  saveLinkButton: document.getElementById("saveLinkButton"),

  cancelLinkButton: document.getElementById("cancelLinkButton"),
};

/* ==========================================================
   Helpers
========================================================== */

function setText(element, value) {
  if (!element) return;

  element.textContent = value ?? "";
}

function enable(element) {
  if (!element) return;

  element.removeAttribute("aria-disabled");

  element.classList.remove("disabled");

  element.disabled = false;
}

function disable(element) {
  if (!element) return;

  element.setAttribute("aria-disabled", "true");

  element.classList.add("disabled");

  element.disabled = true;
}

function addClass(element, className) {
  if (!element) return;

  element.classList.add(className);
}

function removeClass(element, className) {
  if (!element) return;

  element.classList.remove(className);
}

function replaceStatusClass(className) {
  if (!elements.statusCard) return;

  elements.statusCard.classList.remove(
    "status-safe",
    "status-warning",
    "status-danger",
  );

  elements.statusCard.classList.add(className);
}

/* ==========================================================
   Network Renderer
========================================================== */

export function renderNetworkInfo(data) {
  setText(elements.ipAddress, data.ip || UI.DEFAULT_IP);

  setText(elements.countryName, data.country || UI.DEFAULT_COUNTRY);

  setText(elements.countryCode, data.countryCode || UI.DEFAULT_COUNTRY_CODE);

  setText(elements.regionName, data.region || UI.DEFAULT_REGION);

  setText(elements.cityName, data.city || UI.DEFAULT_CITY);

  setText(elements.ispName, data.isp || UI.DEFAULT_ISP);

  setText(elements.timezone, data.timezone || UI.DEFAULT_TIMEZONE);
}

/* ==========================================================
   Loading
========================================================== */

export function showLoading() {
  setText(elements.statusIcon, ICONS.LOADING);

  setText(elements.statusTitle, "Checking...");

  setText(elements.copyButton, "Copy IP");

  setText(elements.statusMessage, UI.LOADING_TEXT);

  disable(elements.copyButton);

  disable(elements.refreshButton);

  clearTimeout(copyFeedbackTimer);

  // Lock Quick Links while checking network
  toggleQuickLinks(false);
}

export function hideLoading() {
  enable(elements.copyButton);

  enable(elements.refreshButton);
}

/* ==========================================================
   Status Renderer
========================================================== */

export function renderStatus(result) {
  if (!result) {
    return;
  }

  switch (result.level) {
    case "SAFE":
      setSafeStatus(result);
      break;

    case "WARNING":
      setWarningStatus(result);
      break;

    case "DANGER":
      setDangerStatus(result);
      break;

    default:
      setWarningStatus({
        title: "Unknown Status",
        message: "Unable to determine network status.",
      });
  }
}

/* ==========================================================
   SAFE
========================================================== */

function setSafeStatus(result) {
  replaceStatusClass("status-safe");

  setText(elements.statusIcon, ICONS.SUCCESS);

  setText(elements.statusTitle, result.title);

  setText(elements.statusMessage, result.message);

  // Enable Quick Links after successful validation
  toggleQuickLinks(true);
}

/* ==========================================================
   WARNING
========================================================== */

function setWarningStatus(result) {
  replaceStatusClass("status-warning");

  setText(elements.statusIcon, ICONS.WARNING);

  setText(elements.statusTitle, result.title);

  setText(elements.statusMessage, result.message);

  // Disable Quick Links
  toggleQuickLinks(false);
}

/* ==========================================================
   DANGER
========================================================== */

function setDangerStatus(result) {
  replaceStatusClass("status-danger");

  setText(elements.statusIcon, ICONS.DANGER);

  setText(elements.statusTitle, result.title);

  setText(elements.statusMessage, result.message);

  // Disable Quick Links when network is dangerous
  toggleQuickLinks(false);
}

/* ==========================================================
   Checklist Renderer
========================================================== */

export function renderChecklist(checks) {
  if (!checks) {
    return;
  }

  updateCheckItem(elements.checkCountry, checks.country, "Country Match");

  updateCheckItem(
    elements.checkInternet,
    checks.internet,
    "Internet Connection",
  );

  updateCheckItem(elements.checkApi, checks.api, "API Status");

  updateCheckItem(elements.checkLogin, checks.login, "Safe To Login");
}

function updateCheckItem(element, passed, label) {
  if (!element) {
    return;
  }

  element.classList.remove("passed", "failed");

  if (passed) {
    element.textContent = `${ICONS.CHECK} ${label}`;

    element.classList.add("passed");
  } else {
    element.textContent = `${ICONS.CROSS} ${label}`;

    element.classList.add("failed");
  }
}

/* ==========================================================
   Reset Checklist
========================================================== */

export function resetChecklist() {
  updateCheckItem(elements.checkCountry, false, "Country Match");

  updateCheckItem(elements.checkInternet, false, "Internet Connection");

  updateCheckItem(elements.checkApi, false, "API Status");

  updateCheckItem(elements.checkLogin, false, "Safe To Login");
}

/* ==========================================================
   Network Reset
========================================================== */

export function resetNetworkInfo() {
  setText(elements.ipAddress, UI.DEFAULT_IP);

  setText(elements.countryName, UI.DEFAULT_COUNTRY);

  setText(elements.countryCode, UI.DEFAULT_COUNTRY_CODE);

  setText(elements.regionName, UI.DEFAULT_REGION);

  setText(elements.cityName, UI.DEFAULT_CITY);

  setText(elements.ispName, UI.DEFAULT_ISP);

  setText(elements.timezone, UI.DEFAULT_TIMEZONE);
}

/* ==========================================================
   Error
========================================================== */

export function renderError(message) {
  replaceStatusClass("status-danger");

  setText(elements.statusIcon, ICONS.DANGER);

  setText(elements.statusTitle, "Error");

  setText(elements.statusMessage, message || UI.ERROR_TEXT);

  toggleQuickLinks(false);
}

/* ==========================================================
   Last Checked
========================================================== */

export function updateLastChecked() {
  const now = new Date();

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  setText(elements.lastChecked, time);
}

/* ==========================================================
   Refresh Animation
========================================================== */

export function startRefreshAnimation() {
  addClass(elements.refreshButton, "loading");
}

export function stopRefreshAnimation() {
  removeClass(elements.refreshButton, "loading");
}

/* ==========================================================
   Loading State
========================================================== */

export function startLoadingState() {
  showLoading();

  resetNetworkInfo();

  resetChecklist();

  startRefreshAnimation();
}

export function stopLoadingState() {
  hideLoading();

  stopRefreshAnimation();
}

/* ==========================================================
   Country Selector
========================================================== */

export function getSelectedCountry() {
  return elements.countrySelect?.value || "IR";
}

export function setSelectedCountry(code) {
  if (!elements.countrySelect) {
    return;
  }

  elements.countrySelect.value = code;
}

/* ==========================================================
   Quick Links Modal
========================================================== */

export function openLinkModal() {
  removeClass(elements.linkModal, "hidden");

  elements.linkTitle?.focus();
}

export function closeLinkModal() {
  addClass(elements.linkModal, "hidden");
}

export function clearLinkForm() {
  elements.linkTitle.value = "";

  elements.linkUrl.value = "";

  const colors = QUICK_LINKS.COLORS;

  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  elements.linkColor.value = randomColor;
}

/* ==========================================================
   Link Form
========================================================== */

export function getLinkFormData() {
  return {
    title: elements.linkTitle.value.trim(),

    url: elements.linkUrl.value.trim(),

    color: elements.linkColor.value,
  };
}

/* ==========================================================
   Quick Links Access Control
========================================================== */

/**
 * Enable or disable Quick Links
 *
 * Quick Links are disabled by default
 * and become available only after
 * network validation is SAFE.
 *
 * @param {boolean} enabled
 */
export function toggleQuickLinks(enabled) {
  quickLinksEnabled = enabled;

  const links = elements.quickLinksContainer?.querySelectorAll(".quick-link");

  if (!links) return;

  links.forEach((link) => {
    if (enabled) {
      link.classList.remove("disabled");
      link.removeAttribute("aria-disabled");
      link.style.pointerEvents = "auto";
    } else {
      link.classList.add("disabled");
      link.setAttribute("aria-disabled", "true");
      link.style.pointerEvents = "none";
    }
  });
}

/* ==========================================================
   Quick Links Renderer
========================================================== */

export function renderQuickLinks(links) {
  if (!elements.quickLinksContainer) {
    return;
  }

  elements.quickLinksContainer.innerHTML = "";

  links.forEach((link) => {
    const wrapper = document.createElement("div");

    wrapper.className = "quick-link-wrapper";

    wrapper.draggable = true;

    wrapper.dataset.id = link.id;

    const button = document.createElement("a");

    /*
    Quick Links are locked until
    IP validation succeeds.
    */
    button.className = "btn quick-link";

    if (!quickLinksEnabled) {
      button.classList.add("disabled");

      button.setAttribute("aria-disabled", "true");
    }

    button.href = link.url;

    button.target = "_blank";

    button.rel = "noopener noreferrer";

    button.textContent = link.title;

    button.style.background = link.color;

    const deleteButton = document.createElement("button");

    /* 
    Drag Events
    */
    wrapper.addEventListener("dragstart", handleDragStart);

    wrapper.addEventListener("dragover", handleDragOver);

    wrapper.addEventListener("drop", handleDrop);

    wrapper.addEventListener("dragend", handleDragEnd);

    deleteButton.className = "quick-link-delete";

    deleteButton.type = "button";

    deleteButton.textContent = "×";

    deleteButton.dataset.id = link.id;

    wrapper.appendChild(button);

    wrapper.appendChild(deleteButton);

    elements.quickLinksContainer.appendChild(wrapper);
  });
}

/* ==========================================================
   Quick Links Drag & Drop
========================================================== */

let draggedElement = null;

/**
 * Start dragging
 */
function handleDragStart(event) {
  draggedElement = event.currentTarget;

  event.dataTransfer.effectAllowed = "move";

  event.currentTarget.classList.add("dragging");
}

/**
 * Allow dropping
 */
function handleDragOver(event) {
  event.preventDefault();

  event.dataTransfer.dropEffect = "move";
}

/**
 * Drop element
 */
function handleDrop(event) {
  event.preventDefault();

  const target = event.currentTarget;

  if (!draggedElement || draggedElement === target) {
    return;
  }

  const container = elements.quickLinksContainer;

  const items = [...container.children];

  const draggedIndex = items.indexOf(draggedElement);

  const targetIndex = items.indexOf(target);

  if (draggedIndex < targetIndex) {
    container.insertBefore(draggedElement, target.nextSibling);
  } else {
    container.insertBefore(draggedElement, target);
  }

  updateQuickLinksOrder();
}

/**
 * End dragging
 */
function handleDragEnd(event) {
  event.currentTarget.classList.remove("dragging");

  draggedElement = null;
}

/* ==========================================================
   Update Quick Links Order
========================================================== */

/**
 * Dispatch reordered quick links event
 *
 * @returns {void}
 */
function updateQuickLinksOrder() {
  if (!elements.quickLinksContainer) {
    return;
  }

  const ids = [...elements.quickLinksContainer.children].map(
    (item) => item.dataset.id,
  );

  elements.quickLinksContainer.dispatchEvent(
    new CustomEvent("quicklinks-reordered", {
      detail: ids,
    }),
  );
}

/* ==========================================================
   Copy IP
========================================================== */

export async function copyIPAddress() {
  const ip = elements.ipAddress?.textContent.trim();

  if (!ip || ip === UI.DEFAULT_IP) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(ip);

    setText(elements.copyButton, "Copied!");

    clearTimeout(copyFeedbackTimer);

    copyFeedbackTimer = setTimeout(() => {
      setText(elements.copyButton, "Copy IP");
    }, 2000);

    return true;
  } catch (error) {
    console.error("Copy failed:", error);

    return false;
  }
}

/* ==========================================================
   Events
========================================================== */

export function onRefresh(callback) {
  elements.refreshButton?.addEventListener("click", callback);
}

export function onCountryChange(callback) {
  elements.countrySelect?.addEventListener("change", callback);
}

export function onCopyIP(callback) {
  elements.copyButton?.addEventListener("click", callback);
}

export function onAddLink(callback) {
  elements.addLinkButton?.addEventListener("click", callback);
}

export function onSaveLink(callback) {
  elements.saveLinkButton?.addEventListener("click", callback);
}

export function onCancelLink(callback) {
  elements.cancelLinkButton?.addEventListener("click", callback);
}

export function onDeleteLink(callback) {
  elements.quickLinksContainer?.addEventListener("click", (event) => {
    const button = event.target.closest(".quick-link-delete");

    if (!button) {
      return;
    }

    callback(button.dataset.id);
  });
}

export function onReorderLinks(callback) {
  elements.quickLinksContainer?.addEventListener(
    "quicklinks-reordered",
    callback,
  );
}

/* ==========================================================
   Initialize
========================================================== */

export function initializeUI() {
  resetNetworkInfo();

  resetChecklist();

  renderEmpty();

  disable(elements.refreshButton);

  disable(elements.copyButton);

  toggleQuickLinks(false);
}

/* ==========================================================
   Empty State
========================================================== */

export function renderEmpty() {
  replaceStatusClass("status-warning");

  setText(elements.statusIcon, ICONS.WARNING);

  setText(elements.statusTitle, "Waiting...");

  setText(elements.statusMessage, UI.EMPTY_TEXT);

  toggleQuickLinks(false);
}

/* ==========================================================
   Public
========================================================== */

export { elements };

export default {
  initializeUI,

  renderNetworkInfo,

  renderStatus,

  renderChecklist,

  renderError,

  renderEmpty,

  startLoadingState,

  stopLoadingState,

  updateLastChecked,

  copyIPAddress,

  getSelectedCountry,

  setSelectedCountry,

  onRefresh,

  onCountryChange,

  onCopyIP,

  toggleQuickLinks,

  renderQuickLinks,

  openLinkModal,

  closeLinkModal,

  clearLinkForm,

  getLinkFormData,

  onAddLink,

  onSaveLink,

  onCancelLink,

  onDeleteLink,

  onReorderLinks,
};
