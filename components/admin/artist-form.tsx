'use client';

import { useState } from 'react';
import { TranslatableInput } from './translatable-input';
import { FormSwitch } from './form-switch';
import type { TranslatableField } from '@/lib/i18n-content';
import { LOCALES } from '@/lib/i18n-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, X } from 'lucide-react';

interface CVEntry {
  type: string;
  title: TranslatableField;
}

interface ArtistFormProps {
  action: (formData: FormData) => void;
  defaultValues?: {
    name?: string;
    nationality?: TranslatableField;
    bio?: TranslatableField;
    imageUrl?: string;
    sortOrder?: number;
    visible?: boolean;
    cvEntries?: CVEntry[];
    collections?: TranslatableField[];
  };
}

const emptyT = (): TranslatableField => ({ en: '', fr: '', zh: '' });

const CV_TYPES = [
  { key: 'SOLO_SHOW', label: 'Solo Shows' },
  { key: 'GROUP_SHOW', label: 'Group Shows' },
  { key: 'ART_FAIR', label: 'Art Fairs' },
  { key: 'RESIDENCY', label: 'Residencies' },
  { key: 'AWARD', label: 'Awards / Prizes' },
] as const;

function filterEntriesByType(entries: CVEntry[] | undefined, type: string): TranslatableField[] {
  if (!entries) return [];
  return entries.filter((e) => e.type === type).map((e) => e.title);
}

export function ArtistForm({ action, defaultValues = {} }: ArtistFormProps) {
  const [soloShows, setSoloShows] = useState<TranslatableField[]>(
    filterEntriesByType(defaultValues.cvEntries, 'SOLO_SHOW').length > 0
      ? filterEntriesByType(defaultValues.cvEntries, 'SOLO_SHOW')
      : [emptyT()]
  );
  const [groupShows, setGroupShows] = useState<TranslatableField[]>(
    filterEntriesByType(defaultValues.cvEntries, 'GROUP_SHOW').length > 0
      ? filterEntriesByType(defaultValues.cvEntries, 'GROUP_SHOW')
      : [emptyT()]
  );
  const [artFairs, setArtFairs] = useState<TranslatableField[]>(
    filterEntriesByType(defaultValues.cvEntries, 'ART_FAIR').length > 0
      ? filterEntriesByType(defaultValues.cvEntries, 'ART_FAIR')
      : [emptyT()]
  );
  const [residencies, setResidencies] = useState<TranslatableField[]>(
    filterEntriesByType(defaultValues.cvEntries, 'RESIDENCY').length > 0
      ? filterEntriesByType(defaultValues.cvEntries, 'RESIDENCY')
      : [emptyT()]
  );
  const [awards, setAwards] = useState<TranslatableField[]>(
    filterEntriesByType(defaultValues.cvEntries, 'AWARD').length > 0
      ? filterEntriesByType(defaultValues.cvEntries, 'AWARD')
      : [emptyT()]
  );
  const [collections, setCollections] = useState<TranslatableField[]>(
    defaultValues.collections?.length ? defaultValues.collections : [emptyT()]
  );

  const cvSections = [
    { key: 'SOLO_SHOW', label: 'Solo Shows', items: soloShows, setItems: setSoloShows },
    { key: 'GROUP_SHOW', label: 'Group Shows', items: groupShows, setItems: setGroupShows },
    { key: 'ART_FAIR', label: 'Art Fairs', items: artFairs, setItems: setArtFairs },
    { key: 'RESIDENCY', label: 'Residencies', items: residencies, setItems: setResidencies },
    { key: 'AWARD', label: 'Awards / Prizes', items: awards, setItems: setAwards },
  ] as const;

  return (
    <form action={action} className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name" className="mb-1.5">Name *</Label>
            <Input id="name" name="name" defaultValue={defaultValues.name} required />
          </div>

          <TranslatableInput
            name="nationality"
            label="Nationality"
            defaultValue={defaultValues.nationality}
            required
          />

          <TranslatableInput
            name="bio"
            label="Bio"
            defaultValue={defaultValues.bio}
            required
            type="textarea"
            rows={5}
          />

          <div>
            <Label htmlFor="imageUrl" className="mb-1.5">Image URL *</Label>
            <Input id="imageUrl" name="imageUrl" defaultValue={defaultValues.imageUrl} required type="url" />
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

      <Card>
        <CardHeader>
          <CardTitle>CV / Exhibition History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {cvSections.map((section, sectionIdx) => (
            <div key={section.key}>
              {sectionIdx > 0 && <Separator className="mb-4" />}
              <Label className="mb-2">{section.label}</Label>
              <div className="space-y-3">
                {section.items.map((entry, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="flex-1 space-y-1">
                      {LOCALES.map((loc) => (
                        <Input
                          key={loc}
                          name={`cv.${section.key}.${i}.${loc}`}
                          defaultValue={entry[loc] ?? ''}
                          placeholder={`${section.label} (${loc.toUpperCase()})`}
                        />
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="self-start mt-1 text-destructive hover:text-destructive"
                      onClick={() => section.setItems(section.items.filter((_, j) => j !== i))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-2 text-muted-foreground"
                onClick={() => section.setItems([...section.items, emptyT()])}
              >
                <Plus className="w-3 h-3 mr-1" />
                Add {section.label.toLowerCase()}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Collections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {collections.map((col, i) => (
              <div key={i} className="flex gap-2">
                <div className="flex-1 space-y-1">
                  {LOCALES.map((loc) => (
                    <Input
                      key={loc}
                      name={`collections.${i}.${loc}`}
                      defaultValue={col[loc] ?? ''}
                      placeholder={`Collection (${loc.toUpperCase()})`}
                    />
                  ))}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="self-start mt-1 text-destructive hover:text-destructive"
                  onClick={() => setCollections(collections.filter((_, j) => j !== i))}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-2 text-muted-foreground"
            onClick={() => setCollections([...collections, emptyT()])}
          >
            <Plus className="w-3 h-3 mr-1" />
            Add collection
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Save Artist
        </Button>
      </div>
    </form>
  );
}
