'use client';

import { useState } from 'react';
import { LOCALES, type TranslatableField } from '@/lib/i18n-content';

const LOCALE_LABELS: Record<string, string> = { en: 'EN', fr: 'FR', zh: 'ZH' };

const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent';

interface TranslatableInputProps {
  name: string;
  label: string;
  defaultValue?: TranslatableField;
  required?: boolean;
  type?: 'input' | 'textarea';
  rows?: number;
  placeholder?: string;
}

export function TranslatableInput({
  name,
  label,
  defaultValue = { en: '', fr: '', zh: '' },
  required = false,
  type = 'input',
  rows = 3,
  placeholder,
}: TranslatableInputProps) {
  const [active, setActive] = useState<string>('en');

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-gray-700">{label}{required ? ' *' : ''}</label>
        <div className="flex gap-0.5">
          {LOCALES.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setActive(loc)}
              className={`px-2 py-0.5 text-xs font-medium rounded ${
                active === loc
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-400 hover:text-gray-600'
              }`}
            >
              {LOCALE_LABELS[loc]}
            </button>
          ))}
        </div>
      </div>
      {LOCALES.map((loc) => (
        <div key={loc} className={active === loc ? '' : 'hidden'}>
          {type === 'textarea' ? (
            <textarea
              name={`${name}.${loc}`}
              defaultValue={defaultValue[loc] ?? ''}
              required={required && loc === 'en'}
              rows={rows}
              className={inputClass}
              placeholder={placeholder}
            />
          ) : (
            <input
              name={`${name}.${loc}`}
              defaultValue={defaultValue[loc] ?? ''}
              required={required && loc === 'en'}
              className={inputClass}
              placeholder={placeholder}
            />
          )}
        </div>
      ))}
    </div>
  );
}
