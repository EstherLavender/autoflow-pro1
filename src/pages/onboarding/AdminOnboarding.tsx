import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, Trash2, ArrowRight, ArrowLeft, Loader2, User, Mail, FileCheck, Briefcase, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import KYCDocumentUpload from '@/components/kyc/KYCDocumentUpload';
import EmailVerification from '@/components/kyc/PhoneVerification';

export default function AdminOnboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: user?.phone || '',
    email: user?.email || '',
    nationalId: '',
    numberOfCarWashes: 1,
    walletAddress: '',
    businessName: '',
    businessRegistrationNumber: '',
    taxIdentificationNumber: '',
    numberOfEmployees: '',
    bankAccountName: '',
    bankAccountNumber: '',
    bankName: '',
  });

  const [carWashes, setCarWashes] = useState<Omit<CarWashBusiness, 'id'>[]>([
    { name: '', location: '', address: '', services: [] }
  ]);

  const [kycData, setKycData] = useState({
    emailVerified: false,
    idDocumentUploaded: false,
    businessLicenseUploaded: false,
    taxCertificateUploaded: false,
    idDocumentId: '',
    businessLicenseId: '',
    taxCertificateId: ''
  });

  const totalSteps = 7;

  const addCarWash = () => {
    setCarWashes([...carWashes, { name: '', location: '', address: '', services: [] }]);
  };

  const removeCarWash = (index: number) => {
    if (carWashes.length > 1) {
      setCarWashes(carWashes.filter((_, i) => i !== index));
    }
  };

  const updateCarWash = (index: number, field: keyof Omit<CarWashBusiness, 'id'>, value: string | string[]) => {
    const updated = [...carWashes];
    updated[index] = { ...updated[index], [field]: value };
    setCarWashes(updated);
  };

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
      if (!formData.businessName || !formData.businessRegistrationNumber || !formData.taxIdentificationNumber) {
        toast.error('Please fill in all business details');
        return false;
      }
    }
    if (step === 5) {
      if (!kycData.businessLicenseUploaded || !kycData.taxCertificateUploaded) {
        toast.error('Please upload all required business documents');
        return false;
      }
    }
    if (step === 6) {
      const hasInvalid = carWashes.some(cw => !cw.name || !cw.location || !cw.address);
      if (hasInvalid) {
        toast.error('Please fill in all car wash details');
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
    
    setIsLoading(true);
    
    try {
      // In a real app, save this to the backend
      const profile = {
        userId: user.id,
        fullName: formData.fullName,
        phone: formData.phone,
        nationalId: formData.nationalId,
        numberOfCarWashes: carWashes.length,
        walletAddress: formData.walletAddress || undefined,
        carWashes: carWashes.map((cw, i) => ({
          ...cw,
          id: `cw-${Date.now()}-${i}`,
        })),
        kycCompleted: true
      };

      localStorage.setItem('adminProfile', JSON.stringify(profile));
      
      toast.success('Profile completed! Awaiting approval.');
      navigate('/pending-approval');
    } catch (error) {
      toast.error('Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--gradient-hero)' }}>
      <div className="w-full max-w-lg">
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
                ) : step === 3 ? (
                  <FileCheck className="h-6 w-6 text-primary" />
                ) : step === 4 || step === 5 ? (
                  <Briefcase className="h-6 w-6 text-primary" />
                ) : step === 6 ? (
                  <Building2 className="h-6 w-6 text-primary" />
                ) : (
                  <CreditCard className="h-6 w-6 text-primary" />
                )}
              </div>
              <div>
                <CardTitle>Car Wash Owner Setup</CardTitle>
                <CardDescription>
                  {step === 1 && 'Personal Information'}
                  {step === 2 && 'Verify Phone Number'}
                  {step === 3 && 'Upload National ID'}
                  {step === 4 && 'Business Details'}
                  {step === 5 && 'Business Documents'}
                  {step === 6 && 'Car Wash Locations'}
                  {step === 7 && 'Review & Submit'}
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
                    placeholder="John Mwangi"
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
                  <Label>National ID *</Label>
                  <Input
                    placeholder="12345678"
                    value={formData.nationalId}
                    onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>M-Pesa Till/Paybill (Optional)</Label>
                  <Input
                    placeholder="e.g. 123456"
                    value={formData.walletAddress}
                    onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Phone Verification */}
            {step === 2 && (
              <div className="animate-fade-in">
                <PhoneVerification 
                  phone={formData.phone}
                  onVerified={() => setKycData({ ...kycData, phoneVerified: true })}
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

            {/* Step 4: Business Details */}
            {step === 4 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label>Business Name *</Label>
                  <Input
                    placeholder="e.g. Track Wash Limited"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Business Registration Number *</Label>
                  <Input
                    placeholder="e.g. PVT-ABCD1234"
                    value={formData.businessRegistrationNumber}
                    onChange={(e) => setFormData({ ...formData, businessRegistrationNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tax Identification Number (KRA PIN) *</Label>
                  <Input
                    placeholder="e.g. A001234567X"
                    value={formData.taxIdentificationNumber}
                    onChange={(e) => setFormData({ ...formData, taxIdentificationNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Number of Employees</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 5"
                    value={formData.numberOfEmployees}
                    onChange={(e) => setFormData({ ...formData, numberOfEmployees: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Step 5: Business Documents */}
            {step === 5 && (
              <div className="space-y-6 animate-fade-in">
                <KYCDocumentUpload
                  documentType="business_license"
                  title="Business License"
                  description="Upload your business registration certificate"
                  requiresBackImage={false}
                  onUploadComplete={(docId) => setKycData({ ...kycData, businessLicenseUploaded: true, businessLicenseId: docId })}
                />
                
                <KYCDocumentUpload
                  documentType="tax_certificate"
                  title="Tax Compliance Certificate"
                  description="Upload your KRA Tax Compliance Certificate"
                  requiresBackImage={false}
                  onUploadComplete={(docId) => setKycData({ ...kycData, taxCertificateUploaded: true, taxCertificateId: docId })}
                />
              </div>
            )}

            {/* Step 6: Car Washes */}
            {step === 6 && (
              <div className="space-y-4 animate-fade-in">
                {carWashes.map((cw, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Car Wash #{index + 1}</span>
                      {carWashes.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeCarWash(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Car Wash Name *</Label>
                      <Input
                        placeholder="e.g. Track Wash Westlands"
                        value={cw.name}
                        onChange={(e) => updateCarWash(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location/Area *</Label>
                      <Input
                        placeholder="e.g. Westlands, Nairobi"
                        value={cw.location}
                        onChange={(e) => updateCarWash(index, 'location', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Full Address *</Label>
                      <Input
                        placeholder="e.g. Waiyaki Way, Next to Sarit Centre"
                        value={cw.address}
                        onChange={(e) => updateCarWash(index, 'address', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={addCarWash}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Car Wash
                </Button>
              </div>
            )}

            {/* Step 7: Review */}
            {step === 7 && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                  <h4 className="font-medium">Personal Information</h4>
                  <div className="text-sm space-y-1">
                    <p><span className="text-muted-foreground">Name:</span> {formData.fullName}</p>
                    <p><span className="text-muted-foreground">Phone:</span> {formData.phone} ✓</p>
                    <p><span className="text-muted-foreground">National ID:</span> {formData.nationalId} ✓</p>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                  <h4 className="font-medium">Business Information</h4>
                  <div className="text-sm space-y-1">
                    <p><span className="text-muted-foreground">Business Name:</span> {formData.businessName}</p>
                    <p><span className="text-muted-foreground">Registration No:</span> {formData.businessRegistrationNumber}</p>
                    <p><span className="text-muted-foreground">KRA PIN:</span> {formData.taxIdentificationNumber}</p>
                    <p className="text-green-600">✓ Business License Uploaded</p>
                    <p className="text-green-600">✓ Tax Certificate Uploaded</p>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                  <h4 className="font-medium">Car Wash Locations ({carWashes.length})</h4>
                  {carWashes.map((cw, i) => (
                    <div key={i} className="text-sm border-l-2 border-primary pl-3">
                      <p className="font-medium">{cw.name}</p>
                      <p className="text-muted-foreground">{cw.location}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-warning/10 border border-warning/20 p-4 rounded-lg">
                  <p className="text-sm text-warning-foreground">
                    ⚠️ Your application will be reviewed by our team. This usually takes 24-48 hours. You'll be notified once approved.
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
                      Submit for Approval
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
