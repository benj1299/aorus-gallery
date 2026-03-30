import { Cormorant_Garamond, DM_Sans, Noto_Serif_TC } from 'next/font/google';

// Display font - Elegant serif for headings (Cormorant as Canela alternative)
export const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

// Body font - Clean, modern sans-serif
export const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
});

// Traditional Chinese font (TC not SC - Taiwan uses Traditional)
export const notoSerifTC = Noto_Serif_TC({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-serif-tc',
  display: 'swap',
});
