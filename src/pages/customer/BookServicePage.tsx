import { useState, useEffect } from 'react';
import { Car, Droplets, Wrench, Settings, Package, Check, Smartphone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CustomerLayout from '@/components/layout/CustomerLayout';
import { EmptyState, LoadingState } from '@/components/ui/empty-state';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/Supabase';
import { toast } from 'sonner';

const categoryIcons = {
  wash: Droplets,
  repair: Wrench,
  maintenance: Settings,
  package: Package,
};

type BookingStep = 'vehicle' | 'service' | 'payment' | 'confirm';

export default function BookServicePage() {
  const { user } = useAuth();
  const [step, setStep] = useState<BookingStep>('vehicle');
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [vehiclesRes, servicesRes] = await Promise.all([
        supabase.from('vehicles').select('*').eq('customer_id', user?.id),
        supabase.from('services').select('*').order('name')
      ]);
      
      if (vehiclesRes.error) throw vehiclesRes.error;
      if (servicesRes.error) throw servicesRes.error;
      
      setVehicles(vehiclesRes.data || []);
      setServices(servicesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load booking data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const vehicle = vehicles.find(v => v.id === selectedVehicle);
  const service = services.find(s => s.id === selectedService);

  const handleConfirm = () => {
    toast.success('Service booked successfully! M-Pesa prompt sent to ' + phone);
    resetBooking();
  };

  const resetBooking = () => {
    setStep('vehicle');
    setSelectedVehicle(null);
    setSelectedService(null);
    setPhone('');
  };

  if (isLoading) {
    return (
      <CustomerLayout title="Book a Service" subtitle="Schedule your next car wash">
        <LoadingState message="Loading..." />
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout title="Book a Service" subtitle="Schedule your next car wash">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {(['vehicle', 'service', 'payment', 'confirm'] as BookingStep[]).map((s, i) => (
          <div 
            key={s} 
            className={`flex items-center gap-2 ${i > 0 ? 'ml-2' : ''}`}
          >
            {i > 0 && <div className="w-8 h-0.5 bg-border" />}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              step === s 
                ? 'bg-primary text-primary-foreground' 
                : s === 'vehicle' && selectedVehicle || 
                  s === 'service' && selectedService ||
                  s === 'payment' && phone
                ? 'bg-success/10 text-success'
                : 'bg-muted text-muted-foreground'
            }`}>
              {s === 'vehicle' && selectedVehicle || 
               s === 'service' && selectedService ||
               s === 'payment' && phone ? (
                <Check className="h-4 w-4" />
              ) : (
                <span>{i + 1}</span>
              )}
              <span className="capitalize hidden sm:inline">{s}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Step: Vehicle */}
      {step === 'vehicle' && (
        <div className="space-y-4 animate-slide-up">
          <h2 className="text-lg font-semibold">Select Your Vehicle</h2>
          <div className="grid gap-3">
            {vehicles.map((v) => (
              <Card 
                key={v.id}
                variant={selectedVehicle === v.id ? 'accent' : 'interactive'}
                onClick={() => setSelectedVehicle(v.id)}
              >
                <CardContent className="py-4">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                      selectedVehicle === v.id ? 'bg-accent/20' : 'bg-muted'
                    }`}>
                      <Car className={`h-6 w-6 ${selectedVehicle === v.id ? 'text-accent' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{v.make} {v.model}</p>
                      <p className="text-sm text-muted-foreground">{v.licensePlate} • {v.color}</p>
                    </div>
                    {selectedVehicle === v.id && (
                      <Check className="h-5 w-5 text-accent" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button 
            variant="hero" 
            className="w-full" 
            disabled={!selectedVehicle}
            onClick={() => setStep('service')}
          >
            Continue
          </Button>
        </div>
      )}

      {/* Step: Service */}
      {step === 'service' && (
        <div className="space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Choose Service</h2>
            <Button variant="ghost" size="sm" onClick={() => setStep('vehicle')}>
              Change vehicle
            </Button>
          </div>
          <div className="grid gap-3">
            {services.map((s) => {
              const Icon = categoryIcons[s.category];
              return (
                <Card 
                  key={s.id}
                  variant={selectedService === s.id ? 'accent' : 'interactive'}
                  onClick={() => setSelectedService(s.id)}
                >
                  <CardContent className="py-4">
                    <div className="flex items-start gap-4">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${
                        selectedService === s.id ? 'bg-accent/20' : 'bg-muted'
                      }`}>
                        <Icon className={`h-6 w-6 ${selectedService === s.id ? 'text-accent' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold">{s.name}</p>
                            <p className="text-sm text-muted-foreground">{s.description}</p>
                          </div>
                          {selectedService === s.id && (
                            <Check className="h-5 w-5 text-accent shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="font-bold">KES {s.price.toLocaleString()}</span>
                          <Badge variant="secondary">{s.duration} min</Badge>
                          <Badge variant="accent">+{s.loyaltyPoints} pts</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <Button 
            variant="hero" 
            className="w-full" 
            disabled={!selectedService}
            onClick={() => setStep('payment')}
          >
            Continue
          </Button>
        </div>
      )}

      {/* Step: Payment - M-Pesa Only */}
      {step === 'payment' && (
        <div className="space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Payment (M-Pesa)</h2>
            <Button variant="ghost" size="sm" onClick={() => setStep('service')}>
              Change service
            </Button>
          </div>

          <Card className="bg-muted/50">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Service</p>
                  <p className="font-semibold">{service?.name}</p>
                </div>
                <p className="text-2xl font-bold">KES {service?.price.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card variant="accent">
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-success/20">
                  <Smartphone className="h-6 w-6 text-success" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">M-Pesa</p>
                  <p className="text-sm text-muted-foreground">Pay with mobile money</p>
                </div>
                <Check className="h-5 w-5 text-success" />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label>M-Pesa Phone Number</Label>
            <Input 
              type="tel" 
              placeholder="+254 712 345 678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">You'll receive an STK push to confirm payment</p>
          </div>

          <Button 
            variant="hero" 
            className="w-full" 
            disabled={!phone}
            onClick={() => setStep('confirm')}
          >
            Continue to Confirm
          </Button>
        </div>
      )}

      {/* Step: Confirm */}
      {step === 'confirm' && (
        <div className="space-y-4 animate-slide-up">
          <h2 className="text-lg font-semibold">Confirm Booking</h2>

          <Card variant="elevated">
            <CardContent className="py-5 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Vehicle</p>
                  <p className="font-semibold">{vehicle?.make} {vehicle?.model}</p>
                  <p className="text-sm text-muted-foreground">{vehicle?.licensePlate}</p>
                </div>
                <Car className="h-8 w-8 text-muted-foreground" />
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Service</p>
                  <p className="font-semibold">{service?.name}</p>
                  <p className="text-sm text-muted-foreground">{service?.duration} min • +{service?.loyaltyPoints} pts</p>
                </div>
                {service && categoryIcons[service.category] && 
                  (() => { const Icon = categoryIcons[service.category]; return <Icon className="h-8 w-8 text-muted-foreground" />; })()
                }
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Payment</p>
                  <p className="font-semibold">M-Pesa</p>
                  <p className="text-sm text-muted-foreground">{phone}</p>
                </div>
                <p className="text-2xl font-bold">KES {service?.price.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep('payment')}>
              Back
            </Button>
            <Button variant="hero" className="flex-1" onClick={handleConfirm}>
              Confirm & Pay
            </Button>
          </div>
        </div>
      )}
    </CustomerLayout>
  );
}
