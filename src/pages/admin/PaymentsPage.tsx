import { CreditCard, Smartphone, Wallet, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/layout/AdminLayout';
import { mockPayments, mockJobs, mockServiceTypes } from '@/data/mockData';

const methodIcons = {
  mpesa: Smartphone,
  x402: Wallet,
  cash: CreditCard,
  card: CreditCard,
};

const statusConfig = {
  completed: { icon: CheckCircle, variant: 'success' as const, label: 'Completed' },
  pending: { icon: Clock, variant: 'pending' as const, label: 'Pending' },
  failed: { icon: XCircle, variant: 'destructive' as const, label: 'Failed' },
};

export default function PaymentsPage() {
  const totalRevenue = mockPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const pendingAmount = mockPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const mpesaTotal = mockPayments
    .filter(p => p.method === 'mpesa' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const x402Total = mockPayments
    .filter(p => p.method === 'x402' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <AdminLayout title="Payments" subtitle="Track all transactions and revenue">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card variant="success">
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-success" />
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
            <p className="text-2xl font-bold">KES {totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card variant="warning">
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-warning" />
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
            <p className="text-2xl font-bold">KES {pendingAmount.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-1">
              <Smartphone className="h-4 w-4 text-success" />
              <p className="text-sm text-muted-foreground">M-Pesa</p>
            </div>
            <p className="text-2xl font-bold">KES {mpesaTotal.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="h-4 w-4 text-primary" />
              <p className="text-sm text-muted-foreground">X402</p>
            </div>
            <p className="text-2xl font-bold">KES {x402Total.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockPayments.map((payment) => {
            const job = mockJobs.find(j => j.id === payment.jobId);
            const service = job ? mockServiceTypes.find(s => s.id === job.serviceTypeId) : null;
            const MethodIcon = methodIcons[payment.method];
            const status = statusConfig[payment.status];
            const StatusIcon = status.icon;
            
            return (
              <div 
                key={payment.id} 
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                    <MethodIcon className="h-6 w-6 text-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{service?.name || 'Service'}</p>
                    <p className="text-sm text-muted-foreground">
                      {payment.method.toUpperCase()} • {payment.reference || 'Pending'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {payment.createdAt.toLocaleDateString('en-KE', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">KES {payment.amount.toLocaleString()}</p>
                  <Badge variant={status.variant} className="mt-1">
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {status.label}
                  </Badge>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
