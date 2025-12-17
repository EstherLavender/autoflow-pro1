import { useState } from 'react';
import { Car, Droplets, Wrench, Settings, Package, Check, Smartphone, Wallet, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CustomerLayout from '@/components/layout/CustomerLayout';
import { mockServiceTypes, mockVehicles } from '@/data/mockData';
import { toast } from 'sonner';

const categoryIcons = {
  wash: Droplets,
  repair: Wrench,
  maintenance: Settings,
  package: Package,
};

type BookingStep = 'vehicle' | 'service' | 'payment' | 'confirm';

export default function BookServicePage() {
  const [step, setStep] = useState<BookingStep>('vehicle');
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'x402' | null>(null);
  const [phone, setPhone] = useState('');

  const vehicles = mockVehicles.filter(v => v.customerId === '3');
  const services = mockServiceTypes;
  
  const vehicle = vehicles.find(v => v.id === selectedVehicle);
  const service = services.find(s => s.id === selectedService);

  const handleConfirm = () => {
    toast.success('Service booked successfully!');
    // Reset
    setStep('vehicle');
    setSelectedVehicle(null);
    setSelectedService(null);
    setPaymentMethod(null);
  };

  return (
    <CustomerLayout title="Book a Service" subtitle="Schedule your next car service">
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
                  s === 'payment' && paymentMethod
                ? 'bg-success/10 text-success'
                : 'bg-muted text-muted-foreground'
            }`}>
              {s === 'vehicle' && selectedVehicle || 
               s === 'service' && selectedService ||
               s === 'payment' && paymentMethod ? (
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

      {/* Step: Payment */}
      {step === 'payment' && (
        <div className="space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Payment Method</h2>
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

          <div className="grid gap-3">
            <Card 
              variant={paymentMethod === 'mpesa' ? 'accent' : 'interactive'}
              onClick={() => setPaymentMethod('mpesa')}
            >
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                    paymentMethod === 'mpesa' ? 'bg-success/20' : 'bg-muted'
                  }`}>
                    <Smartphone className={`h-6 w-6 ${paymentMethod === 'mpesa' ? 'text-success' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">M-Pesa</p>
                    <p className="text-sm text-muted-foreground">Pay with mobile money</p>
                  </div>
                  {paymentMethod === 'mpesa' && <Check className="h-5 w-5 text-success" />}
                </div>
              </CardContent>
            </Card>

            <Card 
              variant={paymentMethod === 'x402' ? 'accent' : 'interactive'}
              onClick={() => setPaymentMethod('x402')}
            >
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                    paymentMethod === 'x402' ? 'bg-primary/20' : 'bg-muted'
                  }`}>
                    <Wallet className={`h-6 w-6 ${paymentMethod === 'x402' ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">X402 Payment</p>
                    <p className="text-sm text-muted-foreground">Internet-native payment</p>
                  </div>
                  {paymentMethod === 'x402' && <Check className="h-5 w-5 text-primary" />}
                </div>
              </CardContent>
            </Card>
          </div>

          {paymentMethod === 'mpesa' && (
            <div className="space-y-2 animate-fade-in">
              <Label>M-Pesa Phone Number</Label>
              <Input 
                type="tel" 
                placeholder="+254 712 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          )}

          <Button 
            variant="hero" 
            className="w-full" 
            disabled={!paymentMethod || (paymentMethod === 'mpesa' && !phone)}
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
                  <p className="font-semibold">{paymentMethod === 'mpesa' ? 'M-Pesa' : 'X402'}</p>
                  {paymentMethod === 'mpesa' && <p className="text-sm text-muted-foreground">{phone}</p>}
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
