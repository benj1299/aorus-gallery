'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

/**
 * RGPD-friendly cookie consent banner.
 *
 * Pattern : Consent Mode v2 default-denied is set globally in `app/layout.tsx`
 * via gtag('consent', 'default', { ..._storage: 'denied', wait_for_update: 500 }).
 * GA4 receives only "consent signals" (aggregated traffic) until user accepts.
 *
 * On accept  → gtag('consent','update',{analytics_storage:'granted'}) + persist
 * On reject  → no gtag update needed (already denied) + persist denial
 *
 * The banner reads localStorage on mount. If a decision exists, it stays
 * hidden. Decisions persist 12 months (RGPD recommended re-prompt cadence).
 *
 * Equal-weight Accept/Reject buttons per CNIL guidelines (2021).
 */

type Consent = 'granted' | 'denied';
const STORAGE_KEY = 'orus-consent';
const STORAGE_TS_KEY = 'orus-consent-ts';
const TWELVE_MONTHS_MS = 365 * 24 * 60 * 60 * 1000;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function applyConsent(decision: Consent) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('consent', 'update', {
    analytics_storage: decision,
    // Ads stay denied — Orus is not running paid acquisition. If/when they do,
    // a separate banner action should explicitly toggle ad_storage.
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
}

export function CookieBanner() {
  const t = useTranslations('cookies');
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const decision = localStorage.getItem(STORAGE_KEY) as Consent | null;
      const tsRaw = localStorage.getItem(STORAGE_TS_KEY);
      const ts = tsRaw ? parseInt(tsRaw, 10) : 0;
      const expired = !ts || Date.now() - ts > TWELVE_MONTHS_MS;

      if (!decision || expired) {
        setShow(true);
      } else {
        // Re-apply previous decision on every mount so SPA navigation doesn't
        // lose the consent state across the gtag instance lifecycle.
        applyConsent(decision);
      }
    } catch {
      // localStorage may be unavailable (private mode, embedded iframe). Show
      // the banner — user will choose, but decision won't persist. Safer than
      // silently sending data without consent.
      setShow(true);
    }
  }, []);

  function decide(decision: Consent) {
    try {
      localStorage.setItem(STORAGE_KEY, decision);
      localStorage.setItem(STORAGE_TS_KEY, Date.now().toString());
    } catch {
      // Persistence failed — apply consent only for this session.
    }
    applyConsent(decision);
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t('aria.label')}
      data-testid="cookie-banner"
      className="
        fixed inset-x-0 bottom-0 z-50
        border-t border-hairline bg-blanc/95 backdrop-blur-md
        shadow-[0_-4px_24px_rgba(0,0,0,0.04)]
      "
    >
      <div className="container-wide px-edge py-4 md:py-5">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <p className="flex-1 text-sm text-noir/75 leading-relaxed">
            {t('message')}{' '}
            <Link
              href="/privacy"
              className="underline decoration-or/40 underline-offset-2 hover:decoration-or transition-colors"
            >
              {t('learnMore')}
            </Link>
          </p>
          <div className="flex flex-shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => decide('denied')}
              data-testid="cookie-banner-reject"
              className="
                inline-flex items-center justify-center
                px-5 py-2 text-xs font-medium tracking-[0.15em] uppercase
                text-noir border border-noir/20
                hover:border-noir/60 transition-colors
              "
            >
              {t('reject')}
            </button>
            <button
              type="button"
              onClick={() => decide('granted')}
              data-testid="cookie-banner-accept"
              className="
                inline-flex items-center justify-center
                px-5 py-2 text-xs font-medium tracking-[0.15em] uppercase
                bg-noir text-blanc
                hover:opacity-85 transition-opacity
              "
            >
              {t('accept')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
