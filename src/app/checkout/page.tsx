'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, MapPin, CreditCard, Loader2, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface State {
  id: number;
  name: string;
  code: string;
  taxRate: string;
}

interface CartItem {
  productId: number;
  name: string;
  price: string;
  imgUrl: string | null;
  count: number;
  total: string | null;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [states, setStates] = useState<State[]>([]);
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stateName, setStateName] = useState('');
  const [plan, setPlan] = useState<'full' | 'installments'>('full');
  const [termMonths, setTermMonths] = useState(60);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/states', { cache: 'no-store' }).then((r) => r.json()),
      fetch('/api/cart', { cache: 'no-store' }).then((r) => r.json()),
    ])
      .then(([s, c]) => {
        setStates(s);
        setItems(c);
      })
      .finally(() => setLoading(false));
  }, []);

  const selectedState = states.find((s) => s.name === stateName);
  const taxRate = selectedState ? parseFloat(selectedState.taxRate) : 0.07;
  const subtotal = items.reduce((sum, item) => sum + parseFloat(item.price) * (item.count ?? 1), 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  // Payment plan math
  const downPaymentPct = 20;
  const downPayment = plan === 'installments' ? (total * downPaymentPct) / 100 : 0;
  const financed = total - downPayment;
  const planApr = 5.9;
  const monthly = plan === 'installments'
    ? (() => {
        const r = planApr / 100 / 12;
        return (financed * r) / (1 - Math.pow(1 + r, -termMonths));
      })()
    : 0;
  const dueToday = plan === 'installments' ? downPayment : total;

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function completePurchase() {
    if (!form.firstName || !form.lastName || !form.email) {
      setError('Please fill in your name and email.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            address: form.address,
            city: form.city,
            stateId: selectedState?.id,
            zipCode: form.zipCode,
          },
          paymentMethod: 'card',
          taxAmount: tax.toFixed(2),
          paymentPlan: {
            type: plan,
            downPayment: plan === 'installments' ? Number(downPayment.toFixed(2)) : 0,
            dueToday: Number(dueToday.toFixed(2)),
            termMonths: plan === 'installments' ? termMonths : null,
            monthlyPayment: plan === 'installments' ? Number(monthly.toFixed(2)) : null,
          },
        }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/checkout/confirmation?id=${data.primaryOrderId}`);
      } else {
        setError(data.error || 'Checkout failed. Please try again.');
      }
    } catch (e) {
      setError('Checkout failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading checkout...
        </div>
      </div>
    );
  }

  // Auth gate — only signed-in customers can pay
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="max-w-md mx-auto px-4 sm:px-6 py-24">
          <Card className="border-border/50 shadow-lux text-center">
            <CardHeader>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Sign in to Checkout</CardTitle>
              <p className="text-muted-foreground text-sm mt-2">
                Secure checkout is reserved for registered customers. Create a free
                account or sign in to complete your purchase.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/auth/login" className="block w-full">
                <Button className="w-full gap-2 shadow-glow" size="lg">
                  Sign In <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/auth/register" className="block w-full">
                <Button variant="outline" className="w-full" size="lg">
                  Create Account
                </Button>
              </Link>
              <Link href="/cart" className="block text-sm text-muted-foreground hover:text-primary mt-2">
                ← Back to cart
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg mb-4">Your cart is empty</p>
            <Button asChild>
              <a href="/">Browse Vehicles</a>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={form.firstName}
                        onChange={(e) => set('firstName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={form.lastName}
                        onChange={(e) => set('lastName', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={(e) => set('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Main Street"
                      value={form.address}
                      onChange={(e) => set('address', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="New York"
                        value={form.city}
                        onChange={(e) => set('city', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Select value={stateName} onChange={setStateName}>
                        <SelectTrigger id="state">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((s) => (
                            <SelectItem key={s.id} value={s.name}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="zipcode">ZIP Code</Label>
                      <Input
                        id="zipcode"
                        placeholder="10001"
                        value={form.zipCode}
                        onChange={(e) => set('zipCode', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={form.cardNumber}
                      onChange={(e) => set('cardNumber', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={form.expiry}
                        onChange={(e) => set('expiry', e.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        placeholder="123"
                        value={form.cvc}
                        onChange={(e) => set('cvc', e.target.value)}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Demo checkout — no real payment is processed. Our concierge team will contact you
                    to arrange payment and delivery.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    {items.map((item) => (
                      <div key={item.productId} className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2">
                          <ShoppingCart className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span className="truncate">
                            {item.name} × {item.count ?? 1}
                          </span>
                        </span>
                        <span className="font-medium">
                          ${(parseFloat(item.price) * (item.count ?? 1)).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax ({selectedState ? selectedState.code : '7'}%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl pt-3 border-t">
                      <span>Total</span>
                      <span className="text-primary">${total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Payment plan selector */}
                  <div className="rounded-xl border border-border/50 p-4 space-y-3">
                    <p className="text-sm font-semibold">Payment Plan</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPlan('full')}
                        className={cn(
                          'px-3 py-2.5 rounded-lg border text-sm font-medium transition-all',
                          plan === 'full'
                            ? 'border-primary bg-primary/10 text-primary shadow-glow'
                            : 'border-border/50 hover:border-primary/40'
                        )}
                      >
                        Pay in Full
                      </button>
                      <button
                        type="button"
                        onClick={() => setPlan('installments')}
                        className={cn(
                          'px-3 py-2.5 rounded-lg border text-sm font-medium transition-all',
                          plan === 'installments'
                            ? 'border-primary bg-primary/10 text-primary shadow-glow'
                            : 'border-border/50 hover:border-primary/40'
                        )}
                      >
                        Installments
                      </button>
                    </div>

                    {plan === 'installments' && (
                      <div className="space-y-3 animate-fade-in">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1.5">Loan term</p>
                          <div className="grid grid-cols-4 gap-2">
                            {[36, 48, 60, 72].map((m) => (
                              <button
                                key={m}
                                type="button"
                                onClick={() => setTermMonths(m)}
                                className={cn(
                                  'px-2 py-1.5 rounded-lg border text-xs font-medium transition-all',
                                  termMonths === m
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border/50 hover:border-primary/40'
                                )}
                              >
                                {m} mo
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-1.5 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Down payment (20%)</span>
                            <span className="font-medium">${downPayment.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Due today before shipping</span>
                            <span className="font-semibold text-primary">${dueToday.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Monthly × {termMonths}</span>
                            <span className="font-medium">${monthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground pt-1">
                            {termMonths} months · {planApr}% APR · first payment after delivery
                          </p>
                        </div>
                      </div>
                    )}

                    {plan === 'full' && (
                      <p className="text-[11px] text-muted-foreground">
                        One-time payment of ${total.toLocaleString()} due today. Vehicle ships after confirmation.
                      </p>
                    )}
                  </div>
                  {error && (
                    <div className="p-3 rounded-lg text-sm bg-destructive/10 text-destructive">
                      {error}
                    </div>
                  )}
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={completePurchase}
                    disabled={submitting}
                  >
                    {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {submitting ? 'Processing...' : 'Complete Purchase'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
