'use client';

import { useState, useRef, useCallback } from 'react';

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_TYPES = '.jpg,.jpeg,.png,.webp,.gif';
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

interface UseImageUploadReturn {
  // Upload state
  uploading: boolean;
  progress: number;
  error: string;
  clearError: () => void;

  // File input
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  acceptedTypes: string;

  // Core actions
  validateFile: (file: File) => boolean;
  uploadFile: (file: File | Blob, fileName?: string) => Promise<string | null>;

  // Editor state
  showEditor: boolean;
  editorSrc: string;
  openEditor: (file: File) => void;
  handleEditorComplete: (blob: Blob) => Promise<string | null>;
  handleEditorCancel: () => void;
}

export function useImageUpload(): UseImageUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [editorSrc, setEditorSrc] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearError = useCallback(() => setError(''), []);

  const validateFile = useCallback((file: File): boolean => {
    setError('');

    if (file.size > MAX_SIZE) {
      setError('Fichier trop lourd (max 10 MB)');
      return false;
    }

    if (!ALLOWED_MIME.includes(file.type)) {
      setError('Format non support\u00e9 (JPG, PNG, WebP, GIF)');
      return false;
    }

    return true;
  }, []);

  const uploadFile = useCallback(async (file: File | Blob, fileName?: string): Promise<string | null> => {
    setUploading(true);
    setProgress(10);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file, fileName);

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
      return data.url as string;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, []);

  const openEditor = useCallback((file: File) => {
    if (!validateFile(file)) return;

    const objectUrl = URL.createObjectURL(file);
    setEditorSrc(objectUrl);
    setShowEditor(true);
  }, [validateFile]);

  const handleEditorComplete = useCallback(async (blob: Blob): Promise<string | null> => {
    setShowEditor(false);
    if (editorSrc) URL.revokeObjectURL(editorSrc);
    setEditorSrc('');

    const croppedFile = new File([blob], 'cropped-image.png', { type: 'image/png' });
    return uploadFile(croppedFile);
  }, [editorSrc, uploadFile]);

  const handleEditorCancel = useCallback(() => {
    setShowEditor(false);
    if (editorSrc) URL.revokeObjectURL(editorSrc);
    setEditorSrc('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [editorSrc]);

  return {
    uploading,
    progress,
    error,
    clearError,
    fileInputRef,
    acceptedTypes: ACCEPTED_TYPES,
    validateFile,
    uploadFile,
    showEditor,
    editorSrc,
    openEditor,
    handleEditorComplete,
    handleEditorCancel,
  };
}
