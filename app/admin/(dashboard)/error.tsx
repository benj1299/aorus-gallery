'use client';

import { useEffect } from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center p-12">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Une erreur est survenue</h2>
        <p className="text-gray-500 text-sm mb-6">{error.message || 'Erreur inattendue'}</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
