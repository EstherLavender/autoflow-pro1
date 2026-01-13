import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, ArrowRight, Loader2, Mail, FileCheck, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import KYCDocumentUpload from '@/components/kyc/KYCDocumentUpload';
import EmailVerification from '@/components/kyc/PhoneVerification';

export default function OperatorOnboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: user?.phone || '',
    email: user?.email || '',
    nationalId: '',
    inviteCode: '',
    yearsOfExperience: '',
    emergencyContact: '',
    emergencyPhone: '',
  });

  const [kycData, setKycData] = useState({
    emailVerified: false,
    idDocumentUploaded: false,
    addressDocumentUploaded: false,
    idDocumentId: '',
    addressDocumentId: ''
  });

  const totalSteps = 5;

  const validateStep = (): boolean => {
    if (step === 1) {
      if (!formData.fullName || !formData.phone || !formData.email || !formData.nationalId) {
        toast.error('Please fill in all required fields');
        return false;
      }
    }
    if (step === 2) {
      if (!kycData.emailVerified) {
        toast.error('Please verify your email address');
        return false;
      }
    }
    if (step === 3) {
      if (!kycData.idDocumentUploaded) {
        toast.error('Please upload your National ID');
        return false;
      }
    }
    if (step === 4) {
      if (!kycData.addressDocumentUploaded) {
        toast.error('Please upload proof of address');
        return false;
      }
    }
    if (step === 5) {
      if (!formData.yearsOfExperience || !formData.emergencyContact || !formData.emergencyPhone) {
        toast.error('Please fill in all work details');
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
    
    if (!formData.fullName || !formData.phone || !formData.nationalId) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // In a real app, save this to the backend
      const profile = {
        userId: user.id,
        fullName: formData.fullName,
        phone: formData.phone,
        nationalId: formData.nationalId,
        inviteCode: formData.inviteCode || undefined,
        kycCompleted: true
      };

      localStorage.setItem('operatorProfile', JSON.stringify(profile));
      
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
                ) : step === 2 ? (
                  <Phone className="h-6 w-6 text-primary" />
                ) : step === 3 || step === 4 ? (
                  <FileCheck className="h-6 w-6 text-primary" />
                ) : (
                  <Wrench className="h-6 w-6 text-primary" />
                )}
              </div>
              <div>
                <CardTitle>
                  {step === 1 ? 'Your Details' : 
                   step === 2 ? 'Verify Phone' :
                   step === 3 ? 'Upload ID' :
                   step === 4 ? 'Proof of Address' :
                   'Work Experience'}
                </CardTitle>
                <CardDescription>
                  {step === 1 
                    ? "Tell us about yourself"
                    : step === 2 
                    ? "Verify your phone number"
                    : step === 3
                    ? "Upload your National ID"
                    : step === 4
                    ? "Upload proof of address"
                    : "Your work details"
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
                    placeholder="Peter Ochieng"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
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
                    placeholder="peter@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>National ID *</Label>
                  <Input
                    placeholder="12345678"
                    value={formData.nationalId}
                    onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
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
              </div>
            )}

            {/* Step 2: Email Verification */}
            {step === 2 && (
              <div className="animate-fade-in">
                <EmailVerification 
                  email={formData.email}
                  onVerified={() => setKycData({ ...kycData, emailVerified: true })}
                />
              </div>
            )}

            {/* Step 3: ID Upload */}
            {step === 3 && (
              <div className="animate-fade-in">
                <KYCDocumentUpload
                  documentType="national_id"
                  title="National ID"
                  description="Upload clear photos of both sides"
                  requiresBackImage={true}
                  onUploadComplete={(docId) => setKycData({ ...kycData, idDocumentUploaded: true, idDocumentId: docId })}
                />
              </div>
            )}

            {/* Step 4: Proof of Address */}
            {step === 4 && (
              <div className="animate-fade-in">
                <KYCDocumentUpload
                  documentType="proof_of_address"
                  title="Proof of Address"
                  description="Upload utility bill, bank statement, or rental agreement (not older than 3 months)"
                  requiresBackImage={false}
                  onUploadComplete={(docId) => setKycData({ ...kycData, addressDocumentUploaded: true, addressDocumentId: docId })}
                />
              </div>
            )}

            {/* Step 5: Work Experience */}
            {step === 5 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label>Years of Experience *</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 3"
                    value={formData.yearsOfExperience}
                    onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Emergency Contact Name *</Label>
                  <Input
                    placeholder="Next of kin name"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Emergency Contact Phone *</Label>
                  <Input
                    placeholder="+254 712 345 678"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  />
                </div>

                <div className="bg-muted/50 p-4 rounded-lg mt-6">
                  <p className="text-sm text-muted-foreground">
                    After submitting, a car wash owner will need to approve your account before you can start working.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)} disabled={isLoading}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              
              {step < totalSteps ? (
                <Button className="flex-1" onClick={handleNext} disabled={isLoading}>
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
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Profile
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
