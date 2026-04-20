'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { Switch } from '@/components/ui/switch';

interface QuickToggleProps<F extends string = string> {
  id: string;
  field: F;
  checked: boolean;
  action: (id: string, field: F) => Promise<void | { error: string }>;
  label?: string;
}

export function QuickToggle<F extends string = string>({ id, field, checked, action, label }: QuickToggleProps<F>) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('admin.feedback');

  return (
    <label
      className="flex items-center gap-1.5 transition-opacity"
      style={{ opacity: isPending ? 0.5 : 1 }}
    >
      <Switch
        size="sm"
        checked={checked}
        disabled={isPending}
        data-testid={`toggle-${field}`}
        onCheckedChange={() => {
          startTransition(async () => {
            try {
              const result = await action(id, field);
              if (result && 'error' in result && result.error) {
                toast.error(result.error);
              } else {
                toast.success(t('updated', { defaultValue: 'Mis à jour' }), {
                  duration: 1500,
                });
              }
            } catch (err) {
              const message = err instanceof Error ? err.message : t('genericError', { defaultValue: 'Une erreur est survenue' });
              toast.error(message);
            }
          });
        }}
      />
      {label && <span className="text-xs text-gray-600 select-none">{label}</span>}
    </label>
  );
}
