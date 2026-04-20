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
  fit?: 'cover' | 'contain' | 'native';
  /** Required when fit="native" — the image's true pixel width. */
  width?: number | null;
  /** Required when fit="native" — the image's true pixel height. */
  height?: number | null;
}

function AdaptiveImage({
  src,
  alt,
  priority,
  sizes = '(max-width: 768px) 100vw, 50vw',
  className,
  containerClassName,
  fit = 'cover',
  width,
  height,
}: AdaptiveImageProps) {
  const [errored, setErrored] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);
  if (prevSrc !== src) {
    setPrevSrc(src);
    setErrored(false);
  }

  const nativeMode = fit === 'native' && !!width && !!height;
  const nativeFallback = fit === 'native' && (!width || !height);
  const imgObjectFit = fit === 'contain' ? 'object-contain' : 'object-cover';

  const containerStyle = nativeMode
    ? { aspectRatio: `${width} / ${height}` }
    : undefined;

  const containerAspectFallback = nativeFallback ? 'aspect-[4/5]' : '';

  return (
    <div
      className={cn(
        'relative w-full bg-blanc',
        !nativeMode && 'h-full',
        containerAspectFallback,
        containerClassName,
      )}
      style={containerStyle}
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
            imgObjectFit,
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
