'use client';

import { useState, useCallback, useEffect, useRef, useLayoutEffect } from 'react';
import { useTranslations } from 'next-intl';
import { RotateCw, RotateCcw, RefreshCcw, AlertTriangle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { getCroppedImage, rotateSize, type CropRect } from '@/lib/image-crop-utils';

/**
 * Bespoke gallery-admin image editor — straighten + free-form crop.
 *
 * Design intent (per multi-format-strategy.md + admin-refactor-plan.md §B):
 *   the mental model is "tilt my photo until the painting is level, then
 *   trim the wall/floor." Not Instagram. Single ±15° straighten slider with
 *   0.5° steps, one 90° quick-rotate button for phone-orientation slips,
 *   free-form crop rectangle with 4 corner handles. No aspect presets, no
 *   zoom slider (zoom was misleading — it didn't affect output resolution).
 *   Light theme to stay coherent with the rest of the admin.
 */

interface ImageEditorProps {
  open: boolean;
  imageSrc: string;
  onComplete: (blob: Blob) => void;
  onCancel: () => void;
}

const STRAIGHTEN_MIN = -15;
const STRAIGHTEN_MAX = 15;
const STRAIGHTEN_STEP = 0.5;

type DragMode =
  | { kind: 'move'; startX: number; startY: number; origCrop: CropRect }
  | { kind: 'resize'; handle: 'nw' | 'ne' | 'sw' | 'se'; startX: number; startY: number; origCrop: CropRect }
  | null;

export function ImageEditor({ open, imageSrc, onComplete, onCancel }: ImageEditorProps) {
  const t = useTranslations('admin.imageEditor');
  const [straighten, setStraighten] = useState(0);
  const [extraRotation, setExtraRotation] = useState(0); // multiples of 90
  const [crop, setCrop] = useState<CropRect | null>(null);
  const [natural, setNatural] = useState<{ width: number; height: number } | null>(null);
  const [applying, setApplying] = useState(false);
  const [imgLoadError, setImgLoadError] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const [displayArea, setDisplayArea] = useState<{
    width: number;
    height: number;
    left: number;
    top: number;
  } | null>(null);
  const [drag, setDrag] = useState<DragMode>(null);

  const rotation = straighten + extraRotation;
  const hasValidImage = !!imageSrc && imageSrc.length > 0;

  // Reset everything each time the editor opens with a new image
  const [prevOpen, setPrevOpen] = useState(open);
  const [prevSrc, setPrevSrc] = useState(imageSrc);
  if (prevOpen !== open || prevSrc !== imageSrc) {
    setPrevOpen(open);
    setPrevSrc(imageSrc);
    setStraighten(0);
    setExtraRotation(0);
    setCrop(null);
    setNatural(null);
    setApplying(false);
    setImgLoadError(false);
    setDisplayArea(null);
  }

  // Compute how the rotated image fits into the workspace
  const recomputeDisplayArea = useCallback(() => {
    if (!wrapRef.current || !natural) return;
    const wrap = wrapRef.current.getBoundingClientRect();
    const rot = rotateSize(natural.width, natural.height, rotation);
    const scale = Math.min(wrap.width / rot.width, wrap.height / rot.height);
    const width = rot.width * scale;
    const height = rot.height * scale;
    const left = (wrap.width - width) / 2;
    const top = (wrap.height - height) / 2;
    setDisplayArea({ width, height, left, top });
  }, [natural, rotation]);

  useLayoutEffect(() => {
    recomputeDisplayArea();
  }, [recomputeDisplayArea]);

  useEffect(() => {
    const handler = () => recomputeDisplayArea();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [recomputeDisplayArea]);

  // Initialize the crop to the full rotated image once we know the natural size
  const [cropInitForDims, setCropInitForDims] = useState<string>('');
  if (natural && !crop) {
    const key = `${natural.width}x${natural.height}`;
    if (cropInitForDims !== key) {
      setCropInitForDims(key);
      const rot = rotateSize(natural.width, natural.height, rotation);
      setCrop({ x: 0, y: 0, width: rot.width, height: rot.height });
    }
  }

  // Re-clamp the crop when rotation changes (image box shifts)
  const [prevRotation, setPrevRotation] = useState(rotation);
  if (prevRotation !== rotation && natural && crop) {
    setPrevRotation(rotation);
    const rot = rotateSize(natural.width, natural.height, rotation);
    setCrop({ x: 0, y: 0, width: rot.width, height: rot.height });
  }

  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setNatural({ width: img.naturalWidth, height: img.naturalHeight });
    setImgLoadError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImgLoadError(true);
  }, []);

  const handleQuickRotate = useCallback(() => {
    setExtraRotation((v) => (v + 90) % 360);
  }, []);

  const handleReset = useCallback(() => {
    setStraighten(0);
    setExtraRotation(0);
    if (natural) {
      const rot = rotateSize(natural.width, natural.height, 0);
      setCrop({ x: 0, y: 0, width: rot.width, height: rot.height });
    } else {
      setCrop(null);
    }
  }, [natural]);

  // --- Crop rectangle drag handlers (pointer events on overlay) ---

  const onOverlayPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!crop) return;
      e.stopPropagation();
      const target = e.target as HTMLElement;
      const handle = target.dataset.handle;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      if (handle === 'nw' || handle === 'ne' || handle === 'sw' || handle === 'se') {
        setDrag({ kind: 'resize', handle, startX: e.clientX, startY: e.clientY, origCrop: { ...crop } });
      } else {
        setDrag({ kind: 'move', startX: e.clientX, startY: e.clientY, origCrop: { ...crop } });
      }
    },
    [crop],
  );

  const onOverlayPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!drag || !crop || !natural || !displayArea) return;
      const rot = rotateSize(natural.width, natural.height, rotation);
      // Convert client pixel delta → image pixel delta via display scale
      const scale = rot.width / displayArea.width;
      const dx = (e.clientX - drag.startX) * scale;
      const dy = (e.clientY - drag.startY) * scale;

      if (drag.kind === 'move') {
        const newX = Math.max(0, Math.min(rot.width - drag.origCrop.width, drag.origCrop.x + dx));
        const newY = Math.max(0, Math.min(rot.height - drag.origCrop.height, drag.origCrop.y + dy));
        setCrop({ ...drag.origCrop, x: newX, y: newY });
      } else {
        const minSize = 20; // px in image space
        let { x, y, width, height } = drag.origCrop;
        if (drag.handle === 'nw') {
          const nx = Math.max(0, Math.min(x + width - minSize, x + dx));
          const ny = Math.max(0, Math.min(y + height - minSize, y + dy));
          width = x + width - nx;
          height = y + height - ny;
          x = nx;
          y = ny;
        } else if (drag.handle === 'ne') {
          const nw = Math.max(minSize, Math.min(rot.width - x, width + dx));
          const ny = Math.max(0, Math.min(y + height - minSize, y + dy));
          height = y + height - ny;
          y = ny;
          width = nw;
        } else if (drag.handle === 'sw') {
          const nx = Math.max(0, Math.min(x + width - minSize, x + dx));
          const nh = Math.max(minSize, Math.min(rot.height - y, height + dy));
          width = x + width - nx;
          x = nx;
          height = nh;
        } else {
          // se
          width = Math.max(minSize, Math.min(rot.width - x, width + dx));
          height = Math.max(minSize, Math.min(rot.height - y, height + dy));
        }
        setCrop({ x, y, width, height });
      }
    },
    [drag, crop, natural, displayArea, rotation],
  );

  const onOverlayPointerUp = useCallback((e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    setDrag(null);
  }, []);

  // --- Apply: export cropped + rotated region as a PNG blob ---

  const handleApply = useCallback(async () => {
    if (!hasValidImage || !crop || !natural) {
      onCancel();
      return;
    }
    setApplying(true);
    try {
      const blob = await getCroppedImage(imageSrc, crop, rotation);
      onComplete(blob);
    } catch (err) {
      console.error('[image-editor] crop failed, sending original', err);
      try {
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        onComplete(blob);
      } catch {
        onCancel();
      }
    } finally {
      setApplying(false);
    }
  }, [hasValidImage, crop, natural, imageSrc, rotation, onComplete, onCancel]);

  // --- Compute crop rect position in DISPLAY pixels ---
  const cropDisplay = (() => {
    if (!crop || !natural || !displayArea) return null;
    const rot = rotateSize(natural.width, natural.height, rotation);
    const scale = displayArea.width / rot.width;
    return {
      left: displayArea.left + crop.x * scale,
      top: displayArea.top + crop.y * scale,
      width: crop.width * scale,
      height: crop.height * scale,
    };
  })();

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onCancel(); }}>
      <DialogContent
        className="sm:max-w-3xl max-h-[92vh] flex flex-col bg-white text-gray-900"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-gray-900">{t('title')}</DialogTitle>
          <DialogDescription className="text-gray-500 text-sm">
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        {/* Workspace: rotated image + axis-aligned crop overlay */}
        <div
          ref={wrapRef}
          className="relative w-full h-[50vh] min-h-[320px] bg-gray-50 rounded-md border border-gray-200 overflow-hidden select-none"
          data-testid="image-editor-workspace"
        >
          {!hasValidImage || imgLoadError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-500">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              <span className="text-sm">{t('noImage', { defaultValue: 'Aucune image à éditer.' })}</span>
            </div>
          ) : (
            <>
              {displayArea && (
                <div
                  className="absolute"
                  style={{
                    left: displayArea.left,
                    top: displayArea.top,
                    width: displayArea.width,
                    height: displayArea.height,
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: 'center center',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSrc}
                    alt=""
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    className="w-full h-full object-contain"
                    draggable={false}
                    data-testid="image-editor-preview"
                  />
                </div>
              )}

              {/* Hidden img for natural size detection (always unrotated) */}
              {!natural && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageSrc}
                  alt=""
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  className="opacity-0 pointer-events-none absolute -z-10"
                  draggable={false}
                  aria-hidden
                />
              )}

              {/* Crop overlay (axis-aligned with viewer, over the rotated image box) */}
              {cropDisplay && (
                <>
                  {/* Dim surrounding area */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-white/50" />
                  </div>
                  <div
                    className="absolute border border-gray-900 cursor-move bg-transparent shadow-[0_0_0_9999px_rgba(255,255,255,0.45)]"
                    style={{
                      left: cropDisplay.left,
                      top: cropDisplay.top,
                      width: cropDisplay.width,
                      height: cropDisplay.height,
                    }}
                    onPointerDown={onOverlayPointerDown}
                    onPointerMove={onOverlayPointerMove}
                    onPointerUp={onOverlayPointerUp}
                    data-testid="image-editor-crop"
                  >
                    {/* Rule-of-thirds guides */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/60" />
                      <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/60" />
                      <div className="absolute top-1/3 left-0 right-0 h-px bg-white/60" />
                      <div className="absolute top-2/3 left-0 right-0 h-px bg-white/60" />
                    </div>
                    {/* Corner handles */}
                    {(['nw', 'ne', 'sw', 'se'] as const).map((h) => (
                      <div
                        key={h}
                        data-handle={h}
                        className={
                          'absolute w-4 h-4 bg-white border border-gray-900 shadow-sm ' +
                          (h === 'nw'
                            ? '-top-2 -left-2 cursor-nwse-resize'
                            : h === 'ne'
                              ? '-top-2 -right-2 cursor-nesw-resize'
                              : h === 'sw'
                                ? '-bottom-2 -left-2 cursor-nesw-resize'
                                : '-bottom-2 -right-2 cursor-nwse-resize')
                        }
                        data-testid={`image-editor-handle-${h}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 w-24 shrink-0 tracking-[0.1em] uppercase">
              {t('straighten', { defaultValue: 'Redresser' })}
            </span>
            <Slider
              value={[straighten]}
              min={STRAIGHTEN_MIN}
              max={STRAIGHTEN_MAX}
              step={STRAIGHTEN_STEP}
              onValueChange={(v: number[]) => setStraighten(v[0])}
              className="flex-1"
              disabled={!hasValidImage || imgLoadError}
              data-testid="image-editor-straighten"
            />
            <span className="text-xs text-gray-700 w-12 text-right tabular-nums">
              {straighten >= 0 ? `+${straighten.toFixed(1)}` : straighten.toFixed(1)}°
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleQuickRotate}
              disabled={!hasValidImage || imgLoadError}
              className="text-gray-900 border-gray-300"
              data-testid="image-editor-rotate-90"
            >
              <RotateCw className="w-4 h-4 mr-1" />
              90°
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
              disabled={!hasValidImage || imgLoadError}
              className="text-gray-600 hover:text-gray-900"
              data-testid="image-editor-reset"
            >
              <RefreshCcw className="w-4 h-4 mr-1" />
              {t('reset', { defaultValue: 'Réinitialiser' })}
            </Button>
            <span className="ml-auto text-xs text-gray-400 hidden md:inline">
              <RotateCcw className="w-3 h-3 inline mr-1" />
              {t('hint', { defaultValue: "Glissez les coins pour ajuster le cadre." })}
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={applying}
            className="text-gray-900 border-gray-300"
            data-testid="image-editor-cancel"
          >
            {t('cancel')}
          </Button>
          <Button
            type="button"
            onClick={handleApply}
            disabled={applying || !hasValidImage || imgLoadError}
            data-testid="image-editor-apply"
          >
            {applying ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                {t('applying')}
              </>
            ) : (
              t('apply')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
