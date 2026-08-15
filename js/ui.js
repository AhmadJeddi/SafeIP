/*
==========================================================
SafeIP
ui.js
UI Layer
Version: 1.6.0
==========================================================
*/

import { ICONS, UI, QUICK_LINKS } from "./config.js";
import { countries, getCountryByCode } from "./countries.js";

let copyFeedbackTimer = null;
let quickLinksEnabled = false;

let countrySearchInitialized = false;
let countrySearchResults = [];
let countrySearchActiveIndex = -1;

/* ==========================================================
   DOM Cache
========================================================== */

const elements = {
  countrySelect: document.getElementById("countrySelect"),

  countrySearch: document.getElementById("countrySearch"),

  countryCard: document.getElementById("countryCard"),

  countrySearchInput: document.getElementById("countrySearchInput"),

  countryOptions: document.getElementById("countryOptions"),

  networkCard: document.getElementById("networkCard"),

  checklistCard: document.getElementById("checklistCard"),

  lastCheckCard: document.getElementById("lastCheckCard"),

  ipAddress: document.getElementById("ipAddress"),

  countryName: document.getElementById("countryName"),

  countryCode: document.getElementById("countryCode"),

  cityName: document.getElementById("cityName"),

  regionName: document.getElementById("regionName"),

  ispName: document.getElementById("ispName"),

  timezone: document.getElementById("timezone"),

  offlineBanner: document.getElementById("offlineBanner"),

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

  linkFaviconPreview: document.getElementById("linkFaviconPreview"),

  linkFaviconPreviewImage: document.getElementById("linkFaviconPreviewImage"),

  linkColor: document.getElementById("linkColor"),

  saveLinkButton: document.getElementById("saveLinkButton"),

  cancelLinkButton: document.getElementById("cancelLinkButton"),

  themeButton: document.getElementById("themeToggle"),

  exportSettingsButton: document.getElementById("exportSettingsButton"),

  importSettingsButton: document.getElementById("importSettingsButton"),

  importSettingsInput: document.getElementById("importSettingsInput"),
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

  const country =
    !data.country || data.country === "Unknown"
      ? UI.UNAVAILABLE_COUNTRY
      : data.country;

  const countryCode =
    !data.countryCode || data.countryCode === "UN"
      ? UI.UNAVAILABLE_COUNTRY_CODE
      : data.countryCode;

  setText(elements.countryName, country);

  setText(elements.countryCode, countryCode);

  setText(elements.regionName, data.region || UI.UNAVAILABLE_REGION);

  setText(elements.cityName, data.city || UI.UNAVAILABLE_CITY);

  setText(elements.ispName, data.isp || UI.UNAVAILABLE_ISP);

  setText(elements.timezone, data.timezone || UI.UNAVAILABLE_TIMEZONE);
}

/* ==========================================================
   Loading
========================================================== */

function setSkeletonLoading(enabled) {
  document.body?.classList.toggle("app-loading", enabled);
  const textElements = [
    elements.ipAddress,
    elements.countryName,
    elements.countryCode,
    elements.regionName,
    elements.cityName,
    elements.timezone,
    elements.ispName,
    elements.lastChecked,
    elements.statusTitle,
    elements.statusMessage,
  ];

  textElements.forEach((element) => {
    element?.classList.toggle("skeleton-text", enabled);
  });

  elements.statusIcon?.classList.toggle("skeleton-circle", enabled);

  [
    elements.checkCountry,
    elements.checkInternet,
    elements.checkApi,
    elements.checkLogin,
  ].forEach((element) => {
    element?.classList.toggle("skeleton-row", enabled);
  });

  elements.networkCard?.setAttribute("aria-busy", String(enabled));
  elements.statusCard?.setAttribute("aria-busy", String(enabled));
  elements.checklistCard?.setAttribute("aria-busy", String(enabled));
}

export function showLoading() {
  setText(elements.statusIcon, ICONS.LOADING);
  setText(elements.statusTitle, "Checking...");
  setText(elements.copyButton, "Copy IP");
  setText(elements.statusMessage, UI.LOADING_TEXT);

  disable(elements.copyButton);
  disable(elements.refreshButton);

  clearTimeout(copyFeedbackTimer);

  setSkeletonLoading(true);

  // Lock Quick Links while checking network.
  toggleQuickLinks(false);
}

