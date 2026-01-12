import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Droplets, Wrench, Package, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/layout/AdminLayout';
import { EmptyState, LoadingState } from '@/components/ui/empty-state';
import { servicesAPI } from '@/lib/api';
import { toast } from 'sonner';

const categoryIcons = {
  wash: Droplets,
  detailing: Wrench,
  maintenance: Settings,
  package: Package,
};

const categoryColors = {
  wash: 'bg-blue-500/10 text-blue-600',
  detailing: 'bg-orange-500/10 text-orange-600',
  maintenance: 'bg-green-500/10 text-green-600',
  package: 'bg-purple-500/10 text-purple-600',
};

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
      await servicesAPI.delete(id);
      toast.success('Service deleted successfully');
      fetchServices();
    } catch (error) {
      toast.error('Failed to delete service');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Services" subtitle="Manage your service types and pricing">
        <LoadingState message="Loading services..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Services" subtitle="Manage your service types and pricing">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="cursor-pointer">All</Badge>
          <Badge variant="outline" className="cursor-pointer">Wash</Badge>
          <Badge variant="outline" className="cursor-pointer">Detailing</Badge>
          <Badge variant="outline" className="cursor-pointer">Maintenance</Badge>
          <Badge variant="outline" className="cursor-pointer">Packages</Badge>
        </div>
        <Button variant="default">
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      {services.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No services available"
          description="Add your first service to get started."
          actionLabel="Add Service"
          onAction={() => toast.info('Service creation coming soon')}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => {
          const Icon = categoryIcons[service.category] || Package;
          return (
            <Card key={service.id} variant="interactive">
              <CardContent className="pt-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${categoryColors[service.category] || 'bg-gray-500/10 text-gray-600'}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon-sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon-sm" 
                      className="text-destructive"
                      onClick={() => handleDelete(service.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <h3 className="font-semibold mb-1">{service.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-xl font-bold">KES {service.base_price?.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{service.duration_minutes} mins</p>
                  </div>
                  {service.is_active ? (
                    <Badge variant="accent">Active</Badge>
                  ) : (
                    <Badge variant="outline">Inactive</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        </div>
      )}
    </AdminLayout>
  );
}
