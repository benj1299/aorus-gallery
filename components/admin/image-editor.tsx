'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';
import { RotateCcw, RotateCw, ZoomIn, ZoomOut, AlertTriangle } from 'lucide-react';
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
import { getCroppedImage } from '@/lib/image-crop-utils';

// --- Types ---

interface ImageEditorProps {
  open: boolean;
  imageSrc: string;
  onComplete: (blob: Blob) => void;
  onCancel: () => void;
}

// --- Constants ---

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.1;
const ROTATION_STEP = 90;

// --- Component ---
//
// Per designer §6.3: ratio preserved natively — no aspect presets that force
// the user to crop to preset ratios. The editor exists for OPTIONAL rotation
// (correcting photos shot in landscape when the artwork is portrait) and
// optional free-form crop (removing a parasitic background element).

export function ImageEditor({ open, imageSrc, onComplete, onCancel }: ImageEditorProps) {
  const t = useTranslations('admin.imageEditor');
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [applying, setApplying] = useState(false);

  // Reset state when the dialog opens with a new image
  useEffect(() => {
    if (open) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      setCroppedAreaPixels(null);
      setApplying(false);
    }
  }, [open, imageSrc]);

  const handleCropComplete = useCallback((_croppedArea: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // Initialize croppedAreaPixels when the image loads
  const handleMediaLoaded = useCallback((mediaSize: { naturalWidth: number; naturalHeight: number }) => {
    if (!croppedAreaPixels) {
      setCroppedAreaPixels({
        x: 0,
        y: 0,
        width: mediaSize.naturalWidth,
        height: mediaSize.naturalHeight,
      });
    }
  }, [croppedAreaPixels]);

  const handleRotateLeft = useCallback(() => {
    setRotation((prev) => prev - ROTATION_STEP);
  }, []);

  const handleRotateRight = useCallback(() => {
    setRotation((prev) => prev + ROTATION_STEP);
  }, []);

  const handleApply = useCallback(async () => {
    setApplying(true);
    try {
      if (croppedAreaPixels) {
        const blob = await getCroppedImage(imageSrc, croppedAreaPixels, rotation);
        onComplete(blob);
      } else {
        // No crop area yet — send original image as-is
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        onComplete(blob);
      }
    } catch {
      // If canvas/fetch fails, try to send the original as a fallback
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
  }, [imageSrc, croppedAreaPixels, rotation, onComplete, onCancel]);

  const hasValidImage = !!imageSrc && imageSrc.length > 0;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onCancel(); }}>
      <DialogContent
        className="sm:max-w-2xl max-h-[90vh] flex flex-col bg-gray-950 text-white border-white/10"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-white">{t('title')}</DialogTitle>
          <DialogDescription className="text-white/60">
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        {/* Crop area — only render Cropper when we have a valid image src */}
        <div className="relative w-full h-80 bg-black rounded-lg overflow-hidden">
          {hasValidImage ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={undefined}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={handleCropComplete}
              onMediaLoaded={handleMediaLoaded}
              showGrid
              classes={{
                containerClassName: 'rounded-lg',
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/70 text-sm flex-col gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              {t('noImage', { defaultValue: "Aucune image à éditer." })}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Zoom control */}
          <div className="flex items-center gap-3">
            <ZoomOut className="w-4 h-4 text-white/60 shrink-0" />
            <Slider
              value={[zoom]}
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={ZOOM_STEP}
              onValueChange={(values: number[]) => setZoom(values[0])}
              className="flex-1"
              disabled={!hasValidImage}
            />
            <ZoomIn className="w-4 h-4 text-white/60 shrink-0" />
          </div>

          {/* Rotation control */}
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={handleRotateLeft}
              title={t('rotateLeft')}
              disabled={!hasValidImage}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Slider
              value={[rotation]}
              min={-180}
              max={180}
              step={1}
              onValueChange={(values: number[]) => setRotation(values[0])}
              className="flex-1"
              disabled={!hasValidImage}
            />
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={handleRotateRight}
              title={t('rotateRight')}
              disabled={!hasValidImage}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
            <span className="text-xs text-white/60 w-12 text-right tabular-nums">
              {rotation}°
            </span>
          </div>
        </div>

        {/* Actions */}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={applying}
            className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
            data-testid="image-editor-cancel"
          >
            {t('cancel')}
          </Button>
          <Button
            type="button"
            onClick={handleApply}
            disabled={applying || !hasValidImage}
            className="bg-white text-gray-950 hover:bg-white/90"
            data-testid="image-editor-apply"
          >
            {applying ? t('applying') : t('apply')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