export function hideLoading() {
  setSkeletonLoading(false);

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
   Country Search Selector
========================================================== */

function normalizeCountrySearch(value) {
  return value.trim().toLocaleLowerCase();
}

function getCountryLabel(country) {
  return `${country.flag} ${country.name} (${country.code})`;
}

function renderCountrySearchResults(query = "") {
  const normalizedQuery = normalizeCountrySearch(query);

  countrySearchResults = countries.filter((country) => {
    if (!normalizedQuery) return true;

    return (
      normalizeCountrySearch(country.name).includes(normalizedQuery) ||
      normalizeCountrySearch(country.code).includes(normalizedQuery)
    );
  });

  countrySearchActiveIndex = countrySearchResults.length ? 0 : -1;

  if (!elements.countryOptions) return;

  elements.countryOptions.innerHTML = "";

  if (!countrySearchResults.length) {
    const empty = document.createElement("div");
    empty.className = "country-search__empty";
    empty.textContent = "No countries found.";
    elements.countryOptions.appendChild(empty);
    elements.countrySearchInput?.removeAttribute("aria-activedescendant");
    return;
  }

  countrySearchResults.forEach((country, index) => {
    const option = document.createElement("button");

    option.type = "button";
    option.className = "country-search__option";
    option.setAttribute("role", "option");
    option.dataset.code = country.code;
    option.id = `country-option-${country.code}`;

    const flag = document.createElement("span");
    flag.className = "country-search__flag";
    flag.textContent = country.flag;

    const name = document.createElement("span");
    name.className = "country-search__name";
    name.textContent = country.name;

    const code = document.createElement("span");
    code.className = "country-search__code";
    code.textContent = country.code;

    option.append(flag, name, code);

    option.addEventListener("mousedown", (event) => {
      event.preventDefault();
    });

    option.addEventListener("click", () => {
      selectCountry(country.code);
    });

    elements.countryOptions.appendChild(option);

    if (index === countrySearchActiveIndex) {
      option.classList.add("is-active");
    }
  });

  updateCountrySearchActiveOption();
}

function updateCountrySearchActiveOption() {
  const options = [
    ...(elements.countryOptions?.querySelectorAll(".country-search__option") ||
      []),
  ];

  options.forEach((option, index) => {
    const active = index === countrySearchActiveIndex;
    option.classList.toggle("is-active", active);
  });

  const activeOption = options[countrySearchActiveIndex];

  if (activeOption) {
    elements.countrySearchInput?.setAttribute(
      "aria-activedescendant",
      activeOption.id,
    );

    activeOption.scrollIntoView({
      block: "nearest",
    });
  } else {
    elements.countrySearchInput?.removeAttribute("aria-activedescendant");
  }
}

function openCountrySearch() {
  elements.countryOptions?.classList.remove("hidden");
  elements.countryCard?.classList.add("is-country-open");
  elements.countrySearchInput?.setAttribute("aria-expanded", "true");

  renderCountrySearchResults(elements.countrySearchInput?.value || "");
}

function closeCountrySearch() {
  elements.countryOptions?.classList.add("hidden");
  elements.countryCard?.classList.remove("is-country-open");
  elements.countrySearchInput?.setAttribute("aria-expanded", "false");
}

function selectCountry(code, dispatchChange = true) {
  const country = getCountryByCode(code);

  if (!country || !elements.countrySelect) {
    return;
  }

  const previousValue = elements.countrySelect.value;

  elements.countrySelect.value = country.code;
  elements.countrySearchInput.value = getCountryLabel(country);

  closeCountrySearch();

  if (dispatchChange && previousValue !== country.code) {
    elements.countrySelect.dispatchEvent(
      new Event("change", { bubbles: true }),
    );
  }
}

function bindCountrySearchEvents() {
  if (countrySearchInitialized || !elements.countrySearchInput) {
    return;
  }

  countrySearchInitialized = true;

  elements.countrySearchInput.addEventListener("focus", () => {
    openCountrySearch();

    // Select the displayed label so typing immediately starts a search.
    elements.countrySearchInput.select();
  });

  elements.countrySearchInput.addEventListener("input", () => {
    openCountrySearch();
  });

  elements.countrySearchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeCountrySearch();
      return;
    }

    if (!countrySearchResults.length) {
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        countrySearchActiveIndex = Math.min(
          countrySearchActiveIndex + 1,
          countrySearchResults.length - 1,
        );
        updateCountrySearchActiveOption();
        break;

      case "ArrowUp":
        event.preventDefault();
        countrySearchActiveIndex = Math.max(countrySearchActiveIndex - 1, 0);
        updateCountrySearchActiveOption();
        break;

      case "Home":
        event.preventDefault();
        countrySearchActiveIndex = 0;
        updateCountrySearchActiveOption();
        break;

      case "End":
        event.preventDefault();
        countrySearchActiveIndex = countrySearchResults.length - 1;
        updateCountrySearchActiveOption();
        break;

      case "Enter":
        event.preventDefault();
        if (countrySearchResults[countrySearchActiveIndex]) {
          selectCountry(countrySearchResults[countrySearchActiveIndex].code);
        }
        break;

      default:
        break;
    }
  });

  document.addEventListener("pointerdown", (event) => {
    if (!elements.countrySearch?.contains(event.target)) {
      closeCountrySearch();
    }
  });
}

