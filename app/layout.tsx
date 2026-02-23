import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter, Noto_Serif_TC } from 'next/font/google';
import './globals.css';

// Display font - Elegant serif for headings (Cormorant as Canela alternative)
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

// Body font - Clean, modern sans-serif
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

// Traditional Chinese font (TC not SC - Taiwan uses Traditional)
const notoSerifTC = Noto_Serif_TC({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-serif-tc',
  display: 'swap',
});

export const metadata: Metadata = {
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
      <body
        className={`${cormorant.variable} ${inter.variable} ${notoSerifTC.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
