'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Create customer via a register endpoint
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }
      // Auto sign-in after registration
      const signInRes = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (signInRes?.ok) {
        router.push('/');
        router.refresh();
      } else {
        router.push('/auth/login');
      }
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full-bleed background image */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://br-royal-dust-ay28petz.storage.c-5.us-east-2.aws.neon.tech/lstar-images/images/site/hero-bg-hd.jpg"
          alt=""
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/85" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-md w-full mx-4 py-24">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-4 shadow-glow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Lion Star Auto" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 text-shadow-hero">
            Create Account
          </h1>
          <p className="text-white/70">Join the Lion Star Auto family</p>
        </div>

        <Card className="glass-dark border-white/10 shadow-lux-lg animate-slide-up backdrop-blur-2xl">
          <CardHeader className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
              <User className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-xl font-bold text-white">Get Started</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-white/80">First Name</Label>
                  <Input id="firstName" placeholder="John" required value={form.firstName} onChange={(e) => set('firstName', e.target.value)} className="mt-1.5 bg-white/5 border-white/15 text-white placeholder:text-white/40 focus:bg-white/10" />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-white/80">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" required value={form.lastName} onChange={(e) => set('lastName', e.target.value)} className="mt-1.5 bg-white/5 border-white/15 text-white placeholder:text-white/40 focus:bg-white/10" />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-white/80">Email</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input id="email" type="email" placeholder="you@example.com" required value={form.email} onChange={(e) => set('email', e.target.value)} className="pl-10 bg-white/5 border-white/15 text-white placeholder:text-white/40 focus:bg-white/10" />
                </div>
              </div>
              <div>
                <Label htmlFor="password" className="text-white/80">Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input id="password" type="password" placeholder="Create a password" required minLength={6} value={form.password} onChange={(e) => set('password', e.target.value)} className="pl-10 bg-white/5 border-white/15 text-white placeholder:text-white/40 focus:bg-white/10" />
                </div>
              </div>
              {error && (
                <div className="p-3 rounded-lg text-sm bg-red-500/15 text-red-300 border border-red-500/20">
                  {error}
                </div>
              )}
              <Button className="w-full gap-2 shadow-glow" type="submit" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <div className="text-center text-sm text-white/60 mt-6">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-primary hover:text-orange-400 font-medium transition-colors">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-white/40 text-xs mt-6">
          © {new Date().getFullYear()} Lion Star Auto · Luxury Car Dealership
        </p>
      </div>
    </div>
  );
}
