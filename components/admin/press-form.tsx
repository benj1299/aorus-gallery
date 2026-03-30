'use client';

import { TranslatableInput } from './translatable-input';
import { FormSwitch } from './form-switch';
import type { TranslatableField } from '@/lib/i18n-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface PressFormProps {
  action: (formData: FormData) => void;
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
  return (
    <form action={action} className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Article Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TranslatableInput
            name="title"
            label="Title"
            defaultValue={defaultValues.title}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="publication" className="mb-1.5">Publication *</Label>
              <Input id="publication" name="publication" defaultValue={defaultValues.publication} required placeholder="Artnet News" />
            </div>
            <div>
              <Label htmlFor="publishedAt" className="mb-1.5">Published Date *</Label>
              <Input id="publishedAt" name="publishedAt" type="date" defaultValue={defaultValues.publishedAt} required />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Links & Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="url" className="mb-1.5">Article URL</Label>
            <Input id="url" name="url" defaultValue={defaultValues.url ?? ''} type="url" />
          </div>

          <div>
            <Label htmlFor="imageUrl" className="mb-1.5">Image URL</Label>
            <Input id="imageUrl" name="imageUrl" defaultValue={defaultValues.imageUrl ?? ''} type="url" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent>
          <TranslatableInput
            name="excerpt"
            label="Excerpt"
            defaultValue={defaultValues.excerpt}
            type="textarea"
            rows={3}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Display Settings</CardTitle>
        </CardHeader>
        <CardContent>
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
          Save Article
        </Button>
      </div>
    </form>
  );
}
