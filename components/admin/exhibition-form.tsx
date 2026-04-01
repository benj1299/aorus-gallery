'use client';

import { TranslatableInput } from './translatable-input';
import { FormSwitch } from './form-switch';
import { FormSelect } from './form-select';
import { ImageUpload } from './image-upload';
import type { TranslatableField } from '@/lib/i18n-content';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormCard } from './form-card';
import { AdminForm } from './form-wrapper';

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

const TYPE_OPTIONS = [
  { value: 'EXHIBITION', label: 'Exposition' },
  { value: 'ART_FAIR', label: "Foire d'art" },
  { value: 'OFFSITE', label: 'Hors les murs' },
];

const STATUS_OPTIONS = [
  { value: 'CURRENT', label: 'En cours' },
  { value: 'UPCOMING', label: 'À venir' },
  { value: 'PAST', label: 'Passée' },
];

export function ExhibitionForm({ action, artists, artworks, defaultValues = {} }: ExhibitionFormProps) {
  return (
    <AdminForm action={action} className="max-w-4xl space-y-6">
      <FormCard title="Détails de l'exposition">
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
            type="richtext" collapsible
          />

          <div>
            <Label htmlFor="location" className="text-sm font-medium text-gray-700 mb-1.5">Lieu</Label>
            <Input id="location" name="location" defaultValue={defaultValues.location} placeholder="ex. Paris, France" />
          </div>
      </FormCard>

      <FormCard title="Classification et calendrier">
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
              <Label htmlFor="startDate" className="text-sm font-medium text-gray-700 mb-1.5">Date de début</Label>
              <Input id="startDate" name="startDate" type="date" defaultValue={defaultValues.startDate} />
            </div>
            <div>
              <Label htmlFor="endDate" className="text-sm font-medium text-gray-700 mb-1.5">Date de fin</Label>
              <Input id="endDate" name="endDate" type="date" defaultValue={defaultValues.endDate} />
            </div>
          </div>
      </FormCard>

      <FormCard title="Média">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5">Image</Label>
            <ImageUpload name="imageUrl" defaultValue={defaultValues?.imageUrl} />
          </div>
      </FormCard>

      <FormCard title="Artistes et œuvres">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2">Artistes</Label>
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
                <p className="text-gray-500 text-sm">Aucun artiste disponible</p>
              )}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2">{'Œuvres'}</Label>
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
                <p className="text-gray-500 text-sm">Aucune {'œuvre'} disponible</p>
              )}
            </div>
          </div>
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

      <div className="flex justify-end pt-6 border-t border-gray-100">
        <button type="submit" className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
          Enregistrer
        </button>
      </div>
    </AdminForm>
  );
}
