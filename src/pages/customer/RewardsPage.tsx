import { useState, useEffect } from 'react';
import { Gift, Sparkles, Award, Star, TrendingUp, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import CustomerLayout from '@/components/layout/CustomerLayout';
import { EmptyState, LoadingState } from '@/components/ui/empty-state';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/Supabase';
import { toast } from 'sonner';

export default function RewardsPage() {
  const { user } = useAuth();
  const [loyalty, setLoyalty] = useState<any>(null);
  const [config, setConfig] = useState({ enabled: true, visitsForFreeWash: 10, freeServiceType: 'Basic Wash' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLoyaltyData();
  }, [user]);

  const fetchLoyaltyData = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('loyalty_accounts')
        .select('*')
        .eq('customer_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      setLoyalty(data);
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
      toast.error('Failed to load rewards');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <CustomerLayout title="Rewards" subtitle="Earn free washes with every visit">
        <LoadingState message="Loading rewards..." />
      </CustomerLayout>
    );
  }
  
  const visitsToReward = config.visitsForFreeWash;
  const currentVisits = loyalty?.visits || 0;
  const progress = ((currentVisits % visitsToReward) / visitsToReward) * 100;
  const visitsRemaining = visitsToReward - (currentVisits % visitsToReward);
  const rewardReady = loyalty && loyalty.free_washes_earned > loyalty.free_washes_redeemed;

  const customerJobs = mockJobs.filter(j => j.customerId === customerId && j.status === 'completed');

  return (
    <CustomerLayout title="Rewards" subtitle="Earn free washes with every visit">
      <Card className="mb-6 overflow-hidden">
        <div className="p-6" style={{ background: 'var(--gradient-primary)' }}>
          <div className="flex items-center justify-between text-primary-foreground mb-6">
            <div><p className="text-sm opacity-80">Your Visits</p><p className="text-4xl font-bold">{currentVisits}</p></div>
            <div className="h-16 w-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center"><Gift className="h-8 w-8 text-primary-foreground" /></div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-primary-foreground">
              <span className="flex items-center gap-2"><Star className="h-4 w-4" />Progress to free wash</span>
              <span className="font-semibold">{currentVisits % visitsToReward} / {visitsToReward}</span>
            </div>
            <Progress value={progress} className="h-4 bg-primary-foreground/20 [&>div]:bg-primary-foreground" />
            <p className="text-sm text-primary-foreground/80 text-center">{visitsRemaining} more visit{visitsRemaining > 1 ? 's' : ''} to unlock your reward!</p>
          </div>
        </div>
      </Card>

      {rewardReady && (
        <Card variant="success" className="mb-6">
          <CardContent className="py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4"><Sparkles className="h-7 w-7 text-success" /><div><p className="font-bold text-lg">Reward Unlocked!</p><p className="text-sm text-muted-foreground">Free {config.freeServiceType}</p></div></div>
              <Button variant="success" onClick={() => toast.success('Show this to the cashier!')}>Redeem</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card><CardContent className="py-4 text-center"><TrendingUp className="h-5 w-5 text-primary mx-auto mb-2" /><p className="text-2xl font-bold">{currentVisits}</p><p className="text-xs text-muted-foreground">Visits</p></CardContent></Card>
        <Card><CardContent className="py-4 text-center"><Award className="h-5 w-5 text-accent mx-auto mb-2" /><p className="text-2xl font-bold">{loyalty?.free_washes_earned || 0}</p><p className="text-xs text-muted-foreground">Earned</p></CardContent></Card>
        <Card><CardContent className="py-4 text-center"><CheckCircle className="h-5 w-5 text-success mx-auto mb-2" /><p className="text-2xl font-bold">{loyalty?.free_washes_redeemed || 0}</p><p className="text-xs text-muted-foreground">Redeemed</p></CardContent></Card>
      </div>

      <Card variant="elevated">
        <CardHeader><CardTitle>How It Works</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Every <span className="font-bold text-foreground">{visitsToReward}th</span> wash is <span className="font-bold text-success">FREE</span>! Keep visiting to earn your rewards.</p>
        </CardContent>
      </Card>
    </CustomerLayout>
  );
}
