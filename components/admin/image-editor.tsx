'use client';

import { useState, useCallback, useEffect } from 'react';
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

// --- Types ---

interface ImageEditorProps {
  open: boolean;
  imageSrc: string;
  onComplete: (blob: Blob) => void;
  onCancel: () => void;
}

interface AspectPreset {
  label: string;
  value: number | undefined;
}

// --- Constants ---

const ASPECT_PRESETS: AspectPreset[] = [
  { label: 'Libre', value: undefined },
  { label: '1:1', value: 1 },
  { label: '4:5', value: 4 / 5 },
  { label: '3:4', value: 3 / 4 },
  { label: '4:3', value: 4 / 3 },
];

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.1;
const ROTATION_STEP = 90;

// --- Component ---

export function ImageEditor({ open, imageSrc, onComplete, onCancel }: ImageEditorProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [applying, setApplying] = useState(false);

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

  const handleRotateLeft = useCallback(() => {
    setRotation((prev) => prev - ROTATION_STEP);
  }, []);

  const handleRotateRight = useCallback(() => {
    setRotation((prev) => prev + ROTATION_STEP);
  }, []);

  const handleApply = useCallback(async () => {
    if (!croppedAreaPixels) return;

    setApplying(true);
    try {
      const blob = await getCroppedImage(imageSrc, croppedAreaPixels, rotation);
      onComplete(blob);
    } catch {
      // If canvas processing fails, fall back to original by signaling cancel
      onCancel();
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
          <DialogTitle>Recadrer l&apos;image</DialogTitle>
          <DialogDescription>
            Ajustez le cadrage, la rotation et le zoom avant l&apos;upload.
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
            <span className="text-sm text-muted-foreground font-medium shrink-0">Ratio :</span>
            {ASPECT_PRESETS.map((preset) => (
              <Button
                key={preset.label}
                type="button"
                variant={aspect === preset.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAspect(preset.value)}
              >
                {preset.label}
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
              title="Rotation -90°"
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
              title="Rotation +90°"
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
            Annuler
          </Button>
          <Button type="button" onClick={handleApply} disabled={applying || !croppedAreaPixels}>
            {applying ? 'Application...' : 'Appliquer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- Helper: Canvas crop ---

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });
}

function getRadianAngle(degreeValue: number): number {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Returns a new bounding box size after rotation.
 */
function rotateSize(width: number, height: number, rotation: number): { width: number; height: number } {
  const rotRad = getRadianAngle(rotation);
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * Draws the cropped and rotated image on a canvas and returns it as a Blob.
 */
async function getCroppedImage(imageSrc: string, pixelCrop: Area, rotation: number): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas 2D context');
  }

  const rotRad = getRadianAngle(rotation);

  // Calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // Set canvas size to the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // Translate canvas center to the origin, rotate, then translate back
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);

  // Draw the rotated image
  ctx.drawImage(image, 0, 0);

  // Extract the cropped area from the rotated canvas
  const croppedCanvas = document.createElement('canvas');
  const croppedCtx = croppedCanvas.getContext('2d');

  if (!croppedCtx) {
    throw new Error('Failed to get canvas 2D context');
  }

  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Convert to blob (PNG to preserve quality; Sharp will convert to WebP server-side)
  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas toBlob returned null'));
        }
      },
      'image/png',
      1
    );
  });
}
