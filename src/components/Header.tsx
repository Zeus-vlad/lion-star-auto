'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, X, ShoppingCart, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';

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

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-sm border-b border-border'
          : 'bg-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" aria-label="Lion Star Auto Home">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent hidden sm:block">
              Lion Star Auto
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/#inventory" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Inventory
            </Link>
            <Link href="/#about" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/#contact" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-foreground/80 hover:text-primary transition-colors rounded-lg hover:bg-accent">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center justify-center">
                0
              </span>
            </Link>

            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-foreground/80 hover:text-primary transition-colors rounded-lg hover:bg-accent"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white font-medium">
                    {(session.user as any)?.firstName?.[0]}{(session.user as any)?.lastName?.[0]}
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{(session.user as any)?.firstName}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg py-2 animate-fade-in">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium">{(session.user as any)?.firstName} {(session.user as any)?.lastName}</p>
                      <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                    </div>
                    <Link
                      href="/history"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-accent"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Purchase History</span>
                    </Link>
                    {(session.user as any)?.isAdmin && (
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
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-foreground/80 hover:text-primary transition-colors rounded-lg hover:bg-accent"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div id="mobile-menu" className="lg:hidden py-4 border-t border-border animate-slide-up">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-lg font-medium text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link href="/#inventory" className="text-lg font-medium text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                Inventory
              </Link>
              <Link href="/#about" className="text-lg font-medium text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
              <Link href="/#contact" className="text-lg font-medium text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
              <div className="pt-4 border-t border-border flex flex-col space-y-2">
                {session ? (
                  <>
                    <Link href="/history" className="text-lg font-medium text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                      Purchase History
                    </Link>
                    {(session.user as any)?.isAdmin && (
                      <Link href="/admin" className="text-lg font-medium text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="text-lg font-medium text-destructive text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-lg font-medium text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                      Sign In
                    </Link>
                    <Link href="/signup" className="text-lg font-medium text-primary" onClick={() => setIsMenuOpen(false)}>
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