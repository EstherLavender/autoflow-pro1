import { MapPin, Clock, Star, Phone, AlertCircle, Navigation } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Garage } from '@/types';
import { mockServiceTypes } from '@/data/mockData';

interface GarageCardProps {
  garage: Garage;
  onSelect: (garage: Garage) => void;
  onCall?: (garage: Garage) => void;
}

export default function GarageCard({ garage, onSelect, onCall }: GarageCardProps) {
  const availableServices = garage.services
    .map(id => mockServiceTypes.find(s => s.id === id))
    .filter(Boolean)
    .slice(0, 3);

  return (
    <Card variant="interactive" className="overflow-hidden" onClick={() => onSelect(garage)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold truncate">{garage.name}</h3>
              {garage.emergencyCapable && (
                <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                  24/7
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">{garage.address}</span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                <span className="font-medium">{garage.rating}</span>
                <span className="text-muted-foreground">({garage.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Navigation className="h-3.5 w-3.5" />
                <span>{garage.distance?.toFixed(1)} km</span>
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <Badge variant={garage.isOpen ? 'success' : 'secondary'}>
              {garage.isOpen ? 'Open' : 'Closed'}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              {garage.operatingHours.open} - {garage.operatingHours.close}
            </p>
          </div>
        </div>

        {/* Services */}
        <div className="flex flex-wrap gap-1 mt-3">
          {availableServices.map(service => (
            <Badge key={service!.id} variant="outline" className="text-xs">
              {service!.name}
            </Badge>
          ))}
          {garage.services.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{garage.services.length - 3} more
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onCall?.(garage);
            }}
          >
            <Phone className="h-4 w-4 mr-1" />
            Call
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(garage);
            }}
          >
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
