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
  const [imageUrl, setImageUrl] = useState(defaultValues.imageUrl ?? '');

  return (
    <form action={action} className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Détails de l'article</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TranslatableInput
            name="title"
            label="Titre"
            defaultValue={defaultValues.title}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="publication" className="mb-1.5">Publication *</Label>
              <Input id="publication" name="publication" defaultValue={defaultValues.publication} required placeholder="Artnet News" />
            </div>
            <div>
              <Label htmlFor="publishedAt" className="mb-1.5">Date de publication *</Label>
              <Input id="publishedAt" name="publishedAt" type="date" defaultValue={defaultValues.publishedAt} required />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liens et média</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="url" className="mb-1.5">URL de l'article</Label>
            <Input id="url" name="url" defaultValue={defaultValues.url ?? ''} type="url" />
          </div>

          <div>
            <Label htmlFor="imageUrl" className="mb-1.5">URL de l'image</Label>
            <div className="flex gap-3 items-start">
              <div className="flex-1">
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  type="url"
                />
              </div>
              <ImagePreview url={imageUrl} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contenu</CardTitle>
        </CardHeader>
        <CardContent>
          <TranslatableInput
            name="excerpt"
            label="Extrait"
            defaultValue={defaultValues.excerpt}
            type="textarea"
            rows={3}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres d'affichage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sortOrder" className="mb-1.5">Ordre d'affichage</Label>
              <Input id="sortOrder" name="sortOrder" type="number" defaultValue={defaultValues.sortOrder ?? 0} />
            </div>
            <div className="flex items-end pb-2">
              <FormSwitch name="visible" label="Visible" defaultChecked={defaultValues.visible ?? true} />
            </div>
          </div>
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
