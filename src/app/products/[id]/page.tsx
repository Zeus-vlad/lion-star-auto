import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Share2, ChevronLeft, Gauge, Fuel, Cog, Calendar, Zap, Palette, CircleDot, Car, CheckCircle2, Shield, Truck } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Reveal } from '@/components/Reveal';

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
  year: number | null;
  mileage: number | null;
  fuelType: string | null;
  transmission: string | null;
  engine: string | null;
  gearbox: string | null;
  colour: string | null;
  interior: string | null;
  wheel: string | null;
  drivetrain: string | null;
  topSpeed: number | null;
  time60: number | null;
  category: { categoryId: number; categoryName: string } | null;
}

async function fetchProduct(id: string): Promise<Product | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products?id=${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json() as Promise<Product>;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProduct(id);
  const parsedPrice = product ? parseFloat(product.price) : 0;
  const year = product?.year || (product ? new Date(product.createdAt).getFullYear() : 0);

  if (!product) {
    notFound();
  }

  // Spec grid (only rows that have values)
  const specs: { icon: React.ElementType; label: string; value: string }[] = [];
  if (product.engine) specs.push({ icon: Cog, label: 'Engine', value: product.engine });
  if (product.gearbox) specs.push({ icon: Cog, label: 'Gearbox', value: product.gearbox });
  if (product.drivetrain) specs.push({ icon: Car, label: 'Drivetrain', value: product.drivetrain });
  if (product.fuelType) specs.push({ icon: Fuel, label: 'Fuel', value: product.fuelType });
  if (product.mileage) specs.push({ icon: Gauge, label: 'Mileage', value: `${product.mileage.toLocaleString()} mi` });
  if (product.colour) specs.push({ icon: Palette, label: 'Colour', value: product.colour });
  if (product.interior) specs.push({ icon: CircleDot, label: 'Interior', value: product.interior });
  if (product.wheel) specs.push({ icon: CircleDot, label: 'Wheels', value: product.wheel });
  if (product.topSpeed) specs.push({ icon: Zap, label: 'Top Speed', value: `${product.topSpeed} mph` });
  if (product.time60) specs.push({ icon: Zap, label: '0-60 mph', value: `${product.time60}s` });

  const imageSrc = product.imgUrl
    ? product.imgUrl.startsWith('http')
      ? product.imgUrl
      : `/images/${product.imgUrl}`
    : '/images/placeholder.jpg';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <Reveal>
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Vehicles
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Gallery */}
          <Reveal delay={1}>
            <div className="space-y-4">
              <div className="relative aspect-[16/10] bg-muted rounded-2xl overflow-hidden img-zoom shadow-lux">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {/* gradient scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                {product.category && (
                  <Badge className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 text-gray-900 backdrop-blur-sm border-0 shadow-sm">
                    {product.category.categoryName}
                  </Badge>
                )}
                <div className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-orange-600 text-white font-bold shadow-glow">
                  ${parsedPrice.toLocaleString()}
                </div>
              </div>

              {/* Quick highlights strip */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Calendar, label: year ? String(year) : '—' },
                  { icon: Gauge, label: product.mileage ? `${product.mileage.toLocaleString()} mi` : '—' },
                  { icon: Fuel, label: product.fuelType || '—' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/50 border border-border/50"
                  >
                    <item.icon className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-foreground text-center leading-tight">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right: Details */}
          <div className="space-y-6">
            <Reveal delay={2}>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold leading-tight">{year} {product.name}</h1>
                <p className="mt-3 text-muted-foreground leading-relaxed">{product.description}</p>
                <div className="flex items-center gap-2 mt-4">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm text-muted-foreground">
                    {product.quantityRemaining > 0 ? `${product.quantityRemaining} in stock — ready for delivery` : 'Sold out'}
                  </span>
                </div>
              </div>
            </Reveal>

            {/* Specifications grid */}
            <Reveal delay={3}>
              <Card className="border-border/50 shadow-lux">
                <CardContent className="p-5 sm:p-6">
                  <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Car className="w-5 h-5 text-primary" />
                    Specifications
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {specs.map((spec) => (
                      <div
                        key={spec.label}
                        className="flex flex-col gap-1.5 p-3 rounded-xl bg-muted/40 border border-border/40 hover:border-primary/30 transition-colors"
                      >
                        <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                          <spec.icon className="w-3.5 h-3.5 text-primary" />
                          {spec.label}
                        </span>
                        <span className="text-sm font-semibold">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Reveal>

            {/* Actions */}
            <Reveal delay={4}>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="flex-1 gap-2 shadow-glow" asChild>
                  <Link href={`/cart?add=${product.productId}`}>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="flex-1 gap-2" asChild>
                  <Link href="/checkout">
                    <Zap className="w-5 h-5 text-primary" />
                    Checkout
                  </Link>
                </Button>
              </div>
              <div className="flex gap-2 mt-3">
                <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground">
                  <Heart className="w-4 h-4 mr-1.5" /> Save
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground">
                  <Share2 className="w-4 h-4 mr-1.5" /> Share
                </Button>
              </div>
            </Reveal>

            {/* Financing / assurance */}
            <Reveal delay={5}>
              <Card className="bg-gradient-to-br from-primary/10 via-transparent to-transparent border-primary/20">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" /> Lion Star Assurance
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      150+ point certified inspection on every vehicle
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      Flexible financing from 2.9% APR
                    </li>
                    <li className="flex items-start gap-2">
                      <Truck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      Nationwide delivery to your doorstep
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
