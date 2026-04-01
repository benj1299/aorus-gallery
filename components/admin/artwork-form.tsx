'use client';

import { TranslatableInput } from './translatable-input';
import { FormSwitch } from './form-switch';
import { FormSelect } from './form-select';
import { ImageUpload } from './image-upload';
import type { TranslatableField } from '@/lib/i18n-content';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormCard } from './form-card';

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
    sold?: boolean;
  };
}

export function ArtworkForm({ action, artists, defaultValues = {} }: ArtworkFormProps) {
  const artistOptions = artists.map((a) => ({ value: a.id, label: a.name }));

  return (
    <form action={action} className="max-w-4xl space-y-6">
      <FormCard title="Détails de l'œuvre">
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
              <Label htmlFor="dimensions" className="text-sm font-medium text-gray-700 mb-1.5">Dimensions</Label>
              <Input id="dimensions" name="dimensions" defaultValue={defaultValues.dimensions ?? ''} placeholder="120 x 90 cm" />
            </div>
          </div>
      </FormCard>

      <FormCard title="Tarification">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="year" className="text-sm font-medium text-gray-700 mb-1.5">Année</Label>
              <Input id="year" name="year" type="number" defaultValue={defaultValues.year ?? ''} />
            </div>
            <div>
              <Label htmlFor="price" className="text-sm font-medium text-gray-700 mb-1.5">Prix</Label>
              <Input id="price" name="price" type="number" step="0.01" defaultValue={defaultValues.price ?? ''} />
            </div>
            <FormSelect
              name="currency"
              label="Devise"
              options={[
                { value: 'EUR', label: 'EUR' },
                { value: 'USD', label: 'USD' },
                { value: 'GBP', label: 'GBP' },
                { value: 'TWD', label: 'TWD' },
                { value: 'CNY', label: 'CNY' },
                { value: 'HKD', label: 'HKD' },
              ]}
              defaultValue={defaultValues.currency ?? 'EUR'}
            />
          </div>
      </FormCard>

      <FormCard title="Média et affichage">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5">Image <span className="text-red-500">*</span></Label>
            <ImageUpload name="imageUrl" defaultValue={defaultValues?.imageUrl} required />
          </div>

          <div className="h-px bg-gray-100" />

          <div>
            <Label htmlFor="sortOrder" className="text-sm font-medium text-gray-700 mb-1.5">Ordre d'affichage</Label>
            <Input id="sortOrder" name="sortOrder" type="number" defaultValue={defaultValues.sortOrder ?? 0} className="max-w-32" />
          </div>

          <div className="h-px bg-gray-100" />

          <div className="flex flex-wrap gap-6">
            <FormSwitch name="visible" label="Visible" defaultChecked={defaultValues.visible ?? true} />
            <FormSwitch name="featuredHome" label="En avant sur l'accueil" defaultChecked={defaultValues.featuredHome ?? false} />
            <FormSwitch name="showPrice" label="Afficher le prix" defaultChecked={defaultValues.showPrice ?? false} />
            <FormSwitch name="sold" label="Vendu" defaultChecked={defaultValues.sold ?? false} />
          </div>
      </FormCard>

      <div className="flex justify-end pt-6 border-t border-gray-100">
        <button type="submit" className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
          Enregistrer
        </button>
      </div>
    </form>
  );
}
