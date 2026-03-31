'use client';

import { useState } from 'react';
import { LOCALES, type TranslatableField } from '@/lib/i18n-content';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from './rich-text-editor';

interface TranslatableInputProps {
  name: string;
  label: string;
  defaultValue?: TranslatableField;
  required?: boolean;
  type?: 'input' | 'textarea' | 'richtext';
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
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}{required ? ' *' : ''}</label>
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-2">
        {LOCALES.map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => setActive(loc)}
            className={
              active === loc
                ? 'px-3 py-1.5 text-sm font-medium bg-white text-gray-900 rounded-md shadow-sm'
                : 'px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 rounded-md'
            }
          >
            {loc.toUpperCase()}
          </button>
        ))}
      </div>
      {LOCALES.map((loc) => (
        <div key={loc} className={active === loc ? '' : 'hidden'}>
          {type === 'richtext' ? (
            <RichTextEditor
              name={`${name}.${loc}`}
              defaultValue={defaultValue[loc] ?? ''}
              placeholder={placeholder}
            />
          ) : type === 'textarea' ? (
            <Textarea
              name={`${name}.${loc}`}
              defaultValue={defaultValue[loc] ?? ''}
              required={required && loc === 'en'}
              rows={rows}
              placeholder={placeholder}
              className="bg-white text-gray-900 border-gray-300"
            />
          ) : (
            <Input
              name={`${name}.${loc}`}
              defaultValue={defaultValue[loc] ?? ''}
              required={required && loc === 'en'}
              placeholder={placeholder}
              className="bg-white text-gray-900 border-gray-300"
            />
          )}
        </div>
      ))}
    </div>
  );
}
