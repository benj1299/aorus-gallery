'use client';

import { TranslatableInput } from './translatable-input';
import { FormSwitch } from './form-switch';
import type { TranslatableField } from '@/lib/i18n-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface BannerFormProps {
  action: (formData: FormData) => void;
  defaultValues?: {
    title?: TranslatableField;
    subtitle?: TranslatableField | null;
    imageUrl?: string;
    linkUrl?: string | null;
    visible?: boolean;
  };
}

export function BannerForm({ action, defaultValues = {} }: BannerFormProps) {
  return (
    <form action={action} className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Banner Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TranslatableInput
            name="title"
            label="Title"
            defaultValue={defaultValues.title}
            required
          />

          <TranslatableInput
            name="subtitle"
            label="Subtitle"
            defaultValue={defaultValues.subtitle ?? undefined}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media & Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="imageUrl" className="mb-1.5">Image URL *</Label>
            <Input id="imageUrl" name="imageUrl" defaultValue={defaultValues.imageUrl} required type="url" />
          </div>

          <div>
            <Label htmlFor="linkUrl" className="mb-1.5">Link URL</Label>
            <Input id="linkUrl" name="linkUrl" defaultValue={defaultValues.linkUrl ?? ''} type="url" placeholder="https://..." />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Display</CardTitle>
        </CardHeader>
        <CardContent>
          <FormSwitch name="visible" label="Visible" defaultChecked={defaultValues.visible ?? false} />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Save Banner
        </Button>
      </div>
    </form>
  );
}
