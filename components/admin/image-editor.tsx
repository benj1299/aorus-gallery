'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';
import { RotateCcw, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
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

interface AspectPreset {
  labelKey: string;
  displayLabel: string;
  value: number | undefined;
}

// --- Constants ---

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.1;
const ROTATION_STEP = 90;

// --- Component ---

export function ImageEditor({ open, imageSrc, onComplete, onCancel }: ImageEditorProps) {
  const t = useTranslations('admin.imageEditor');
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [applying, setApplying] = useState(false);

  const ASPECT_PRESETS: AspectPreset[] = [
    { labelKey: 'free', displayLabel: t('free'), value: undefined },
    { labelKey: '1:1', displayLabel: '1:1', value: 1 },
    { labelKey: '4:5', displayLabel: '4:5', value: 4 / 5 },
    { labelKey: '3:4', displayLabel: '3:4', value: 3 / 4 },
    { labelKey: '4:3', displayLabel: '4:3', value: 4 / 3 },
  ];

  // Reset state when the dialog opens with a new image
  useEffect(() => {
    if (open) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      setAspect(undefined);
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

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onCancel(); }}>
      <DialogContent
        className="sm:max-w-2xl max-h-[90vh] flex flex-col"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        {/* Crop area */}
        <div className="relative w-full h-80 bg-gray-950 rounded-lg overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect ?? 4 / 3}
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
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Aspect ratio presets */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground font-medium shrink-0">{t('ratio')}</span>
            {ASPECT_PRESETS.map((preset) => (
              <Button
                key={preset.labelKey}
                type="button"
                variant={aspect === preset.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAspect(preset.value)}
              >
                {preset.displayLabel}
              </Button>
            ))}
          </div>

          {/* Zoom control */}
          <div className="flex items-center gap-3">
            <ZoomOut className="w-4 h-4 text-muted-foreground shrink-0" />
            <Slider
              value={[zoom]}
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={ZOOM_STEP}
              onValueChange={(values: number[]) => setZoom(values[0])}
              className="flex-1"
            />
            <ZoomIn className="w-4 h-4 text-muted-foreground shrink-0" />
          </div>

          {/* Rotation control */}
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={handleRotateLeft}
              title={t('rotateLeft')}
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
            />
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={handleRotateRight}
              title={t('rotateRight')}
            >
              <RotateCw className="w-4 h-4" />
            </Button>
            <span className="text-xs text-muted-foreground w-12 text-right tabular-nums">
              {rotation}°
            </span>
          </div>
        </div>

        {/* Actions */}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel} disabled={applying}>
            {t('cancel')}
          </Button>
          <Button type="button" onClick={handleApply} disabled={applying}>
            {applying ? t('applying') : t('apply')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
