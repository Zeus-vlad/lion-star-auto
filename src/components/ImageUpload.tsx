'use client';

import { useCallback, useRef, useState } from 'react';
import { ImagePlus, Loader2, Check, X, UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, folder = 'cars', className }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setError(null);

      // Validate type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (JPG, PNG, WebP)');
        return;
      }

      // Validate size ≤ 15MB
      if (file.size > 15 * 1024 * 1024) {
        setError(`Image is ${(file.size / 1024 / 1024).toFixed(1)}MB — max allowed is 15MB.`);
        return;
      }

      setUploading(true);
      try {
        const form = new FormData();
        form.append('file', file);
        form.append('folder', folder);

        const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Upload failed');

        onChange(data.url);
      } catch (e) {
        setError((e as Error).message || 'Upload failed. Please try again.');
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange]
  );

  const handleFile = (file?: File | null) => {
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {value ? (
        // Preview mode
        <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-zinc-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Upload preview" className="w-full h-44 object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white flex items-center gap-1.5 backdrop-blur"
            >
              <ImagePlus className="w-3.5 h-3.5" /> Replace
            </button>
            <button
              type="button"
              onClick={async () => {
                // Best-effort delete from bucket, then clear field
                try {
                  const keyMatch = value.match(/lstar-images\/(.+)$/);
                  if (keyMatch) {
                    await fetch(`/api/admin/upload?key=${encodeURIComponent(keyMatch[1])}`, { method: 'DELETE' });
                  }
                } catch { /* non-fatal */ }
                onChange('');
              }}
              className="px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-xs text-red-300 flex items-center gap-1.5 backdrop-blur"
            >
              <X className="w-3.5 h-3.5" /> Remove
            </button>
          </div>
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500/90 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
      ) : (
        // Dropzone mode
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'w-full h-44 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all',
            dragging
              ? 'border-primary bg-primary/10 scale-[1.01]'
              : 'border-white/15 bg-zinc-900/50 hover:border-primary/50 hover:bg-zinc-900'
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <span className="text-sm text-white/70">Uploading to CDN…</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-8 h-8 text-white/40 group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium text-white/70">
                Tap to upload or drag &amp; drop
              </span>
              <span className="text-[11px] text-white/40">JPG · PNG · WebP — max 15MB</span>
            </>
          )}
        </button>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}

      {value && (
        <p className="text-[11px] text-white/40 truncate font-mono" title={value}>
          {value}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
    </div>
  );
}
