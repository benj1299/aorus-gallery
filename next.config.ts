import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // @react-pdf/renderer doit rester serveur — il dépend de yoga-layout +
  // pdfkit (Node natifs) et ne se bundle pas côté client.
  serverExternalPackages: ['sharp', '@react-pdf/renderer'],
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: '*.vercel-storage.com' },
      { protocol: 'https', hostname: '*.r2.dev' },
      { protocol: 'https', hostname: 'r2.orusgallery.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            // GA4 (`@next/third-parties/google`) charge gtag.js depuis googletagmanager.com
            // et envoie les events vers google-analytics.com (collect endpoint + img beacon).
            // Si NEXT_PUBLIC_GA_MEASUREMENT_ID n'est pas setté côté serveur, les composants
            // ne sont pas rendus → les domaines listés ici sont autorisés mais inutilisés.
            value: `default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com${isDev ? " 'unsafe-eval'" : ''}; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://images.unsplash.com https://res.cloudinary.com https://*.supabase.co https://*.vercel-storage.com https://*.r2.dev https://r2.orusgallery.com https://www.google-analytics.com https://www.googletagmanager.com; font-src 'self'; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com; frame-ancestors 'none'`,
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
