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

interface CVEntry {
  type: string;
  title: TranslatableField;
}

interface ArtistFormProps {
  action: (formData: FormData) => void;
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

const CV_TYPES = [
  { key: 'SOLO_SHOW', label: 'Expositions personnelles' },
  { key: 'GROUP_SHOW', label: 'Expositions collectives' },
  { key: 'ART_FAIR', label: "Foires d'art" },
  { key: 'RESIDENCY', label: "Résidences" },
  { key: 'AWARD', label: 'Prix et distinctions' },
] as const;

function filterEntriesByType(entries: CVEntry[] | undefined, type: string): TranslatableField[] {
  if (!entries) return [];
  return entries.filter((e) => e.type === type).map((e) => e.title);
}

export function ArtistForm({ action, defaultValues = {} }: ArtistFormProps) {
  const [soloShows, setSoloShows] = useState<TranslatableField[]>(
    filterEntriesByType(defaultValues.cvEntries, 'SOLO_SHOW').length > 0
      ? filterEntriesByType(defaultValues.cvEntries, 'SOLO_SHOW')
      : [emptyT()]
  );
  const [groupShows, setGroupShows] = useState<TranslatableField[]>(
    filterEntriesByType(defaultValues.cvEntries, 'GROUP_SHOW').length > 0
      ? filterEntriesByType(defaultValues.cvEntries, 'GROUP_SHOW')
      : [emptyT()]
  );
  const [artFairs, setArtFairs] = useState<TranslatableField[]>(
    filterEntriesByType(defaultValues.cvEntries, 'ART_FAIR').length > 0
      ? filterEntriesByType(defaultValues.cvEntries, 'ART_FAIR')
      : [emptyT()]
  );
  const [residencies, setResidencies] = useState<TranslatableField[]>(
    filterEntriesByType(defaultValues.cvEntries, 'RESIDENCY').length > 0
      ? filterEntriesByType(defaultValues.cvEntries, 'RESIDENCY')
      : [emptyT()]
  );
  const [awards, setAwards] = useState<TranslatableField[]>(
    filterEntriesByType(defaultValues.cvEntries, 'AWARD').length > 0
      ? filterEntriesByType(defaultValues.cvEntries, 'AWARD')
      : [emptyT()]
  );
  const [collections, setCollections] = useState<TranslatableField[]>(
    defaultValues.collections?.length ? defaultValues.collections : [emptyT()]
  );

  const cvSections = [
    { key: 'SOLO_SHOW', label: 'Expositions personnelles', items: soloShows, setItems: setSoloShows },
    { key: 'GROUP_SHOW', label: 'Expositions collectives', items: groupShows, setItems: setGroupShows },
    { key: 'ART_FAIR', label: "Foires d'art", items: artFairs, setItems: setArtFairs },
    { key: 'RESIDENCY', label: "Résidences", items: residencies, setItems: setResidencies },
    { key: 'AWARD', label: 'Prix et distinctions', items: awards, setItems: setAwards },
  ] as const;

  return (
    <form action={action} className="max-w-4xl space-y-6">
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">Informations générales</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1.5">Nom *</Label>
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
            type="textarea"
            rows={5}
          />

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5">Image *</Label>
            <ImageUpload name="imageUrl" defaultValue={defaultValues?.imageUrl} required />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">Paramètres d'affichage</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sortOrder" className="text-sm font-medium text-gray-700 mb-1.5">Ordre d'affichage</Label>
              <Input id="sortOrder" name="sortOrder" type="number" defaultValue={defaultValues.sortOrder ?? 0} />
            </div>
            <div className="flex items-end pb-2">
              <FormSwitch name="visible" label="Visible" defaultChecked={defaultValues.visible ?? true} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">CV / Historique d'expositions</h3>
        </div>
        <div className="p-6 space-y-6">
          {cvSections.map((section, sectionIdx) => (
            <div key={section.key}>
              {sectionIdx > 0 && <div className="h-px bg-gray-100 mb-4" />}
              <Label className="text-sm font-medium text-gray-700 mb-2">{section.label}</Label>
              <div className="space-y-3">
                {section.items.map((entry, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="flex-1 space-y-1">
                      {LOCALES.map((loc) => (
                        <Input
                          key={loc}
                          name={`cv.${section.key}.${i}.${loc}`}
                          defaultValue={entry[loc] ?? ''}
                          placeholder={`${section.label} (${loc.toUpperCase()})`}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      className="self-start mt-1 text-red-400 hover:text-red-600"
                      onClick={() => section.setItems(section.items.filter((_, j) => j !== i))}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="mt-2 text-sm text-gray-500 hover:text-gray-900 inline-flex items-center"
                onClick={() => section.setItems([...section.items, emptyT()])}
              >
                <Plus className="w-3 h-3 mr-1" />
                Ajouter
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">Collections</h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {collections.map((col, i) => (
              <div key={i} className="flex gap-2">
                <div className="flex-1 space-y-1">
                  {LOCALES.map((loc) => (
                    <Input
                      key={loc}
                      name={`collections.${i}.${loc}`}
                      defaultValue={col[loc] ?? ''}
                      placeholder={`Collection (${loc.toUpperCase()})`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="self-start mt-1 text-red-400 hover:text-red-600"
                  onClick={() => setCollections(collections.filter((_, j) => j !== i))}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-2 text-sm text-gray-500 hover:text-gray-900 inline-flex items-center"
            onClick={() => setCollections([...collections, emptyT()])}
          >
            <Plus className="w-3 h-3 mr-1" />
            Ajouter une collection
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-100">
        <button type="submit" className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
          Enregistrer
        </button>
      </div>
    </form>
  );
}
