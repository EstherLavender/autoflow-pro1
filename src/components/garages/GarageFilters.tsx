import { Filter, Clock, AlertCircle, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface GarageFiltersProps {
  filters: {
    openNow: boolean;
    emergencyOnly: boolean;
    serviceId?: string;
  };
  onFilterChange: (filters: GarageFiltersProps['filters']) => void;
}

export default function GarageFilters({ filters, onFilterChange }: GarageFiltersProps) {
  const toggleFilter = (key: 'openNow' | 'emergencyOnly') => {
    onFilterChange({
      ...filters,
      [key]: !filters[key],
    });
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => toggleFilter('openNow')}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap",
          filters.openNow
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        )}
      >
        <Clock className="h-3.5 w-3.5" />
        Open Now
      </button>
      
      <button
        onClick={() => toggleFilter('emergencyOnly')}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap",
          filters.emergencyOnly
            ? "bg-destructive text-destructive-foreground"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        )}
      >
        <AlertCircle className="h-3.5 w-3.5" />
        Emergency
      </button>
      
      <button
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-all whitespace-nowrap"
      >
        <Wrench className="h-3.5 w-3.5" />
        Service Type
      </button>
    </div>
  );
}
