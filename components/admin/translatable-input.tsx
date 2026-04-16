'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { LOCALES, type TranslatableField } from '@/lib/i18n-content';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from './rich-text-editor';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TranslatableInputProps {
  name: string;
  label: string;
  defaultValue?: TranslatableField;
  required?: boolean;
  type?: 'input' | 'textarea' | 'richtext';
  rows?: number;
  placeholder?: string;
  collapsible?: boolean;
}

export function TranslatableInput({
  name,
  label,
  defaultValue = { en: '', fr: '', zh: '' },
  required = false,
  type = 'input',
  rows = 3,
  placeholder,
  collapsible = false,
}: TranslatableInputProps) {
  const tf = useTranslations('admin.forms');
  const [active, setActive] = useState<string>('en');
  const hasContent = defaultValue.en || defaultValue.fr || defaultValue.zh;
  const [collapsed, setCollapsed] = useState(collapsible && !!hasContent);

  const preview = (defaultValue.en || defaultValue.fr || '').replace(/<[^>]*>/g, '').slice(0, 60);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium text-gray-700">
          {label}{required ? <> <span className="text-red-500">*</span></> : ''}
        </label>
        {collapsible && (
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
        )}
      </div>

      {collapsed ? (
        <>
          <div
            className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors truncate"
            onClick={() => setCollapsed(false)}
          >
            {preview || <span className="italic text-gray-400">{tf('clickToEdit')}</span>}
          </div>
          {LOCALES.map((loc) => (
            <input key={loc} type="hidden" name={`${name}.${loc}`} value={defaultValue[loc] ?? ''} />
          ))}
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
