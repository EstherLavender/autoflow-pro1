import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, DollarSign, Calendar, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState, LoadingState } from '@/components/ui/empty-state';
import { useAuth } from '@/context/AuthContext';

interface Earning {
  id: string;
  date: string;
  service: string;
  amount: number;
  tip: number;
  vehiclePlate: string;
}

export default function OperatorEarningsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');

  useEffect(() => {
    // Simulate loading - in production this would fetch from API
    const timer = setTimeout(() => {
      setEarnings([]); // Empty state - no mock data
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedPeriod]);

  if (isLoading) {
    return <LoadingState message="Loading earnings..." />;
  }

  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);
  const totalTips = earnings.reduce((sum, e) => sum + e.tip, 0);
  const totalJobs = earnings.length;

  return (
    <div className="space-y-6">
      {/* Period Selection */}
      <div className="flex gap-2">
        <Button
          variant={selectedPeriod === 'today' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedPeriod('today')}
        >
          Today
        </Button>
        <Button
          variant={selectedPeriod === 'week' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedPeriod('week')}
        >
          This Week
        </Button>
        <Button
          variant={selectedPeriod === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedPeriod('month')}
        >
          This Month
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Earnings</p>
                <p className="text-2xl font-bold text-foreground">KES {totalEarnings.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tips Received</p>
                <p className="text-2xl font-bold text-foreground">KES {totalTips.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Jobs Completed</p>
                <p className="text-2xl font-bold text-foreground">{totalJobs}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Earnings History</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          {earnings.length === 0 ? (
            <EmptyState
              icon={Wallet}
              title="No earnings yet"
              description={`You haven't earned any money ${selectedPeriod === 'today' ? 'today' : selectedPeriod === 'week' ? 'this week' : 'this month'}. Complete jobs to start earning!`}
            />
          ) : (
            <div className="space-y-3">
              {earnings.map((earning) => (
                <div 
                  key={earning.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{earning.service}</p>
                      <p className="text-sm text-muted-foreground">
                        {earning.vehiclePlate} • {new Date(earning.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">KES {earning.amount}</p>
                    {earning.tip > 0 && (
                      <p className="text-sm text-accent">+KES {earning.tip} tip</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payout Info */}
      <Card variant="elevated" className="bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Weekly Payouts</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Your earnings are automatically transferred to your M-Pesa account every Monday.
              </p>
              <Button variant="outline" size="sm">
                Update Payment Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
