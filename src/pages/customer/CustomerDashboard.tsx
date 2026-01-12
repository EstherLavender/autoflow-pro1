import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplets, Car, CalendarPlus, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CustomerLayout from '@/components/layout/CustomerLayout';
import { EmptyState, LoadingState } from '@/components/ui/empty-state';
import { useAuth } from '@/context/AuthContext';
import { CustomerProfile } from '@/types/auth';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const customerProfile = profile as CustomerProfile | null;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <CustomerLayout title="Welcome" subtitle="Loading your dashboard...">
        <LoadingState />
      </CustomerLayout>
    );
  }

  const vehicles = customerProfile?.vehicles || [];

  return (
    <CustomerLayout title="Hi there! 👋" subtitle="What does your car need today?">
      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card 
          className="cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => navigate('/customer/book')}
        >
          <CardContent className="py-5 text-center">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <CalendarPlus className="h-6 w-6 text-primary" />
            </div>
            <p className="font-semibold text-sm text-foreground">Book Service</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => navigate('/customer/history')}
        >
          <CardContent className="py-5 text-center">
            <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
              <History className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-semibold text-sm text-foreground">View History</p>
          </CardContent>
        </Card>
      </div>

      {/* My Vehicles Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">My Vehicles</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate('/customer/profile')}>
            Manage
          </Button>
        </CardHeader>
        <CardContent>
          {vehicles.length === 0 ? (
            <EmptyState
              icon={Car}
              title="No vehicles added"
              description="Add your first vehicle to start booking wash services."
              actionLabel="Add Vehicle"
              onAction={() => navigate('/customer/profile')}
              className="py-8"
            />
          ) : (
            <div className="space-y-3">
              {vehicles.map((vehicle) => (
                <div 
                  key={vehicle.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border"
                >
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <Car className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{vehicle.carModel}</p>
                    <p className="text-xs text-muted-foreground">{vehicle.numberPlate} • {vehicle.color}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Bookings */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Droplets}
            title="No bookings yet"
            description="Book your first car wash service and see your history here."
            actionLabel="Book Now"
            onAction={() => navigate('/customer/book')}
            className="py-8"
          />
        </CardContent>
      </Card>
    </CustomerLayout>
  );
}