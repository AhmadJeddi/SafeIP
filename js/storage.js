/*
==========================================================
SafeIP
storage.js
Local Storage Manager
Version: 1.0.0
==========================================================
*/

import { STORAGE } from "./config.js";

/* ==========================================================
   Export Storage Keys
========================================================== */

export const STORAGE_KEYS = STORAGE;

/* ==========================================================
   Check Storage Availability
========================================================== */

function isStorageAvailable() {
  try {
    if (!window.localStorage) {
      return false;
    }

    const testKey = "__safeip_test__";

    localStorage.setItem(testKey, "test");

    localStorage.removeItem(testKey);

    return true;
  } catch {
    return false;
  }
}

/* ==========================================================
   Save Value
========================================================== */

/**
 * Save data in localStorage
 *
 * @param {string} key
 * @param {*} value
 * @returns {boolean}
 */
export function save(key, value) {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    localStorage.setItem(
      key,

      JSON.stringify(value),
    );

    return true;
  } catch (error) {
    console.error("Storage Save Error:", error);

    return false;
  }
}

/* ==========================================================
   Load Value
========================================================== */

/**
 * Load data from localStorage
 *
 * @param {string} key
 * @param {*} defaultValue
 * @returns {*}
 */
export function load(key, defaultValue = null) {
  if (!isStorageAvailable()) {
    return defaultValue;
  }

  try {
    const value = localStorage.getItem(key);

    if (value === null) {
      return defaultValue;
    }

    return JSON.parse(value);
  } catch (error) {
    console.error("Storage Load Error:", error);

    return defaultValue;
  }
}

/* ==========================================================
   Remove Value
========================================================== */

/**
 * Remove storage item
 *
 * @param {string} key
 * @returns {boolean}
 */
export function remove(key) {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    localStorage.removeItem(key);

    return true;
  } catch (error) {
    console.error("Storage Remove Error:", error);

    return false;
  }
}

/* ==========================================================
   Clear SafeIP Data
========================================================== */

/**
 * Remove only SafeIP keys
 *
 * @returns {boolean}
 */
export function clearSafeIPStorage() {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });

    return true;
  } catch (error) {
    console.error("Storage Clear Error:", error);

    return false;
  }
}

/* ==========================================================
   Country
========================================================== */

/**
 * Save selected country
 *
 * @param {string} countryCode
 */
export function saveSelectedCountry(countryCode) {
  return save(STORAGE_KEYS.COUNTRY, countryCode);
}

/**
 * Get selected country
 *
 * @returns {string}
 */
export function getSelectedCountry() {
  return load(STORAGE_KEYS.COUNTRY, "IR");
}

/* ==========================================================
   Last Check
========================================================== */

/**
 * Save last check time
 *
 * @param {string} dateTime
 */
export function saveLastCheck(dateTime) {
  return save(STORAGE_KEYS.LAST_CHECK, dateTime);
}

/**
 * Get last check time
 *
 * @returns {string|null}
 */
export function getLastCheck() {
  return load(STORAGE_KEYS.LAST_CHECK, null);
}

/* ==========================================================
   Auto Refresh
========================================================== */

/**
 * Save auto refresh status
 *
 * @param {boolean} enabled
 */
export function saveAutoRefresh(enabled) {
  return save(STORAGE_KEYS.AUTO_REFRESH, enabled);
}

/**
 * Get auto refresh status
 *
 * @returns {boolean}
 */
export function getAutoRefresh() {
  return load(STORAGE_KEYS.AUTO_REFRESH, false);
}
