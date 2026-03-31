import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { cormorant, dmSans, notoSerifTC } from '@/lib/fonts';
import { getSiteSettings } from '@/lib/queries/settings';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const settings = await getSiteSettings();

  return (
    <div className={`${cormorant.variable} ${dmSans.variable} ${notoSerifTC.variable} font-sans antialiased`}>
      <NextIntlClientProvider messages={messages}>
        <div className="min-h-screen flex flex-col bg-blanc" lang={locale}>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-noir focus:text-blanc focus:text-sm">
            Skip to content
          </a>
          <Header showExhibitions={settings.showExhibitions} />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
        </div>
      </NextIntlClientProvider>
    </div>
  );
}
