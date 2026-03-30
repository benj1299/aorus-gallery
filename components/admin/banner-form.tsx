'use client';

import { TranslatableInput } from './translatable-input';
import type { TranslatableField } from '@/lib/i18n-content';

interface BannerFormProps {
  action: (formData: FormData) => void;
  defaultValues?: {
    title?: TranslatableField;
    subtitle?: TranslatableField | null;
    imageUrl?: string;
    linkUrl?: string | null;
    visible?: boolean;
  };
}

const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent';

export function BannerForm({ action, defaultValues = {} }: BannerFormProps) {
  return (
    <form action={action} className="max-w-2xl space-y-6">
      <TranslatableInput
        name="title"
        label="Title"
        defaultValue={defaultValues.title}
        required
      />

      <TranslatableInput
        name="subtitle"
        label="Subtitle"
        defaultValue={defaultValues.subtitle ?? undefined}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
        <input name="imageUrl" defaultValue={defaultValues.imageUrl} required type="url" className={inputClass} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
        <input name="linkUrl" defaultValue={defaultValues.linkUrl ?? ''} type="url" className={inputClass} placeholder="https://..." />
      </div>

      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 text-sm">
          <input name="visible" type="checkbox" defaultChecked={defaultValues.visible ?? false} value="true" className="rounded" />
          Visible
        </label>
      </div>

      <div className="pt-4">
        <button type="submit" className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800">
          Save Banner
        </button>
      </div>
    </form>
  );
}
