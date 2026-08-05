import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import Link from 'next/link';

interface Product {
  productId: number;
  name: string;
  price: string;
  description: string;
  quantityRemaining: number;
  categoryId: number | null;
  categoryName: string | null;
  imgUrl: string | null;
  createdAt: Date;
}

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/products`, {
    next: { revalidate: 0 },
  });
  if (!res.ok) return [];
  return res.json() as Promise<Product[]>;
}

export const dynamic = 'force-dynamic';

export default async function AdminProducts() {
  let products: Product[] = [];
  try {
    products = await fetchProducts();
  } catch (e) {
    console.error('Fetch failed:', e);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Products Management</h1>
          <Button asChild>
            <Link href="/admin/products/new">Add New Product</Link>
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-10" />
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Product</th>
                    <th className="text-left p-4 font-medium">Category</th>
                    <th className="text-left p-4 font-medium">Price</th>
                    <th className="text-left p-4 font-medium">Stock</th>
                    <th className="text-center p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.productId} className="border-b">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                            {product.imgUrl ? (
                              <img
                                src={`/images/${product.imgUrl}`}
                                alt={product.name}
                                className="w-full h-full object-cover object-center"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                No Image
                              </div>
                            )}
                          </div>
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{product.categoryName || 'Uncategorized'}</Badge>
                      </td>
                      <td className="p-4 text-primary font-semibold">
                        ${parseFloat(product.price).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <Badge variant={product.quantityRemaining > 0 ? 'default' : 'secondary'}>
                          {product.quantityRemaining > 0 ? `${product.quantityRemaining} in stock` : 'Sold Out'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/products/${product.productId}`}>
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {products.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            No products found. Click "Add New Product" to get started.
          </div>
        )}
      </div>
    </div>
  );
}
