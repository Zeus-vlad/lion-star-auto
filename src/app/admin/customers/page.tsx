'use client';

import { useEffect, useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2 } from 'lucide-react';

interface Customer {
  customerId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  city: string | null;
  stateCode: string | null;
  zipCode: string | null;
  isAdmin: boolean;
  createdAt: string;
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/customers');
      if (res.ok) setCustomers(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Customers Management</h1>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search customers by name, email, or phone..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Customer</th>
                    <th className="text-left p-4 font-medium">Email</th>
                    <th className="text-left p-4 font-medium">Phone</th>
                    <th className="text-left p-4 font-medium">Location</th>
                    <th className="text-center p-4 font-medium">Role</th>
                    <th className="text-center p-4 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.customerId} className="border-b">
                      <td className="p-4 font-medium">
                        {c.firstName} {c.lastName}
                      </td>
                      <td className="p-4">{c.email}</td>
                      <td className="p-4 text-muted-foreground">{c.phone || '—'}</td>
                      <td className="p-4 text-muted-foreground">
                        {[c.city, c.stateCode, c.zipCode].filter(Boolean).join(', ') || '—'}
                      </td>
                      <td className="p-4 text-center">
                        {c.isAdmin ? (
                          <Badge className="bg-primary/15 text-primary">Admin</Badge>
                        ) : (
                          <Badge variant="outline">Customer</Badge>
                        )}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground text-center whitespace-nowrap">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            {customers.length === 0 ? 'No customers yet.' : 'No customers match your search.'}
          </div>
        )}
        {loading && (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading customers...
          </div>
        )}
      </div>
    </div>
  );
}
