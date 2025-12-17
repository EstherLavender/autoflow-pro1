import { Car, Gift, Clock, History, ArrowRight, Sparkles, CalendarPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import CustomerLayout from '@/components/layout/CustomerLayout';
import { mockVehicles, mockJobs, mockServiceTypes, mockLoyalty, mockLoyaltyConfig } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const customerId = '3'; // Mock customer
  const vehicles = mockVehicles.filter(v => v.customerId === customerId);
  const recentJobs = mockJobs.filter(j => j.customerId === customerId).slice(0, 3);
  const loyalty = mockLoyalty.find(l => l.customerId === customerId);
  
  const visitsToReward = mockLoyaltyConfig.freeServiceThreshold;
  const currentVisits = loyalty?.totalVisits || 0;
  const progress = (currentVisits % visitsToReward) / visitsToReward * 100;
  const visitsRemaining = visitsToReward - (currentVisits % visitsToReward);

  // Check if active job
  const activeJob = mockJobs.find(j => j.customerId === customerId && (j.status === 'pending' || j.status === 'in_progress'));

  return (
    <CustomerLayout title="Welcome Back!" subtitle="Here's your car care summary">
      {/* Active Service Alert */}
      {activeJob && (
        <Card variant="accent" className="mb-6 animate-slide-up">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-semibold">Service in Progress</p>
                  <p className="text-sm text-muted-foreground">
                    {mockServiceTypes.find(s => s.id === activeJob.serviceTypeId)?.name}
                  </p>
                </div>
              </div>
              <Badge variant="in-progress">
                {activeJob.status === 'in_progress' ? 'In Progress' : 'Queued'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loyalty Card */}
      <Card className="mb-6 overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="p-5" style={{ background: 'var(--gradient-primary)' }}>
          <div className="flex items-center justify-between text-primary-foreground mb-4">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              <span className="font-semibold">Loyalty Rewards</span>
            </div>
            <Badge className="bg-primary-foreground/20 text-primary-foreground border-0">
              {loyalty?.points || 0} points
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-primary-foreground/80">
              <span>{currentVisits % visitsToReward} / {visitsToReward} visits</span>
              <span>{visitsRemaining} to go!</span>
            </div>
            <Progress 
              value={progress} 
              className="h-3 bg-primary-foreground/20 [&>div]:bg-primary-foreground"
            />
          </div>

          {progress >= 100 && (
            <div className="mt-4 p-3 rounded-lg bg-primary-foreground/20 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <span className="font-medium">Free {mockLoyaltyConfig.freeServiceType} unlocked!</span>
            </div>
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card 
          variant="interactive" 
          className="animate-slide-up" 
          style={{ animationDelay: '0.2s' }}
          onClick={() => navigate('/customer/book')}
        >
          <CardContent className="pt-5 text-center">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <CalendarPlus className="h-6 w-6 text-primary" />
            </div>
            <p className="font-semibold">Book Service</p>
            <p className="text-xs text-muted-foreground">Schedule now</p>
          </CardContent>
        </Card>
        <Card 
          variant="interactive" 
          className="animate-slide-up" 
          style={{ animationDelay: '0.25s' }}
          onClick={() => navigate('/customer/vehicles')}
        >
          <CardContent className="pt-5 text-center">
            <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
              <Car className="h-6 w-6 text-accent" />
            </div>
            <p className="font-semibold">My Vehicles</p>
            <p className="text-xs text-muted-foreground">{vehicles.length} registered</p>
          </CardContent>
        </Card>
      </div>

      {/* My Vehicles */}
      <Card variant="elevated" className="mb-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>My Vehicles</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate('/customer/vehicles')}>
            View all
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Car className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{vehicle.make} {vehicle.model}</p>
                  <p className="text-xs text-muted-foreground">{vehicle.licensePlate}</p>
                </div>
              </div>
              <Badge variant="secondary">{vehicle.year}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Services */}
      <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Recent Services</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate('/customer/history')}>
            View all
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentJobs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No service history yet
            </p>
          ) : (
            recentJobs.map((job) => {
              const service = mockServiceTypes.find(s => s.id === job.serviceTypeId);
              const vehicle = mockVehicles.find(v => v.id === job.vehicleId);
              return (
                <div key={job.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <History className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{service?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {vehicle?.licensePlate} • {job.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={job.status === 'completed' ? 'success' : 'in-progress'}>
                    {job.status === 'completed' ? 'Done' : 'Active'}
                  </Badge>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </CustomerLayout>
  );
}
