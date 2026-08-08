'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AdminBreadcrumbs } from '@/components/AdminBreadcrumbs';
import { Plus, Trash2, Loader2 } from 'lucide-react';

interface Category {
  categoryId: number;
  categoryName: string;
  description: string | null;
  imageUrl: string | null;
  productCount: string | number;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) setCategories(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryName: name.trim(), description: description.trim() || null }),
      });
      if (res.ok) {
        setName('');
        setDescription('');
        setMessage({ type: 'success', text: 'Category added.' });
        await load();
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.error || 'Failed to add category.' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to add category.' });
    } finally {
      setSaving(false);
    }
  }

  async function deleteCategory(id: number) {
    if (!confirm('Delete this category? Products in it become uncategorized.')) return;
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Category deleted.' });
        await load();
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.error || 'Failed to delete category.' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to delete category.' });
    }
  }

  return (
    <div>
      <AdminBreadcrumbs crumbs={[{ label: 'Categories' }]} />
      <div>
        <h1 className="text-2xl font-bold text-white mb-8">Categories Management</h1>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg text-sm ${
              message.type === 'error'
                ? 'bg-destructive/10 text-destructive'
                : 'bg-emerald-500/10 text-emerald-600'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={addCategory} className="mb-8 p-6 border rounded-xl">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="cat-name">Category Name</Label>
              <Input
                id="cat-name"
                placeholder="e.g. Luxury Sedans"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="cat-desc">Description (optional)</Label>
              <Input
                id="cat-desc"
                placeholder="Short description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button type="submit" disabled={saving || !name.trim()}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add Category
            </Button>
          </div>
        </form>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Category</th>
                    <th className="text-left p-4 font-medium">Description</th>
                    <th className="text-center p-4 font-medium">Products</th>
                    <th className="text-center p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.categoryId} className="border-b">
                      <td className="p-4 font-medium">{cat.categoryName}</td>
                      <td className="p-4 text-muted-foreground">{cat.description || '—'}</td>
                      <td className="p-4 text-center">
                        <Badge variant="outline">{String(cat.productCount)}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => deleteCategory(cat.categoryId)}
                          >
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

        {!loading && categories.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            No categories yet. Add one above.
          </div>
        )}
      </div>
    </div>
  );
}
