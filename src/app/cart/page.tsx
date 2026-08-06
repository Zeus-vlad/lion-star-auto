'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, Minus, ShoppingCart, Truck, Shield, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

interface CartItem {
  productId: number;
  name: string;
  price: string;
  imgUrl: string | null;
  count: number;
  total: string | null;
  quantityRemaining: number;
}

function CartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const addRef = useRef<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/cart', { cache: 'no-store' });
      if (res.ok) setItems(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Handle ?add=productId from the "Add to Cart" button on product pages
    const addParam = searchParams.get('add');
    if (addParam) {
      addRef.current = addParam;
      router.replace('/cart');
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (addRef.current) {
      const pid = addRef.current;
      addRef.current = null;
      addToCart(pid);
    } else {
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addToCart(productId: string) {
    setMessage(null);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Added to cart.' });
        await load();
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.error || 'Failed to add to cart.' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to add to cart.' });
    }
  }

  async function changeQty(productId: number, action: 'inc' | 'dec') {
    try {
      const res = await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, action }),
      });
      if (res.ok) {
        setMessage(null);
        await load();
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.error || 'Failed to update quantity.' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to update quantity.' });
    }
  }

  async function removeItem(productId: number) {
    try {
      const res = await fetch(`/api/cart?productId=${productId}`, { method: 'DELETE' });
      if (res.ok) await load();
    } catch (e) {
      console.error(e);
    }
  }

  const subtotal = items.reduce((sum, item) => sum + parseFloat(item.price) * (item.count ?? 1), 0);
  const tax = subtotal * 0.07;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

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

        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading cart...
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg mb-4">Your cart is empty</p>
            <Button asChild>
              <Link href="/">Browse Vehicles</Link>
            </Button>
          </div>
        ) : (
          <div>
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <Card key={item.productId} className="p-4">
                  <CardContent className="flex items-center gap-4 p-0">
                    <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      {item.imgUrl ? (
                        <img
                          src={`/images/${item.imgUrl}`}
                          alt={item.name}
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Link href={`/products/${item.productId}`} className="font-semibold hover:underline">
                        {item.name}
                      </Link>
                      <p className="text-primary font-semibold">
                        ${parseFloat(item.price).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => changeQty(item.productId, 'dec')}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center">{item.count ?? 1}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => changeQty(item.productId, 'inc')}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => removeItem(item.productId)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-3 border-t">
                      <span>Total</span>
                      <span>${total.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Checkout</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Truck className="w-5 h-5 text-primary" />
                        <span className="text-sm">Free shipping</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        <span className="text-sm">Secure payment</span>
                      </div>
                    </div>
                    <Button size="lg" className="w-full" asChild>
                      <Link href="/checkout">Proceed to Checkout</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <CartContent />
    </Suspense>
  );
}
