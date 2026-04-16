'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('admin.error');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center p-12">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('title')}</h2>
        <p className="text-gray-500 text-sm mb-6">{error.message || t('defaultMessage')}</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          {t('retry')}
        </button>
      </div>
    </div>
  );
}
