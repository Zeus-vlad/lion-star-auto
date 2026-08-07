import { Header } from '@/components/Header';
import { VehicleCard } from '@/components/VehicleCard';
import { db } from '@/db';
import { products, categories } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { Zap } from 'lucide-react';

export default async function ElectricPage() {
  const list = await db
    .select({
      productId: products.productId,
      name: products.name,
      price: products.price,
      imgUrl: products.imgUrl,
      year: products.year,
      mileage: products.mileage,
      fuelType: products.fuelType,
      transmission: products.transmission,
      categoryName: categories.categoryName,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.categoryId))
    .where(eq(products.fuelType, 'Electric'))
    .orderBy(asc(products.name));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-12">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Electric Vehicles</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Zero emissions. Infinite performance.
          </p>
        </div>
        {list.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">Electric vehicles coming soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((p) => (
              <VehicleCard
                key={p.productId}
                id={p.productId}
                title={p.name}
                price={parseFloat(p.price)}
                image={p.imgUrl || '/images/placeholder.jpg'}
                category={p.categoryName || ''}
                year={p.year ?? undefined}
                mileage={p.mileage ?? undefined}
                fuelType={p.fuelType || undefined}
                transmission={p.transmission || undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
