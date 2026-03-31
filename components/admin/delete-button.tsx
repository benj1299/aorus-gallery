'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Trash2, X, Check } from 'lucide-react';

interface DeleteButtonProps {
  id: string;
  action: (id: string) => Promise<void>;
  label?: string;
}

export function DeleteButton({ id, action }: DeleteButtonProps) {
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
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="destructive" size="icon" className="h-8 w-8" onClick={handleDelete}>
                <Check className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Confirmer</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setConfirming(false)}>
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Annuler</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setConfirming(true)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Supprimer</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
