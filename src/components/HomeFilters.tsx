'use client';

import { useRouter } from 'next/navigation';
import { Filters } from '@/components/Filters';

interface HomeFiltersProps {
  categories: string[];
  selectedCategory: string;
  bodyTypes: string[];
  selectedBodyType: string;
  priceRange: [number, number];
  searchQuery: string;
  hasActiveFilters: boolean;
  params: Record<string, string>;
}

export function HomeFilters({
  categories,
  selectedCategory,
  bodyTypes,
  selectedBodyType,
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

  const navigate = (url: string) => {
    router.push(url, { scroll: false });
  };

  return (
    <Filters
      categories={categories}
      selectedCategory={selectedCategory}
      bodyTypes={bodyTypes}
      selectedBodyType={selectedBodyType}
      priceRange={priceRange}
      searchQuery={searchQuery}
      onCategoryChange={(cat) => navigate(buildUrl({ category: cat, page: '1' }))}
      onBodyTypeChange={(bt) => navigate(buildUrl({ bodyType: bt, page: '1' }))}
      onPriceRangeChange={(range) =>
        navigate(
          buildUrl({
            minPrice: range[0] > 0 ? String(range[0]) : '',
            maxPrice: range[1] < 200000 ? String(range[1]) : '',
            page: '1',
          })
        )
      }
      onSearchChange={(q) => navigate(buildUrl({ search: q, page: '1' }))}
      onClearFilters={() => navigate('/?page=1')}
      hasActiveFilters={hasActiveFilters}
    />
  );
}
