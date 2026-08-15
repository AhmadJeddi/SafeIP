/*
==========================================================
SafeIP
pwa.js
PWA Registration and Installation
Version: 1.0.0
==========================================================
*/

let deferredInstallPrompt = null;

function getInstallButton() {
  return document.getElementById("installAppButton");
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

function updateInstallButtonVisibility() {
  const button = getInstallButton();

  if (!button || isStandalone()) {
    return;
  }

  button.classList.toggle("hidden", !deferredInstallPrompt);
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

export function initializePWA() {
  const button = getInstallButton();

  if (!button) {
    return;
  }

  button.classList.add("hidden");

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();

    deferredInstallPrompt = event;

    updateInstallButtonVisibility();
  });

  button.addEventListener("click", async () => {
    if (!deferredInstallPrompt) {
      return;
    }

    const promptEvent = deferredInstallPrompt;

    deferredInstallPrompt = null;
    updateInstallButtonVisibility();

    try {
      await promptEvent.prompt();
    } catch (error) {
      console.warn("PWA install prompt failed:", error);
    }
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    button.classList.add("hidden");
  });

  updateInstallButtonVisibility();
}
