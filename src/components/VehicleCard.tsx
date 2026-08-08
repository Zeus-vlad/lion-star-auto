'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, ArrowRight, Loader2, Check, Gauge, Fuel, Cog, Calendar } from 'lucide-react';
import SmartImage from '@/components/SmartImage';
import { useState } from 'react';

interface VehicleCardProps {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  year?: number;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
}

export function VehicleCard({
  id,
  title,
  price,
  image,
  category,
  year,
  mileage,
  fuelType,
  transmission,
}: VehicleCardProps) {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const addToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (adding) return;
    setAdding(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id }),
      });
      if (res.ok) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      }
    } catch {
      // silent fail on network error
    } finally {
      setAdding(false);
    }
  };

  return (
    <Link href={`/products/${id}`} className="block group h-full">
      <Card className="card-lift overflow-hidden h-full bg-card border-border/50 rounded-2xl">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted img-zoom">
          <SmartImage
            src={image}
            alt={`${year || ''} ${title}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Gradient scrim for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <Badge className="text-xs px-2.5 py-1 bg-white/90 text-gray-900 backdrop-blur-sm hover:bg-white/90 border-0 shadow-sm">
              {category}
            </Badge>
          </div>

          {/* Year chip */}
          {year && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium border border-white/10">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              {year}
            </div>
          )}

          {/* Wishlist button */}
          <button
            className="absolute top-3 right-3 p-2.5 bg-black/40 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-white hover:scale-110"
            aria-label="Add to wishlist"
            onClick={(e) => e.preventDefault()}
          >
            <Heart className="w-4 h-4" />
          </button>

          {/* Price ribbon */}
          <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary to-orange-600 text-white font-bold text-sm shadow-glow">
            ${price.toLocaleString()}
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-5 pb-0">
          <h3 className="font-semibold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors mb-3">
            {title}
          </h3>

          {/* Spec chips */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {mileage ? (
              <span className="flex items-center justify-center gap-1.5 px-2 py-1.5 bg-muted/60 rounded-lg text-[11px] text-muted-foreground font-medium">
                <Gauge className="w-3.5 h-3.5 text-primary" />
                {mileage.toLocaleString()}
              </span>
            ) : (
              <span className="px-2 py-1.5 bg-muted/60 rounded-lg text-[11px] text-muted-foreground font-medium text-center">—</span>
            )}
            <span className="flex items-center justify-center gap-1.5 px-2 py-1.5 bg-muted/60 rounded-lg text-[11px] text-muted-foreground font-medium">
              <Fuel className="w-3.5 h-3.5 text-primary" />
              {fuelType || '—'}
            </span>
            <span className="flex items-center justify-center gap-1.5 px-2 py-1.5 bg-muted/60 rounded-lg text-[11px] text-muted-foreground font-medium">
              <Cog className="w-3.5 h-3.5 text-primary" />
              {transmission || '—'}
            </span>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-5 pt-0 gap-2">
          <Button
            className="flex-1 gap-2 bg-primary hover:bg-primary/90 shadow-glow"
            type="button"
          >
            View Details
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            className={cn(
              'gap-2 px-3.5',
              added
                ? 'bg-emerald-600 hover:bg-emerald-600 text-white'
                : 'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground'
            )}
            type="button"
            aria-label="Add to cart"
            onClick={addToCart}
            disabled={adding}
          >
            {adding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : added ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
