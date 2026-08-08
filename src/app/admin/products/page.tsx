'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Loader2, Package } from 'lucide-react';
import Link from 'next/link';
import { AdminBreadcrumbs } from '@/components/AdminBreadcrumbs';

interface AdminProduct {
  productId: number;
  name: string;
  price: string;
  imgUrl: string | null;
  quantityRemaining: number;
  fuelType: string | null;
  categoryName: string | null;
}

const imgSrc = (u: string | null) =>
  u && u.startsWith('http') ? u : u ? `/images/${u}` : null;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/admin/products')
      .then((r) => r.json())
      .then((d) => setProducts(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  async function removeProduct(id: number) {
    if (!confirm('Delete this product permanently?')) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
    if (res.ok) setProducts((ps) => ps.filter((p) => p.productId !== id));
    setDeleting(null);
  }

  return (
    <div>
      <AdminBreadcrumbs crumbs={[{ label: 'Products' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Package className="w-6 h-6 text-primary" />
            Products Management
          </h1>
          <p className="text-sm text-white/50 mt-1">{products.length} vehicles in the lot</p>
        </div>
        <Button asChild className="shadow-glow gap-2">
          <Link href="/admin/products/new">
            <Plus className="w-4 h-4" /> Add New Product
          </Link>
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <Input
          placeholder="Search products..."
          className="pl-10 bg-white/5 border-white/15 text-white placeholder:text-white/40"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-white/50">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading products...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <Card key={p.productId} className="card-lift bg-zinc-900/80 border-white/10 shadow-lux hover:border-primary/40 transition-all">
              <CardContent className="p-0">
                <div className="flex gap-4 p-4">
                  <div className="w-24 h-20 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0 img-zoom">
                    {imgSrc(p.imgUrl) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imgSrc(p.imgUrl)!} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-white/30">No Image</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm leading-tight line-clamp-2">{p.name}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <Badge variant="outline" className="border-white/15 text-white/70">{p.categoryName || 'Uncategorized'}</Badge>
                      {p.fuelType && (
                        <Badge variant="outline" className="border-primary/30 text-primary/90">{p.fuelType}</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-primary font-bold">${parseFloat(p.price).toLocaleString()}</span>
                      <Badge className={p.quantityRemaining > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}>
                        {p.quantityRemaining > 0 ? `${p.quantityRemaining} in stock` : 'Sold Out'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex border-t border-white/10">
                  <Button variant="ghost" size="sm" className="flex-1 rounded-none text-white/70 hover:text-white hover:bg-white/5" asChild>
                    <Link href={`/admin/products/${p.productId}`}>
                      <Edit className="w-3.5 h-3.5 mr-1.5" /> Edit
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 rounded-none text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={() => removeProduct(p.productId)}
                    disabled={deleting === p.productId}
                  >
                    {deleting === p.productId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5 mr-1.5" />}
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-white/40">
              No products match your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
