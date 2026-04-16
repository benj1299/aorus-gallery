'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, X, Check } from 'lucide-react';

interface DeleteButtonProps {
  id: string;
  action: (id: string) => Promise<void | { error: string }>;
}

export function DeleteButton({ id, action }: DeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await action(id);
    } catch (error: unknown) {
      const err = error as { digest?: string };
      if (err?.digest?.startsWith('NEXT_REDIRECT')) throw error;
      console.error('Delete failed:', error);
    }
    router.refresh();
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          className="h-8 w-8 inline-flex items-center justify-center rounded-md bg-red-600 text-white transition-colors"
          onClick={handleDelete}
          title="Confirmer"
          data-testid="delete-confirm"
        >
          <Check className="h-4 w-4" />
        </button>
        <button
          className="h-8 w-8 inline-flex items-center justify-center rounded-md bg-white text-gray-600 border border-gray-200 transition-colors"
          onClick={() => setConfirming(false)}
          title="Annuler"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      className="h-8 w-8 inline-flex items-center justify-center rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
      onClick={() => setConfirming(true)}
      title="Supprimer"
      data-testid="delete-btn"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
