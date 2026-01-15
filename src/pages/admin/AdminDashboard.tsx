import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CreditCard, AlertTriangle, CheckSquare, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState, LoadingState } from '@/components/ui/empty-state';
import { usersAPI, paymentsAPI, bookingsAPI } from '@/lib/api';
import { User } from '@/types/auth';

interface DashboardStats {
  pendingUsers: number;
  activeUsers: number;
  totalTransactions: number;
  openDisputes: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    pendingUsers: 0,
    activeUsers: 0,
    totalTransactions: 0,
    openDisputes: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load pending users
      const pendingResponse = await usersAPI.getPending();
      const pending = pendingResponse.data.users || [];
      setPendingUsers(pending);

      // Load user stats
      const statsResponse = await usersAPI.getStats();
      const userStats = statsResponse.data.stats;

      // Load payments count
      const paymentsResponse = await paymentsAPI.getAll();
      const payments = paymentsResponse.data.payments || [];

      // Load bookings to count disputes (bookings with status 'disputed')
      const bookingsResponse = await bookingsAPI.getAll();
      const bookings = bookingsResponse.data.bookings || [];
      const disputes = bookings.filter((b: any) => b.status === 'disputed').length;

      setStats({
        pendingUsers: pending.length,
        activeUsers: parseInt(userStats.active_count) || 0,
        totalTransactions: payments.length,
        openDisputes: disputes,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading dashboard..." />;
  }

  const dashboardStats = [
    { 
      label: 'Pending Approvals', 
      value: stats.pendingUsers, 
      icon: CheckSquare, 
      href: '/admin/approvals',
      variant: stats.pendingUsers > 0 ? 'warning' : 'default'
    },
    { label: 'Active Users', value: stats.activeUsers, icon: Users, href: '/admin/users' },
    { label: 'Transactions', value: stats.totalTransactions, icon: CreditCard, href: '/admin/payments' },
    { label: 'Open Disputes', value: stats.openDisputes, icon: AlertTriangle, href: '/admin/disputes' },
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
        {dashboardStats.map((stat) => (
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