'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, ArrowRight } from 'lucide-react';
import SmartImage from '@/components/SmartImage';

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
  return (
    <Link href={`/products/${id}`} className="block group">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card  border-border/50 group-hover:border-primary/30">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <SmartImage
            src={image}
            alt={`${year || ''} ${title}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="text-xs px-2 py-1">
              {category}
            </Badge>
          </div>
          {/* Wishlist button */}
          <button
            className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-900/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground"
            aria-label="Add to wishlist"
            onClick={(e) => e.preventDefault()}
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <CardContent className="p-4 pb-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              {year && (
                <p className="text-xs text-muted-foreground mb-1">{year}</p>
              )}
              <h3 className="font-semibold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {title}
              </h3>
            </div>
          </div>

          {/* Specs */}
          {(mileage || fuelType || transmission) && (
            <div className="flex flex-wrap gap-2 mb-3 text-xs text-muted-foreground">
              {mileage && (
                <span className="flex items-center gap-1 px-2 py-1 bg-muted rounded">
                  {mileage.toLocaleString()} mi
                </span>
              )}
              {fuelType && (
                <span className="flex items-center gap-1 px-2 py-1 bg-muted rounded">
                  {fuelType}
                </span>
              )}
              {transmission && (
                <span className="flex items-center gap-1 px-2 py-1 bg-muted rounded">
                  {transmission}
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline justify-between pt-3 border-t border-border">
            <span className="text-2xl font-bold text-primary">
              ${price.toLocaleString()}
            </span>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full gap-2 bg-primary hover:bg-primary/90"
            asChild
            onClick={(e) => e.preventDefault()}
          >
            View Details
            <ArrowRight className="w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}