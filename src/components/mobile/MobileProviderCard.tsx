import { Star, Clock, MapPin, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MobileProvider } from '@/types';
import { mockServiceTypes } from '@/data/mockData';

interface MobileProviderCardProps {
  provider: MobileProvider;
  onSelect: (provider: MobileProvider) => void;
}

export default function MobileProviderCard({ provider, onSelect }: MobileProviderCardProps) {
  const availableServices = provider.services
    .map(id => mockServiceTypes.find(s => s.id === id))
    .filter(Boolean)
    .slice(0, 3);

  return (
    <Card variant="interactive" onClick={() => onSelect(provider)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {provider.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{provider.name}</h3>
              <Badge variant={provider.isAvailable ? 'success' : 'secondary'} className="text-xs">
                {provider.isAvailable ? 'Available' : 'Busy'}
              </Badge>
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                <span className="font-medium text-foreground">{provider.rating}</span>
              </div>
              {provider.eta && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{provider.eta} min</span>
                </div>
              )}
            </div>

            {/* Service Areas */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{provider.serviceArea.slice(0, 2).join(', ')}</span>
            </div>

            {/* Services */}
            <div className="flex flex-wrap gap-1">
              {availableServices.map(service => (
                <Badge key={service!.id} variant="outline" className="text-xs">
                  {service!.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Action */}
        <Button 
          variant="default" 
          size="sm" 
          className="w-full mt-4"
          disabled={!provider.isAvailable}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(provider);
          }}
        >
          {provider.isAvailable ? (
            <>Book Now • ETA {provider.eta} min</>
          ) : (
            'Currently Unavailable'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
