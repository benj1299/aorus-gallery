'use client';

import { useTranslations } from 'next-intl';
import { TranslatableInput } from './translatable-input';
import { FormSwitch } from './form-switch';
import { ImageUpload } from './image-upload';
import type { TranslatableField } from '@/lib/i18n-content';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormCard } from './form-card';
import { FormLayout } from './form-layout';

interface PressFormProps {
  action: (formData: FormData) => Promise<{ error: string } | void>;
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
  const t = useTranslations('admin');

  return (
    <FormLayout action={action}>
      <FormCard title={t('cards.articleDetails')}>
          <TranslatableInput
            name="title"
            label={t('forms.title')}
            defaultValue={defaultValues.title}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="publication" className="text-sm font-medium text-gray-700 mb-1.5">{t('forms.publication')} <span className="text-red-500">*</span></Label>
              <Input id="publication" name="publication" defaultValue={defaultValues.publication} required placeholder="Artnet News" />
            </div>
            <div>
              <Label htmlFor="publishedAt" className="text-sm font-medium text-gray-700 mb-1.5">{t('forms.publishedAt')} <span className="text-red-500">*</span></Label>
              <Input id="publishedAt" name="publishedAt" type="date" defaultValue={defaultValues.publishedAt} required />
            </div>
          </div>
      </FormCard>

      <FormCard title={t('cards.linksAndMedia')}>
          <div>
            <Label htmlFor="url" className="text-sm font-medium text-gray-700 mb-1.5">{t('forms.articleUrl')}</Label>
            <Input id="url" name="url" defaultValue={defaultValues.url ?? ''} type="url" />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5">{t('forms.image')}</Label>
            <ImageUpload name="imageUrl" defaultValue={defaultValues?.imageUrl} />
          </div>
      </FormCard>

      <FormCard title={t('cards.content')}>
          <TranslatableInput
            name="excerpt"
            label={t('forms.excerpt')}
            defaultValue={defaultValues.excerpt}
            type="richtext" collapsible
          />
      </FormCard>

      <FormCard title={t('cards.displaySettings')}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
