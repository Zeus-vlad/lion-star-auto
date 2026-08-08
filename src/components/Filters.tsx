'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, X, Filter } from 'lucide-react';

interface FilterProps {
  categories: string[];
  selectedCategory: string;
  priceRange: [number, number];
  searchQuery: string;
  onCategoryChange: (category: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function Filters({
  categories,
  selectedCategory,
  priceRange,
  searchQuery,
  onCategoryChange,
  onPriceRangeChange,
  onSearchChange,
  onClearFilters,
  hasActiveFilters,
}: FilterProps) {
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handlePriceApply = () => {
    const min = minPrice ? parseInt(minPrice) : 0;
    const max = maxPrice ? parseInt(maxPrice) : 200000;
    onPriceRangeChange([min, max]);
    setIsPriceOpen(false);
  };

  return (
    <div className="px-0 py-4 lg:sticky lg:top-24 lg:z-40 lg:bg-background/95 lg:backdrop-blur-sm lg:border-b lg:px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Search vehicles"
            />
          </div>

          {/* Category Filter */}
          <div className="relative flex-1 max-w-xs">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Filter by brand"
            >
              <option value="">All Brands</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* Price Range */}
          <div className="relative flex-1 max-w-xs">
            <button
              type="button"
              onClick={() => setIsPriceOpen(!isPriceOpen)}
              className="w-full flex items-center justify-between px-4 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              aria-expanded={isPriceOpen}
              aria-haspopup="true"
            >
              <span>
                ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
              </span>
              <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', isPriceOpen && 'rotate-180')} />
            </button>

            {isPriceOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-popover border  rounded-lg shadow-lg z-50 animate-fade-in">
                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="flex-1 px-3 py-2 border border-input rounded bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label="Minimum price"
                  />
                  <span className="text-muted-foreground">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="flex-1 px-3 py-2 border border-input rounded bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label="Maximum price"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1" onClick={handlePriceApply}>
                    Apply
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => setIsPriceOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={onClearFilters} className="gap-2">
              <X className="w-4 h-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}