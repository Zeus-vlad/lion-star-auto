import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const orderNumber = id ? `LSA-${id}` : 'LSA-' + Math.random().toString(36).substring(2, 10).toUpperCase();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-8">
            Your purchase has been successfully processed.
          </p>
          <Card className="max-w-md mx-auto mb-8 text-left">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Number</span>
                  <span className="font-mono font-medium">{orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-primary font-semibold">Processing</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-sm text-muted-foreground mb-8">
            A confirmation email has been sent to your inbox. Our concierge team
            will contact you within 24 hours to schedule delivery.
          </p>

          <Button size="lg" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
