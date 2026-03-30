'use client';

import { TranslatableInput } from './translatable-input';
import type { TranslatableField } from '@/lib/i18n-content';

interface ArtworkFormProps {
  action: (formData: FormData) => void;
  artists: { id: string; name: string }[];
  defaultValues?: {
    title?: TranslatableField;
    slug?: string;
    artistId?: string;
    medium?: TranslatableField;
    dimensions?: string;
    year?: number | null;
    price?: number | null;
    currency?: string;
    imageUrl?: string;
    sortOrder?: number;
    visible?: boolean;
    featuredHome?: boolean;
    showPrice?: boolean;
  };
}

const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent';

export function ArtworkForm({ action, artists, defaultValues = {} }: ArtworkFormProps) {
  return (
    <form action={action} className="max-w-2xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <TranslatableInput
          name="title"
          label="Title"
          defaultValue={defaultValues.title}
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
          <input name="slug" defaultValue={defaultValues.slug} required pattern="[a-z0-9-]+" className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Artist *</label>
        <select name="artistId" defaultValue={defaultValues.artistId} required className={inputClass}>
          <option value="">Select artist...</option>
          {artists.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TranslatableInput
          name="medium"
          label="Medium"
          defaultValue={defaultValues.medium}
          placeholder="Oil on canvas"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
          <input name="dimensions" defaultValue={defaultValues.dimensions ?? ''} className={inputClass} placeholder="120 x 90 cm" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <input name="year" type="number" defaultValue={defaultValues.year ?? ''} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <input name="price" type="number" step="0.01" defaultValue={defaultValues.price ?? ''} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
          <input name="currency" defaultValue={defaultValues.currency ?? 'EUR'} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
        <input name="imageUrl" defaultValue={defaultValues.imageUrl} required type="url" className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
          <input name="sortOrder" type="number" defaultValue={defaultValues.sortOrder ?? 0} className={inputClass} />
        </div>
        <div className="flex items-end pb-1 gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input name="visible" type="checkbox" defaultChecked={defaultValues.visible ?? true} value="true" className="rounded" />
            Visible
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input name="featuredHome" type="checkbox" defaultChecked={defaultValues.featuredHome} value="true" className="rounded" />
            Featured on homepage
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input name="showPrice" type="checkbox" defaultChecked={defaultValues.showPrice} value="true" className="rounded" />
            Show price
          </label>
        </div>
      </div>

      <div className="pt-4">
        <button type="submit" className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800">
          Save Artwork
        </button>
      </div>
    </form>
  );
}
