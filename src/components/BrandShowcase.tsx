'use client';

import { cn } from '@/lib/utils';

interface BrandShowcaseProps {
  brands: string[];
}

// Top brands only — keeps the section premium, not congested
const TOP_BRANDS = ['Mercedes Benz', 'BMW', 'Audi', 'Lexus'];

const CDN = 'https://br-royal-dust-ay28petz.storage.c-5.us-east-2.aws.neon.tech/lstar-images/brand';

const BRAND_LOGO: Record<string, string> = {
  'Mercedes Benz': `${CDN}/mercedes.jpg`,
  'BMW': `${CDN}/bmw.jpg`,
  'Audi': `${CDN}/audi.jpg`,
  'Lexus': `${CDN}/lexus.jpg`,
};

export function BrandShowcase({ brands }: BrandShowcaseProps) {
  const display = TOP_BRANDS.filter((b) => brands.includes(b));

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">Premium</span> Brands
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We source only from the world&apos;s most prestigious automotive manufacturers.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {display.map((brand, index) => {
            const logo = BRAND_LOGO[brand];

            return (
              <div
                key={brand}
                className="group flex flex-col items-center justify-center p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 hover:border-primary/30 hover:bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-24 h-24 mb-4 rounded-2xl bg-zinc-950 flex items-center justify-center overflow-hidden border border-border/30 group-hover:border-primary/40 transition-all shadow-lg">
                  <img
                    src={logo}
                    alt={`${brand} logo`}
                    className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `<span class="text-2xl font-bold text-primary">${brand.split(' ').map(w => w[0]).join('')}</span>`;
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
