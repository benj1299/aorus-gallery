'use client';

import { useTransition } from 'react';
import { Switch } from '@/components/ui/switch';

interface QuickToggleProps<F extends string = string> {
  id: string;
  field: F;
  checked: boolean;
  action: (id: string, field: F) => Promise<void>;
  label?: string;
}

export function QuickToggle<F extends string = string>({ id, field, checked, action, label }: QuickToggleProps<F>) {
  const [isPending, startTransition] = useTransition();

  return (
    <label
      className="flex items-center gap-1.5 transition-opacity"
      style={{ opacity: isPending ? 0.5 : 1 }}
    >
      <Switch
        size="sm"
        checked={checked}
        disabled={isPending}
        onCheckedChange={() => {
          startTransition(() => action(id, field));
        }}
      />
      {label && <span className="text-xs text-gray-600 select-none">{label}</span>}
    </label>
  );
}
