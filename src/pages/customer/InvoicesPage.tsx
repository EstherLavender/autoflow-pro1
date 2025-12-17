import { FileText, Download, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CustomerLayout from '@/components/layout/CustomerLayout';
import { mockInvoices, mockServiceTypes } from '@/data/mockData';
import { toast } from 'sonner';

export default function InvoicesPage() {
  const handleDownload = (invoiceId: string) => {
    toast.success(`Downloading invoice ${invoiceId}`);
  };

  return (
    <CustomerLayout title="Invoices" subtitle="View and download your service invoices">
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Your Invoices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockInvoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">INV-{invoice.id.padStart(3, '0')}</p>
                  <p className="text-sm text-muted-foreground">
                    {invoice.items.map(i => i.name).join(', ')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {invoice.createdAt.toLocaleDateString('en-KE')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold">KES {invoice.amount.toLocaleString()}</p>
                  {invoice.amountUsd && (
                    <p className="text-xs text-muted-foreground">${invoice.amountUsd} USD</p>
                  )}
                  <Badge variant="secondary">{invoice.paymentMethod}</Badge>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDownload(invoice.id)}>
                  <Download className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </CustomerLayout>
  );
}
