'use client';

import { useRouter } from 'next/navigation';
import { Filters } from '@/components/Filters';

interface HomeFiltersProps {
  categories: string[];
  selectedCategory: string;
  priceRange: [number, number];
  searchQuery: string;
  hasActiveFilters: boolean;
  params: Record<string, string>;
}

export function HomeFilters({
  categories,
  selectedCategory,
  priceRange,
  searchQuery,
  hasActiveFilters,
  params,
}: HomeFiltersProps) {
  const router = useRouter();

  const buildUrl = (newParams: Record<string, string>) => {
    const sp = new URLSearchParams();
    Object.entries({ ...params, ...newParams }).forEach(([k, v]) => {
      if (v) sp.set(k, v);
    });
    return `/?${sp.toString()}`;
  };

  return (
    <Filters
      categories={categories}
      selectedCategory={selectedCategory}
      priceRange={priceRange}
      searchQuery={searchQuery}
      onCategoryChange={(cat) => router.push(buildUrl({ category: cat, page: '1' }))}
      onPriceRangeChange={(range) =>
        router.push(
          buildUrl({
            minPrice: range[0] > 0 ? String(range[0]) : '',
            maxPrice: range[1] < 200000 ? String(range[1]) : '',
            page: '1',
          })
        )
      }
      onSearchChange={(q) => router.push(buildUrl({ search: q, page: '1' }))}
      onClearFilters={() => router.push('/')}
      hasActiveFilters={hasActiveFilters}
    />
  );
}