export function initializeCountrySelector() {
  if (!elements.countrySelect || !elements.countrySearchInput) {
    throw new Error("Country search elements not found.");
  }

  elements.countrySelect.innerHTML = countries
    .map(
      (country) => `<option value="${country.code}">${country.name}</option>`,
    )
    .join("");

  bindCountrySearchEvents();

  selectCountry(elements.countrySelect.value || "IR", false);
}

export function getSelectedCountry() {
  return elements.countrySelect?.value || "IR";
}

export function setSelectedCountry(code) {
  if (!elements.countrySelect) {
    return;
  }

  const country = getCountryByCode(code);

  if (!country) {
    return;
  }

  selectCountry(country.code, false);
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

function getFaviconCandidates(url) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.trim();

    if (!hostname || !hostname.includes(".")) {
      return ["assets/favicon.png"];
    }

    // Avoid unnecessary favicon requests for raw IP-address hosts.
    if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)) {
      return ["assets/favicon.png"];
    }

    return [
      `${parsed.origin}/favicon.ico`,
      `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
        hostname,
      )}&sz=64`,
      "assets/favicon.png",
    ];
  } catch {
    return ["assets/favicon.png"];
  }
}

function updateFaviconPreview(url) {
  if (!elements.linkFaviconPreview || !elements.linkFaviconPreviewImage) {
    return;
  }

  const value = url.trim();

  if (!value) {
    elements.linkFaviconPreview.classList.add("hidden");
    elements.linkFaviconPreviewImage.src = "assets/favicon.png";
    return;
  }

  const normalized = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  let candidates = [];

  try {
    candidates = getFaviconCandidates(normalized);
  } catch {
    candidates = ["assets/favicon.png"];
  }

  let index = 0;

  const tryNext = () => {
    if (index >= candidates.length) {
      elements.linkFaviconPreviewImage.src = "assets/favicon.png";
      return;
    }

    elements.linkFaviconPreviewImage.src = candidates[index++];
  };

  elements.linkFaviconPreviewImage.onload = () => {
    elements.linkFaviconPreview.classList.remove("hidden");
  };

  elements.linkFaviconPreviewImage.onerror = tryNext;

  elements.linkFaviconPreview.classList.remove("hidden");
  tryNext();
}

export function clearLinkForm() {
  elements.linkTitle.value = "";
  elements.linkUrl.value = "";

  const colors = QUICK_LINKS.COLORS;
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  elements.linkColor.value = randomColor;
  updateFaviconPreview("");

  /*
  Reset previous validation states
  when opening a fresh form.
  */
  showInputError("linkTitle", "linkTitleError", null);
  showInputError("linkUrl", "linkUrlError", null);
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
   Quick Link Validation UI
========================================================== */

/**
 * Show validation message near input
 *
 * @param {string} inputId
 * @param {string} errorId
 * @param {string|null} message
 */

export function showInputError(inputId, errorId, message) {
  const input = document.getElementById(inputId);

  const error = document.getElementById(errorId);

  if (!input || !error) {
    return;
  }

  if (message) {
    input.classList.add("input-invalid");

    error.textContent = message;

    error.classList.add("show");
  } else {
    input.classList.remove("input-invalid");

    error.textContent = "";

    error.classList.remove("show");
  }
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
    } else {
      link.classList.add("disabled");
      link.setAttribute("aria-disabled", "true");
    }
  });
}

/* ==========================================================
   Quick Links Renderer
========================================================== */

function createFaviconElement(url, title) {
  const image = document.createElement("img");

  image.className = "quick-link__icon";
  image.alt = "";
  image.loading = "lazy";
  image.decoding = "async";
  image.title = `${title} favicon`;

  const candidates = getFaviconCandidates(url);
  let index = 0;

  image.onerror = () => {
    if (index < candidates.length) {
      image.src = candidates[index++];
    }
  };

  image.src = candidates[index++] || "assets/favicon.png";

  return image;
}

export function renderQuickLinks(links) {
  if (!elements.quickLinksContainer) {
    return;
  }

  elements.quickLinksContainer.innerHTML = "";

  if (!links.length) {
    const empty = document.createElement("p");
    empty.className = "quick-links__empty";
    empty.textContent = "No quick links yet.";
    elements.quickLinksContainer.appendChild(empty);
    return;
  }

  links.forEach((link) => {
    const wrapper = document.createElement("div");

    wrapper.className = "quick-link-wrapper";
    wrapper.dataset.id = String(link.id);

    enableQuickLinkDrag(wrapper);

    const button = document.createElement("a");

    button.className = "btn quick-link";
    button.draggable = false;
    button.href = link.url;
    button.target = "_blank";
    button.rel = "noopener noreferrer";
    button.style.background = link.color;

    if (!quickLinksEnabled) {
      button.classList.add("disabled");
      button.setAttribute("aria-disabled", "true");
    }

    const content = document.createElement("span");
    content.className = "quick-link__content";

    content.append(createFaviconElement(link.url, link.title));

    const title = document.createElement("span");
    title.className = "quick-link__title";
    title.textContent = link.title;

    content.appendChild(title);
    button.appendChild(content);

    const deleteButton = document.createElement("button");
    deleteButton.className = "quick-link-delete";
    deleteButton.type = "button";
    deleteButton.textContent = "×";
    deleteButton.dataset.id = String(link.id);
    deleteButton.setAttribute("aria-label", `Delete ${link.title}`);

    wrapper.append(button, deleteButton);
    elements.quickLinksContainer.appendChild(wrapper);
  });

  toggleQuickLinks(quickLinksEnabled);
}

