'use client';

import { TranslatableInput } from './translatable-input';
import type { TranslatableField } from '@/lib/i18n-content';

interface ExhibitionFormProps {
  action: (formData: FormData) => void;
  artists: { id: string; name: string }[];
  artworks: { id: string; title: string }[];
  defaultValues?: {
    title?: TranslatableField;
    description?: TranslatableField;
    slug?: string;
    type?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    imageUrl?: string;
    visible?: boolean;
    sortOrder?: number;
    artistIds?: string[];
    artworkIds?: string[];
  };
}

const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent';
const selectClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white';

export function ExhibitionForm({ action, artists, artworks, defaultValues = {} }: ExhibitionFormProps) {
  return (
    <form action={action} className="max-w-2xl space-y-6">
      <TranslatableInput
        name="title"
        label="Title"
        defaultValue={defaultValues.title}
        required
      />

      <TranslatableInput
        name="description"
        label="Description"
        defaultValue={defaultValues.description}
        type="textarea"
        rows={4}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
          <input
            name="slug"
            defaultValue={defaultValues.slug}
            required
            pattern="[a-z0-9-]+"
            className={inputClass}
            placeholder="e.g. spring-exhibition-2026"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            name="location"
            defaultValue={defaultValues.location}
            className={inputClass}
            placeholder="e.g. Taipei, Taiwan"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
          <select name="type" defaultValue={defaultValues.type ?? 'EXHIBITION'} className={selectClass}>
            <option value="EXHIBITION">Exhibition</option>
            <option value="ART_FAIR">Art Fair</option>
            <option value="OFFSITE">Off-site</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
          <select name="status" defaultValue={defaultValues.status ?? 'UPCOMING'} className={selectClass}>
            <option value="CURRENT">Current</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="PAST">Past</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input name="startDate" type="date" defaultValue={defaultValues.startDate} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input name="endDate" type="date" defaultValue={defaultValues.endDate} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
        <input name="imageUrl" defaultValue={defaultValues.imageUrl} type="url" className={inputClass} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Artists</label>
        <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
          {artists.map((artist) => (
            <label key={artist.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="artistIds"
                value={artist.id}
                defaultChecked={defaultValues.artistIds?.includes(artist.id)}
                className="rounded"
              />
              {artist.name}
            </label>
          ))}
          {artists.length === 0 && (
            <p className="text-gray-400 text-sm">No artists available</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Artworks</label>
        <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
          {artworks.map((artwork) => (
            <label key={artwork.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="artworkIds"
                value={artwork.id}
                defaultChecked={defaultValues.artworkIds?.includes(artwork.id)}
                className="rounded"
              />
              {artwork.title}
            </label>
          ))}
          {artworks.length === 0 && (
            <p className="text-gray-400 text-sm">No artworks available</p>
          )}
        </div>
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

      <div className="pt-4">
        <button
          type="submit"
          className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800"
        >
          Save Exhibition
        </button>
      </div>
    </form>
  );
}
