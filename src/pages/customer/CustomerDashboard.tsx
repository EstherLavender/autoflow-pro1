import { useState } from 'react';
import { Droplets, Car, Mic, MapPin, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import CustomerLayout from '@/components/layout/CustomerLayout';
import { mockVehicles, mockJobs, mockServiceTypes, mockLoyalty, mockLoyaltyConfig } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const customerId = '3';
  const vehicles = mockVehicles.filter(v => v.customerId === customerId);
  const loyalty = mockLoyalty.find(l => l.customerId === customerId);
  const activeJob = mockJobs.find(j => j.customerId === customerId && (j.status === 'pending' || j.status === 'in_progress'));
  
  const visitsToReward = mockLoyaltyConfig.freeServiceThreshold;
  const currentVisits = loyalty?.totalVisits || 0;
  const progress = (currentVisits % visitsToReward) / visitsToReward * 100;

  const vehicleNeedsAttention = vehicles.find(v => v.healthStatus === 'attention' || v.healthStatus === 'urgent');

  const quickActions = [
    { id: 'wash', label: 'Wash My Car', icon: Droplets, color: 'bg-blue-500/10 text-blue-600', href: '/customer/wash' },
    { id: 'sound', label: 'Strange Sound?', icon: Mic, color: 'bg-orange-500/10 text-orange-600', href: '/customer/diagnose' },
    { id: 'garage', label: 'Find Garage', icon: MapPin, color: 'bg-green-500/10 text-green-600', href: '/customer/garages' },
    { id: 'help', label: 'Need Help Now', icon: AlertTriangle, color: 'bg-red-500/10 text-red-600', href: '/customer/rescue' },
  ];

  return (
    <CustomerLayout title="Hi, Peter 👋" subtitle="What does your car need today?">
      {/* Vehicle Alert */}
      {vehicleNeedsAttention && (
        <Card className="mb-5 border-warning/50 bg-warning/5">
          <CardContent className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm font-medium">{vehicleNeedsAttention.make} {vehicleNeedsAttention.model}</p>
                <p className="text-xs text-muted-foreground">Service due soon</p>
              </div>
            </div>
            <Badge variant="warning">Attention</Badge>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {quickActions.map((action) => (
          <Card 
            key={action.id}
            variant="interactive"
            className="cursor-pointer"
            onClick={() => navigate(action.href)}
          >
            <CardContent className="py-5 text-center">
              <div className={`h-12 w-12 rounded-xl ${action.color} flex items-center justify-center mx-auto mb-3`}>
                <action.icon className="h-6 w-6" />
              </div>
              <p className="font-semibold text-sm">{action.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Service */}
      {activeJob && (
        <Card variant="accent" className="mb-5">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="font-semibold">{mockServiceTypes.find(s => s.id === activeJob.serviceTypeId)?.name}</p>
              </div>
              <Badge variant="in-progress">Live</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loyalty Progress */}
      <Card className="mb-5 overflow-hidden">
        <div className="p-4" style={{ background: 'var(--gradient-primary)' }}>
          <div className="flex items-center justify-between text-primary-foreground mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="font-medium text-sm">Loyalty Progress</span>
            </div>
            <span className="text-sm">{currentVisits % visitsToReward}/{visitsToReward}</span>
          </div>
          <Progress value={progress} className="h-2 bg-primary-foreground/20 [&>div]:bg-primary-foreground" />
          <p className="text-xs text-primary-foreground/80 mt-2">
            {visitsToReward - (currentVisits % visitsToReward)} more visits for a free wash!
          </p>
        </div>
      </Card>

      {/* My Vehicles */}
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold">My Vehicles</h3>
        <button className="text-sm text-primary" onClick={() => navigate('/customer/vehicles')}>View all</button>
      </div>
      <div className="space-y-2">
        {vehicles.slice(0, 2).map((vehicle) => (
          <Card key={vehicle.id} variant="interactive" onClick={() => navigate('/customer/vehicles')}>
            <CardContent className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Car className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{vehicle.make} {vehicle.model}</p>
                  <p className="text-xs text-muted-foreground">{vehicle.licensePlate}</p>
                </div>
              </div>
              <Badge variant={vehicle.healthStatus === 'good' ? 'success' : 'warning'}>
                {vehicle.healthStatus === 'good' ? 'Healthy' : 'Check'}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </CustomerLayout>
  );
}
