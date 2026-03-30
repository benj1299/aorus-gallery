'use client';

import { TranslatableInput } from './translatable-input';
import type { TranslatableField } from '@/lib/i18n-content';

interface PressFormProps {
  action: (formData: FormData) => void;
  defaultValues?: {
    title?: TranslatableField;
    slug?: string;
    publication?: string;
    publishedAt?: string;
    url?: string;
    imageUrl?: string;
    excerpt?: TranslatableField;
    sortOrder?: number;
    visible?: boolean;
  };
}

const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent';

export function PressForm({ action, defaultValues = {} }: PressFormProps) {
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Publication *</label>
          <input name="publication" defaultValue={defaultValues.publication} required className={inputClass} placeholder="Artnet News" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Published Date *</label>
          <input name="publishedAt" type="date" defaultValue={defaultValues.publishedAt} required className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Article URL</label>
        <input name="url" defaultValue={defaultValues.url ?? ''} type="url" className={inputClass} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
        <input name="imageUrl" defaultValue={defaultValues.imageUrl ?? ''} type="url" className={inputClass} />
      </div>

      <TranslatableInput
        name="excerpt"
        label="Excerpt"
        defaultValue={defaultValues.excerpt}
        type="textarea"
        rows={3}
      />

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
        <button type="submit" className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800">
          Save Article
        </button>
      </div>
    </form>
  );
}
