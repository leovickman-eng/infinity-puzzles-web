'use client';

import { useEffect } from 'react';

const TRACKING_KEYS = ['fbclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const STORAGE_KEY = 'ip_tracking';

/**
 * Captures fbclid and utm_* params from the URL on first visit and
 * stores them in sessionStorage so they can be appended to the checkout URL.
 */
export default function TrackingCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const captured: Record<string, string> = {};
    let found = false;
    for (const key of TRACKING_KEYS) {
      const val = params.get(key);
      if (val) { captured[key] = val; found = true; }
    }
    if (found) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(captured));
    }
  }, []);

  return null;
}
