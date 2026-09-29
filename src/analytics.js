import { calculatePosition } from "./util/sizerUtil.js";

const websiteId = "00bb3f90-3cce-45fa-9508-6281ed65e97e";
const domains = ["swarajpanigrahi.in", "www.swarajpanigrahi.in"];
const seen = new Set();
const pending = [];
let enabled = false;
let ready = false;

function send(name, data) {
  try {
    Promise.resolve(window.umami?.track(name, data)).catch(() => {});
  } catch {
    // Analytics must never interrupt the calculator, including when blocked.
  }
}

// One event per action/field/outcome per page keeps the shared quota small.
export function trackSizeEvent(action, data = {}, key = action) {
  if (!enabled || seen.has(key)) return;
  seen.add(key);
  if (ready) send(`size-${action}`, data);
  else if (pending.length < 25) pending.push([`size-${action}`, data]);
}

export function trackPlanEdit(field, input) {
  trackSizeEvent("engaged", { elapsed_ms: Math.round(performance.now()) });
  trackSizeEvent("field-used", { field }, `field-${field}`);
  const { result } = calculatePosition(input);
  const outcome = !result
    ? "invalid-input"
    : result.quantity === 0
      ? "zero-shares"
      : result.tradeFits
        ? "meets-rules"
        : "below-minimum";
  trackSizeEvent("plan-evaluated", { outcome }, `plan-${outcome}`);
}

export function initAnalytics() {
  if (
    enabled ||
    !import.meta.env.PROD ||
    !domains.includes(location.hostname) ||
    !/^\/size\/?$/.test(location.pathname)
  )
    return;
  enabled = true;
  // Normalize the app route and discard URL parameters/fragments before sending.
  window.sizeBeforeSend = (type, payload) => {
    if (type !== "event") return payload;
    const clean = { ...payload, url: "/size" };
    if (clean.referrer) {
      try {
        const referrer = new URL(clean.referrer);
        clean.referrer = referrer.origin + referrer.pathname;
      } catch {
        clean.referrer = "";
      }
    }
    return clean;
  };
  const script = document.createElement("script");
  script.src = "https://cloud.umami.is/script.js";
  script.defer = true;
  script.dataset.websiteId = websiteId;
  script.dataset.domains = domains.join(",");
  script.dataset.excludeSearch = "true";
  script.dataset.excludeHash = "true";
  script.dataset.beforeSend = "sizeBeforeSend";
  script.dataset.tag = "position-size";
  script.onload = () => {
    ready = true;
    for (const [name, data] of pending.splice(0)) send(name, data);
  };
  script.onerror = () => {
    pending.length = 0;
    enabled = false;
  };
  document.head.append(script);
  window.addEventListener("error", () => trackSizeEvent("app-error"));
  window.addEventListener("unhandledrejection", () =>
    trackSizeEvent("app-error"),
  );

  const recordLoad = () => {
    // Run after the load event completes so loadEventEnd is populated.
    setTimeout(() => {
      const navigation = performance.getEntriesByType("navigation")[0];
      if (!navigation) return;
      const paint = performance.getEntriesByName("first-contentful-paint")[0];
      trackSizeEvent("load", {
        load_ms: Math.round(navigation.loadEventEnd),
        dom_ready_ms: Math.round(navigation.domContentLoadedEventEnd),
        ttfb_ms: Math.round(navigation.responseStart - navigation.requestStart),
        ...(paint ? { fcp_ms: Math.round(paint.startTime) } : {}),
      });
    }, 0);
  };
  if (document.readyState === "complete") recordLoad();
  else window.addEventListener("load", recordLoad, { once: true });
}
