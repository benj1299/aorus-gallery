import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

export default async function LoginLayout({ children }: { children: React.ReactNode }) {
  setRequestLocale('fr');
  const messages = (await import('@/messages/fr.json')).default;

  return (
    <NextIntlClientProvider locale="fr" messages={messages}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
