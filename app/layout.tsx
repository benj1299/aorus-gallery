import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://aorus-gallery.vercel.app'),
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body>{children}</body>
    </html>
  );
}
