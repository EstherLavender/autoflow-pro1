import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, User, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { CustomerProfile, CustomerVehicle } from '@/types/auth';
import { toast } from 'sonner';

export default function CustomerOnboarding() {
  const navigate = useNavigate();
  const { user, updateProfile, completeOnboarding } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: user?.phone || '',
    email: user?.email || '',
  });

  const [vehicle, setVehicle] = useState<Omit<CustomerVehicle, 'id'>>({
    numberPlate: '',
    carModel: '',
    color: '',
  });

  const totalSteps = 2;

  const validateStep = (): boolean => {
    if (step === 1) {
      if (!formData.fullName || !formData.phone || !formData.email) {
        toast.error('Please fill in all fields');
        return false;
      }
    }
    if (step === 2) {
      if (!vehicle.numberPlate || !vehicle.carModel || !vehicle.color) {
        toast.error('Please fill in all vehicle details');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!validateStep()) return;
    
    setIsLoading(true);
    
    try {
      const profile: CustomerProfile = {
        userId: user.id,
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        vehicles: [
          {
            ...vehicle,
            id: `v-${Date.now()}`,
          },
        ],
      };

      updateProfile(profile);
      completeOnboarding();
      
      toast.success('Welcome to Track Wash! 🎉');
      navigate('/customer');
    } catch (error) {
      toast.error('Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--gradient-hero)' }}>
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}% complete</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                {step === 1 ? (
                  <User className="h-6 w-6 text-primary" />
                ) : (
                  <Car className="h-6 w-6 text-primary" />
                )}
              </div>
              <div>
                <CardTitle>
                  {step === 1 ? 'Your Details' : 'Add Your Vehicle'}
                </CardTitle>
                <CardDescription>
                  {step === 1 
                    ? "Let's get to know you"
                    : "Tell us about your car"
                  }
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    placeholder="Mary Wanjiku"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number (M-Pesa) *</Label>
                  <Input
                    placeholder="+254 712 345 678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Address *</Label>
                  <Input
                    type="email"
                    placeholder="mary@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Vehicle */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label>Number Plate *</Label>
                  <Input
                    placeholder="e.g. KDA 123A"
                    value={vehicle.numberPlate}
                    onChange={(e) => setVehicle({ ...vehicle, numberPlate: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Car Model *</Label>
                  <Input
                    placeholder="e.g. Toyota Camry 2020"
                    value={vehicle.carModel}
                    onChange={(e) => setVehicle({ ...vehicle, carModel: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Color *</Label>
                  <Input
                    placeholder="e.g. Silver"
                    value={vehicle.color}
                    onChange={(e) => setVehicle({ ...vehicle, color: e.target.value })}
                  />
                </div>
                
                <div className="bg-success/10 border border-success/20 p-4 rounded-lg">
                  <p className="text-sm text-success-foreground">
                    ✨ You can add more vehicles later from your dashboard
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              
              {step < totalSteps ? (
                <Button className="flex-1" onClick={handleNext}>
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  className="flex-1" 
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Start Using Track Wash
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
