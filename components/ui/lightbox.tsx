'use client';

import { useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface LightboxProps {
  images: { src: string; alt: string }[];
  index: number;
  open: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export function Lightbox({ images, index, open, onClose, onIndexChange }: LightboxProps) {
  const hasMultiple = images.length > 1;

  const goPrev = useCallback(() => {
    onIndexChange((index - 1 + images.length) % images.length);
  }, [index, images.length, onIndexChange]);

  const goNext = useCallback(() => {
    onIndexChange((index + 1) % images.length);
  }, [index, images.length, onIndexChange]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (hasMultiple && e.key === 'ArrowLeft') goPrev();
      if (hasMultiple && e.key === 'ArrowRight') goNext();
    }

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, hasMultiple, goPrev, goNext, onClose]);

  if (!open || images.length === 0) return null;

  const current = images[index];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-noir/95"
            onClick={onClose}
            data-testid="lightbox-overlay"
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center text-blanc/70 hover:text-blanc transition-colors"
            aria-label="Close"
            data-testid="lightbox-close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Counter */}
          {hasMultiple && (
            <div
              className="absolute top-6 left-6 z-10 text-blanc/50 text-sm tracking-[0.1em] font-medium"
              data-testid="lightbox-counter"
            >
              {index + 1} / {images.length}
            </div>
          )}

          {/* Previous */}
          {hasMultiple && (
            <button
              onClick={goPrev}
              className="absolute left-4 md:left-8 z-10 w-12 h-12 flex items-center justify-center text-blanc/50 hover:text-blanc transition-colors"
              aria-label="Previous image"
              data-testid="lightbox-prev"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Image */}
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative z-[1] w-[90vw] h-[85vh] max-w-7xl"
          >
            <Image
              src={current.src}
              alt={current.alt}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </motion.div>

          {/* Next */}
          {hasMultiple && (
            <button
              onClick={goNext}
              className="absolute right-4 md:right-8 z-10 w-12 h-12 flex items-center justify-center text-blanc/50 hover:text-blanc transition-colors"
              aria-label="Next image"
              data-testid="lightbox-next"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
