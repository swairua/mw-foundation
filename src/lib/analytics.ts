// Analytics wrapper. Plausible (cookie-free) is the recommended provider; GA4 is
// supported but only loads after the visitor accepts the cookie notice.
// Use track() for donation and form events — it is a no-op when no provider is set.
type Props = Record<string, string | number | boolean>;

const PLAUSIBLE = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
const GA4 = import.meta.env.VITE_GA4_ID;
const CONSENT_KEY = "mwf-consent";

export type Consent = "granted" | "denied";

export function getConsent(): Consent | null {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(value: Consent) {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* storage unavailable (private mode) — choice applies to this visit only */
  }
  if (value === "granted") loadGa4();
}

export const analyticsConfigured = Boolean(PLAUSIBLE || GA4);
export const needsConsent = Boolean(GA4);

function inject(src: string, attrs: Record<string, string> = {}) {
  const s = document.createElement("script");
  s.src = src;
  s.defer = true;
  for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v);
  document.head.appendChild(s);
}

let gaLoaded = false;
function loadGa4() {
  if (!GA4 || gaLoaded) return;
  gaLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA4, { anonymize_ip: true });
  inject(`https://www.googletagmanager.com/gtag/js?id=${GA4}`);
}

/** Called once after hydration; waits for the page to finish loading so it never competes with content. */
export function initAnalytics() {
  const start = () => {
    if (PLAUSIBLE && getConsent() !== "denied") {
      window.plausible =
        window.plausible ||
        Object.assign(
          (...args: unknown[]) => {
            (window.plausible!.q = window.plausible!.q || []).push(args);
          },
          { q: [] as unknown[] },
        );
      inject("https://plausible.io/js/script.outbound-links.file-downloads.js", { "data-domain": PLAUSIBLE });
    }
    if (GA4 && getConsent() === "granted") loadGa4();
  };
  if (document.readyState === "complete") setTimeout(start, 1500);
  else window.addEventListener("load", () => setTimeout(start, 1500), { once: true });
}

export function trackPageview() {
  // Plausible tracks SPA navigation automatically via history events.
  if (gaLoaded) window.gtag?.("event", "page_view", { page_location: window.location.href });
}

export function track(event: string, props?: Props) {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
    if (gaLoaded) window.gtag?.("event", event.toLowerCase().replace(/[^a-z0-9]+/g, "_"), props);
  } catch {
    /* never let analytics break the page */
  }
}
