/*
==========================================================
SafeIP
validator.js
Security Validation Engine
Version: 1.1.1
==========================================================
*/

import { SECURITY_LEVEL, SCORE } from "./config.js";
import { getCountryByCode } from "./countries.js";

/* ==========================================================
   Country Validation
========================================================== */

function validateCountry(selectedCountry, detectedCountry) {
  if (
    typeof selectedCountry !== "string" ||
    typeof detectedCountry !== "string"
  ) {
    return false;
  }

  const normalizedSelectedCountry = selectedCountry.toUpperCase();
  const normalizedDetectedCountry = detectedCountry.toUpperCase();

  if (!getCountryByCode(normalizedSelectedCountry)) {
    return false;
  }

  return normalizedSelectedCountry === normalizedDetectedCountry;
}

/* ==========================================================
   Internet Validation
========================================================== */

function validateInternet(networkData) {
  return Boolean(networkData);
}

/* ==========================================================
   API Validation
========================================================== */

function validateAPI(networkData) {
  return Boolean(networkData && networkData.ip);
}

function hasLocationData(networkData) {
  return Boolean(networkData && networkData.country && networkData.countryCode);
}

/* ==========================================================
   Result Builder
========================================================== */

function createResult({ safe, level, score, title, message, checks }) {
  return {
    safe,

    level,

    score,

    title,

    message,

    checks,
  };
}

/* ==========================================================
   Main Validator
========================================================== */

export function validateNetwork(selectedCountry, networkData) {
  /* ========================================================
     Internet Check
  ======================================================== */

  const internet = validateInternet(networkData);

  if (!internet) {
    return createResult({
      safe: false,

      level: SECURITY_LEVEL.WARNING,

      score: SCORE.WARNING,

      title: "No Connection",

      message: "Unable to retrieve network information.",

      checks: {
        internet: false,

        api: false,

        country: false,

        login: false,
      },
    });
  }

  /* ========================================================
     API Check
  ======================================================== */

  const api = validateAPI(networkData);

  if (!api) {
    return createResult({
      safe: false,

      level: SECURITY_LEVEL.WARNING,

      score: SCORE.WARNING,

      title: "Invalid Response",

      message: "The IP service returned incomplete information.",

      checks: {
        internet: true,

        api: false,

        country: false,

        login: false,
      },
    });
  }

  /* ========================================================
     Location Check
  ======================================================== */

  if (!hasLocationData(networkData)) {
    return createResult({
      safe: false,

      level: SECURITY_LEVEL.WARNING,

      score: SCORE.WARNING,

      title: "Location Unavailable",

      message:
        "Your IP address was detected, but complete location information is unavailable.",

      checks: {
        internet: true,

        api: true,

        country: false,

        login: false,
      },
    });
  }

  /* ========================================================
     Country Check
  ======================================================== */

  const country = validateCountry(
    selectedCountry,

    networkData.countryCode,
  );

  if (!country) {
    return createResult({
      safe: false,

      level: SECURITY_LEVEL.DANGER,

      score: SCORE.DANGER,

      title: "Unsafe Network",

      message: `Detected country (${networkData.country}) does not match selected country.`,

      checks: {
        internet: true,

        api: true,

        country: false,

        login: false,
      },
    });
  }

  /* ========================================================
     Safe Result
  ======================================================== */

  return createResult({
    safe: true,

    level: SECURITY_LEVEL.SAFE,

    score: SCORE.SAFE,

    title: "Safe Network",

    message:
      "Your network passed the SafeIP verification. The detected IP location matches your selected country.",

    checks: {
      internet: true,

      api: true,

      country: true,

      login: true,
    },
  });
}

/* ==========================================================
   Helper Functions
========================================================== */

export function isSafe(result) {
  return Boolean(result && result.level === SECURITY_LEVEL.SAFE);
}

export function canLogin(result) {
  return Boolean(result && result.safe);
}

export function isWarning(result) {
  return Boolean(result && result.level === SECURITY_LEVEL.WARNING);
}

export function isDanger(result) {
  return Boolean(result && result.level === SECURITY_LEVEL.DANGER);
}
