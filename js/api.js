/*
==========================================================
SafeIP
api.js
Network API Service
Version: 1.3.0
==========================================================
*/

import { API } from "./config.js";

const TIMEOUT = API.TIMEOUT;

/* ==========================================================
   Fetch JSON
========================================================== */

async function fetchJSON(url) {
  console.log("Trying API:", url);

  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, TIMEOUT);

  try {
    const response = await fetch(url, {
      method: "GET",

      signal: controller.signal,

      cache: API.CACHE,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

/* ==========================================================
   Normalize GeoJS
========================================================== */

function normalizeGeoJS(data) {
  return {
    ip: data?.ip || "",

    country: data?.country || "",

    countryCode: data?.country_code || "",

    region: data?.region || "",

    city: data?.city || "",

    timezone: data?.timezone || "",

    isp: data?.organization_name || data?.organization || "",
  };
}

/* ==========================================================
   Normalize IPWho
========================================================== */

function normalizeIPWho(data) {
  if (!data?.success) {
    throw new Error(data?.message || "IPWho failed");
  }

  return {
    ip: data.ip || "",

    country: data.country || "",

    countryCode: data.country_code || "",

    region: data.region || "",

    city: data.city || "",

    timezone: data.timezone?.id || data.timezone || "",

    isp: data.connection?.isp || data.connection?.org || "",
  };
}

/* ==========================================================
   Normalize IPify
========================================================== */

function normalizeIPify(data) {
  return {
    ip: data?.ip || "",

    country: "",

    countryCode: "",

    region: "",

    city: "",

    timezone: "",

    isp: "",
  };
}

/* ==========================================================
   Validate Network Data
========================================================== */

function validateIP(data) {
  return Boolean(data && data.ip);
}

function validateCompleteGeoData(data) {
  return Boolean(data && data.ip && data.country && data.countryCode);
}

/* ==========================================================
   Main Function
========================================================== */

export async function getNetworkInfo() {
  const services = [
    {
      name: "GeoJS",

      url: "https://get.geojs.io/v1/ip/geo.json",

      normalize: normalizeGeoJS,
    },

    {
      name: "IPWho",

      url: "https://ipwho.is/",

      normalize: normalizeIPWho,
    },

    {
      name: "IPify",

      url: "https://api.ipify.org?format=json",

      normalize: normalizeIPify,
    },
  ];

  let bestPartialResult = null;

  for (const service of services) {
    try {
      const response = await fetchJSON(service.url);

      const result = service.normalize(response);

      if (!validateIP(result)) {
        throw new Error("API returned no IP address.");
      }

      if (validateCompleteGeoData(result)) {
        console.log("API Success:", service.name);

        return result;
      }

      if (!bestPartialResult) {
        bestPartialResult = result;
      }

      console.warn(`${service.name} returned partial network information.`);
    } catch (error) {
      console.warn(
        `${service.name} failed:`,

        error.message,
      );
    }
  }

  if (bestPartialResult) {
    console.warn(
      "Returning partial network information after all full geo lookups failed.",
    );

    return bestPartialResult;
  }

  throw new Error("Network information service temporarily unavailable");
}
