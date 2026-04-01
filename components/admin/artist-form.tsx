'use client';

import { useState } from 'react';
import { TranslatableInput } from './translatable-input';
import { FormSwitch } from './form-switch';
import { ImageUpload } from './image-upload';
import type { TranslatableField } from '@/lib/i18n-content';
import { LOCALES } from '@/lib/i18n-content';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { FormCard } from './form-card';
import { AdminForm } from './form-wrapper';

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

const CV_TYPES = [
  { key: 'SOLO_SHOW', label: 'Expositions personnelles' },
  { key: 'GROUP_SHOW', label: 'Expositions collectives' },
  { key: 'ART_FAIR', label: "Foires d'art" },
  { key: 'RESIDENCY', label: "Résidences" },
  { key: 'AWARD', label: 'Prix et distinctions' },
] as const;

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
  const [soloShows, setSoloShows] = useState<CVItem[]>(initItems(filterEntriesByType(defaultValues.cvEntries, 'SOLO_SHOW')));
  const [groupShows, setGroupShows] = useState<CVItem[]>(initItems(filterEntriesByType(defaultValues.cvEntries, 'GROUP_SHOW')));
  const [artFairs, setArtFairs] = useState<CVItem[]>(initItems(filterEntriesByType(defaultValues.cvEntries, 'ART_FAIR')));
  const [residencies, setResidencies] = useState<CVItem[]>(initItems(filterEntriesByType(defaultValues.cvEntries, 'RESIDENCY')));
  const [awards, setAwards] = useState<CVItem[]>(initItems(filterEntriesByType(defaultValues.cvEntries, 'AWARD')));
  const [collections, setCollections] = useState<ColItem[]>(initCollections(defaultValues.collections));

  const cvSections = [
    { key: 'SOLO_SHOW', label: 'Expositions personnelles', items: soloShows, setItems: setSoloShows },
    { key: 'GROUP_SHOW', label: 'Expositions collectives', items: groupShows, setItems: setGroupShows },
    { key: 'ART_FAIR', label: "Foires d'art", items: artFairs, setItems: setArtFairs },
    { key: 'RESIDENCY', label: "Résidences", items: residencies, setItems: setResidencies },
    { key: 'AWARD', label: 'Prix et distinctions', items: awards, setItems: setAwards },
  ] as const;

  return (
    <AdminForm action={action} className="max-w-4xl space-y-6">
      <FormCard title="Informations générales">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1.5">Nom <span className="text-red-500">*</span></Label>
            <Input id="name" name="name" defaultValue={defaultValues.name} required />
          </div>

          <TranslatableInput
            name="nationality"
            label="Nationalité"
            defaultValue={defaultValues.nationality}
            required
          />

          <TranslatableInput
            name="bio"
            label="Biographie"
            defaultValue={defaultValues.bio}
            required
            type="richtext" collapsible
          />

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5">Image <span className="text-red-500">*</span></Label>
            <ImageUpload name="imageUrl" defaultValue={defaultValues?.imageUrl} required />
          </div>
      </FormCard>

      <FormCard title="Paramètres d'affichage">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sortOrder" className="text-sm font-medium text-gray-700 mb-1.5">Ordre d'affichage</Label>
              <Input id="sortOrder" name="sortOrder" type="number" defaultValue={defaultValues.sortOrder ?? 0} />
            </div>
            <div className="flex items-end pb-2">
              <FormSwitch name="visible" label="Visible" defaultChecked={defaultValues.visible ?? true} />
            </div>
          </div>
      </FormCard>

      <FormCard title="CV / Historique d'expositions">
        <div className="space-y-6">
          {cvSections.map((section, sectionIdx) => (
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
                        placeholder="Année"
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
                onClick={() => section.setItems([...section.items, { id: uid(), value: emptyT() }])}
              >
                <Plus className="w-3 h-3 mr-1" />
                Ajouter
              </button>
            </div>
          ))}
        </div>
      </FormCard>

      <FormCard title="Collections">
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
            Ajouter une collection
          </button>
      </FormCard>

      <div className="flex justify-end pt-6 border-t border-gray-100">
        <button type="submit" className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
          Enregistrer
        </button>
      </div>
    </AdminForm>
  );
}
