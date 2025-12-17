import { useState } from 'react';
import { Gift, Settings, Sparkles, Award, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/components/layout/AdminLayout';
import { mockLoyalty, mockLoyaltyConfig } from '@/data/mockData';

export default function LoyaltyPage() {
  const [config, setConfig] = useState(mockLoyaltyConfig);
  
  const totalMembers = mockLoyalty.length;
  const totalPointsIssued = mockLoyalty.reduce((sum, l) => sum + l.points, 0);
  const freeServicesEarned = mockLoyalty.reduce((sum, l) => sum + l.freeServicesEarned, 0);

  return (
    <AdminLayout title="Loyalty Program" subtitle="Reward your customers and increase retention">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Members</p>
            </div>
            <p className="text-2xl font-bold">{totalMembers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-accent" />
              <p className="text-sm text-muted-foreground">Points Issued</p>
            </div>
            <p className="text-2xl font-bold">{totalPointsIssued}</p>
          </CardContent>
        </Card>
        <Card variant="success">
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-4 w-4 text-success" />
              <p className="text-sm text-muted-foreground">Rewards Earned</p>
            </div>
            <p className="text-2xl font-bold">{freeServicesEarned}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-1">
              <Gift className="h-4 w-4 text-primary" />
              <p className="text-sm text-muted-foreground">Reward Type</p>
            </div>
            <p className="text-xl font-bold">{config.freeServiceType}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Program Settings
                </CardTitle>
                <CardDescription>Configure your loyalty rules</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="enabled" className="text-sm">Active</Label>
                <Switch 
                  id="enabled"
                  checked={config.enabled}
                  onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
              <div className="flex items-center gap-3 mb-2">
                <Gift className="h-5 w-5 text-accent" />
                <span className="font-semibold">Current Rule</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Every <span className="font-bold text-foreground">{config.freeServiceThreshold}th</span> visit = 
                Free <span className="font-bold text-foreground">{config.freeServiceType}</span>
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Visits Required for Reward</Label>
                <Input 
                  type="number" 
                  value={config.freeServiceThreshold}
                  onChange={(e) => setConfig({ ...config, freeServiceThreshold: parseInt(e.target.value) || 10 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Points Per Service</Label>
                <Input 
                  type="number" 
                  value={config.pointsPerService}
                  onChange={(e) => setConfig({ ...config, pointsPerService: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Free Service Reward</Label>
                <Input 
                  value={config.freeServiceType}
                  onChange={(e) => setConfig({ ...config, freeServiceType: e.target.value })}
                />
              </div>
            </div>

            <Button variant="default" className="w-full">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Top Members */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Top Members</CardTitle>
            <CardDescription>Customers with the most visits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockLoyalty.map((member, index) => (
              <div 
                key={member.customerId}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-accent text-accent-foreground' : 'bg-primary/10 text-primary'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">Customer #{member.customerId}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.totalVisits} visits • {member.points} points
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(member.totalVisits % config.freeServiceThreshold) / config.freeServiceThreshold * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {member.totalVisits % config.freeServiceThreshold}/{config.freeServiceThreshold}
                    </span>
                  </div>
                  {member.totalVisits >= config.freeServiceThreshold && (
                    <Badge variant="success" className="mt-1">Reward Ready!</Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
