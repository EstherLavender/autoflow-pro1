import { useState, useEffect } from 'react';
import { Smartphone, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState, LoadingState } from '@/components/ui/empty-state';
import { paymentsAPI } from '@/lib/api';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  amount: number;
  status: string;
  payment_method: string;
  mpesa_receipt: string;
  phone_number: string;
  user_name?: string;
  service_name?: string;
  created_at: string;
}

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingAmount: 0,
    mpesaTotal: 0
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await paymentsAPI.getAll();
      const data = response.data.payments || [];
      
      setTransactions(data);
      
      // Calculate stats
      const completed = (data || []).filter(t => t.status === 'completed');
      const totalRev = completed.reduce((sum, t) => sum + t.amount, 0);
      const pending = (data || []).filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);
      const mpesa = completed.filter(t => t.payment_method === 'mpesa').reduce((sum, t) => sum + t.amount, 0);
      
      setStats({
        totalRevenue: totalRev,
        pendingAmount: pending,
        mpesaTotal: mpesa
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading payments..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Payments</h1>
        <p className="text-muted-foreground mt-1">Track M-Pesa transactions</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card variant="success"><CardContent className="pt-5"><TrendingUp className="h-4 w-4 text-success mb-1" /><p className="text-2xl font-bold">KES {stats.totalRevenue.toLocaleString()}</p><p className="text-sm text-muted-foreground">Total Revenue</p></CardContent></Card>
        <Card variant="warning"><CardContent className="pt-5"><Clock className="h-4 w-4 text-warning mb-1" /><p className="text-2xl font-bold">KES {stats.pendingAmount.toLocaleString()}</p><p className="text-sm text-muted-foreground">Pending</p></CardContent></Card>
        <Card><CardContent className="pt-5"><Smartphone className="h-4 w-4 text-success mb-1" /><p className="text-2xl font-bold">KES {stats.mpesaTotal.toLocaleString()}</p><p className="text-sm text-muted-foreground">M-Pesa</p></CardContent></Card>
      </div>

      <Card variant="elevated">
        <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {transactions.length === 0 ? (
            <EmptyState
              icon={Smartphone}
              title="No transactions yet"
              description="Payments will appear here once customers start booking services."
              className="py-8"
            />
          ) : (
            transactions.map((tx) => {
              const serviceName = tx.service_name || 'Car Wash Service';
              const userName = tx.user_name || 'Customer';
              return (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-4">
                    <Smartphone className="h-6 w-6 text-success" />
                    <div>
                      <p className="font-medium">{serviceName}</p>
                      <p className="text-sm text-muted-foreground">
                        {tx.payment_method?.toUpperCase()} • {tx.mpesa_receipt || tx.phone_number}
                      </p>
                      <p className="text-xs text-muted-foreground">{userName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">KES {tx.amount.toLocaleString()}</p>
                    <Badge variant={tx.status === 'completed' ? 'success' : tx.status === 'failed' ? 'destructive' : 'warning'}>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
