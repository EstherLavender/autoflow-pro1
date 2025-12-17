import { useState } from 'react';
import { Plus, Edit, Trash2, Droplets, Wrench, Package, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/layout/AdminLayout';
import { mockServiceTypes } from '@/data/mockData';

const categoryIcons = {
  wash: Droplets,
  repair: Wrench,
  maintenance: Settings,
  package: Package,
};

const categoryColors = {
  wash: 'bg-blue-500/10 text-blue-600',
  repair: 'bg-orange-500/10 text-orange-600',
  maintenance: 'bg-green-500/10 text-green-600',
  package: 'bg-purple-500/10 text-purple-600',
};

export default function ServicesPage() {
  const [services] = useState(mockServiceTypes);

  return (
    <AdminLayout title="Services" subtitle="Manage your service types and pricing">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="cursor-pointer">All</Badge>
          <Badge variant="outline" className="cursor-pointer">Wash</Badge>
          <Badge variant="outline" className="cursor-pointer">Repair</Badge>
          <Badge variant="outline" className="cursor-pointer">Maintenance</Badge>
          <Badge variant="outline" className="cursor-pointer">Packages</Badge>
        </div>
        <Button variant="default">
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => {
          const Icon = categoryIcons[service.category];
          return (
            <Card key={service.id} variant="interactive">
              <CardContent className="pt-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${categoryColors[service.category]}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon-sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <h3 className="font-semibold mb-1">{service.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-xl font-bold">KES {service.price.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{service.duration} mins</p>
                  </div>
                  <Badge variant="accent">+{service.loyaltyPoints} pts</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AdminLayout>
  );
}
