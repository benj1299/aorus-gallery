'use client';

import { useState } from 'react';
import { TranslatableInput } from './translatable-input';
import { FormSwitch } from './form-switch';
import { FormSelect } from './form-select';
import { ImagePreview } from './image-preview';
import type { TranslatableField } from '@/lib/i18n-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface ExhibitionFormProps {
  action: (formData: FormData) => void;
  artists: { id: string; name: string }[];
  artworks: { id: string; title: string }[];
  defaultValues?: {
    title?: TranslatableField;
    description?: TranslatableField;
    type?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    imageUrl?: string;
    visible?: boolean;
    sortOrder?: number;
    artistIds?: string[];
    artworkIds?: string[];
  };
}

const TYPE_OPTIONS = [
  { value: 'EXHIBITION', label: 'Exposition' },
  { value: 'ART_FAIR', label: 'Foire d\u2019art' },
  { value: 'OFFSITE', label: 'Hors les murs' },
];

const STATUS_OPTIONS = [
  { value: 'CURRENT', label: 'En cours' },
  { value: 'UPCOMING', label: '\u00c0 venir' },
  { value: 'PAST', label: 'Pass\u00e9e' },
];

export function ExhibitionForm({ action, artists, artworks, defaultValues = {} }: ExhibitionFormProps) {
  const [imageUrl, setImageUrl] = useState(defaultValues.imageUrl ?? '');

  return (
    <form action={action} className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>D\u00e9tails de l&apos;exposition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TranslatableInput
            name="title"
            label="Titre"
            defaultValue={defaultValues.title}
            required
          />

          <TranslatableInput
            name="description"
            label="Description"
            defaultValue={defaultValues.description}
            type="textarea"
            rows={4}
          />

          <div>
            <Label htmlFor="location" className="mb-1.5">Lieu</Label>
            <Input id="location" name="location" defaultValue={defaultValues.location} placeholder="ex. Paris, France" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Classification et calendrier</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              name="type"
              label="Type"
              options={TYPE_OPTIONS}
              defaultValue={defaultValues.type ?? 'EXHIBITION'}
              required
            />
            <FormSelect
              name="status"
              label="Statut"
              options={STATUS_OPTIONS}
              defaultValue={defaultValues.status ?? 'UPCOMING'}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate" className="mb-1.5">Date de d\u00e9but</Label>
              <Input id="startDate" name="startDate" type="date" defaultValue={defaultValues.startDate} />
            </div>
            <div>
              <Label htmlFor="endDate" className="mb-1.5">Date de fin</Label>
              <Input id="endDate" name="endDate" type="date" defaultValue={defaultValues.endDate} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>M\u00e9dia</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="imageUrl" className="mb-1.5">URL de l&apos;image</Label>
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
          <CardTitle>Artistes et \u0153uvres</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="mb-2">Artistes</Label>
            <div className="border border-border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
              {artists.map((artist) => (
                <div key={artist.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`artist-${artist.id}`}
                    name="artistIds"
                    value={artist.id}
                    defaultChecked={defaultValues.artistIds?.includes(artist.id)}
                  />
                  <Label htmlFor={`artist-${artist.id}`} className="text-sm font-normal">{artist.name}</Label>
                </div>
              ))}
              {artists.length === 0 && (
                <p className="text-muted-foreground text-sm">Aucun artiste disponible</p>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <Label className="mb-2">{'\u0152uvres'}</Label>
            <div className="border border-border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
              {artworks.map((artwork) => (
                <div key={artwork.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`artwork-${artwork.id}`}
                    name="artworkIds"
                    value={artwork.id}
                    defaultChecked={defaultValues.artworkIds?.includes(artwork.id)}
                  />
                  <Label htmlFor={`artwork-${artwork.id}`} className="text-sm font-normal">{artwork.title}</Label>
                </div>
              ))}
              {artworks.length === 0 && (
                <p className="text-muted-foreground text-sm">Aucune {'\u0153uvre'} disponible</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Param\u00e8tres d&apos;affichage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sortOrder" className="mb-1.5">Ordre d&apos;affichage</Label>
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
