'use client';

import { TranslatableInput } from './translatable-input';
import { FormSwitch } from './form-switch';
import { ImageUpload } from './image-upload';
import type { TranslatableField } from '@/lib/i18n-content';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cardStyles } from './form-styles';

interface PressFormProps {
  action: (formData: FormData) => void;
  defaultValues?: {
    title?: TranslatableField;
    publication?: string;
    publishedAt?: string;
    url?: string;
    imageUrl?: string;
    excerpt?: TranslatableField;
    sortOrder?: number;
    visible?: boolean;
  };
}

export function PressForm({ action, defaultValues = {} }: PressFormProps) {
  return (
    <form action={action} className="max-w-4xl space-y-6">
      <div className={cardStyles}>
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">Détails de l'article</h3>
        </div>
        <div className="p-6 space-y-4">
          <TranslatableInput
            name="title"
            label="Titre"
            defaultValue={defaultValues.title}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="publication" className="text-sm font-medium text-gray-700 mb-1.5">Publication <span className="text-red-500">*</span></Label>
              <Input id="publication" name="publication" defaultValue={defaultValues.publication} required placeholder="Artnet News" />
            </div>
            <div>
              <Label htmlFor="publishedAt" className="text-sm font-medium text-gray-700 mb-1.5">Date de publication <span className="text-red-500">*</span></Label>
              <Input id="publishedAt" name="publishedAt" type="date" defaultValue={defaultValues.publishedAt} required />
            </div>
          </div>
        </div>
      </div>

      <div className={cardStyles}>
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">Liens et média</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <Label htmlFor="url" className="text-sm font-medium text-gray-700 mb-1.5">URL de l'article</Label>
            <Input id="url" name="url" defaultValue={defaultValues.url ?? ''} type="url" />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5">Image</Label>
            <ImageUpload name="imageUrl" defaultValue={defaultValues?.imageUrl} />
          </div>
        </div>
      </div>

      <div className={cardStyles}>
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">Contenu</h3>
        </div>
        <div className="p-6">
          <TranslatableInput
            name="excerpt"
            label="Extrait"
            defaultValue={defaultValues.excerpt}
            type="richtext" collapsible
          />
        </div>
      </div>

      <div className={cardStyles}>
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">Paramètres d'affichage</h3>
        </div>
        <div className="p-6">
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

      <div className="flex justify-end pt-6 border-t border-gray-100">
        <button type="submit" className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
          Enregistrer
        </button>
      </div>
    </form>
  );
}
