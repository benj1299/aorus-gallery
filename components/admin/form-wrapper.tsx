'use client';

import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';

interface AdminFormProps {
  action: (formData: FormData) => Promise<{ error: string } | void>;
  children: React.ReactNode;
  className?: string;
}

export function AdminForm({ action, children, className }: AdminFormProps) {
  const [state, formAction] = useActionState(
    async (_prev: { error: string } | null, formData: FormData) => {
      const result = await action(formData);
      if (result && 'error' in result) return result;
      return null;
    },
    null
  );

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return <form action={formAction} className={className} noValidate>{children}</form>;
}
