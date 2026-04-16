'use client';

import { TranslatableInput } from './translatable-input';
import { FormSwitch } from './form-switch';
import { ImageUpload } from './image-upload';
import type { TranslatableField } from '@/lib/i18n-content';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormCard } from './form-card';
import { FormLayout } from './form-layout';

interface PressFormProps {
  action: (formData: FormData) => Promise<{ error: string } | void>;
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
    <FormLayout action={action}>
      <FormCard title="Détails de l'article">
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
      </FormCard>

      <FormCard title="Liens et média">
          <div>
            <Label htmlFor="url" className="text-sm font-medium text-gray-700 mb-1.5">URL de l'article</Label>
            <Input id="url" name="url" defaultValue={defaultValues.url ?? ''} type="url" />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5">Image</Label>
            <ImageUpload name="imageUrl" defaultValue={defaultValues?.imageUrl} />
          </div>
      </FormCard>

      <FormCard title="Contenu">
          <TranslatableInput
            name="excerpt"
            label="Extrait"
            defaultValue={defaultValues.excerpt}
            type="richtext" collapsible
          />
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

    </FormLayout>
  );
}
