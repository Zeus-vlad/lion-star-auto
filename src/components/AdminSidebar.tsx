'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Package, Tags, Users, ShoppingCart, Menu, X, LogOut, Car,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers', icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  const isActive = (item: (typeof NAV)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const NavContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <Link href="/admin" className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl overflow-hidden shadow-glow shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Lion Star Auto" className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-white leading-tight">Lion Star Auto</p>
          <p className="text-[10px] uppercase tracking-wider text-primary/80">Admin Console</p>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
              isActive(item)
                ? 'bg-gradient-to-r from-primary/25 to-primary/10 text-white border border-primary/30 shadow-glow'
                : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
            )}
          >
            <item.icon className={cn('w-4 h-4 shrink-0', isActive(item) ? 'text-primary' : '')} />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
        >
          <Car className="w-4 h-4 shrink-0" />
          View Storefront
        </Link>
        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className="w-full justify-start gap-3 px-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-zinc-950 border-r border-white/10 z-40">
        {NavContent}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-zinc-950 shadow-lux-lg animate-slide-right">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-2 text-white/60 hover:text-white"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            {NavContent}
          </aside>
        </div>
      )}

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 bg-zinc-950/95 backdrop-blur border-b border-white/10">
        <button
          onClick={() => setOpen(true)}
          className="p-2 text-white rounded-lg hover:bg-white/10"
          aria-label="Open admin menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" className="w-full h-full object-cover" />
          </div>
          <span className="text-sm font-semibold text-white">Admin Console</span>
        </div>
        <div className="w-9" />
      </div>
    </>
  );
}
