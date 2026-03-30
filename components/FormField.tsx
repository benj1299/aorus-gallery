'use client';

import { Label } from '@/components/ui/label';

interface FormFieldProps {
  label: string;
  id: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, id, required, error, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-or text-xs tracking-[0.2em] uppercase font-medium">
        {label}{required && ' *'}
      </Label>
      {children}
      {error && <p className="text-red-600 text-xs">{error}</p>}
    </div>
  );
}
