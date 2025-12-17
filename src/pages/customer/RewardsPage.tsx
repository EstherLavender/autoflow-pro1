import { Gift, Sparkles, Award, Star, TrendingUp, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import CustomerLayout from '@/components/layout/CustomerLayout';
import { mockLoyalty, mockLoyaltyConfig, mockJobs, mockServiceTypes } from '@/data/mockData';
import { toast } from 'sonner';

export default function RewardsPage() {
  const customerId = '3';
  const loyalty = mockLoyalty.find(l => l.customerId === customerId);
  const config = mockLoyaltyConfig;
  
  const visitsToReward = config.freeServiceThreshold;
  const currentVisits = loyalty?.totalVisits || 0;
  const progress = (currentVisits % visitsToReward) / visitsToReward * 100;
  const visitsRemaining = visitsToReward - (currentVisits % visitsToReward);
  const rewardReady = currentVisits >= visitsToReward && loyalty && loyalty.freeServicesEarned > loyalty.freeServicesRedeemed;

  // Calculate points history from jobs
  const customerJobs = mockJobs.filter(j => j.customerId === customerId && j.status === 'completed');
  const pointsHistory = customerJobs.map(job => {
    const service = mockServiceTypes.find(s => s.id === job.serviceTypeId);
    return {
      id: job.id,
      service: service?.name || 'Service',
      points: service?.loyaltyPoints || 0,
      date: job.completedAt || job.createdAt,
    };
  });

  const handleRedeem = () => {
    toast.success('Reward redeemed! Show this to the cashier.');
  };

  return (
    <CustomerLayout title="Rewards" subtitle="Earn points and unlock free services">
      {/* Main Loyalty Card */}
      <Card className="mb-6 overflow-hidden animate-slide-up">
        <div className="p-6" style={{ background: 'var(--gradient-primary)' }}>
          <div className="flex items-center justify-between text-primary-foreground mb-6">
            <div>
              <p className="text-sm opacity-80">Your Points</p>
              <p className="text-4xl font-bold">{loyalty?.points || 0}</p>
            </div>
            <div className="h-16 w-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
              <Gift className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-primary-foreground">
              <span className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Progress to free {config.freeServiceType}
              </span>
              <span className="font-semibold">{currentVisits % visitsToReward} / {visitsToReward}</span>
            </div>
            <Progress 
              value={progress} 
              className="h-4 bg-primary-foreground/20 [&>div]:bg-primary-foreground"
            />
            <p className="text-sm text-primary-foreground/80 text-center">
              {visitsRemaining} more visit{visitsRemaining > 1 ? 's' : ''} to unlock your reward!
            </p>
          </div>
        </div>
      </Card>

      {/* Reward Ready */}
      {rewardReady && (
        <Card variant="success" className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardContent className="py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-success/20 flex items-center justify-center">
                  <Sparkles className="h-7 w-7 text-success" />
                </div>
                <div>
                  <p className="font-bold text-lg">Reward Unlocked!</p>
                  <p className="text-sm text-muted-foreground">
                    Free {config.freeServiceType} available
                  </p>
                </div>
              </div>
              <Button variant="success" onClick={handleRedeem}>
                Redeem
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <CardContent className="py-4 text-center">
            <TrendingUp className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{loyalty?.totalVisits || 0}</p>
            <p className="text-xs text-muted-foreground">Total Visits</p>
          </CardContent>
        </Card>
        <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardContent className="py-4 text-center">
            <Award className="h-5 w-5 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold">{loyalty?.freeServicesEarned || 0}</p>
            <p className="text-xs text-muted-foreground">Rewards Earned</p>
          </CardContent>
        </Card>
        <Card className="animate-slide-up" style={{ animationDelay: '0.25s' }}>
          <CardContent className="py-4 text-center">
            <CheckCircle className="h-5 w-5 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold">{loyalty?.freeServicesRedeemed || 0}</p>
            <p className="text-xs text-muted-foreground">Redeemed</p>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card variant="elevated" className="mb-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>Earn rewards with every visit</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
              1
            </div>
            <div>
              <p className="font-medium">Get Services</p>
              <p className="text-sm text-muted-foreground">
                Earn points on every service you complete
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
              2
            </div>
            <div>
              <p className="font-medium">Track Progress</p>
              <p className="text-sm text-muted-foreground">
                Every {config.freeServiceThreshold} visits unlocks a reward
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-sm font-bold text-accent shrink-0">
              3
            </div>
            <div>
              <p className="font-medium">Enjoy Free Service</p>
              <p className="text-sm text-muted-foreground">
                Redeem your free {config.freeServiceType} any time
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Points History */}
      <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '0.35s' }}>
        <CardHeader>
          <CardTitle>Points History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pointsHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No points earned yet. Book your first service!
            </p>
          ) : (
            pointsHistory.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-sm">{item.service}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.date.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                <Badge variant="success">+{item.points} pts</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </CustomerLayout>
  );
}
