'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface LightboxProps {
  images: { src: string; alt: string }[];
  index: number;
  open: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

const ZOOM_LEVELS = [1, 2, 3] as const;
const WHEEL_ZOOM_STEP = 0.2;

export function Lightbox({ images, index, open, onClose, onIndexChange }: LightboxProps) {
  const t = useTranslations('lightbox');
  const hasMultiple = images.length > 1;
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const goPrev = useCallback(() => {
    resetZoom();
    onIndexChange((index - 1 + images.length) % images.length);
  }, [index, images.length, onIndexChange, resetZoom]);

  const goNext = useCallback(() => {
    resetZoom();
    onIndexChange((index + 1) % images.length);
  }, [index, images.length, onIndexChange, resetZoom]);

  const cycleZoom = useCallback(() => {
    setZoom((current) => {
      const currentIdx = ZOOM_LEVELS.findIndex((z) => Math.abs(z - current) < 0.01);
      const nextIdx = (currentIdx + 1) % ZOOM_LEVELS.length;
      const next = ZOOM_LEVELS[nextIdx];
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    // Zoom on plain wheel — no need for ctrl since we own the viewport.
    e.preventDefault();
    setZoom((current) => {
      const delta = e.deltaY > 0 ? -WHEEL_ZOOM_STEP : WHEEL_ZOOM_STEP;
      const next = Math.max(1, Math.min(4, current + delta));
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (zoom <= 1 || !imageRef.current) return;
      const rect = imageRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      // Pan so that the cursor's position on the image stays under the cursor.
      const panRangeX = (rect.width * (zoom - 1)) / 2;
      const panRangeY = (rect.height * (zoom - 1)) / 2;
      const nx = ((cx - e.clientX) / (rect.width / 2)) * panRangeX;
      const ny = ((cy - e.clientY) / (rect.height / 2)) * panRangeY;
      setPan({ x: nx, y: ny });
    },
    [zoom],
  );

  const zoomIn = useCallback(() => setZoom((z) => Math.min(4, z + 0.5)), []);
  const zoomOut = useCallback(() => {
    setZoom((z) => {
      const next = Math.max(1, z - 0.5);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (hasMultiple && e.key === 'ArrowLeft') goPrev();
      if (hasMultiple && e.key === 'ArrowRight') goNext();
      if (e.key === '+' || e.key === '=') zoomIn();
      if (e.key === '-' || e.key === '_') zoomOut();
      if (e.key === '0') resetZoom();
    }

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, hasMultiple, goPrev, goNext, onClose, zoomIn, zoomOut, resetZoom]);

  // Reset zoom when the lightbox toggles closed (render-time state reset
  // pattern — React accepts this for prop-driven resets).
  const [prevOpen, setPrevOpen] = useState(open);
  if (prevOpen !== open) {
    setPrevOpen(open);
    if (!open) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }

  if (!open || images.length === 0) return null;

  const current = images[index];
  const isZoomed = zoom > 1.01;

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
          aria-label={t('viewer')}
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
            aria-label={t('close')}
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

          {/* Zoom controls */}
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 px-4 py-2 bg-noir/40 backdrop-blur-sm rounded-full border border-blanc/10"
            data-testid="lightbox-zoom-controls"
          >
            <button
              onClick={zoomOut}
              disabled={zoom <= 1}
              className="w-8 h-8 flex items-center justify-center text-blanc/70 hover:text-blanc transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label={t('zoomOut', { defaultValue: 'Zoom out' })}
              data-testid="lightbox-zoom-out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-blanc/60 text-xs tracking-[0.15em] tabular-nums w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={zoomIn}
              disabled={zoom >= 4}
              className="w-8 h-8 flex items-center justify-center text-blanc/70 hover:text-blanc transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label={t('zoomIn', { defaultValue: 'Zoom in' })}
              data-testid="lightbox-zoom-in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Previous */}
          {hasMultiple && !isZoomed && (
            <button
              onClick={goPrev}
              className="absolute left-4 md:left-8 z-10 w-12 h-12 flex items-center justify-center text-blanc/50 hover:text-blanc transition-colors"
              aria-label={t('previous')}
              data-testid="lightbox-prev"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Image with zoom + pan */}
          <motion.div
            key={index}
            ref={imageRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative z-[1] w-[90vw] h-[85vh] max-w-7xl select-none overflow-hidden"
            onClick={(e) => {
              // Only cycle zoom if click is on the image container (not on child nav buttons).
              if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'IMG') {
                cycleZoom();
              }
            }}
            onWheel={handleWheel}
            onMouseMove={handleMouseMove}
            style={{ cursor: isZoomed ? 'zoom-out' : 'zoom-in' }}
            data-testid="lightbox-image"
            data-zoom-level={zoom}
          >
            <motion.div
              animate={{
                scale: zoom,
                x: pan.x,
                y: pan.y,
              }}
              transition={{
                scale: { type: 'spring', stiffness: 200, damping: 25 },
                x: { type: 'spring', stiffness: 400, damping: 40 },
                y: { type: 'spring', stiffness: 400, damping: 40 },
              }}
              className="relative w-full h-full"
            >
              <Image
                src={current.src}
                alt={current.alt}
                fill
                sizes="90vw"
                className="object-contain pointer-events-none"
                priority
              />
            </motion.div>
          </motion.div>

          {/* Next */}
          {hasMultiple && !isZoomed && (
            <button
              onClick={goNext}
              className="absolute right-4 md:right-8 z-10 w-12 h-12 flex items-center justify-center text-blanc/50 hover:text-blanc transition-colors"
              aria-label={t('next')}
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
