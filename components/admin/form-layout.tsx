'use client';

import { AdminForm } from './form-wrapper';

interface FormLayoutProps {
  action: (formData: FormData) => Promise<{ error: string } | void>;
  children: React.ReactNode;
  submitLabel?: string;
}

export function FormLayout({ action, children, submitLabel = 'Enregistrer' }: FormLayoutProps) {
  return (
    <AdminForm action={action} className="max-w-4xl space-y-6">
      {children}
      <div className="flex justify-end pt-6 border-t border-gray-100">
        <button
          type="submit"
          className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          {submitLabel}
        </button>
      </div>
    </AdminForm>
  );
}
