'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface CartItem {
  productId: number;
  count: number;
}

/**
 * Live cart badge — polls /api/cart so the nav count stays in sync
 * with add-to-cart actions anywhere on the site.
 */
export function CartBadge() {
  const [count, setCount] = useState(0);
  const pathname = usePathname();

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/cart', { cache: 'no-store' });
      if (res.ok) {
        const items = (await res.json()) as CartItem[];
        setCount(items.reduce((acc, item) => acc + (item.count ?? 1), 0));
      }
    } catch {
      // keep last known count on network errors
    }
  }, []);

  useEffect(() => {
    refresh();
    // refresh on route change + every 5s while cart page open
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [refresh, pathname]);

  return (
    <Link
      href="/cart"
      className="relative p-2 text-white/85 hover:text-primary transition-colors rounded-lg hover:bg-white/10"
      aria-label={`Cart, ${count} items`}
    >
      <ShoppingCart className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-gradient-to-r from-primary to-orange-600 text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center shadow-glow animate-fade-in">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
