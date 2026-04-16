'use client';

import { useTranslations } from 'next-intl';
import type { TranslatableField } from '@/lib/i18n-content';
import { LOCALES } from '@/lib/i18n-content';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';

// --- Types ---

export interface CVItem {
  id: string;
  value: TranslatableField;
  year?: number | null;
}

interface CVSection {
  readonly key: string;
  readonly label: string;
  items: CVItem[];
  setItems: React.Dispatch<React.SetStateAction<CVItem[]>>;
}

interface CVEntriesFormProps {
  sections: readonly CVSection[];
  generateId: () => string;
  emptyTranslatable: () => TranslatableField;
}

// --- Component ---

export function CVEntriesForm({ sections, generateId, emptyTranslatable }: CVEntriesFormProps) {
  const t = useTranslations('admin.forms');
  return (
    <div className="space-y-6">
      {sections.map((section, sectionIdx) => (
        <div key={section.key}>
          {sectionIdx > 0 && <div className="h-px bg-gray-100 mb-4" />}
          <Label className="text-sm font-medium text-gray-700 mb-2">{section.label}</Label>
          <div className="space-y-3">
            {section.items.map((entry, i) => (
              <div key={entry.id} className="flex gap-2">
                <div className="w-20 shrink-0">
                  <Input
                    name={`cv.${section.key}.${i}.year`}
                    type="number"
                    defaultValue={entry.year ?? ''}
                    placeholder={t('year')}
                    className="text-center"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  {LOCALES.map((loc) => (
                    <Input
                      key={loc}
                      name={`cv.${section.key}.${i}.${loc}`}
                      defaultValue={entry.value[loc] ?? ''}
                      placeholder={`${section.label} (${loc.toUpperCase()})`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="self-start mt-1 text-red-400 hover:text-red-600"
                  onClick={() => section.setItems(section.items.filter((item) => item.id !== entry.id))}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-2 text-sm text-gray-500 hover:text-gray-900 inline-flex items-center"
            onClick={() => section.setItems([...section.items, { id: generateId(), value: emptyTranslatable() }])}
          >
            <Plus className="w-3 h-3 mr-1" />
            {t('add')}
          </button>
        </div>
      ))}
    </div>
  );
}
