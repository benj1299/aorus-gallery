'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ArtworkWork } from '@/lib/artists-data';

interface LightboxProps {
  works: ArtworkWork[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
  artistName: string;
}

export function Lightbox({ works, currentIndex, onClose, onNavigate, artistName }: LightboxProps) {
  const isOpen = currentIndex !== null;
  const current = currentIndex !== null ? works[currentIndex] : null;

  const handlePrev = useCallback(() => {
    if (currentIndex === null) return;
    const prev = (currentIndex - 1 + works.length) % works.length;
    onNavigate(prev);
  }, [currentIndex, works.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex === null) return;
    const next = (currentIndex + 1) % works.length;
    onNavigate(next);
  }, [currentIndex, works.length, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  return (
    <AnimatePresence>
      {isOpen && current && (
        <motion.div
          key="lightbox-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ backgroundColor: 'rgba(11, 11, 11, 0.95)' }}
          onClick={onClose}
        >
          {/* Inner container — stop propagation */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-6xl w-full mx-6 md:mx-12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="relative flex-shrink-0 w-full md:w-auto md:max-w-xl">
              <div className="relative aspect-[4/5] w-full md:w-[480px]">
                <Image
                  src={current.image}
                  alt={current.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 480px"
                  priority
                />
              </div>
            </div>

            {/* Metadata panel */}
            <div className="flex flex-col gap-6 text-paper md:max-w-xs w-full">
              {/* Work info */}
              <div>
                <p className="font-display text-2xl md:text-3xl italic tracking-wide mb-1 text-paper">
                  {current.title}
                </p>
                <p className="text-paper/60 text-sm tracking-body">{current.year}</p>
              </div>

              <div className="space-y-1">
                <p className="text-paper/80 text-sm">{current.medium}</p>
                <p className="text-paper/60 text-sm">{current.dimensions}</p>
              </div>

              <div className="h-px bg-paper/10 w-12" />

              {/* Price & CTA */}
              <div className="space-y-4">
                <p className="text-micro" style={{ color: '#6E6E6E' }}>
                  Price on request
                </p>
                <button
                  className="btn-primary w-full md:w-auto"
                  onClick={() => {
                    const subject = encodeURIComponent(`Inquiry — ${current.title} by ${artistName}`);
                    window.location.href = `/contact?subject=${subject}`;
                  }}
                >
                  Inquire
                </button>
              </div>

              {/* Navigation dots (desktop only) */}
              {works.length > 1 && (
                <div className="hidden md:flex items-center gap-2 mt-2">
                  {works.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => onNavigate(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                        i === currentIndex ? 'bg-jade w-3' : 'bg-paper/30 hover:bg-paper/60'
                      }`}
                      aria-label={`View work ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Navigation arrows */}
          {works.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-paper/60 hover:text-paper transition-colors duration-200"
                aria-label="Previous work"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-paper/60 hover:text-paper transition-colors duration-200"
                aria-label="Next work"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 flex items-center justify-center text-paper/60 hover:text-paper transition-colors duration-200"
            aria-label="Close lightbox"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
