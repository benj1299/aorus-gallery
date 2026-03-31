'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface FormSelectProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
}

export function FormSelect({ name, label, options, defaultValue, required, placeholder }: FormSelectProps) {
  const [value, setValue] = useState(defaultValue ?? '');
  return (
    <div>
      <Label className="mb-1.5">{label} {required && '*'}</Label>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder || `S\u00e9lectionner...`} />
        </SelectTrigger>
        <SelectContent>
          {options.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
