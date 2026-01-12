import { useState, useEffect } from 'react';
import { Smartphone, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/layout/AdminLayout';
import { EmptyState, LoadingState } from '@/components/ui/empty-state';
import { supabase } from '@/lib/Supabase';
import { toast } from 'sonner';

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
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
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          booking:bookings(
            id,
            service:services(name)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTransactions(data || []);
      
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
    return (
      <AdminLayout title="Payments" subtitle="Track M-Pesa transactions">
        <LoadingState message="Loading payments..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Payments" subtitle="Track M-Pesa transactions">
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
              const serviceName = tx.booking?.service?.name || 'Service';
              return (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-4">
                    <Smartphone className="h-6 w-6 text-success" />
                    <div><p className="font-medium">{serviceName}</p><p className="text-sm text-muted-foreground">{tx.payment_method?.toUpperCase()} • {tx.reference}</p></div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">KES {tx.amount.toLocaleString()}</p>
                    <Badge variant={tx.status === 'completed' ? 'success' : 'pending'}><CheckCircle className="h-3 w-3 mr-1" />{tx.status}</Badge>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
