'use client';

import { TranslatableInput } from './translatable-input';
import { FormSwitch } from './form-switch';
import { ImageUpload } from './image-upload';
import type { TranslatableField } from '@/lib/i18n-content';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

export function BannerForm({ action, defaultValues = {} }: BannerFormProps) {
  return (
    <form action={action} className="max-w-4xl space-y-6">
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">Contenu de la bannière</h3>
        </div>
        <div className="p-6 space-y-4">
          <TranslatableInput
            name="title"
            label="Titre"
            defaultValue={defaultValues.title}
            required
          />

          <TranslatableInput
            name="subtitle"
            label="Sous-titre"
            defaultValue={defaultValues.subtitle ?? undefined}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">Média et lien</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5">Image *</Label>
            <ImageUpload name="imageUrl" defaultValue={defaultValues?.imageUrl} required />
          </div>

          <div>
            <Label htmlFor="linkUrl" className="text-sm font-medium text-gray-700 mb-1.5">URL du lien</Label>
            <Input id="linkUrl" name="linkUrl" defaultValue={defaultValues.linkUrl ?? ''} type="url" placeholder="https://..." />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">Affichage</h3>
        </div>
        <div className="p-6">
          <FormSwitch name="visible" label="Visible" defaultChecked={defaultValues.visible ?? false} />
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
