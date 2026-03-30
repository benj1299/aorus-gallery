'use client';

import { TranslatableInput } from './translatable-input';
import { FormSwitch } from './form-switch';
import { FormSelect } from './form-select';
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
  const artistOptions = artists.map((a) => ({ value: a.id, label: a.name }));

  return (
    <form action={action} className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Artwork Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TranslatableInput
            name="title"
            label="Title"
            defaultValue={defaultValues.title}
            required
          />

          <FormSelect
            name="artistId"
            label="Artist"
            options={artistOptions}
            defaultValue={defaultValues.artistId}
            required
            placeholder="Select artist..."
          />

          <div className="grid grid-cols-2 gap-4">
            <TranslatableInput
              name="medium"
              label="Medium"
              defaultValue={defaultValues.medium}
              placeholder="Oil on canvas"
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
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="year" className="mb-1.5">Year</Label>
              <Input id="year" name="year" type="number" defaultValue={defaultValues.year ?? ''} />
            </div>
            <div>
              <Label htmlFor="price" className="mb-1.5">Price</Label>
              <Input id="price" name="price" type="number" step="0.01" defaultValue={defaultValues.price ?? ''} />
            </div>
            <div>
              <Label htmlFor="currency" className="mb-1.5">Currency</Label>
              <Input id="currency" name="currency" defaultValue={defaultValues.currency ?? 'EUR'} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media & Display</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="imageUrl" className="mb-1.5">Image URL *</Label>
            <Input id="imageUrl" name="imageUrl" defaultValue={defaultValues.imageUrl} required type="url" />
          </div>

          <Separator />

          <div>
            <Label htmlFor="sortOrder" className="mb-1.5">Sort Order</Label>
            <Input id="sortOrder" name="sortOrder" type="number" defaultValue={defaultValues.sortOrder ?? 0} className="max-w-32" />
          </div>

          <Separator />

          <div className="flex flex-wrap gap-6">
            <FormSwitch name="visible" label="Visible" defaultChecked={defaultValues.visible ?? true} />
            <FormSwitch name="featuredHome" label="Featured on homepage" defaultChecked={defaultValues.featuredHome ?? false} />
            <FormSwitch name="showPrice" label="Show price" defaultChecked={defaultValues.showPrice ?? false} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Save Artwork
        </Button>
      </div>
    </form>
  );
}
