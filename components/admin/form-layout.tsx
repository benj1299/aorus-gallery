'use client';

import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import { AdminForm } from './form-wrapper';
import { useTranslations } from 'next-intl';

interface FormLayoutProps {
  action: (formData: FormData) => Promise<{ error: string } | void>;
  children: React.ReactNode;
  submitLabel?: string;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  const t = useTranslations('admin.forms');
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:bg-gray-800"
      data-testid="form-submit"
      aria-busy={pending}
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {t('saving', { defaultValue: 'Enregistrement...' })}
        </>
      ) : (
        label
      )}
    </button>
  );
}

export function FormLayout({ action, children, submitLabel }: FormLayoutProps) {
  const t = useTranslations('admin.forms');
  const label = submitLabel ?? t('save');

  return (
    <AdminForm action={action} className="max-w-4xl space-y-6">
      {children}
      <div className="flex justify-end pt-6 border-t border-gray-100">
        <SubmitButton label={label} />
      </div>
    </AdminForm>
  );
}
