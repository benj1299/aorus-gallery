/**
 * Image crop + straighten utilities. Standalone — no react-easy-crop
 * dependency. Designed for the bespoke gallery-admin editor that exposes a
 * ±15° straighten slider and a free-form crop rectangle (no aspect preset).
 */

/** Rectangle in image pixel space: x/y/width/height at 1:1 scale. */
export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Loads an image from a URL (works cross-origin when the URL is same-origin
 * or serves CORS headers — our /api/image-proxy handles R2).
 */
export function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (err) => reject(err));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });
}

export function getRadianAngle(degreeValue: number): number {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Bounding-box size after rotating a w×h rectangle by `rotation` degrees.
 * Used to size the canvas when rendering a rotated image without clipping.
 */
export function rotateSize(
  width: number,
  height: number,
  rotation: number,
): { width: number; height: number } {
  const rotRad = getRadianAngle(rotation);
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * Renders the source image rotated by `rotation` degrees, then extracts
 * `pixelCrop` from the rotated canvas. `pixelCrop` coords are in the
 * rotated image's coordinate system (origin at top-left of the bounding box).
 */
export async function getCroppedImage(
  imageSrc: string,
  pixelCrop: CropRect,
  rotation: number,
): Promise<Blob> {
  const image = await createImage(imageSrc);

  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation,
  );

  const rotatedCanvas = document.createElement('canvas');
  rotatedCanvas.width = bBoxWidth;
  rotatedCanvas.height = bBoxHeight;
  const rotatedCtx = rotatedCanvas.getContext('2d');
  if (!rotatedCtx) throw new Error('Failed to get canvas 2D context');

  rotatedCtx.translate(bBoxWidth / 2, bBoxHeight / 2);
  rotatedCtx.rotate(getRadianAngle(rotation));
  rotatedCtx.translate(-image.width / 2, -image.height / 2);
  rotatedCtx.drawImage(image, 0, 0);

  const out = document.createElement('canvas');
  out.width = Math.max(1, Math.round(pixelCrop.width));
  out.height = Math.max(1, Math.round(pixelCrop.height));
  const outCtx = out.getContext('2d');
  if (!outCtx) throw new Error('Failed to get canvas 2D context');

  outCtx.drawImage(
    rotatedCanvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise<Blob>((resolve, reject) => {
    out.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob returned null'));
      },
      'image/png',
      1,
    );
  });
}
