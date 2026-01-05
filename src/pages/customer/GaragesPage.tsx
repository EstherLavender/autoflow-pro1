import { useState } from 'react';
import { MapPin, Filter } from 'lucide-react';
import CustomerLayout from '@/components/layout/CustomerLayout';
import GarageCard from '@/components/garages/GarageCard';
import GarageFilters from '@/components/garages/GarageFilters';
import { getNearbyGarages } from '@/data/mockData';
import { Garage } from '@/types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function GaragesPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<{ openNow: boolean; emergencyOnly: boolean; serviceId?: string }>({ openNow: false, emergencyOnly: false });
  
  const garages = getNearbyGarages(filters);

  const handleSelectGarage = (garage: Garage) => {
    navigate(`/customer/book?garageId=${garage.id}`);
  };

  const handleCallGarage = (garage: Garage) => {
    toast.info(`Calling ${garage.name}...`);
  };

  return (
    <CustomerLayout title="Find a Garage" subtitle="Nearby service centers">
      <div className="mb-4">
        <GarageFilters filters={filters} onFilterChange={setFilters} />
      </div>

      <div className="space-y-3">
        {garages.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium">No garages found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
          </div>
        ) : (
          garages.map((garage) => (
            <GarageCard
              key={garage.id}
              garage={garage}
              onSelect={handleSelectGarage}
              onCall={handleCallGarage}
            />
          ))
        )}
      </div>
    </CustomerLayout>
  );
}
