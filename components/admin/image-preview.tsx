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
      <div className={`w-12 h-12 rounded border border-dashed border-gray-200 flex items-center justify-center bg-gray-50 shrink-0 ${className}`}>
        <ImageIcon className="w-4 h-4 text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={url}
      alt="Aperçu"
      onError={() => setError(true)}
      className={`w-12 h-12 rounded border border-gray-200 object-cover shrink-0 ${className}`}
    />
  );
}
