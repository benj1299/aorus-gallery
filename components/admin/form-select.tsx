'use client';

import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { inputStyles, labelStyles } from './form-styles';

interface FormSelectProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
}

export function FormSelect({ name, label, options, defaultValue, required, placeholder }: FormSelectProps) {
  const t = useTranslations('admin.forms');
  return (
    <div>
      <label className={labelStyles}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          name={name}
          defaultValue={defaultValue ?? ''}
          required={required}
          className={`${inputStyles} appearance-none pr-10 cursor-pointer`}
        >
          <option value="" disabled>
            {placeholder || t('select')}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}
