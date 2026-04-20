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
  fit?: 'cover' | 'contain';
}

function AdaptiveImage({
  src,
  alt,
  priority,
  sizes = '(max-width: 768px) 100vw, 50vw',
  className,
  containerClassName,
  fit = 'cover',
}: AdaptiveImageProps) {
  const [errored, setErrored] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);
  if (prevSrc !== src) {
    setPrevSrc(src);
    setErrored(false);
  }

  return (
    <div
      className={cn(
        'relative w-full h-full bg-blanc',
        containerClassName,
      )}
    >
      {!errored ? (
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          onError={() => setErrored(true)}
          className={cn(
            fit === 'cover' ? 'object-cover' : 'object-contain',
            'transition-opacity duration-500 ease-out',
            className,
          )}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-noir/5 text-noir/40 text-xs tracking-[0.15em] uppercase">
          Image indisponible
        </div>
      )}
    </div>
  );
}

export { AdaptiveImage };
