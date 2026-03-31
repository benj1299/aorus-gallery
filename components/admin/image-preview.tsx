'use client';

import { useState } from 'react';
import { ImageIcon } from 'lucide-react';

interface ImagePreviewProps {
  url: string;
  className?: string;
}

export function ImagePreview({ url, className = '' }: ImagePreviewProps) {
  const [error, setError] = useState(false);

  if (!url || error) {
    return (
      <div className={`w-12 h-12 rounded border border-dashed border-border flex items-center justify-center bg-muted shrink-0 ${className}`}>
        <ImageIcon className="w-4 h-4 text-muted-foreground" />
      </div>
    );
  }

  return (
    <img
      src={url}
      alt="Aper\u00e7u"
      onError={() => setError(true)}
      className={`w-12 h-12 rounded border border-border object-cover shrink-0 ${className}`}
    />
  );
}
