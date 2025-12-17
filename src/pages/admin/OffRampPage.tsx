import { ArrowDownToLine, Wallet, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/layout/AdminLayout';
import { mockOffRampTransactions, getWalletStats, exchangeRates } from '@/data/mockData';
import { toast } from 'sonner';

const statusConfig = {
  completed: { icon: CheckCircle, variant: 'success' as const },
  processing: { icon: Clock, variant: 'pending' as const },
  pending: { icon: Clock, variant: 'secondary' as const },
  failed: { icon: AlertCircle, variant: 'destructive' as const },
};

export default function OffRampPage() {
  const stats = getWalletStats();

  const handleWithdraw = () => {
    toast.success('Withdrawal initiated via Rain API');
  };

  return (
    <AdminLayout title="Off-Ramp" subtitle="Convert stablecoins to local currency via Rain">
      {/* Wallet Balance */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card variant="accent">
          <CardContent className="pt-5">
            <p className="text-sm text-muted-foreground">USDC Balance</p>
            <p className="text-2xl font-bold">${stats.totalUsdc.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-muted-foreground">USDT Balance</p>
            <p className="text-2xl font-bold">${stats.totalUsdt.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-muted-foreground">KES Equivalent</p>
            <p className="text-2xl font-bold">KES {(stats.totalUsd * exchangeRates.usdToKes).toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-muted-foreground">Pending Off-Ramp</p>
            <p className="text-2xl font-bold">${stats.pendingOffRamp.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Withdraw Action */}
      <Card variant="elevated" className="mb-6">
        <CardContent className="py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ArrowDownToLine className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Withdraw to Bank (KES)</p>
                <p className="text-sm text-muted-foreground">Convert via Rain API • Instant settlement</p>
              </div>
            </div>
            <Button variant="hero" onClick={handleWithdraw}>
              <Wallet className="h-4 w-4 mr-2" />
              Withdraw
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Off-Ramp History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockOffRampTransactions.map((tx) => {
            const status = statusConfig[tx.status];
            const StatusIcon = status.icon;
            return (
              <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <ArrowDownToLine className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">${tx.amount} {tx.stablecoin.toUpperCase()} → {tx.targetCurrency}</p>
                    <p className="text-sm text-muted-foreground">{tx.rainTxId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">KES {tx.targetAmount.toLocaleString()}</p>
                  <Badge variant={status.variant}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {tx.status}
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
