'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { TranslatableInput } from './translatable-input';
import { FormSwitch } from './form-switch';
import { ImageUpload } from './image-upload';
import { CVEntriesForm } from './cv-entries-form';
import type { TranslatableField } from '@/lib/i18n-content';
import { LOCALES } from '@/lib/i18n-content';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { FormCard } from './form-card';
import { FormLayout } from './form-layout';

interface CVEntry {
  type: string;
  title: TranslatableField;
  year?: number | null;
}

interface ArtistFormProps {
  action: (formData: FormData) => Promise<{ error: string } | void>;
  defaultValues?: {
    name?: string;
    nationality?: TranslatableField;
    bio?: TranslatableField;
    imageUrl?: string;
    sortOrder?: number;
    visible?: boolean;
    cvEntries?: CVEntry[];
    collections?: TranslatableField[];
  };
}

const emptyT = (): TranslatableField => ({ en: '', fr: '', zh: '' });

let nextId = 0;
function uid(): string {
  return `entry-${++nextId}-${Date.now()}`;
}

interface CVItem {
  id: string;
  value: TranslatableField;
  year?: number | null;
}

interface ColItem {
  id: string;
  value: TranslatableField;
}

function filterEntriesByType(entries: CVEntry[] | undefined, type: string): CVItem[] {
  if (!entries) return [];
  return entries
    .filter((e) => e.type === type)
    .map((e) => ({ id: uid(), value: e.title, year: e.year }));
}

function initItems(entries: CVItem[]): CVItem[] {
  return entries.length > 0 ? entries : [{ id: uid(), value: emptyT() }];
}

function initCollections(cols: TranslatableField[] | undefined): ColItem[] {
  if (cols?.length) return cols.map((c) => ({ id: uid(), value: c }));
  return [{ id: uid(), value: emptyT() }];
}

export function ArtistForm({ action, defaultValues = {} }: ArtistFormProps) {
  const t = useTranslations('admin');
  const [soloShows, setSoloShows] = useState<CVItem[]>(initItems(filterEntriesByType(defaultValues.cvEntries, 'SOLO_SHOW')));
  const [groupShows, setGroupShows] = useState<CVItem[]>(initItems(filterEntriesByType(defaultValues.cvEntries, 'GROUP_SHOW')));
  const [artFairs, setArtFairs] = useState<CVItem[]>(initItems(filterEntriesByType(defaultValues.cvEntries, 'ART_FAIR')));
  const [residencies, setResidencies] = useState<CVItem[]>(initItems(filterEntriesByType(defaultValues.cvEntries, 'RESIDENCY')));
  const [awards, setAwards] = useState<CVItem[]>(initItems(filterEntriesByType(defaultValues.cvEntries, 'AWARD')));
  const [collections, setCollections] = useState<ColItem[]>(initCollections(defaultValues.collections));

  const cvSections = [
    { key: 'SOLO_SHOW', label: t('artists.cvSections.soloShows'), items: soloShows, setItems: setSoloShows },
    { key: 'GROUP_SHOW', label: t('artists.cvSections.groupShows'), items: groupShows, setItems: setGroupShows },
    { key: 'ART_FAIR', label: t('artists.cvSections.artFairs'), items: artFairs, setItems: setArtFairs },
    { key: 'RESIDENCY', label: t('artists.cvSections.residencies'), items: residencies, setItems: setResidencies },
    { key: 'AWARD', label: t('artists.cvSections.awards'), items: awards, setItems: setAwards },
  ] as const;

  return (
    <FormLayout action={action}>
      <FormCard title={t('cards.generalInfo')}>
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1.5">{t('forms.name')} <span className="text-red-500">*</span></Label>
            <Input id="name" name="name" defaultValue={defaultValues.name} required />
          </div>

          <TranslatableInput
            name="nationality"
            label={t('forms.nationality')}
            defaultValue={defaultValues.nationality}
            required
          />

          <TranslatableInput
            name="bio"
            label={t('forms.biography')}
            defaultValue={defaultValues.bio}
            required
            type="richtext" collapsible
          />

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5">{t('forms.image')} <span className="text-red-500">*</span></Label>
            <ImageUpload name="imageUrl" defaultValue={defaultValues?.imageUrl} required />
          </div>
      </FormCard>

      <FormCard title={t('cards.displaySettings')}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sortOrder" className="text-sm font-medium text-gray-700 mb-1.5">{t('forms.sortOrder')}</Label>
              <Input id="sortOrder" name="sortOrder" type="number" defaultValue={defaultValues.sortOrder ?? 0} />
            </div>
            <div className="flex items-end pb-2">
              <FormSwitch name="visible" label={t('forms.visible')} defaultChecked={defaultValues.visible ?? true} />
            </div>
          </div>
      </FormCard>

      <FormCard title={t('cards.cvHistory')}>
        <CVEntriesForm
          sections={cvSections}
          generateId={uid}
          emptyTranslatable={emptyT}
        />
      </FormCard>

      <FormCard title={t('cards.collections')}>
          <div className="space-y-3">
            {collections.map((col, i) => (
              <div key={col.id} className="flex gap-2">
                <div className="flex-1 space-y-1">
                  {LOCALES.map((loc) => (
                    <Input
                      key={loc}
                      name={`collections.${i}.${loc}`}
                      defaultValue={col.value[loc] ?? ''}
                      placeholder={`Collection (${loc.toUpperCase()})`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="self-start mt-1 text-red-400 hover:text-red-600"
                  onClick={() => setCollections(collections.filter((c) => c.id !== col.id))}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-2 text-sm text-gray-500 hover:text-gray-900 inline-flex items-center"
            onClick={() => setCollections([...collections, { id: uid(), value: emptyT() }])}
          >
            <Plus className="w-3 h-3 mr-1" />
            {t('forms.addCollection')}
          </button>
      </FormCard>

    </FormLayout>
  );
}
