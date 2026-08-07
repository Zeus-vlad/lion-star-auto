'use client';

import { ArrowRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Full-bleed background video (original template structure) */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-center"
          poster="/images/hero-poster.jpg"
          aria-label="Lion Star Auto showroom"
        >
          <source src="/images/tesla.mp4" type="video/mp4" />
        </video>
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 right-10 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl animate-float animation-delay-200" />
        <div className="absolute bottom-1/4 left-1/4 w-16 h-16 bg-primary/10 rounded-full blur-2xl animate-float animation-delay-400" />
        <div className="absolute bottom-1/3 right-20 w-24 h-24 bg-orange-500/15 rounded-full blur-3xl animate-float animation-delay-600" />
      </div>

      {/* Shimmer overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: 'linear-gradient(120deg, transparent 0%, rgba(249, 115, 22, 0.1) 50%, transparent 100%)',
          animation: 'shimmer 8s infinite',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-in">
            <span className="text-sm font-medium text-white/90">Est. 2024</span>
            <span className="w-2 h-2 bg-primary rounded-full" />
            <span className="text-sm font-medium text-white/90">50+ Luxury Vehicles</span>
          </div>

          {/* Main Headline */}
          <h1
            id="hero-title"
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight mb-6 animate-slide-up"
          >
            <span className="block">Discover Your</span>
            <span className="gradient-text">Dream Luxury Car</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl lg:text-2xl text-white/80 max-w-2xl mx-auto mb-10 animate-slide-up animation-delay-100">
            Curated collection of premium vehicles from Mercedes, BMW, Audi, Lexus & more.
            Uncompromising quality, exceptional service.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animation-delay-200">
            <Button
              size="lg"
              className={cn(
                "w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg"
              )}
              asChild
            >
              <a href="#inventory" className="inline-flex items-center gap-2">
                Explore Inventory
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className={cn(
                "w-full sm:w-auto border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg"
              )}
              asChild
            >
              <a href="#about">Learn More</a>
            </Button>
          </div>

          {/* Scroll indicator */}
          <div className="mt-16 animate-fade-in animation-delay-300">
            <button
              className="flex flex-col items-center space-y-2 text-white/60 hover:text-white transition-colors"
              aria-label="Scroll down to explore"
            >
              <span className="text-sm font-medium tracking-wide uppercase">Scroll to Explore</span>
              <ChevronDown className="w-6 h-6 animate-bounce" />
            </button>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in animation-delay-400">
          {[
            { icon: '🏆', label: 'Premium Quality', desc: 'Hand-selected vehicles' },
            { icon: '🔧', label: 'Full Inspection', desc: '150+ point check' },
            { icon: '🚚', label: 'Nationwide Delivery', desc: 'To your doorstep' },
            { icon: '🛡️', label: 'Warranty Options', desc: 'Peace of mind' },
          ].map((item, index) => (
            <div
              key={item.label}
              className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <h3 className="font-semibold text-white mb-1">{item.label}</h3>
              <p className="text-sm text-white/60">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
