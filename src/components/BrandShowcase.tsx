'use client';

import { cn } from '@/lib/utils';
import { CATEGORY_IMAGES } from '@/db/seed-data';

interface BrandShowcaseProps {
  brands: string[];
}

export function BrandShowcase({ brands }: BrandShowcaseProps) {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">Premium</span> Brands
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We source only from the world's most prestigious automotive manufacturers.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {brands.map((brand, index) => {
            const imgKey = brand.toLowerCase().replace(/\s+/g, '-');
            const imgSrc = CATEGORY_IMAGES[brand] || `/images/${imgKey}.png`;
            
            return (
              <div
                key={brand}
                className="group flex flex-col items-center justify-center p-4 bg-card/50 backdrop-blur-sm rounded-xl border /50 hover:border-primary/30 hover:bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-16 h-16 mb-3 rounded-full bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center overflow-hidden border border-primary/20 group-hover:border-primary/40 transition-all">
                  <img
                    src={imgSrc}
                    alt={brand}
                    className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `<span class="text-xl font-bold text-primary">${brand.split(' ').map(w => w[0]).join('')}</span>`;
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {brand}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
