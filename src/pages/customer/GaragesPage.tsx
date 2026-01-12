import { useState, useEffect } from 'react';
import { MapPin, Filter } from 'lucide-react';
import CustomerLayout from '@/components/layout/CustomerLayout';
import GarageCard from '@/components/garages/GarageCard';
import GarageFilters from '@/components/garages/GarageFilters';
import { EmptyState, LoadingState } from '@/components/ui/empty-state';
import { supabase } from '@/lib/Supabase';
import { Garage } from '@/types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function GaragesPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<{ openNow: boolean; emergencyOnly: boolean; serviceId?: string }>({ openNow: false, emergencyOnly: false });
  const [garages, setGarages] = useState<Garage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGarages();
  }, [filters]);

  const fetchGarages = async () => {
    try {
      let query = supabase.from('garages').select('*');
      
      if (filters.openNow) {
        query = query.eq('is_open', true);
      }
      
      const { data, error } = await query.order('distance');
      if (error) throw error;
      setGarages(data || []);
    } catch (error) {
      console.error('Error fetching garages:', error);
      toast.error('Failed to load garages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectGarage = (garage: Garage) => {
    navigate(`/customer/book?garageId=${garage.id}`);
  };

  const handleCallGarage = (garage: Garage) => {
    toast.info(`Calling ${garage.name}...`);
  };

  if (isLoading) {
    return (
      <CustomerLayout title="Find a Garage" subtitle="Nearby service centers">
        <LoadingState message="Loading garages..." />
      </CustomerLayout>
    );
  }

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
