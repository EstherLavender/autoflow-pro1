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
        <p className="text-muted-foreground mt-1">Welcome back</p>
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
                {stat.variant === 'warning' && stat.value > 0 && (
                  <Badge variant="destructive" className="text-xs">{stat.value} new</Badge>
                )}
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pending Approvals Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Pending Approvals</CardTitle>
            {pendingUsers.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/approvals')}>
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {pendingUsers.length === 0 ? (
              <EmptyState
                icon={CheckSquare}
                title="No pending approvals"
                description="All user registrations have been reviewed."
                className="py-8"
              />
            ) : (
              <div className="space-y-3">
                {pendingUsers.slice(0, 3).map((user) => (
                  <div 
                    key={user.id} 
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-sm font-semibold text-foreground">
                          {user.email?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">
                          {user.email || user.phone}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                      </div>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                ))}
              </div>
            )}
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