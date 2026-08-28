/*
==========================================================
SafeIP
pwa.js
PWA Registration and Installation
Version: 1.1.0
==========================================================
*/

let deferredInstallPrompt = null;
let appInstalled = false;

function getInstallButton() {
  return document.getElementById("installAppButton");
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

/*
 * Check whether SafeIP is already installed.
 *
 * display-mode detects when the current page is running
 * as a standalone PWA.
 *
 * getInstalledRelatedApps() detects an installed SafeIP PWA
 * even when this page is opened in the browser.
 */
async function isAppInstalled() {
  if (isStandalone()) {
    return true;
  }

  if (typeof navigator.getInstalledRelatedApps !== "function") {
    return false;
  }

  try {
    const relatedApps = await navigator.getInstalledRelatedApps();

    return relatedApps.some((app) => app.platform === "webapp");
  } catch (error) {
    console.warn("Unable to detect installed PWA:", error);
    return false;
  }
}

function hideInstallButton() {
  const button = getInstallButton();

  if (!button) {
    return;
  }

  button.classList.add("hidden");
}

function showInstallButton() {
  const button = getInstallButton();

  if (!button || appInstalled || isStandalone()) {
    return;
  }

  button.classList.remove("hidden");
}

export function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js", { scope: "./" })
      .then((registration) => {
        console.log("SafeIP Service Worker registered:", registration.scope);
      })
      .catch((error) => {
        console.warn("Service Worker registration failed:", error);
      });
  });
}

export async function initializePWA() {
  const button = getInstallButton();

  if (!button) {
    return;
  }

  hideInstallButton();

  /*
   * Capture the browser install prompt so it can be
   * triggered later from the custom Install button.
   */
  window.addEventListener("beforeinstallprompt", (event) => {
    if (appInstalled || isStandalone()) {
      return;
    }

    event.preventDefault();

    deferredInstallPrompt = event;
    showInstallButton();
  });

  /*
   * The application has just been installed.
   * No install prompt should be offered anymore.
   */
  window.addEventListener("appinstalled", () => {
    appInstalled = true;
    deferredInstallPrompt = null;
    hideInstallButton();
  });

  button.addEventListener("click", async () => {
    if (!deferredInstallPrompt) {
      return;
    }

    const promptEvent = deferredInstallPrompt;

    deferredInstallPrompt = null;
    hideInstallButton();

    try {
      await promptEvent.prompt();
    } catch (error) {
      console.warn("PWA install prompt failed:", error);
    }
  });

  /*
   * Check the real installation state when the web page
   * is opened in the browser.
   */
  appInstalled = await isAppInstalled();

  if (appInstalled) {
    hideInstallButton();
  }
}
