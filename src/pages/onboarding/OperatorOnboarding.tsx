import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { OperatorProfile } from '@/types/auth';
import { toast } from 'sonner';

export default function OperatorOnboarding() {
  const navigate = useNavigate();
  const { user, updateProfile, completeOnboarding } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: user?.phone || '',
    nationalId: '',
    inviteCode: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    if (!formData.fullName || !formData.phone || !formData.nationalId) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const profile: OperatorProfile = {
        userId: user.id,
        fullName: formData.fullName,
        phone: formData.phone,
        nationalId: formData.nationalId,
        inviteCode: formData.inviteCode || undefined,
      };

      updateProfile(profile);
      completeOnboarding();
      
      toast.success('Profile completed! Awaiting admin approval.');
      navigate('/pending-approval');
    } catch (error) {
      toast.error('Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--gradient-hero)' }}>
      <div className="w-full max-w-md">
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Wrench className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Detailer Setup</CardTitle>
                <CardDescription>Complete your profile to start working</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input
                  placeholder="Peter Ochieng"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Phone Number *</Label>
                <Input
                  placeholder="+254 712 345 678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>National ID *</Label>
                <Input
                  placeholder="12345678"
                  value={formData.nationalId}
                  onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Invite Code (Optional)</Label>
                <Input
                  placeholder="Enter code from car wash owner"
                  value={formData.inviteCode}
                  onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  If you were invited by a car wash owner, enter their code here
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg mt-6">
                <p className="text-sm text-muted-foreground">
                  After submitting, a car wash owner will need to approve your account before you can start working.
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Submit Profile
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
