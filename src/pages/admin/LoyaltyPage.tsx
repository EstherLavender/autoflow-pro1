import { Gift, Sparkles, Award, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AdminLayout from '@/components/layout/AdminLayout';
import { mockLoyalty, mockLoyaltyConfig, mockUsers } from '@/data/mockData';

export default function LoyaltyPage() {
  const visitsForFree = mockLoyaltyConfig.visitsForFreeWash;
  const totalMembers = mockLoyalty.length;
  const totalVisits = mockLoyalty.reduce((sum, l) => sum + l.visits, 0);

  return (
    <AdminLayout title="Loyalty Program" subtitle="10th wash is FREE!">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card><CardContent className="pt-5"><Users className="h-4 w-4 text-muted-foreground mb-1" /><p className="text-2xl font-bold">{totalMembers}</p><p className="text-sm text-muted-foreground">Members</p></CardContent></Card>
        <Card><CardContent className="pt-5"><Sparkles className="h-4 w-4 text-accent mb-1" /><p className="text-2xl font-bold">{totalVisits}</p><p className="text-sm text-muted-foreground">Total Visits</p></CardContent></Card>
        <Card variant="success"><CardContent className="pt-5"><Award className="h-4 w-4 text-success mb-1" /><p className="text-2xl font-bold">{mockLoyalty.reduce((s, l) => s + l.freeWashesEarned, 0)}</p><p className="text-sm text-muted-foreground">Free Washes Earned</p></CardContent></Card>
        <Card><CardContent className="pt-5"><Gift className="h-4 w-4 text-primary mb-1" /><p className="text-xl font-bold">{mockLoyaltyConfig.freeServiceType}</p><p className="text-sm text-muted-foreground">Reward</p></CardContent></Card>
      </div>

      <Card variant="elevated" className="mb-6">
        <CardHeader><CardTitle>Program Rule</CardTitle></CardHeader>
        <CardContent>
          <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
            <div className="flex items-center gap-3"><Gift className="h-5 w-5 text-accent" /><span className="font-semibold">Every {visitsForFree}th visit = Free {mockLoyaltyConfig.freeServiceType}</span></div>
          </div>
        </CardContent>
      </Card>

      <Card variant="elevated">
        <CardHeader><CardTitle>Members</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {mockLoyalty.map((member) => {
            const user = mockUsers.find(u => u.id === member.customerId);
            const progress = ((member.visits % visitsForFree) / visitsForFree) * 100;
            return (
              <div key={member.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div><p className="font-medium">{user?.name || `Customer #${member.customerId}`}</p><p className="text-sm text-muted-foreground">{member.visits} visits</p></div>
                <div className="flex items-center gap-3">
                  <Progress value={progress} className="w-24 h-2" />
                  <span className="text-xs text-muted-foreground">{member.visits % visitsForFree}/{visitsForFree}</span>
                  {member.visits >= visitsForFree && <Badge variant="success">Reward!</Badge>}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
