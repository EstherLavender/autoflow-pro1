import { useState, useEffect } from 'react';
import { Gift, Sparkles, Award, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { EmptyState, LoadingState } from '@/components/ui/empty-state';
import { supabase } from '@/lib/Supabase';
import { toast } from 'sonner';

export default function LoyaltyPage() {
  const [loyalty, setLoyalty] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [config] = useState({ visitsForFreeWash: 10, freeServiceType: 'Basic Wash' });

  useEffect(() => {
    fetchLoyaltyData();
  }, []);

  const fetchLoyaltyData = async () => {
    try {
      const { data, error } = await supabase
        .from('loyalty_accounts')
        .select(`
          *,
          customer:users(full_name, email)
        `);
      
      if (error) throw error;
      setLoyalty(data || []);
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
      toast.error('Failed to load loyalty data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading loyalty data..." />;
  }

  const visitsForFree = config.visitsForFreeWash;
  const totalMembers = loyalty.length;
  const totalVisits = loyalty.reduce((sum, l) => sum + l.visits, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Loyalty Program</h1>
        <p className="text-muted-foreground mt-1">10th wash is FREE!</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card><CardContent className="pt-5"><Users className="h-4 w-4 text-muted-foreground mb-1" /><p className="text-2xl font-bold">{totalMembers}</p><p className="text-sm text-muted-foreground">Members</p></CardContent></Card>
        <Card><CardContent className="pt-5"><Sparkles className="h-4 w-4 text-accent mb-1" /><p className="text-2xl font-bold">{totalVisits}</p><p className="text-sm text-muted-foreground">Total Visits</p></CardContent></Card>
        <Card variant="success"><CardContent className="pt-5"><Award className="h-4 w-4 text-success mb-1" /><p className="text-2xl font-bold">{loyalty.reduce((s, l) => s + l.free_washes_earned, 0)}</p><p className="text-sm text-muted-foreground">Free Washes Earned</p></CardContent></Card>
        <Card><CardContent className="pt-5"><Gift className="h-4 w-4 text-primary mb-1" /><p className="text-xl font-bold">{config.freeServiceType}</p><p className="text-sm text-muted-foreground">Reward</p></CardContent></Card>
      </div>

      <Card variant="elevated" className="mb-6">
        <CardHeader><CardTitle>Program Rule</CardTitle></CardHeader>
        <CardContent>
          <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
            <div className="flex items-center gap-3"><Gift className="h-5 w-5 text-accent" /><span className="font-semibold">Every {visitsForFree}th visit = Free {config.freeServiceType}</span></div>
          </div>
        </CardContent>
      </Card>

      <Card variant="elevated">
        <CardHeader><CardTitle>Members</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {loyalty.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No loyalty members yet"
              description="Members will appear here once customers start using the service."
              className="py-8"
            />
          ) : (
            loyalty.map((member) => {
              const progress = ((member.visits % visitsForFree) / visitsForFree) * 100;
              return (
                <div key={member.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div><p className="font-medium">{member.customer?.full_name || member.customer?.email || `Customer #${member.customer_id}`}</p><p className="text-sm text-muted-foreground">{member.visits} visits</p></div>
                  <div className="flex items-center gap-3">
                    <Progress value={progress} className="w-24 h-2" />
                    <span className="text-xs text-muted-foreground">{member.visits % visitsForFree}/{visitsForFree}</span>
                    {member.visits >= visitsForFree && <Badge variant="success">Reward!</Badge>}
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
