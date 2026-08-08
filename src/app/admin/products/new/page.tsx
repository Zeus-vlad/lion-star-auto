'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { AdminBreadcrumbs } from '@/components/AdminBreadcrumbs';

interface Category {
  categoryId: number;
  categoryName: string;
}

const emptyForm = {
  name: '',
  price: '',
  description: '',
  quantityRemaining: '1',
  categoryId: '',
  imgUrl: '',
  year: '',
  mileage: '',
  fuelType: 'Gasoline',
  bodyType: 'Sedan',
  transmission: 'Automatic',
  engine: '',
};

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => setCategories(Array.isArray(d) ? d : d.categories || []))
      .catch(() => {});
  }, []);

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.price) {
      setError('Name and price are required.');
      return;
    }
    setSaving(true);
    setError(null);
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push('/admin/products');
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error || 'Failed to create product.');
      setSaving(false);
    }
  }

  const fieldCls = "mt-1.5 bg-white/5 border-white/15 text-white placeholder:text-white/40 focus:bg-white/10";

  return (
    <div>
      <AdminBreadcrumbs crumbs={[{ label: 'Products', href: '/admin/products' }, { label: 'New Product' }]} />
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild className="text-white/60 hover:text-white hover:bg-white/10">
          <Link href="/admin/products"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Link>
        </Button>
        <h1 className="text-2xl font-bold text-white">Add New Product</h1>
      </div>

      <Card className="bg-zinc-900/80 border-white/10 shadow-lux max-w-2xl">
        <CardHeader>
          <CardTitle className="text-white">Vehicle Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-white/80">Vehicle Name *</Label>
              <Input id="name" placeholder="2024 Mercedes-Benz S Class" value={form.name} onChange={(e) => set('name', e.target.value)} className={fieldCls} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price" className="text-white/80">Price ($) *</Label>
                <Input id="price" type="number" placeholder="75000" value={form.price} onChange={(e) => set('price', e.target.value)} className={fieldCls} />
              </div>
              <div>
                <Label htmlFor="quantity" className="text-white/80">Stock</Label>
                <Input id="quantity" type="number" value={form.quantityRemaining} onChange={(e) => set('quantityRemaining', e.target.value)} className={fieldCls} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category" className="text-white/80">Category</Label>
                <select id="category" value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)} className={`${fieldCls} w-full px-3 py-2 rounded-md border bg-zinc-900`}>
                  <option value="">Select category…</option>
                  {categories.map((c) => (
                    <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="fuel" className="text-white/80">Fuel Type</Label>
                <select id="fuel" value={form.fuelType} onChange={(e) => set('fuelType', e.target.value)} className={`${fieldCls} w-full px-3 py-2 rounded-md border bg-zinc-900`}>
                  <option>Gasoline</option>
                  <option>Electric</option>
                  <option>Hybrid</option>
                  <option>Diesel</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="year" className="text-white/80">Year</Label>
                <Input id="year" type="number" placeholder="2024" value={form.year} onChange={(e) => set('year', e.target.value)} className={fieldCls} />
              </div>
              <div>
                <Label htmlFor="mileage" className="text-white/80">Mileage</Label>
                <Input id="mileage" type="number" placeholder="5000" value={form.mileage} onChange={(e) => set('mileage', e.target.value)} className={fieldCls} />
              </div>
              <div>
                <Label htmlFor="bodyType" className="text-white/80">Body Type</Label>
                <select id="bodyType" value={form.bodyType || 'Sedan'} onChange={(e) => set('bodyType', e.target.value)} className={`${fieldCls} w-full px-3 py-2 rounded-md border bg-zinc-900`}>
                  <option>Sedan</option>
                  <option>SUV</option>
                  <option>Coupe</option>
                  <option>Truck</option>
                  <option>Sports</option>
                  <option>Convertible</option>
                  <option>Wagon</option>
                </select>
              </div>
              <div>
                <Label htmlFor="transmission" className="text-white/80">Transmission</Label>
                <Input id="transmission" placeholder="Automatic" value={form.transmission} onChange={(e) => set('transmission', e.target.value)} className={fieldCls} />
              </div>
            </div>
            <div>
              <Label htmlFor="engine" className="text-white/80">Engine</Label>
              <Input id="engine" placeholder="3.0L Twin-Turbo V6" value={form.engine} onChange={(e) => set('engine', e.target.value)} className={fieldCls} />
            </div>
            <div>
              <Label htmlFor="imgUrl" className="text-white/80">Image URL (CDN)</Label>
              <Input id="imgUrl" placeholder="https://…/lstar-images/cars/new-car.jpg" value={form.imgUrl} onChange={(e) => set('imgUrl', e.target.value)} className={fieldCls} />
              <p className="text-[11px] text-white/40 mt-1">Paste a Neon Storage CDN URL, or leave empty to use a placeholder.</p>
            </div>
            <div>
              <Label htmlFor="description" className="text-white/80">Description</Label>
              <textarea id="description" rows={3} placeholder="Premium luxury sedan with…" value={form.description} onChange={(e) => set('description', e.target.value)} className={`${fieldCls} w-full px-3 py-2 rounded-md border bg-zinc-900 resize-none`} />
            </div>
            {error && (
              <div className="p-3 rounded-lg text-sm bg-red-500/15 text-red-300 border border-red-500/20">{error}</div>
            )}
            <Button type="submit" className="w-full gap-2 shadow-glow" disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Creating…' : 'Create Product'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
