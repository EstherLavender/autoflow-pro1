import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CreditCard, AlertTriangle, Wrench, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState, LoadingState } from '@/components/ui/empty-state';

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load dashboard data
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingState message="Loading dashboard..." />;
  }

  const stats = [
    { label: 'Total Users', value: 0, icon: Users, href: '/owner/users', variant: 'default' },
    { label: 'Active Services', value: 0, icon: Wrench, href: '/owner/services', variant: 'default' },
    { label: 'Transactions', value: 0, icon: CreditCard, href: '/owner/payments', variant: 'default' },
    { label: 'Open Disputes', value: 0, icon: AlertTriangle, href: '/owner/disputes', variant: 'default' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage your car wash business</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card 
            key={stat.label} 
            className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => navigate(stat.href)}
          >
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Services Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Active Services</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={Wrench}
              title="No active services"
              description="Add services to start accepting bookings from customers."
              className="py-8"
            />
          </CardContent>
        </Card>

        {/* Recent Activity Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={CreditCard}
              title="No recent activity"
              description="Transactions and events will appear here once users start booking services."
              className="py-8"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}