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
  { value: 'EXHIBITION', label: 'Exhibition' },
  { value: 'ART_FAIR', label: 'Art Fair' },
  { value: 'OFFSITE', label: 'Off-site' },
];

const STATUS_OPTIONS = [
  { value: 'CURRENT', label: 'Current' },
  { value: 'UPCOMING', label: 'Upcoming' },
  { value: 'PAST', label: 'Past' },
];

export function ExhibitionForm({ action, artists, artworks, defaultValues = {} }: ExhibitionFormProps) {
  return (
    <form action={action} className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exhibition Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TranslatableInput
            name="title"
            label="Title"
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
            <Label htmlFor="location" className="mb-1.5">Location</Label>
            <Input id="location" name="location" defaultValue={defaultValues.location} placeholder="e.g. Taipei, Taiwan" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Classification & Schedule</CardTitle>
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
              label="Status"
              options={STATUS_OPTIONS}
              defaultValue={defaultValues.status ?? 'UPCOMING'}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate" className="mb-1.5">Start Date</Label>
              <Input id="startDate" name="startDate" type="date" defaultValue={defaultValues.startDate} />
            </div>
            <div>
              <Label htmlFor="endDate" className="mb-1.5">End Date</Label>
              <Input id="endDate" name="endDate" type="date" defaultValue={defaultValues.endDate} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="imageUrl" className="mb-1.5">Image URL</Label>
            <Input id="imageUrl" name="imageUrl" defaultValue={defaultValues.imageUrl} type="url" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Artists & Artworks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="mb-2">Artists</Label>
            <div className="border border-border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
              {artists.map((artist) => (
                <label key={artist.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="artistIds"
                    value={artist.id}
                    defaultChecked={defaultValues.artistIds?.includes(artist.id)}
                    className="rounded border-input"
                  />
                  {artist.name}
                </label>
              ))}
              {artists.length === 0 && (
                <p className="text-muted-foreground text-sm">No artists available</p>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <Label className="mb-2">Artworks</Label>
            <div className="border border-border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
              {artworks.map((artwork) => (
                <label key={artwork.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="artworkIds"
                    value={artwork.id}
                    defaultChecked={defaultValues.artworkIds?.includes(artwork.id)}
                    className="rounded border-input"
                  />
                  {artwork.title}
                </label>
              ))}
              {artworks.length === 0 && (
                <p className="text-muted-foreground text-sm">No artworks available</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Display Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sortOrder" className="mb-1.5">Sort Order</Label>
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
          Save Exhibition
        </Button>
      </div>
    </form>
  );
}
