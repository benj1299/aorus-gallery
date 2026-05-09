import { requireAuth } from '@/lib/auth-utils';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

// Print routes (artist inventory, exhibition card, etc.) need their own layout
// to inject NextIntlClientProvider — without it, useTranslations() in client
// components throws "context from NextIntlClientProvider was not found" and
// every print route returns HTTP 500. (Bug found 2026-05-09.)
//
// We deliberately keep the markup minimal — no sidebar, no mobile bar, no toast
// container — so CMD+P produces a clean page from the inner client component.

export default async function AdminPrintLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();

  setRequestLocale('fr');
  const messages = (await import('@/messages/fr.json')).default;

  return (
    <NextIntlClientProvider locale="fr" messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
