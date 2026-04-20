'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Upload, X, Link as LinkIcon, Pencil } from 'lucide-react';
import { ImageEditor } from '@/components/admin/image-editor';
import { useImageUpload } from '@/lib/hooks/use-image-upload';

interface ImageUploadProps {
  name: string;
  defaultValue?: string;
  defaultWidth?: number | null;
  defaultHeight?: number | null;
  required?: boolean;
}

type Tab = 'upload' | 'url';

export function ImageUpload({ name, defaultValue, defaultWidth, defaultHeight, required }: ImageUploadProps) {
  const t = useTranslations('admin.upload');
  const [tab, setTab] = useState<Tab>(defaultValue ? 'url' : 'upload');
  const [currentUrl, setCurrentUrl] = useState(defaultValue ?? '');
  const [currentWidth, setCurrentWidth] = useState<number | null>(defaultWidth ?? null);
  const [currentHeight, setCurrentHeight] = useState<number | null>(defaultHeight ?? null);
  const [dragOver, setDragOver] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorImageSrc, setEditorImageSrc] = useState('');

  const [prevDefault, setPrevDefault] = useState(defaultValue ?? '');
  if ((defaultValue ?? '') !== prevDefault) {
    setPrevDefault(defaultValue ?? '');
    if (defaultValue) {
      setCurrentUrl(defaultValue);
      setCurrentWidth(defaultWidth ?? null);
      setCurrentHeight(defaultHeight ?? null);
      setTab('url');
      setPreviewError(false);
    }
  }

  const [prevCurrent, setPrevCurrent] = useState(currentUrl);
  if (currentUrl !== prevCurrent) {
    setPrevCurrent(currentUrl);
    setPreviewError(false);
  }

  const {
    uploading,
    progress,
    error,
    fileInputRef,
    acceptedTypes,
    validateFile,
    uploadFile,
  } = useImageUpload();

  // Upload a file directly (no editor intermediate step) — this is the new default flow per designer §6.3
  const uploadDirect = useCallback(
    async (file: File) => {
      if (!validateFile(file)) return;
      const result = await uploadFile(file);
      if (result) {
        setCurrentUrl(result.url);
        setCurrentWidth(result.width);
        setCurrentHeight(result.height);
        setTab('url');
      }
    },
    [validateFile, uploadFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) uploadDirect(file);
    },
    [uploadDirect],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) uploadDirect(file);
    },
    [uploadDirect],
  );

  const handleRemove = useCallback(() => {
    setCurrentUrl('');
    setCurrentWidth(null);
    setCurrentHeight(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [fileInputRef]);

  // On-demand edit: re-open the editor with the current image for crop/rotate
  const openEditorWithCurrent = useCallback(() => {
    if (!currentUrl) return;
    setEditorImageSrc(currentUrl);
    setEditorOpen(true);
  }, [currentUrl]);

  const onEditorComplete = useCallback(
    async (blob: Blob) => {
      setEditorOpen(false);
      const file = new File([blob], 'edited-image.png', { type: 'image/png' });
      const result = await uploadFile(file);
      if (result) {
        setCurrentUrl(result.url);
        setCurrentWidth(result.width);
        setCurrentHeight(result.height);
      }
      setEditorImageSrc('');
    },
    [uploadFile],
  );

  const onEditorCancel = useCallback(() => {
    setEditorOpen(false);
    setEditorImageSrc('');
  }, []);

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={currentUrl} />
      <input type="hidden" name={`${name}Width`} value={currentWidth ?? ''} />
      <input type="hidden" name={`${name}Height`} value={currentHeight ?? ''} />

      {/* Tabs */}
      <div className="inline-flex rounded-lg bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => setTab('upload')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            tab === 'upload'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          {t('upload')}
        </button>
        <button
          type="button"
          onClick={() => setTab('url')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            tab === 'url'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          {t('url')}
        </button>
      </div>

      {/* Upload tab */}
      {tab === 'upload' && !currentUrl && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            {t('dragOrClick')}{' '}
            <span className="text-gray-700 font-medium">{t('clickToBrowse')}</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">{t('formats')}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* Upload progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">{t('uploading')}</p>
        </div>
      )}

      {/* URL tab */}
      {tab === 'url' && !currentUrl && (
        <div>
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
            onChange={(e) => {
              setCurrentUrl(e.target.value);
              setCurrentWidth(null);
              setCurrentHeight(null);
            }}
          />
        </div>
      )}

      {/* Preview */}
      {currentUrl && (
        <div className="relative w-full max-w-xs" data-testid="image-upload-preview">
          <div className="h-48 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
            {previewError ? (
              <div className="flex flex-col items-center gap-2 px-4 text-center">
                <span className="text-sm text-gray-500">{t('previewError', { defaultValue: 'Aperçu indisponible' })}</span>
                <span className="text-xs text-gray-400 break-all">{currentUrl}</span>
              </div>
            ) : (
              <img
                src={currentUrl}
                alt={t('preview')}
                onError={() => setPreviewError(true)}
                onLoad={(e) => {
                  const img = e.currentTarget;
                  if (!currentWidth && img.naturalWidth) setCurrentWidth(img.naturalWidth);
                  if (!currentHeight && img.naturalHeight) setCurrentHeight(img.naturalHeight);
                }}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
            aria-label={t('remove', { defaultValue: 'Retirer' })}
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
          {/* Discreet edit link — only visible when there's an image and it's not in error */}
          {!previewError && (
            <button
              type="button"
              onClick={openEditorWithCurrent}
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors underline-offset-2 hover:underline"
            >
              <Pencil className="w-3 h-3" />
              {t('editImage', { defaultValue: 'Recadrer ou faire pivoter' })}
            </button>
          )}
        </div>
      )}

      {/* Error */}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Required hint */}
      {required && !currentUrl && <p className="text-sm text-red-500">{t('imageRequired')}</p>}

      {/* Image editor modal — only rendered when user explicitly requests crop/rotate */}
      <ImageEditor
        open={editorOpen}
        imageSrc={editorImageSrc}
        onComplete={onEditorComplete}
        onCancel={onEditorCancel}
      />
    </div>
  );
}
