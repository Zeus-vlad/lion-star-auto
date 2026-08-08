'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Keeps the browser anchored at the inventory section when filter/pagination
 * params change — instead of jumping to the top of the landing page.
 * Renders nothing; just listens for searchParam changes and scrolls #inventory into view.
 */
export function InventoryScrollAnchor() {
  const searchParams = useSearchParams();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      // On initial load: if a filter param exists, honor the URL hash (e.g. /#inventory)
      return;
    }
    const el = document.getElementById('inventory');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [searchParams]);

  return null;
}
