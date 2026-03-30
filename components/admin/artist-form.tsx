'use client';

import { useState } from 'react';
import { TranslatableInput } from './translatable-input';
import type { TranslatableField } from '@/lib/i18n-content';
import { LOCALES } from '@/lib/i18n-content';

interface CVEntry {
  type: string;
  title: TranslatableField;
}

interface ArtistFormProps {
  action: (formData: FormData) => void;
  defaultValues?: {
    name?: string;
    slug?: string;
    nationality?: TranslatableField;
    bio?: TranslatableField;
    imageUrl?: string;
    sortOrder?: number;
    visible?: boolean;
    cvEntries?: CVEntry[];
    collections?: TranslatableField[];
  };
}

const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent';

const emptyT = (): TranslatableField => ({ en: '', fr: '', zh: '' });

const CV_TYPES = [
  { key: 'SOLO_SHOW', label: 'Solo Shows' },
  { key: 'GROUP_SHOW', label: 'Group Shows' },
  { key: 'ART_FAIR', label: 'Art Fairs' },
  { key: 'RESIDENCY', label: 'Residencies' },
  { key: 'AWARD', label: 'Awards / Prizes' },
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
    { key: 'SOLO_SHOW', label: 'Solo Shows', items: soloShows, setItems: setSoloShows },
    { key: 'GROUP_SHOW', label: 'Group Shows', items: groupShows, setItems: setGroupShows },
    { key: 'ART_FAIR', label: 'Art Fairs', items: artFairs, setItems: setArtFairs },
    { key: 'RESIDENCY', label: 'Residencies', items: residencies, setItems: setResidencies },
    { key: 'AWARD', label: 'Awards / Prizes', items: awards, setItems: setAwards },
  ] as const;

  return (
    <form action={action} className="max-w-2xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input name="name" defaultValue={defaultValues.name} required className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
          <input name="slug" defaultValue={defaultValues.slug} required pattern="[a-z0-9-]+" className={inputClass} placeholder="e.g. john-doe" />
        </div>
      </div>

      <TranslatableInput
        name="nationality"
        label="Nationality"
        defaultValue={defaultValues.nationality}
        required
      />

      <TranslatableInput
        name="bio"
        label="Bio"
        defaultValue={defaultValues.bio}
        required
        type="textarea"
        rows={5}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
        <input name="imageUrl" defaultValue={defaultValues.imageUrl} required type="url" className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
          <input name="sortOrder" type="number" defaultValue={defaultValues.sortOrder ?? 0} className={inputClass} />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 text-sm">
            <input name="visible" type="checkbox" defaultChecked={defaultValues.visible ?? true} value="true" className="rounded" />
            Visible
          </label>
        </div>
      </div>

      {cvSections.map((section) => (
        <div key={section.key}>
          <label className="block text-sm font-medium text-gray-700 mb-2">{section.label}</label>
          {section.items.map((entry, i) => (
            <div key={i} className="flex gap-2 mb-3">
              <div className="flex-1">
                {LOCALES.map((loc) => (
                  <input
                    key={loc}
                    name={`cv.${section.key}.${i}.${loc}`}
                    defaultValue={entry[loc] ?? ''}
                    className={`${inputClass} mb-1`}
                    placeholder={`${section.label} (${loc.toUpperCase()})`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => section.setItems(section.items.filter((_, j) => j !== i))}
                className="px-3 text-red-500 hover:text-red-700 text-sm self-start mt-2"
              >
                x
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => section.setItems([...section.items, emptyT()])}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            + Add {section.label.toLowerCase()}
          </button>
        </div>
      ))}

      {/* Collections */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Collections</label>
        {collections.map((col, i) => (
          <div key={i} className="flex gap-2 mb-3">
            <div className="flex-1">
              {LOCALES.map((loc) => (
                <input
                  key={loc}
                  name={`collections.${i}.${loc}`}
                  defaultValue={col[loc] ?? ''}
                  className={`${inputClass} mb-1`}
                  placeholder={`Collection (${loc.toUpperCase()})`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setCollections(collections.filter((_, j) => j !== i))}
              className="px-3 text-red-500 hover:text-red-700 text-sm self-start mt-2"
            >
              x
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setCollections([...collections, emptyT()])}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          + Add collection
        </button>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800"
        >
          Save Artist
        </button>
      </div>
    </form>
  );
}
