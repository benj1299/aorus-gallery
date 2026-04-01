'use client';

import { toast } from 'sonner';

interface AdminFormProps {
  action: (formData: FormData) => Promise<{ error: string } | void>;
  children: React.ReactNode;
  className?: string;
}

export function AdminForm({ action, children, className }: AdminFormProps) {
  async function handleSubmit(formData: FormData) {
    try {
      const result = await action(formData);
      if (result?.error) toast.error(result.error);
    } catch (e) {
      // NEXT_REDIRECT throws here — re-throw to let Next.js handle redirect
      throw e;
    }
  }

  return <form action={handleSubmit} className={className} noValidate>{children}</form>;
}
