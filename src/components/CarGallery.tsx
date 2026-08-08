'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface GalleryProps {
  images: string[];
  alt: string;
  badge?: string | null;
  price?: number;
}

const imgSrc = (u: string) => (u.startsWith('http') ? u : `/images/${u}`);

/**
 * Multi-view image gallery — main image + thumbnail strip.
 * Thumbnails that fail to load are filtered out gracefully.
 */
export function CarGallery({ images, alt, badge, price }: GalleryProps) {
  const valid = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const [working, setWorking] = useState(valid.map(() => true));
  const shown = valid.filter((_, i) => working[i]);

  const select = (i: number) => {
    // map shown index back to valid index
    let idx = 0;
    for (let j = 0; j < valid.length; j++) {
      if (working[j]) {
        if (idx === i) { setActive(j); return; }
        idx++;
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/10] bg-muted rounded-2xl overflow-hidden img-zoom shadow-lux">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={valid[active] || ''}
          src={imgSrc(valid[active] || '')}
          alt={alt}
          className="w-full h-full object-cover animate-fade-in"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
        {badge && (
          <Badge className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 text-gray-900 backdrop-blur-sm border-0 shadow-sm">
            {badge}
          </Badge>
        )}
        {typeof price === 'number' && (
          <div className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-orange-600 text-white font-bold shadow-glow">
            ${price.toLocaleString()}
          </div>
        )}
      </div>

      {shown.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {shown.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => select(i)}
              className={cn(
                'aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all',
                valid[active] === img
                  ? 'border-primary shadow-glow'
                  : 'border-transparent opacity-70 hover:opacity-100 hover:border-primary/40'
              )}
              aria-label={`View image ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgSrc(img)}
                alt={`${alt} view ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const idx = valid.indexOf(img);
                  setWorking((w) => w.map((ok, k) => (k === idx ? false : ok)));
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
