import { Smartphone, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/layout/AdminLayout';
import { mockTransactions, mockJobs, mockServiceTypes } from '@/data/mockData';

export default function PaymentsPage() {
  const completedPayments = mockTransactions.filter(p => p.status === 'completed');
  const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = mockTransactions.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const mpesaTotal = completedPayments.filter(p => p.paymentMethod === 'mpesa').reduce((sum, p) => sum + p.amount, 0);

  return (
    <AdminLayout title="Payments" subtitle="Track M-Pesa transactions">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card variant="success"><CardContent className="pt-5"><TrendingUp className="h-4 w-4 text-success mb-1" /><p className="text-2xl font-bold">KES {totalRevenue.toLocaleString()}</p><p className="text-sm text-muted-foreground">Total Revenue</p></CardContent></Card>
        <Card variant="warning"><CardContent className="pt-5"><Clock className="h-4 w-4 text-warning mb-1" /><p className="text-2xl font-bold">KES {pendingAmount.toLocaleString()}</p><p className="text-sm text-muted-foreground">Pending</p></CardContent></Card>
        <Card><CardContent className="pt-5"><Smartphone className="h-4 w-4 text-success mb-1" /><p className="text-2xl font-bold">KES {mpesaTotal.toLocaleString()}</p><p className="text-sm text-muted-foreground">M-Pesa</p></CardContent></Card>
      </div>

      <Card variant="elevated">
        <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {mockTransactions.map((tx) => {
            const job = mockJobs.find(j => j.id === tx.jobId);
            const service = job ? mockServiceTypes.find(s => s.id === job.serviceTypeId) : null;
            return (
              <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-4">
                  <Smartphone className="h-6 w-6 text-success" />
                  <div><p className="font-medium">{service?.name || 'Service'}</p><p className="text-sm text-muted-foreground">{tx.paymentMethod.toUpperCase()} • {tx.reference}</p></div>
                </div>
                <div className="text-right">
                  <p className="font-bold">KES {tx.amount.toLocaleString()}</p>
                  <Badge variant={tx.status === 'completed' ? 'success' : 'pending'}><CheckCircle className="h-3 w-3 mr-1" />{tx.status}</Badge>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
