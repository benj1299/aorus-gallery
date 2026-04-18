'use client';

import { useEffect, useRef, useState } from 'react';
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
  const imgRef = useRef<HTMLImageElement>(null);

  // Handle cached images: onLoad may not fire if image is already complete by the time we attach the listener
  useEffect(() => {
    if (imgRef.current?.complete) {
      setLoaded(true);
    }
  }, []);

  return (
    <div
      className={cn(
        'relative w-full h-full bg-blanc',
        !loaded && 'animate-pulse bg-noir/5',
        containerClassName,
      )}
    >
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
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
