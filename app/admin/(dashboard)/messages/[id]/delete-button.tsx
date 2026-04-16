'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Trash2 } from 'lucide-react';
import { deleteMessage } from '@/lib/actions/messages';

export function MessageDeleteButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  const t = useTranslations('admin.messages.detail');
  const tf = useTranslations('admin.forms');

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-red-600">{t('deleteConfirm')}</span>
        <button
          onClick={() => deleteMessage(id)}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
        >
          {t('yes')}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {t('no')}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
    >
      <Trash2 className="h-4 w-4" />
      {tf('delete')}
    </button>
  );
}
