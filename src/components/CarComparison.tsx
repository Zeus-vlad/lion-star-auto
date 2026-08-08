'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X, Scale, Gauge, Zap, Fuel, Cog, Car, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompareCar {
  productId: number;
  name: string;
  price: string;
  imgUrl: string | null;
  year: number | null;
  fuelType: string | null;
  bodyType: string | null;
  transmission: string | null;
  engine: string | null;
  drivetrain: string | null;
  topSpeed: number | null;
  time60: string | null;
  mileage: number | null;
}

const MAX_SLOTS = 3;

const imgSrc = (u: string | null) =>
  u && u.startsWith('http') ? u : u ? `/images/${u}` : '/images/placeholder.jpg';

export function CarComparison() {
  const [allCars, setAllCars] = useState<CompareCar[]>([]);
  const [picks, setPicks] = useState<(number | null)[]>([null, null, null]);
  const [activeSlots, setActiveSlots] = useState(2);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products?limit=100&includeOutOfStock=true', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        const list = (d.products || d || []) as CompareCar[];
        setAllCars(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const selected = picks
    .filter((p): p is number => p !== null)
    .map((id) => allCars.find((c) => c.productId === id))
    .filter((c): c is CompareCar => Boolean(c));

  const available = (slot: number) =>
    allCars.filter((c) => !picks.includes(c.productId) || picks[slot] === c.productId);

  const addSlot = () => {
    if (activeSlots < MAX_SLOTS) setActiveSlots(activeSlots + 1);
  };

  const removeSlot = (i: number) => {
    const next = [...picks];
    next[i] = null;
    setPicks(next);
    if (activeSlots > 2 && i === activeSlots - 1) setActiveSlots(activeSlots - 1);
  };

  const specRows: { label: string; icon: React.ElementType; get: (c: CompareCar) => string }[] = [
    { label: 'Price', icon: Scale, get: (c) => `$${parseFloat(c.price).toLocaleString()}` },
    { label: 'Fuel', icon: Fuel, get: (c) => c.fuelType || '—' },
    { label: 'Type', icon: Car, get: (c) => c.bodyType || '—' },
    { label: 'Engine', icon: Cog, get: (c) => c.engine || '—' },
    { label: 'Drivetrain', icon: Car, get: (c) => c.drivetrain || '—' },
    { label: '0-60 mph', icon: Zap, get: (c) => (c.time60 ? `${c.time60}s` : '—') },
    { label: 'Top Speed', icon: Gauge, get: (c) => (c.topSpeed ? `${c.topSpeed} mph` : '—') },
    { label: 'Year', icon: Calendar, get: (c) => String(c.year || '—') },
  ];

  return (
    <section id="compare" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Scale className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="gradient-text">Compare</span> Models
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Pick up to {MAX_SLOTS} vehicles and see their stats side by side — price, performance, and more.
          </p>
        </div>

        {/* Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {Array.from({ length: activeSlots }).map((_, i) => (
            <div key={i} className="relative">
              <select
                value={picks[i] ?? ''}
                onChange={(e) => {
                  const next = [...picks];
                  next[i] = e.target.value ? parseInt(e.target.value) : null;
                  setPicks(next);
                }}
                className="w-full appearance-none px-4 py-3 pr-10 border border-input rounded-xl bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring shadow-lux"
                aria-label={`Select vehicle ${i + 1}`}
              >
                <option value="">Select vehicle {i + 1}…</option>
                {available(i).map((c) => (
                  <option key={c.productId} value={c.productId}>
                    {c.name}
                  </option>
                ))}
              </select>
              {picks[i] !== null && (
                <button
                  onClick={() => removeSlot(i)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                  aria-label={`Clear vehicle ${i + 1}`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {activeSlots < MAX_SLOTS && (
          <div className="flex justify-center mb-8">
            <Button variant="outline" size="sm" onClick={addSlot} className="gap-2">
              <Plus className="w-4 h-4" /> Add a third vehicle
            </Button>
          </div>
        )}

        {/* Comparison table */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground animate-pulse">Loading vehicles…</div>
        ) : selected.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Select at least one vehicle above to start comparing.
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 px-4">
            <div className="min-w-[560px]">
              {/* Header cards with mini image + name */}
              <div className="grid gap-3 mb-2" style={{ gridTemplateColumns: `140px repeat(${selected.length}, 1fr)` }}>
                <div />
                {selected.map((c) => (
                  <div key={c.productId} className="card-lift bg-card border border-border/50 rounded-2xl p-4 text-center shadow-lux">
                    <div className="w-16 h-12 mx-auto mb-2 rounded-lg overflow-hidden bg-muted img-zoom">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imgSrc(c.imgUrl)} alt={c.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <p className="text-sm font-semibold leading-tight line-clamp-2">{c.name}</p>
                  </div>
                ))}
              </div>

              {/* Spec rows */}
              {specRows.map((row) => (
                <div key={row.label} className="grid gap-3 mb-2" style={{ gridTemplateColumns: `140px repeat(${selected.length}, 1fr)` }}>
                  <div className="flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <row.icon className="w-4 h-4 text-primary shrink-0" />
                    {row.label}
                  </div>
                  {selected.map((c) => (
                    <div key={c.productId} className="bg-card/70 border border-border/40 rounded-xl px-4 py-3 text-sm font-medium flex items-center justify-center text-center">
                      {row.get(c)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
