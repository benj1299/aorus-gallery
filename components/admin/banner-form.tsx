'use client';

import { TranslatableInput } from './translatable-input';
import { FormSwitch } from './form-switch';
import { ImageUpload } from './image-upload';
import type { TranslatableField } from '@/lib/i18n-content';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormCard } from './form-card';
import { FormLayout } from './form-layout';

interface BannerFormProps {
  action: (formData: FormData) => Promise<{ error: string } | void>;
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
    <FormLayout action={action}>
      <FormCard title="Contenu de la bannière">
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
      </FormCard>

      <FormCard title="Média et lien">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5">Image <span className="text-red-500">*</span></Label>
            <ImageUpload name="imageUrl" defaultValue={defaultValues?.imageUrl} required />
          </div>

          <div>
            <Label htmlFor="linkUrl" className="text-sm font-medium text-gray-700 mb-1.5">URL du lien</Label>
            <Input id="linkUrl" name="linkUrl" defaultValue={defaultValues.linkUrl ?? ''} type="url" placeholder="https://..." />
          </div>
      </FormCard>

      <FormCard title="Affichage">
          <FormSwitch name="visible" label="Visible" defaultChecked={defaultValues.visible ?? false} />
      </FormCard>

    </FormLayout>
  );
}
