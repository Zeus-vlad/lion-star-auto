'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: 0 | 1 | 2 | 3 | 4 | 5;
  as?: 'div' | 'section' | 'article' | 'li';
}

/**
 * Scroll-triggered reveal wrapper. Every section/card wrapped in <Reveal>
 * fades + slides up when it enters the viewport (IntersectionObserver).
 * Pairs with the `.reveal` / `.is-visible` utilities in globals.css.
 */
export function Reveal({ children, className, delay, as = 'div' }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as as 'div';

  return (
    <Tag
      ref={ref}
      className={cn('reveal', visible && 'is-visible', delay && `reveal-delay-${delay}`, className)}
    >
      {children}
    </Tag>
  );
}
