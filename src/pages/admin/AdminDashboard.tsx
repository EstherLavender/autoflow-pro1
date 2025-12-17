import { DollarSign, Car, Clock, AlertTriangle, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/layout/AdminLayout';
import { getTodayStats, mockJobs, mockServiceTypes, mockInventory, mockVehicles } from '@/data/mockData';

const stats = getTodayStats();

const statCards = [
  {
    title: "Today's Revenue",
    value: `KES ${stats.todayRevenue.toLocaleString()}`,
    icon: DollarSign,
    change: '+12%',
    trend: 'up',
    variant: 'accent' as const,
  },
  {
    title: 'Cars Serviced',
    value: stats.carsServiced.toString(),
    icon: Car,
    change: '+3',
    trend: 'up',
    variant: 'success' as const,
  },
  {
    title: 'Pending Services',
    value: stats.pendingServices.toString(),
    icon: Clock,
    change: 'Active',
    trend: 'neutral',
    variant: 'default' as const,
  },
  {
    title: 'Low Stock Alerts',
    value: stats.lowStockAlerts.toString(),
    icon: AlertTriangle,
    change: 'Action needed',
    trend: 'down',
    variant: 'warning' as const,
  },
];

export default function AdminDashboard() {
  const pendingJobs = mockJobs.filter(j => j.status === 'pending' || j.status === 'in_progress');
  const lowStockItems = mockInventory.filter(i => i.quantity <= i.minStockLevel);

  return (
    <AdminLayout title="Dashboard" subtitle="Welcome back! Here's what's happening today.">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.title} variant={stat.variant}>
            <CardContent className="pt-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === 'up' && <ArrowUpRight className="h-4 w-4 text-success" />}
                    {stat.trend === 'down' && <ArrowDownRight className="h-4 w-4 text-destructive" />}
                    <span className={`text-xs font-medium ${
                      stat.trend === 'up' ? 'text-success' : 
                      stat.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active Jobs */}
        <Card variant="elevated">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Active Jobs</CardTitle>
            <Badge variant="in-progress">{pendingJobs.length} active</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingJobs.slice(0, 4).map((job) => {
              const vehicle = mockVehicles.find(v => v.id === job.vehicleId);
              const service = mockServiceTypes.find(s => s.id === job.serviceTypeId);
              return (
                <div key={job.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Car className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {vehicle?.make} {vehicle?.model}
                      </p>
                      <p className="text-xs text-muted-foreground">{service?.name}</p>
                    </div>
                  </div>
                  <Badge variant={job.status === 'in_progress' ? 'in-progress' : 'pending'}>
                    {job.status === 'in_progress' ? 'In Progress' : 'Pending'}
                  </Badge>
                </div>
              );
            })}
            {pendingJobs.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No active jobs right now
              </p>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card variant="elevated">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Inventory Alerts</CardTitle>
            <Badge variant="warning">{lowStockItems.length} low</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStockItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/20">
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} left / Min: {item.minStockLevel}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Reorder
                </Button>
              </div>
            ))}
            {lowStockItems.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                All stock levels are healthy
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card variant="elevated" className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="default">+ New Service Job</Button>
          <Button variant="outline">Add Customer</Button>
          <Button variant="outline">Update Inventory</Button>
          <Button variant="outline">View Reports</Button>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
