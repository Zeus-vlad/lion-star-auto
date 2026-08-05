'use client';

import React, { useState, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallback?: string;
}

const SmartImage = forwardRef<HTMLImageElement, SmartImageProps>(
  ({ src, fallback = '/placeholder-car.jpg', className, ...props }, ref) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const normalizeUrl = (url: string) => {
    if (!url) return url;
    if (/pinterest\.com\/pin\//i.test(url)) return url;
    if (url.includes('pinimg.com')) return url;
    const unsplashMatch = url.match(/unsplash\.com\/photos\/([a-zA-Z0-9_-]+)/);
    if (unsplashMatch) {
      return `https://images.unsplash.com/${unsplashMatch[1]}?w=800&q=80`;
    }
    if (/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url)) return url;
    if (url.startsWith('http')) return url;
    return url;
  };

  const normalizedSrc = normalizeUrl(src);

  const handleError = () => {
    if (!error && imageSrc !== fallback) {
      setError(true);
      setImageSrc(fallback);
    }
  };

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <img
      ref={ref}
      src={imageSrc}
      onError={handleError}
      onLoad={handleLoad}
      className={cn('transition-opacity duration-300', loading && 'opacity-50', className)}
      {...props}
    />
  );
});
SmartImage.displayName = 'SmartImage';

export default SmartImage;
