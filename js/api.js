/*
==========================================================
SafeIP
api.js
Network API Service
Version: 1.2.0
==========================================================
*/

import { API } from "./config.js";

const TIMEOUT = API.TIMEOUT;

/*
==========================================================
Fetch JSON
==========================================================
*/

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

      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

/*
==========================================================
Normalize GeoJS
==========================================================
*/

function normalizeGeoJS(data) {
  return {
    ip: data.ip,

    country: data.country,

    countryCode: data.country_code,

    region: data.region,

    city: data.city,

    timezone: data.timezone,

    isp: data.organization || "",
  };
}

/*
==========================================================
Normalize IPWho
==========================================================
*/

function normalizeIPWho(data) {
  if (!data.success) {
    throw new Error("IPWho failed");
  }

  return {
    ip: data.ip,

    country: data.country,

    countryCode: data.country_code,

    region: data.region,

    city: data.city,

    timezone: data.timezone?.id || "",

    isp: data.connection?.isp || "",
  };
}

/*
==========================================================
Normalize IPify
==========================================================
*/

function normalizeIPify(data) {
  return {
    ip: data.ip,

    country: "Unknown",

    countryCode: "UN",

    region: "",

    city: "",

    timezone: "",

    isp: "",
  };
}

/*
==========================================================
Check Data
==========================================================
*/

function validate(data) {
  return Boolean(data && data.ip);
}

/*
==========================================================
Main Function
==========================================================
*/

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

  for (const service of services) {
    try {
      const response = await fetchJSON(service.url);

      const result = service.normalize(response);

      if (validate(result)) {
        console.log("API Success:", service.name);

        return result;
      }
    } catch (error) {
      console.warn(
        `${service.name} failed:`,

        error.message,
      );
    }
  }

  throw new Error("Network information service temporarily unavailable");
}
