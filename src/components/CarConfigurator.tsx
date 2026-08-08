'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, RotateCcw, Palette, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BASE = 'https://br-royal-dust-ay28petz.storage.c-5.us-east-2.aws.neon.tech/lstar-images';

interface WheelOption {
  id: string;
  name: string;
  price: number;
  img: string;
}

interface ColorOption {
  id: string;
  name: string;
  swatch: string; // tailwind bg class
  price: number;
}

const WHEELS: WheelOption[] = [
  { id: 'standard', name: 'Standard Alloy', price: 0, img: `${BASE}/wheels/standard.jpg` },
  { id: 'sport', name: 'Sport Alloy', price: 1800, img: `${BASE}/wheels/sport.jpg` },
  { id: 'forged', name: 'Forged Polished', price: 3200, img: `${BASE}/wheels/forged.jpg` },
  { id: 'black', name: 'Blacked-Out', price: 2400, img: `${BASE}/wheels/black.jpg` },
  { id: 'carbon', name: 'Carbon Fiber', price: 6800, img: `${BASE}/wheels/carbon.jpg` },
];

const COLORS: ColorOption[] = [
  { id: 'std', name: 'Onyx Black', swatch: 'bg-zinc-900', price: 0 },
  { id: 'pearl', name: 'Pearl White', swatch: 'bg-zinc-100', price: 0 },
  { id: 'silver', name: 'Liquid Silver', swatch: 'bg-zinc-400', price: 0 },
  { id: 'graphite', name: 'Graphite Grey', swatch: 'bg-zinc-600', price: 0 },
  { id: 'sapphire', name: 'Sapphire Blue', swatch: 'bg-blue-700', price: 1200 },
  { id: 'ruby', name: 'Ruby Red', swatch: 'bg-red-700', price: 1200 },
  { id: 'emerald', name: 'Emerald Green', swatch: 'bg-emerald-700', price: 1200 },
  { id: 'champagne', name: 'Champagne Gold', swatch: 'bg-amber-400', price: 1500 },
  { id: 'midnight', name: 'Midnight Purple', swatch: 'bg-purple-800', price: 1500 },
  { id: 'matte', name: 'Matte Storm', swatch: 'bg-zinc-800', price: 2000 },
];

export function CarConfigurator({
  basePrice,
  carName,
}: {
  basePrice: number;
  carName: string;
}) {
  const [wheel, setWheel] = useState<WheelOption>(WHEELS[0]);
  const [color, setColor] = useState<ColorOption>(COLORS[0]);
  const [configured, setConfigured] = useState(false);

  const addons = wheel.price + color.price;
  const total = basePrice + addons;

  const reset = () => {
    setWheel(WHEELS[0]);
    setColor(COLORS[0]);
    setConfigured(false);
  };

  const saveConfig = () => {
    setConfigured(true);
    setTimeout(() => setConfigured(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Wheels */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Circle className="w-4 h-4 text-primary" /> Wheel Selection
          <span className="text-xs font-normal text-muted-foreground">(upgrade pricing shown)</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {WHEELS.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => setWheel(w)}
              className={cn(
                'group relative rounded-xl border p-2 text-left transition-all',
                wheel.id === w.id
                  ? 'border-primary ring-2 ring-primary/30 shadow-glow'
                  : 'border-border/50 hover:border-primary/40 hover:shadow-lux'
              )}
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-2 img-zoom">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={w.img} alt={w.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="text-xs font-semibold leading-tight">{w.name}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {w.price === 0 ? 'Included' : `+$${w.price.toLocaleString()}`}
              </p>
              {wheel.id === w.id && (
                <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4 text-primary" /> Colour Palette
          <span className="text-xs font-normal text-muted-foreground">(custom paint on request)</span>
        </h3>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
          {COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setColor(c)}
              className={cn(
                'group flex flex-col items-center gap-1.5',
              )}
              aria-label={c.name}
              title={`${c.name}${c.price ? ` (+$${c.price.toLocaleString()})` : ''}`}
            >
              <span
                className={cn(
                  'w-9 h-9 rounded-full border-2 transition-all',
                  c.swatch,
                  color.id === c.id
                    ? 'border-primary scale-110 shadow-glow'
                    : 'border-border/60 group-hover:scale-105'
                )}
              />
              <span className={cn(
                'text-[10px] leading-tight text-center',
                color.id === c.id ? 'text-primary font-semibold' : 'text-muted-foreground'
              )}>
                {c.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-transparent to-transparent p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{carName}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>{wheel.name} {wheel.price > 0 && `+$${wheel.price.toLocaleString()}`}</span>
              <span>{color.name} {color.price > 0 && `+$${color.price.toLocaleString()}`}</span>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Configured Total</p>
            <p className="text-2xl font-bold text-primary">${total.toLocaleString()}</p>
            {addons > 0 && (
              <p className="text-[11px] text-muted-foreground">
                Base ${basePrice.toLocaleString()} + ${addons.toLocaleString()} add-ons
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button className="flex-1 gap-2 shadow-glow" onClick={saveConfig} type="button">
            {configured ? (
              <>
                <Check className="w-4 h-4" /> Configuration Saved
              </>
            ) : (
              'Save My Configuration'
            )}
          </Button>
          <Button variant="outline" onClick={reset} type="button" aria-label="Reset configuration">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground mt-3">
          Custom paint &amp; wheel upgrades are applied at our showroom. Contact our concierge to confirm lead time.
        </p>
      </div>
    </div>
  );
}
