'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { CartBadge } from '@/components/CartBadge';

export function Header() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const firstName = (session?.user as any)?.firstName;
  const lastName = (session?.user as any)?.lastName;
  const isAdmin = (session?.user as any)?.isAdmin;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'glass-dark shadow-lux border-b border-border/50'
          : 'bg-gradient-to-b from-black/60 via-black/30 to-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo — always visible */}
          <Link href="/" className="flex items-center space-x-2" aria-label="Lion Star Auto Home">
            <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Lion Star Auto" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
              Lion Star Auto
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-white/85 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/#inventory" className="text-sm font-medium text-white/85 hover:text-white transition-colors">
              Inventory
            </Link>
            <Link href="/electric" className="text-sm font-medium text-white/85 hover:text-white transition-colors">
              Electric
            </Link>
            <Link href="/gas" className="text-sm font-medium text-white/85 hover:text-white transition-colors">
              Gas
            </Link>
            <Link href="/#about" className="text-sm font-medium text-white/85 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/#contact" className="text-sm font-medium text-white/85 hover:text-white transition-colors">
              Contact
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Cart — always visible */}
            <CartBadge />

            {/* Desktop auth */}
            <div className="hidden lg:block">
              {status === 'loading' ? (
                <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
              ) : session ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 text-white/85 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white font-medium">
                      {firstName?.[0]}{lastName?.[0]}
                    </div>
                    <span className="hidden sm:block text-sm font-medium">{firstName}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-lux-lg py-2 animate-fade-in">
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-medium">{firstName} {lastName}</p>
                        <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                      </div>
                      <Link
                        href="/orders"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-accent"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Purchase History</span>
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-accent"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-destructive hover:bg-accent"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm" className="text-white/85 hover:text-white hover:bg-white/10">Sign In</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button size="sm" className="shadow-glow">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button — visible on mobile only */}
            <button
              className="lg:hidden p-2 text-white/85 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu — everything lives here */}
        {isMenuOpen && (
          <div id="mobile-menu" className="lg:hidden glass-dark rounded-2xl shadow-lux-lg border border-white/10 mb-4 animate-slide-up">
            <div className="flex flex-col space-y-1 p-4">
              <Link href="/" className="text-base font-medium text-white hover:text-primary px-3 py-2.5 rounded-lg hover:bg-white/5" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link href="/#inventory" className="text-base font-medium text-white hover:text-primary px-3 py-2.5 rounded-lg hover:bg-white/5" onClick={() => setIsMenuOpen(false)}>
                Inventory
              </Link>
              <Link href="/electric" className="text-base font-medium text-white hover:text-primary px-3 py-2.5 rounded-lg hover:bg-white/5" onClick={() => setIsMenuOpen(false)}>
                Electric
              </Link>
              <Link href="/gas" className="text-base font-medium text-white hover:text-primary px-3 py-2.5 rounded-lg hover:bg-white/5" onClick={() => setIsMenuOpen(false)}>
                Gas
              </Link>
              <Link href="/#about" className="text-base font-medium text-white hover:text-primary px-3 py-2.5 rounded-lg hover:bg-white/5" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
              <Link href="/#contact" className="text-base font-medium text-white hover:text-primary px-3 py-2.5 rounded-lg hover:bg-white/5" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>

              <div className="pt-3 mt-2 border-t border-white/10 flex flex-col space-y-1">
                {status === 'loading' ? (
                  <div className="px-3 py-2.5 text-sm text-white/50">Loading…</div>
                ) : session ? (
                  <>
                    <div className="px-3 py-2.5">
                      <p className="text-sm font-medium text-white">{firstName} {lastName}</p>
                      <p className="text-xs text-white/50">{session.user?.email}</p>
                    </div>
                    <Link href="/orders" className="text-base font-medium text-white hover:text-primary px-3 py-2.5 rounded-lg hover:bg-white/5" onClick={() => setIsMenuOpen(false)}>
                      Purchase History
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className="text-base font-medium text-white hover:text-primary px-3 py-2.5 rounded-lg hover:bg-white/5" onClick={() => setIsMenuOpen(false)}>
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="text-base font-medium text-red-400 text-left px-3 py-2.5 rounded-lg hover:bg-white/5"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="text-base font-medium text-white hover:text-primary px-3 py-2.5 rounded-lg hover:bg-white/5" onClick={() => setIsMenuOpen(false)}>
                      Sign In
                    </Link>
                    <Link href="/auth/register" className="text-base font-semibold text-primary px-3 py-2.5 rounded-lg hover:bg-white/5" onClick={() => setIsMenuOpen(false)}>
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
