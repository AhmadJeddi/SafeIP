/*
==========================================================
SafeIP
quick-links-validator.js
Quick Links Validation
Version: 1.0.0
==========================================================
*/

import { QUICK_LINKS } from "./config.js";

/* ==========================================================
   Normalize URL
========================================================== */

/**
 * Add default protocol if missing
 *
 * @param {string} url
 * @returns {string}
 */
export function normalizeURL(url) {
  let normalized = url.trim();

  /*
  Reject dangerous protocols
  */

  if (
    /^[a-z][a-z0-9+.-]*:/i.test(normalized) &&
    !/^https?:\/\//i.test(normalized)
  ) {
    return normalized;
  }

  /*
  Add default protocol
  */

  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `${QUICK_LINKS.DEFAULT_PROTOCOL}${normalized}`;
  }

  return normalized;
}

/* ==========================================================
   Validate URL
========================================================== */

/**
 * Validate quick link URL
 *
 * @param {string} url
 * @returns {Object}
 */
export function validateURL(url) {
  try {
    const parsed = new URL(url);

    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return {
        valid: false,
        message: "Only HTTP and HTTPS links are allowed.",
      };
    }

    /*
      Check hostname
    */

    const hostname = parsed.hostname;

    if (!hostname || hostname.length < 3) {
      return {
        valid: false,
        message: "Please enter a valid URL.",
      };
    }

    /*
      Reject only numbers
      Example:
      https://2
      https://123
    */

    if (/^\d+$/.test(hostname)) {
      return {
        valid: false,
        message: "URL domain cannot be only numbers.",
      };
    }

    /*
      Require domain dot
      Example:
      github.com ✅
      abc ❌
    */

    if (!hostname.includes(".")) {
      return {
        valid: false,
        message: "Please enter a valid domain.",
      };
    }

    return {
      valid: true,
      url: parsed.href,
    };
  } catch (error) {
    return {
      valid: false,
      message: "Please enter a valid URL.",
    };
  }
}

/* ==========================================================
   Check Duplicate URL
========================================================== */

/**
 * Check if quick link URL already exists
 *
 * @param {string} url
 * @param {Array} links
 * @returns {boolean}
 */
export function isDuplicateURL(url, links) {
  return links.some((link) => link.url.toLowerCase() === url.toLowerCase());
}

/* ==========================================================
   Validate Title
========================================================== */

/**
 * Validate quick link title
 *
 * @param {string} title
 * @returns {Object}
 */
export function validateTitle(title) {
  const value = title.trim();

  if (!value) {
    return {
      valid: false,

      message: "Title is required.",
    };
  }

  if (value.length > QUICK_LINKS.MAX_TITLE_LENGTH) {
    return {
      valid: false,

      message: `Title must be less than ${QUICK_LINKS.MAX_TITLE_LENGTH} characters.`,
    };
  }

  return {
    valid: true,

    title: value,
  };
}

/* ==========================================================
   Validate Quick Link
========================================================== */

/**
 * Validate complete quick link
 *
 * @param {Object} data
 * @returns {Object}
 */
export function validateQuickLink(data) {
  const titleResult = validateTitle(data.title);

  if (!titleResult.valid) {
    return titleResult;
  }

  const normalizedURL = normalizeURL(data.url);

  if (normalizedURL.length > QUICK_LINKS.MAX_URL_LENGTH) {
    return {
      valid: false,
      message: "URL is too long.",
    };
  }

  const urlResult = validateURL(normalizedURL);

  if (!urlResult.valid) {
    return urlResult;
  }

  return {
    valid: true,

    data: {
      title: titleResult.title,

      url: urlResult.url,

      color: data.color,
    },
  };
}
