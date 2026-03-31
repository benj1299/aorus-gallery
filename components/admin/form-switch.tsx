'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';

interface FormSwitchProps {
  name: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
}

export function FormSwitch({ name, label, description, defaultChecked = false }: FormSwitchProps) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-start gap-3">
      <Switch checked={checked} onCheckedChange={setChecked} id={name} className="mt-0.5 data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-gray-200" />
      <div>
        <label htmlFor={name} className="text-sm font-medium text-gray-700">{label}</label>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <input type="hidden" name={name} value={checked ? 'true' : 'false'} />
    </div>
  );
}
