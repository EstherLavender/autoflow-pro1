import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CreditCard, AlertTriangle, CheckSquare, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/layout/AdminLayout';
import { EmptyState, LoadingState } from '@/components/ui/empty-state';
import { getPendingUsers } from '@/lib/userStore';
import { User } from '@/types/auth';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      const pending = getPendingUsers();
      setPendingUsers(pending);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <AdminLayout title="Dashboard" subtitle="Welcome back">
        <LoadingState message="Loading dashboard..." />
      </AdminLayout>
    );
  }

  const stats = [
    { 
      label: 'Pending Approvals', 
      value: pendingUsers.length, 
      icon: CheckSquare, 
      href: '/admin/approvals',
      variant: pendingUsers.length > 0 ? 'warning' : 'default'
    },
    { label: 'Active Users', value: 0, icon: Users, href: '/admin/users' },
    { label: 'Transactions', value: 0, icon: CreditCard, href: '/admin/payments' },
    { label: 'Open Disputes', value: 0, icon: AlertTriangle, href: '/admin/disputes' },
  ];

  return (
    <AdminLayout title="Dashboard" subtitle="Welcome back">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
    </AdminLayout>
  );
}