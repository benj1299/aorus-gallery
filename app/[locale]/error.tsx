'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('error');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blanc">
      <div className="text-center px-6">
        <h2 className="font-display text-3xl text-noir mb-4">{t('title')}</h2>
        <p className="text-noir/60 mb-8">{t('description')}</p>
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-noir text-blanc text-sm font-medium rounded-lg hover:bg-noir/90 transition-colors"
        >
          {t('retry')}
        </button>
      </div>
    </div>
  );
}