/* ==========================================================
   Quick Links Drag & Drop
   Supports Mouse + Touch
========================================================== */

function enableQuickLinkDrag(element) {
  let startX = 0;
  let startY = 0;

  let isDragging = false;

  let pointerId = null;

  element.addEventListener("pointerdown", (event) => {
    /*
      Detect pointer start.
      Drag should not begin immediately
      because this can be a normal link click.
    */
    startX = event.clientX;
    startY = event.clientY;

    pointerId = event.pointerId;

    isDragging = false;
  });

  element.addEventListener("pointermove", (event) => {
    if (pointerId !== event.pointerId) {
      return;
    }

    const distance =
      Math.abs(event.clientX - startX) + Math.abs(event.clientY - startY);

    /*
      Movement smaller than 8 pixels
      is considered a normal click.
    */
    if (distance < 8) {
      return;
    }

    if (!isDragging) {
      isDragging = true;

      element.classList.add("dragging");

      /*
        Enable pointer capture only
        after dragging has actually started.
      */
      element.setPointerCapture(event.pointerId);
    }

    const target = document
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest(".quick-link-wrapper");

    if (target && target !== element) {
      const container = elements.quickLinksContainer;

      const items = [...container.children];

      const current = items.indexOf(element);

      const targetIndex = items.indexOf(target);

      if (current < targetIndex) {
        container.insertBefore(element, target.nextSibling);
      } else {
        container.insertBefore(element, target);
      }
    }
  });

  element.addEventListener("pointerup", (event) => {
    if (isDragging) {
      if (element.hasPointerCapture(event.pointerId)) {
        element.releasePointerCapture(event.pointerId);
      }

      updateQuickLinksOrder();
    }

    element.classList.remove("dragging");

    isDragging = false;

    pointerId = null;
  });

  element.addEventListener("pointercancel", () => {
    element.classList.remove("dragging");

    isDragging = false;
  });
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

/**
 * Clear validation errors while user is typing
 *
 * Improves UX by removing old
 * validation messages immediately
 * when user starts correcting input.
 */
export function bindValidationInputEvents() {
  elements.linkTitle?.addEventListener("input", () => {
    showInputError("linkTitle", "linkTitleError", null);
  });

  elements.linkUrl?.addEventListener("input", () => {
    showInputError("linkUrl", "linkUrlError", null);
    updateFaviconPreview(elements.linkUrl.value.trim());
  });
}

/**
 * Bind theme toggle button event
 *
 * Theme switching logic is handled
 * inside theme.js.
 *
 * This function only connects
 * the UI button with the callback.
 */
export function onThemeToggle(callback) {
  elements.themeButton?.addEventListener("click", callback);
}

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

export function onExportSettings(callback) {
  elements.exportSettingsButton?.addEventListener("click", callback);
}

export function onImportSettings(callback) {
  elements.importSettingsButton?.addEventListener("click", () => {
    elements.importSettingsInput?.click();
  });

  elements.importSettingsInput?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];

    if (file) {
      callback(file);
    }

    /*
     * Allow importing the same file again
     */
    event.target.value = "";
  });
}

/* ==========================================================
   Network Availability State
========================================================== */

export function renderOfflineState() {
  elements.offlineBanner?.classList.remove("hidden");

  replaceStatusClass("status-warning");

  setText(elements.statusIcon, ICONS.WARNING);

  setText(elements.statusTitle, "Offline");

  setText(
    elements.statusMessage,
    "SafeIP is available offline, but live network checks require an internet connection.",
  );

  toggleQuickLinks(false);
}

export function renderOnlineState() {
  elements.offlineBanner?.classList.add("hidden");
}

export function onNetworkStatusChange(callback) {
  window.addEventListener("online", () => callback(true));
  window.addEventListener("offline", () => callback(false));
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

  initializeCountrySelector,

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

  showInputError,

  bindValidationInputEvents,

  onExportSettings,

  onImportSettings,
  renderOfflineState,
  renderOnlineState,
  onNetworkStatusChange,
};
