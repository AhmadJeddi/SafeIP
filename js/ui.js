/*
==========================================================
SafeIP
ui.js
UI Layer
Version: 1.1.0
==========================================================
*/

import { ICONS, UI } from "./config.js";

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

  checkLinkedin: document.getElementById("checkLogin"),

  refreshButton: document.getElementById("refreshButton"),

  copyButton: document.getElementById("copyButton"),

  linkedinButton: document.getElementById("linkedinButton"),

  lastChecked: document.getElementById("lastChecked"),
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

  setText(elements.statusMessage, UI.LOADING_TEXT);

  disable(elements.linkedinButton);

  disable(elements.copyButton);

  disable(elements.refreshButton);
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

  enable(elements.linkedinButton);
}

/* ==========================================================
   WARNING
========================================================== */

function setWarningStatus(result) {
  replaceStatusClass("status-warning");

  setText(elements.statusIcon, ICONS.WARNING);

  setText(elements.statusTitle, result.title);

  setText(elements.statusMessage, result.message);

  disable(elements.linkedinButton);
}

/* ==========================================================
   DANGER
========================================================== */

function setDangerStatus(result) {

  replaceStatusClass(
    "status-danger"
  );


  setText(
    elements.statusIcon,
    ICONS.DANGER
  );


  setText(
    elements.statusTitle,
    result.title
  );


  setText(
    elements.statusMessage,
    result.message
  );


  disable(
    elements.linkedinButton
  );

}

/* ==========================================================
   Checklist Renderer
========================================================== */

export function renderChecklist(checks) {

  if (!checks) {
    return;
  }

  updateCheckItem(
    elements.checkCountry,
    checks.country,
    "Country Match"
  );

  updateCheckItem(
    elements.checkInternet,
    checks.internet,
    "Internet Connection"
  );

  updateCheckItem(
    elements.checkApi,
    checks.api,
    "API Status"
  );

  updateCheckItem(
    elements.checkLinkedin,
    checks.login,
    "Safe To Login"
  );

}

function updateCheckItem(
  element,
  passed,
  label
) {

  if (!element) {
    return;
  }

  element.classList.remove(
    "passed",
    "failed"
  );

  if (passed) {

    element.textContent =
      `${ICONS.CHECK} ${label}`;

    element.classList.add(
      "passed"
    );

  }

  else {

    element.textContent =
      `${ICONS.CROSS} ${label}`;

    element.classList.add(
      "failed"
    );

  }

}

/* ==========================================================
   Reset Checklist
========================================================== */

export function resetChecklist() {

  updateCheckItem(
    elements.checkCountry,
    false,
    "Country Match"
  );

  updateCheckItem(
    elements.checkInternet,
    false,
    "Internet Connection"
  );

  updateCheckItem(
    elements.checkApi,
    false,
    "API Status"
  );

  updateCheckItem(
    elements.checkLinkedin,
    false,
    "Safe To Login"
  );

}

/* ==========================================================
   Network Reset
========================================================== */

export function resetNetworkInfo() {

  setText(
    elements.ipAddress,
    UI.DEFAULT_IP
  );

  setText(
    elements.countryName,
    UI.DEFAULT_COUNTRY
  );

  setText(
    elements.countryCode,
    UI.DEFAULT_COUNTRY_CODE
  );

  setText(
    elements.regionName,
    UI.DEFAULT_REGION
  );

  setText(
    elements.cityName,
    UI.DEFAULT_CITY
  );

  setText(
    elements.ispName,
    UI.DEFAULT_ISP
  );

  setText(
    elements.timezone,
    UI.DEFAULT_TIMEZONE
  );

}

/* ==========================================================
   Error
========================================================== */

export function renderError(message) {

  replaceStatusClass(
    "status-danger"
  );

  setText(
    elements.statusIcon,
    ICONS.DANGER
  );

  setText(
    elements.statusTitle,
    "Error"
  );

  setText(
    elements.statusMessage,
    message || UI.ERROR_TEXT
  );

  disable(
    elements.linkedinButton
  );

}

/* ==========================================================
   Last Checked
========================================================== */

export function updateLastChecked() {

  const now = new Date();

  const time =
    now.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }
    );

  setText(
    elements.lastChecked,
    time
  );

}

/* ==========================================================
   Refresh Animation
========================================================== */

export function startRefreshAnimation() {

  addClass(
    elements.refreshButton,
    "loading"
  );

}

export function stopRefreshAnimation() {

  removeClass(
    elements.refreshButton,
    "loading"
  );

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
   Copy IP
========================================================== */

export async function copyIPAddress() {

  const ip =
    elements.ipAddress?.textContent.trim();

  if (
    !ip ||
    ip === UI.DEFAULT_IP
  ) {

    return false;

  }

  try {

    await navigator.clipboard.writeText(ip);

    return true;

  }

  catch(error) {

    console.error(
      "Copy failed:",
      error
    );

    return false;

  }

}

/* ==========================================================
   Events
========================================================== */

export function onRefresh(callback) {

  elements.refreshButton?.addEventListener(
    "click",
    callback
  );

}

export function onCountryChange(callback) {

  elements.countrySelect?.addEventListener(
    "change",
    callback
  );

}

export function onCopyIP(callback) {

  elements.copyButton?.addEventListener(
    "click",
    callback
  );

}

export function onLinkedIn(callback) {

  elements.linkedinButton?.addEventListener(
    "click",
    callback
  );

}

/* ==========================================================
   Initialize
========================================================== */

export function initializeUI() {

  resetNetworkInfo();

  resetChecklist();

  renderEmpty();

  disable(
    elements.refreshButton
  );

  disable(
    elements.copyButton
  );

  disable(
    elements.linkedinButton
  );

}

/* ==========================================================
   Empty State
========================================================== */

export function renderEmpty() {

  replaceStatusClass(
    "status-warning"
  );

  setText(
    elements.statusIcon,
    ICONS.WARNING
  );

  setText(
    elements.statusTitle,
    "Waiting..."
  );

  setText(
    elements.statusMessage,
    UI.EMPTY_TEXT
  );

  disable(
    elements.linkedinButton
  );

}

/* ==========================================================
   Public
========================================================== */

export {
  elements
};

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

  onLinkedIn,

};