import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { HomeFilters } from '@/components/HomeFilters';
import { VehicleCard } from '@/components/VehicleCard';
import { BrandShowcase } from '@/components/BrandShowcase';
import { ServicesSection } from '@/components/ServicesSection';
import { TeamSection } from '@/components/TeamSection';
import { Reveal } from '@/components/Reveal';
import { CarComparison } from '@/components/CarComparison';
import { InventoryScrollAnchor } from '@/components/InventoryScrollAnchor';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATEGORY_NAMES } from '@/db/seed-data';

interface Product {
  productId: number;
  name: string;
  price: string;
  description: string;
  quantityRemaining: number;
  categoryId: number | null;
  imgUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  inCart: boolean;
  count: number;
  total: string | null;
  category: { categoryId: number; categoryName: string } | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

async function fetchProducts(params: Record<string, string>) {
  const query = new URLSearchParams(params).toString();
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${base}/api/products?${query}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json() as Promise<{ products: Product[]; categories: string[]; bodyTypes: string[]; pagination: Pagination }>;
}

export const dynamic = 'force-dynamic';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const category = params.category || '';
  const search = params.search || '';
  const minPrice = params.minPrice || '';
  const maxPrice = params.maxPrice || '';
  const sort = params.sort || 'newest';
  const bodyType = params.bodyType || '';

  let productsData: { products: Product[]; categories: string[]; bodyTypes: string[]; pagination: Pagination };

  try {
    productsData = await fetchProducts({
      page: page.toString(),
      limit: '6',
      category: category,
      search: search,
      minPrice: minPrice,
      maxPrice: maxPrice,
      sort: sort,
      bodyType: bodyType,
    });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    productsData = { products: [], categories: [], bodyTypes: [], pagination: { page: 1, limit: 6, total: 0, totalPages: 0 } };
  }

  const { products, categories: categoryList, bodyTypes, pagination } = productsData;

  const hasActiveFilters = category || search || minPrice || maxPrice || bodyType;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Suspense fallback={null}>
        <InventoryScrollAnchor />
      </Suspense>
      <Hero />

      {/* Hero Section */}
      {/* Brand Showcase */}
      <BrandShowcase brands={CATEGORY_NAMES} />

      {/* Featured Inventory Section */}
      <section id="inventory" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="gradient-text">Featured</span> Inventory
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Carefully curated selection of the world's most prestigious luxury vehicles.
            </p>
          </div>
          {/* Filters */}
          <HomeFilters
            categories={categoryList}
            selectedCategory={category}
            bodyTypes={bodyTypes}
            selectedBodyType={bodyType}
            priceRange={[
              minPrice ? parseInt(minPrice) : 0,
              maxPrice ? parseInt(maxPrice) : 200000,
            ]}
            searchQuery={search || ''}
            hasActiveFilters={!!hasActiveFilters}
            params={params}
          />

          {/* Products Grid */}
          <div className="mt-8">
            {products && products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No vehicles found matching your criteria.</p>
                <p className="text-muted-foreground text-sm mt-2">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product, index) => (
                    <Reveal
                      key={product.productId}
                      delay={(index % 3) as 0 | 1 | 2}
                      className="h-full"
                    >
                      <VehicleCard
                        id={product.productId}
                        title={product.name}
                        price={parseFloat(product.price)}
                        image={product.imgUrl || '/images/placeholder.jpg'}
                        category={product.category?.categoryName || ''}
                        year={new Date(product.createdAt).getFullYear()}
                      />
                    </Reveal>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-12 pt-8 border-t border-white/10">
                    {pagination.page > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link href={`/?page=${pagination.page - 1}${category ? `&category=${category}` : ''}${search ? `&search=${search}` : ''}${minPrice ? `&minPrice=${minPrice}` : ''}${maxPrice ? `&maxPrice=${maxPrice}` : ''}`} scroll={false}>
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Previous
                        </Link>
                      </Button>
                    )}

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      Page {pagination.page} of {pagination.totalPages}
                    </div>

                    {pagination.page < pagination.totalPages && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link href={`/?page=${pagination.page + 1}${category ? `&category=${category}` : ''}${search ? `&search=${search}` : ''}${minPrice ? `&minPrice=${minPrice}` : ''}${maxPrice ? `&maxPrice=${maxPrice}` : ''}`} scroll={false}>
                          Next
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <CarComparison />

      {/* About Section */}
      <section id="about" className="py-20 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/about-hero.jpg" alt="" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Lion Star Auto — <span className="gradient-text">Premium Luxury Redefined</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              At Lion Star Auto, we curate the finest selection of luxury vehicles from
              world-renowned manufacturers. Each vehicle undergoes a rigorous inspection
              process to ensure it meets our exacting standards.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <p className="text-sm text-muted-foreground">Premium Vehicles</p>
              </div>
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="text-3xl font-bold text-primary mb-2">14</div>
                <p className="text-sm text-muted-foreground">Luxury Brands</p>
              </div>
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />

      {/* Team Section */}
      <TeamSection />

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">Ready to Find Your Dream Car?</h3>
            <p className="text-muted-foreground mb-6">
              Contact us today to schedule your personal viewing appointment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <a href="tel:+15551234567">Call Us</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:sales@lionstarauto.com">Email Us</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
