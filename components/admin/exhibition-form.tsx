'use client';

import { useTranslations } from 'next-intl';
import { TranslatableInput } from './translatable-input';
import { FormSwitch } from './form-switch';
import { FormSelect } from './form-select';
import { ImageUpload } from './image-upload';
import type { TranslatableField } from '@/lib/i18n-content';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormCard } from './form-card';
import { FormLayout } from './form-layout';

interface ExhibitionFormProps {
  action: (formData: FormData) => Promise<{ error: string } | void>;
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

export function ExhibitionForm({ action, artists, artworks, defaultValues = {} }: ExhibitionFormProps) {
  const t = useTranslations('admin');

  const TYPE_OPTIONS = [
    { value: 'EXHIBITION', label: t('exhibitions.types.exhibition') },
    { value: 'ART_FAIR', label: t('exhibitions.types.artFair') },
    { value: 'OFFSITE', label: t('exhibitions.types.offsite') },
  ];

  const STATUS_OPTIONS = [
    { value: 'CURRENT', label: t('exhibitions.statuses.current') },
    { value: 'UPCOMING', label: t('exhibitions.statuses.upcoming') },
    { value: 'PAST', label: t('exhibitions.statuses.past') },
  ];

  return (
    <FormLayout action={action}>
      <FormCard title={t('cards.exhibitionDetails')}>
          <TranslatableInput
            name="title"
            label={t('forms.title')}
            defaultValue={defaultValues.title}
            required
          />

          <TranslatableInput
            name="description"
            label={t('forms.description')}
            defaultValue={defaultValues.description}
            type="richtext" collapsible
          />

          <div>
            <Label htmlFor="location" className="text-sm font-medium text-gray-700 mb-1.5">{t('forms.location')}</Label>
            <Input id="location" name="location" defaultValue={defaultValues.location} placeholder={t('forms.locationPlaceholder')} />
          </div>
      </FormCard>

      <FormCard title={t('cards.classificationSchedule')}>
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              name="type"
              label={t('forms.type')}
              options={TYPE_OPTIONS}
              defaultValue={defaultValues.type ?? 'EXHIBITION'}
              required
            />
            <FormSelect
              name="status"
              label={t('forms.status')}
              options={STATUS_OPTIONS}
              defaultValue={defaultValues.status ?? 'UPCOMING'}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate" className="text-sm font-medium text-gray-700 mb-1.5">{t('forms.startDate')}</Label>
              <Input id="startDate" name="startDate" type="date" defaultValue={defaultValues.startDate} />
            </div>
            <div>
              <Label htmlFor="endDate" className="text-sm font-medium text-gray-700 mb-1.5">{t('forms.endDate')}</Label>
              <Input id="endDate" name="endDate" type="date" defaultValue={defaultValues.endDate} />
            </div>
          </div>
      </FormCard>

      <FormCard title={t('cards.media')}>
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5">{t('forms.image')}</Label>
            <ImageUpload name="imageUrl" defaultValue={defaultValues?.imageUrl} />
          </div>
      </FormCard>

      <FormCard title={t('cards.artistsAndArtworks')}>
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2">{t('artists.title')}</Label>
            <div className="border border-gray-200 rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
              {artists.map((artist) => (
                <div key={artist.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`artist-${artist.id}`}
                    name="artistIds"
                    value={artist.id}
                    defaultChecked={defaultValues.artistIds?.includes(artist.id)}
                  />
                  <Label htmlFor={`artist-${artist.id}`} className="text-sm text-gray-700 font-normal">{artist.name}</Label>
                </div>
              ))}
              {artists.length === 0 && (
                <p className="text-gray-500 text-sm">{t('exhibitions.noArtists')}</p>
              )}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2">{t('artworks.title')}</Label>
            <div className="border border-gray-200 rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
              {artworks.map((artwork) => (
                <div key={artwork.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`artwork-${artwork.id}`}
                    name="artworkIds"
                    value={artwork.id}
                    defaultChecked={defaultValues.artworkIds?.includes(artwork.id)}
                  />
                  <Label htmlFor={`artwork-${artwork.id}`} className="text-sm text-gray-700 font-normal">{artwork.title}</Label>
                </div>
              ))}
              {artworks.length === 0 && (
                <p className="text-gray-500 text-sm">{t('exhibitions.noArtworks')}</p>
              )}
            </div>
          </div>
      </FormCard>

      <FormCard title={t('cards.displaySettings')}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sortOrder" className="text-sm font-medium text-gray-700 mb-1.5">{t('forms.sortOrder')}</Label>
              <Input id="sortOrder" name="sortOrder" type="number" defaultValue={defaultValues.sortOrder ?? 0} />
            </div>
            <div className="flex items-end pb-2">
              <FormSwitch name="visible" label={t('forms.visible')} defaultChecked={defaultValues.visible ?? true} />
            </div>
          </div>
      </FormCard>

    </FormLayout>
  );
}
