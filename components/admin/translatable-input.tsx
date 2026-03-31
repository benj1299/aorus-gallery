'use client';

import { useState } from 'react';
import { LOCALES, type TranslatableField } from '@/lib/i18n-content';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

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
      <Label className="mb-1.5">{label}{required ? ' *' : ''}</Label>
      <Tabs value={active} onValueChange={setActive}>
        <TabsList className="h-9 mb-1.5">
          {LOCALES.map((loc) => (
            <TabsTrigger
              key={loc}
              value={loc}
              className="text-sm px-3 py-1 h-7 font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md transition-colors"
            >
              {loc.toUpperCase()}
            </TabsTrigger>
          ))}
        </TabsList>
        {LOCALES.map((loc) => (
          <TabsContent key={loc} value={loc} className="mt-0">
            {type === 'textarea' ? (
              <Textarea
                name={`${name}.${loc}`}
                defaultValue={defaultValue[loc] ?? ''}
                required={required && loc === 'en'}
                rows={rows}
                placeholder={placeholder}
              />
            ) : (
              <Input
                name={`${name}.${loc}`}
                defaultValue={defaultValue[loc] ?? ''}
                required={required && loc === 'en'}
                placeholder={placeholder}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
