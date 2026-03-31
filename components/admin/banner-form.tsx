'use client';

import { useState } from 'react';
import { TranslatableInput } from './translatable-input';
import { FormSwitch } from './form-switch';
import { ImagePreview } from './image-preview';
import type { TranslatableField } from '@/lib/i18n-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

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
  const [imageUrl, setImageUrl] = useState(defaultValues.imageUrl ?? '');

  return (
    <form action={action} className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contenu de la bannière</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Média et lien</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="imageUrl" className="mb-1.5">URL de l'image *</Label>
            <div className="flex gap-3 items-start">
              <div className="flex-1">
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                  type="url"
                />
              </div>
              <ImagePreview url={imageUrl} />
            </div>
          </div>

          <div>
            <Label htmlFor="linkUrl" className="mb-1.5">URL du lien</Label>
            <Input id="linkUrl" name="linkUrl" defaultValue={defaultValues.linkUrl ?? ''} type="url" placeholder="https://..." />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Affichage</CardTitle>
        </CardHeader>
        <CardContent>
          <FormSwitch name="visible" label="Visible" defaultChecked={defaultValues.visible ?? false} />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Enregistrer
        </Button>
      </div>
    </form>
  );
}
