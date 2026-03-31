'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';

interface FormSwitchProps {
  name: string;
  label: string;
  defaultChecked?: boolean;
}

export function FormSwitch({ name, label, defaultChecked = false }: FormSwitchProps) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center gap-3">
      <Switch checked={checked} onCheckedChange={setChecked} id={name} />
      <label htmlFor={name} className="text-sm font-medium text-gray-700">{label}</label>
      <input type="hidden" name={name} value={checked ? 'true' : 'false'} />
    </div>
  );
}
