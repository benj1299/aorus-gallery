'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { X, ImagePlus, Upload } from 'lucide-react';
import { useImageUpload } from '@/lib/hooks/use-image-upload';

interface ImageEntry {
  url: string;
  width: number | null;
  height: number | null;
}

interface MultiImageUploadProps {
  name: string;
  defaultValue?: string[];
  defaultMeta?: Array<{ width: number | null; height: number | null }>;
  metaName?: string;
  maxImages?: number;
}

export function MultiImageUpload({
  name,
  defaultValue = [],
  defaultMeta = [],
  metaName,
  maxImages = 5,
}: MultiImageUploadProps) {
  const t = useTranslations('admin.upload');
  const [images, setImages] = useState<ImageEntry[]>(() =>
    defaultValue.map((url, i) => ({
      url,
      width: defaultMeta[i]?.width ?? null,
      height: defaultMeta[i]?.height ?? null,
    })),
  );

  const {
    uploading,
    error,
    fileInputRef,
    acceptedTypes,
    validateFile,
    uploadFile,
  } = useImageUpload();

  const canAdd = images.length < maxImages;

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !validateFile(file)) return;

      const result = await uploadFile(file);
      if (result) {
        setImages((prev) => [...prev, result]);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    [validateFile, uploadFile, fileInputRef],
  );

  const handleRemove = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const metaFieldName = metaName ?? `${name}Meta`;
  const metaPayload = JSON.stringify(
    images.map(({ width, height }) => ({ width, height })),
  );

  return (
    <div className="space-y-3">
      {/* Hidden inputs: one per image URL so FormData.getAll(name) works */}
      {images.map(({ url }) => (
        <input key={url} type="hidden" name={name} value={url} />
      ))}
      {/* Aligned meta array — serialized JSON */}
      <input type="hidden" name={metaFieldName} value={metaPayload} />

      {/* Thumbnail grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {images.map(({ url }, index) => (
            <div key={url} className="relative group aspect-square">
              <div className="w-full h-full rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
                <img
                  src={url}
                  alt={`Image ${index + 1}`}
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    if (!img.naturalWidth) return;
                    setImages((prev) =>
                      prev.map((entry) =>
                        entry.url === url && entry.width === null
                          ? { ...entry, width: img.naturalWidth, height: img.naturalHeight }
                          : entry,
                      ),
                    );
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                aria-label={t('remove', { defaultValue: 'Retirer' })}
              >
                <X className="w-3.5 h-3.5 text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Counter */}
      <p className="text-xs text-gray-400">
        {images.length}/{maxImages} images
      </p>

      {/* Add button */}
      {canAdd && (
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <Upload className="w-4 h-4 animate-pulse" />
              {t('uploading')}
            </>
          ) : (
            <>
              <ImagePlus className="w-4 h-4" />
              {t('addImage')}
            </>
          )}
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error */}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
