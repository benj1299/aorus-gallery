import type { Metadata } from 'next';
import Script from 'next/script';
import { getLocale } from 'next-intl/server';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';

// GA Measurement ID — set via Vercel env. If absent, the GoogleAnalytics
// component is not rendered (no script load, no PII leakage).
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL('https://www.orusgallery.com'),
  title: 'ORUS Gallery | Contemporary Art | Taiwan',
  description:
    'ORUS Gallery represents international contemporary artists for Asian and global collectors. Origin + Us: where art meets identity. Based in Taiwan with connections to Paris.',
  keywords: [
    'art gallery',
    'contemporary art',
    'Taiwan',
    'Paris',
    'luxury gallery',
    'art collection',
    'international artists',
    'Asian collectors',
    'memory',
    'identity',
  ],
  openGraph: {
    title: 'ORUS Gallery',
    description: 'Contemporary Art | Taiwan — Paris | Origin + Us',
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['fr_FR', 'zh_TW'],
    images: [{ url: '/images/gallery/logo.jpeg', width: 800, height: 800, alt: 'ORUS Gallery' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@orusgallery',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return (
    <html suppressHydrationWarning lang={locale}>
      <body>{children}</body>

      {/* === GA4 Consent Mode v2 ===
          RGPD-friendly default : tous les consents commencent à 'denied'.
          GA4 reçoit alors UNIQUEMENT des "consent signals" (traffic agrégé +
          modélisé), aucune donnée personnelle. Quand on ajoutera un cookie
          banner, il appellera gtag('consent', 'update', { ad_storage: 'granted',
          analytics_storage: 'granted' }) pour activer le tracking complet.
          Tant que le banner n'est pas en place, on reste en "tracking minimal
          conforme RGPD" — GA collecte des stats de trafic sans cookies. */}
      {GA_ID && (
        <Script id="gtag-consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              wait_for_update: 500
            });
            gtag('set', 'ads_data_redaction', true);
          `}
        </Script>
      )}
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
    </html>
  );
}
