'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Trash2, X, Check, Loader2 } from 'lucide-react';

interface DeleteButtonProps {
  id: string;
  action: (id: string) => Promise<void | { error: string }>;
}

export function DeleteButton({ id, action }: DeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const t = useTranslations('admin.table');
  const tf = useTranslations('admin.feedback');

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await action(id);
        if (result && 'error' in result && result.error) {
          toast.error(result.error);
          setConfirming(false);
          return;
        }
        toast.success(tf('deleted', { defaultValue: 'Supprimé' }));
        setConfirming(false);
        router.refresh();
      } catch (error: unknown) {
        const err = error as { digest?: string };
        if (err?.digest?.startsWith('NEXT_REDIRECT')) throw error;
        console.error('Delete failed:', error);
        toast.error(tf('deleteError', { defaultValue: 'Échec de la suppression' }));
        setConfirming(false);
      }
    });
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          className="h-8 w-8 inline-flex items-center justify-center rounded-md bg-red-600 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={handleDelete}
          disabled={isPending}
          title={t('confirmDelete')}
          data-testid="delete-confirm"
          aria-busy={isPending}
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        </button>
        <button
          className="h-8 w-8 inline-flex items-center justify-center rounded-md bg-white text-gray-600 border border-gray-200 transition-colors disabled:opacity-60"
          onClick={() => setConfirming(false)}
          disabled={isPending}
          title={t('cancelDelete')}
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
      title={t('delete')}
      data-testid="delete-btn"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
