"use client";

// ─── UTM & URL parameter capture ──────────────────────────────────────────

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
  landing_source?: string;
  first_page_seen?: string;
  last_page_seen?: string;
}

const STORAGE_KEY = "ul_utm_data";

export function captureUTMs(): UTMParams {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const utm: UTMParams = {};

  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"] as const;
  for (const key of keys) {
    const val = params.get(key);
    if (val) utm[key] = val;
  }

  // First page seen (for multi-step funnels)
  const currentUrl = window.location.href;
  utm.landing_source = currentUrl;
  utm.first_page_seen = currentUrl;
  utm.last_page_seen = currentUrl;

  // Merge with any previously stored UTMs (first touch attribution)
  const existing = loadUTMs();
  if (existing?.utm_source && !utm.utm_source) {
    // Keep first-touch UTMs if current page has none
    return existing;
  }

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm));
  } catch { /* noop */ }

  return utm;
}

export function loadUTMs(): UTMParams | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getAllUtmParams(): Record<string, string> {
  const utm = loadUTMs() || captureUTMs();
  return Object.fromEntries(
    Object.entries(utm).filter(([, v]) => Boolean(v))
  ) as Record<string, string>;
}

/** Update last_page_seen before navigation or form submit */
export function updateLastPageSeen(): void {
  if (typeof window === "undefined") return;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const utm = JSON.parse(raw);
      utm.last_page_seen = window.location.href;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm));
    }
  } catch { /* noop */ }
}

// ─── Meta Pixel ───────────────────────────────────────────────────────────

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export function initPixel(): void {
  if (typeof window === "undefined" || !PIXEL_ID) return;
  if (window.fbq) return; // already initialized

  // Standard Meta Pixel bootstrap
  const script = document.createElement("script");
  script.async = true;
  script.defer = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  window._fbq = window._fbq || [];
  window.fbq = function (...args: any[]) {
    window._fbq.push(args);
  };
  window.fbq("init", PIXEL_ID);
  window.fbq("track", "PageView");
}

export function firePixelEvent(eventName: string, data?: Record<string, any>): void {
  if (typeof window === "undefined") return;
  try {
    if (window.fbq) {
      window.fbq("track", eventName, data || {});
    }
  } catch {
    // silently fail — pixel should not break the app
  }
}

export function firePixelCustomEvent(eventName: string, data?: Record<string, any>): void {
  if (typeof window === "undefined") return;
  try {
    if (window.fbq) {
      window.fbq("trackCustom", eventName, data || {});
    }
  } catch {
    // silently fail
  }
}