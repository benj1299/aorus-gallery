'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface DeleteButtonProps {
  id: string;
  action: (id: string) => Promise<void>;
  label: string;
}

export function DeleteButton({ id, action, label }: DeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await action(id);
    } catch {
      // redirect() throws NEXT_REDIRECT - expected behavior
    }
    router.refresh();
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          Confirmer
        </Button>
        <Button variant="outline" size="sm" onClick={() => setConfirming(false)}>
          Annuler
        </Button>
      </div>
    );
  }

  return (
    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setConfirming(true)}>
      Supprimer
    </Button>
  );
}
