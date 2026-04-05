'use client';

import { useState } from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

interface AdaptiveImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  containerClassName?: string;
}

function AdaptiveImage({
  src,
  alt,
  priority,
  sizes = '(max-width: 768px) 100vw, 50vw',
  className,
  containerClassName,
}: AdaptiveImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn(
        'relative w-full h-full bg-blanc',
        !loaded && 'animate-pulse bg-noir/5',
        containerClassName,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        className={cn(
          'object-contain transition-all duration-700 ease-out',
          loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm',
          className,
        )}
      />
    </div>
  );
}

export { AdaptiveImage };
