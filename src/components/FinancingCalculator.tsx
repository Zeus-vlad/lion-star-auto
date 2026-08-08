'use client';

import { useEffect, useMemo, useState } from 'react';
import { Calculator, Percent, Wallet, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FinancingCalculatorProps {
  price: number;
}

/**
 * Financing calculator — monthly payment with down payment slider,
 * term selector, and APR. Used on the vehicle detail page.
 */
export function FinancingCalculator({ price }: FinancingCalculatorProps) {
  const [downPct, setDownPct] = useState(20);
  const [termMonths, setTermMonths] = useState(60);
  const [apr, setApr] = useState(5.9);

  const downPayment = useMemo(() => (price * downPct) / 100, [price, downPct]);
  const financed = Math.max(price - downPayment, 0);

  const monthly = useMemo(() => {
    if (financed <= 0) return 0;
    const r = apr / 100 / 12;
    return (financed * r) / (1 - Math.pow(1 + r, -termMonths));
  }, [financed, apr, termMonths]);

  const totalInterest = monthly * termMonths - financed;
  const totalPaid = downPayment + monthly * termMonths;

  return (
    <div className="space-y-5">
      <h3 className="font-semibold flex items-center gap-2">
        <Calculator className="w-4 h-4 text-primary" /> Financing Calculator
      </h3>

      {/* Down payment */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-primary" /> Down Payment
          </label>
          <span className="text-sm font-bold text-primary">
            ${downPayment.toLocaleString()} ({downPct}%)
          </span>
        </div>
        <input
          type="range"
          min={5}
          max={60}
          step={5}
          value={downPct}
          onChange={(e) => setDownPct(parseInt(e.target.value))}
          className="w-full accent-primary"
          aria-label="Down payment percentage"
        />
        <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
          <span>5%</span><span>60%</span>
        </div>
      </div>

      {/* Term */}
      <div>
        <label className="text-sm font-medium flex items-center gap-1.5 mb-2">
          <TrendingDown className="w-3.5 h-3.5 text-primary" /> Loan Term
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[36, 48, 60, 72].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setTermMonths(m)}
              className={cn(
                'px-2 py-2 rounded-lg border text-sm font-medium transition-all',
                termMonths === m
                  ? 'border-primary bg-primary/10 text-primary shadow-glow'
                  : 'border-border/50 hover:border-primary/40'
              )}
            >
              {m} mo
            </button>
          ))}
        </div>
      </div>

      {/* APR */}
      <div>
        <label className="text-sm font-medium flex items-center gap-1.5 mb-2">
          <Percent className="w-3.5 h-3.5 text-primary" /> APR
        </label>
        <div className="grid grid-cols-5 gap-2">
          {[3.9, 4.9, 5.9, 6.9, 7.9].map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setApr(a)}
              className={cn(
                'px-2 py-2 rounded-lg border text-sm font-medium transition-all',
                apr === a
                  ? 'border-primary bg-primary/10 text-primary shadow-glow'
                  : 'border-border/50 hover:border-primary/40'
              )}
            >
              {a}%
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-transparent to-transparent p-5 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Vehicle Price</span>
          <span className="font-medium">${price.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Down Payment</span>
          <span className="font-medium text-emerald-600 dark:text-emerald-400">−${downPayment.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Amount Financed</span>
          <span className="font-medium">${financed.toLocaleString()}</span>
        </div>
        <div className="divider-gradient my-1" />
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-muted-foreground">Estimated Monthly</span>
          <span className="text-2xl font-bold text-primary">
            ${monthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground pt-1">
          {termMonths} months · {apr}% APR · Total interest ~${Math.max(totalInterest, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} · Total ${totalPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </p>
      </div>

      <p className="text-[11px] text-muted-foreground">
        Estimated figures for illustration only. Final rates subject to credit approval at the showroom.
      </p>
    </div>
  );
}
