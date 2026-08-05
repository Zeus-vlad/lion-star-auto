import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Share2, ChevronLeft, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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
  const year = product ? new Date(product.createdAt).getFullYear() : 0;

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Vehicles
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Gallery */}
          <div className="space-y-4">
            <div className="aspect-[16/9] bg-muted rounded-xl overflow-hidden relative">
              {product.imgUrl ? (
                <img
                  src={`/images/${product.imgUrl}`}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Image coming soon
                </div>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            <div>
              {product.category && (
                <Badge variant="outline" className="mb-2">
                  {product.category.categoryName}
                </Badge>
              )}
              <h1 className="text-3xl font-bold">{year} {product.name}</h1>
              <p className="text-2xl font-semibold text-primary mt-2">${parsedPrice.toLocaleString()}</p>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <p>{product.description}</p>
              <h3>Specifications</h3>
              <ul>
                <li><strong>Year:</strong> {year}</li>
                <li><strong>Make:</strong> {product.category?.categoryName || 'Unknown'}</li>
                <li><strong>Model:</strong> {product.name.split(' ').slice(1).join(' ')}</li>
                <li><strong>Price:</strong> ${parsedPrice.toLocaleString()}</li>
                <li><strong>Availability:</strong> {product.quantityRemaining > 0 ? `${product.quantityRemaining} in stock` : 'Sold Out'}</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button size="lg" className="flex-1" asChild>
                <Link href="/checkout">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Proceed to Checkout
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href={`/cart?add=${product.productId}`}>
                  <Plus className="w-5 h-5 mr-2" />
                  Add to Cart
                </Link>
              </Button>
              <Button variant="ghost" size="lg">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="lg">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-2">Financing Available</h4>
                <p className="text-sm text-muted-foreground">
                  Enjoy competitive financing options with rates starting from 2.9% APR.
                  Apply directly through our finance portal during checkout.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}