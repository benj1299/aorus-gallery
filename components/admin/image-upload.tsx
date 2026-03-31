'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  name: string;
  defaultValue?: string;
  required?: boolean;
}

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_TYPES = '.jpg,.jpeg,.png,.webp,.gif';

type Tab = 'upload' | 'url';

export function ImageUpload({ name, defaultValue, required }: ImageUploadProps) {
  const [tab, setTab] = useState<Tab>(defaultValue ? 'url' : 'upload');
  const [currentUrl, setCurrentUrl] = useState(defaultValue ?? '');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    setError('');

    if (file.size > MAX_SIZE) {
      setError('Fichier trop lourd (max 10 MB)');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Format non supporté (JPG, PNG, WebP, GIF)');
      return;
    }

    setUploading(true);
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append('file', file);

      setProgress(30);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
      });

      setProgress(80);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de l\'upload');
      }

      const data = await response.json();
      setProgress(100);
      setCurrentUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  const handleRemove = useCallback(() => {
    setCurrentUrl('');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const hasPreview = currentUrl && !currentUrl.startsWith('data:') ? true : currentUrl ? true : false;

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
          Upload
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
          URL
        </button>
      </div>

      {/* Upload tab */}
      {tab === 'upload' && !currentUrl && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            Glissez une image ici ou{' '}
            <span className="text-gray-700 font-medium">cliquez pour parcourir</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP, GIF - Max 10 MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES}
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
          <p className="text-xs text-gray-500">Upload en cours...</p>
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
              alt="Aperçu"
              className="w-full h-full object-cover"
              onError={() => {
                if (tab === 'url') {
                  setError('Impossible de charger l\'image');
                }
              }}
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
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Required hint */}
      {required && !currentUrl && (
        <p className="text-sm text-red-500">Image requise</p>
      )}
    </div>
  );
}
