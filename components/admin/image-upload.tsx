'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Upload, X, Link as LinkIcon } from 'lucide-react';
import { ImageEditor } from '@/components/admin/image-editor';
import { useImageUpload } from '@/lib/hooks/use-image-upload';

interface ImageUploadProps {
  name: string;
  defaultValue?: string;
  required?: boolean;
}

type Tab = 'upload' | 'url';

export function ImageUpload({ name, defaultValue, required }: ImageUploadProps) {
  const t = useTranslations('admin.upload');
  const [tab, setTab] = useState<Tab>(defaultValue ? 'url' : 'upload');
  const [currentUrl, setCurrentUrl] = useState(defaultValue ?? '');
  const [dragOver, setDragOver] = useState(false);

  const {
    uploading,
    progress,
    error,
    fileInputRef,
    acceptedTypes,
    openEditor,
    showEditor,
    editorSrc,
    handleEditorCancel,
    handleEditorComplete,
  } = useImageUpload();

  const onEditorComplete = useCallback(async (blob: Blob) => {
    const url = await handleEditorComplete(blob);
    if (url) setCurrentUrl(url);
  }, [handleEditorComplete]);

  const onEditorCancel = useCallback(() => {
    handleEditorCancel();
  }, [handleEditorCancel]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) openEditor(file);
    },
    [openEditor]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) openEditor(file);
    },
    [openEditor]
  );

  const handleRemove = useCallback(() => {
    setCurrentUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [fileInputRef]);

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={currentUrl} />

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
            onChange={(e) => setCurrentUrl(e.target.value)}
          />
        </div>
      )}

      {/* Preview */}
      {currentUrl && (
        <div className="relative w-full max-w-xs">
          <div className="h-48 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
            <img
              src={currentUrl}
              alt={t('preview')}
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Required hint */}
      {required && !currentUrl && <p className="text-sm text-red-500">{t('imageRequired')}</p>}

      {/* Image editor modal */}
      <ImageEditor
        open={showEditor}
        imageSrc={editorSrc}
        onComplete={onEditorComplete}
        onCancel={onEditorCancel}
      />
    </div>
  );
}
