'use client';

import { useState } from 'react';
import { TranslatableInput } from './translatable-input';
import { FormSwitch } from './form-switch';
import { FormSelect } from './form-select';
import { ImagePreview } from './image-preview';
import type { TranslatableField } from '@/lib/i18n-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface ArtworkFormProps {
  action: (formData: FormData) => void;
  artists: { id: string; name: string }[];
  defaultValues?: {
    title?: TranslatableField;
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

export function ArtworkForm({ action, artists, defaultValues = {} }: ArtworkFormProps) {
  const [imageUrl, setImageUrl] = useState(defaultValues.imageUrl ?? '');
  const artistOptions = artists.map((a) => ({ value: a.id, label: a.name }));

  return (
    <form action={action} className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Détails de l'œuvre</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TranslatableInput
            name="title"
            label="Titre"
            defaultValue={defaultValues.title}
            required
          />

          <FormSelect
            name="artistId"
            label="Artiste"
            options={artistOptions}
            defaultValue={defaultValues.artistId}
            required
            placeholder="Sélectionner un artiste..."
          />

          <div className="grid grid-cols-2 gap-4">
            <TranslatableInput
              name="medium"
              label="Technique"
              defaultValue={defaultValues.medium}
              placeholder="Huile sur toile"
            />
            <div>
              <Label htmlFor="dimensions" className="mb-1.5">Dimensions</Label>
              <Input id="dimensions" name="dimensions" defaultValue={defaultValues.dimensions ?? ''} placeholder="120 x 90 cm" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tarification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="year" className="mb-1.5">Année</Label>
              <Input id="year" name="year" type="number" defaultValue={defaultValues.year ?? ''} />
            </div>
            <div>
              <Label htmlFor="price" className="mb-1.5">Prix</Label>
              <Input id="price" name="price" type="number" step="0.01" defaultValue={defaultValues.price ?? ''} />
            </div>
            <div>
              <Label htmlFor="currency" className="mb-1.5">Devise</Label>
              <Input id="currency" name="currency" defaultValue={defaultValues.currency ?? 'EUR'} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Média et affichage</CardTitle>
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

          <Separator />

          <div>
            <Label htmlFor="sortOrder" className="mb-1.5">Ordre d'affichage</Label>
            <Input id="sortOrder" name="sortOrder" type="number" defaultValue={defaultValues.sortOrder ?? 0} className="max-w-32" />
          </div>

          <Separator />

          <div className="flex flex-wrap gap-6">
            <FormSwitch name="visible" label="Visible" defaultChecked={defaultValues.visible ?? true} />
            <FormSwitch name="featuredHome" label="En avant sur l'accueil" defaultChecked={defaultValues.featuredHome ?? false} />
            <FormSwitch name="showPrice" label="Afficher le prix" defaultChecked={defaultValues.showPrice ?? false} />
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
