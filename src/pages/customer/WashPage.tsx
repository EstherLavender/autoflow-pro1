import { useState } from 'react';
import { Droplets, Home, Building, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CustomerLayout from '@/components/layout/CustomerLayout';
import MobileProviderCard from '@/components/mobile/MobileProviderCard';
import { mockServiceTypes, getAvailableMobileProviders, getNearbyGarages } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

type WashOption = 'mobile' | 'physical';

export default function WashPage() {
  const navigate = useNavigate();
  const [washOption, setWashOption] = useState<WashOption | null>(null);
  
  const washServices = mockServiceTypes.filter(s => s.category === 'wash' || s.category === 'detailing');
  const mobileServices = washServices.filter(s => s.mobileAvailable);
  const mobileProviders = getAvailableMobileProviders();
  const carWashGarages = getNearbyGarages({ serviceId: '1' });

  return (
    <CustomerLayout title="Wash My Car" subtitle="Choose how you want your car cleaned">
      {!washOption ? (
        <div className="space-y-4">
          <Card 
            variant="interactive"
            className="cursor-pointer"
            onClick={() => setWashOption('mobile')}
          >
            <CardContent className="py-6">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Home className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Mobile Detailing</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    We come to you! Get your car washed at home or work.
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-primary font-medium">
                      {mobileProviders.length} detailers available
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      From KES {Math.min(...mobileServices.map(s => s.price)).toLocaleString()}
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card 
            variant="interactive"
            className="cursor-pointer"
            onClick={() => setWashOption('physical')}
          >
            <CardContent className="py-6">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <Building className="h-7 w-7 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Car Wash Location</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Drive to a nearby car wash for quick service.
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-accent font-medium">
                      {carWashGarages.length} locations nearby
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      From KES 500
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : washOption === 'mobile' ? (
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => setWashOption(null)} className="mb-2">
            ← Back
          </Button>
          <h3 className="font-semibold">Available Mobile Detailers</h3>
          {mobileProviders.map((provider) => (
            <MobileProviderCard
              key={provider.id}
              provider={provider}
              onSelect={() => navigate(`/customer/book?mobileProviderId=${provider.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => setWashOption(null)} className="mb-2">
            ← Back
          </Button>
          <h3 className="font-semibold">Nearby Car Washes</h3>
          <p className="text-sm text-muted-foreground">
            Select a location to book your wash
          </p>
          <Button 
            variant="default" 
            className="w-full" 
            onClick={() => navigate('/customer/garages?service=wash')}
          >
            View All Car Wash Locations
          </Button>
        </div>
      )}
    </CustomerLayout>
  );
}
