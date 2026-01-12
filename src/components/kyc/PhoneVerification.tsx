import { useState } from 'react';
import { Phone, Loader2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface PhoneVerificationProps {
  phone: string;
  onVerified?: () => void;
}

export default function PhoneVerification({ phone, onVerified }: PhoneVerificationProps) {
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const sendOTP = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/kyc/verify/phone/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ phone })
      });

      if (!response.ok) throw new Error('Failed to send OTP');

      const data = await response.json();
      setOtpSent(true);
      setCountdown(60);
      toast.success('OTP sent to your phone!');

      // Start countdown
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (error) {
      console.error('Send OTP error:', error);
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (otpCode.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/kyc/verify/phone/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ phone, otpCode })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Verification failed');
      }

      setIsVerified(true);
      toast.success('Phone number verified! ✓');
      
      if (onVerified) {
        onVerified();
      }

    } catch (error: any) {
      console.error('Verify OTP error:', error);
      toast.error(error.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerified) {
    return (
      <Card className="border-green-500 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-3 text-green-600">
            <CheckCircle2 className="h-6 w-6" />
            <span className="font-medium">Phone number verified</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Phone className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Verify Phone Number</CardTitle>
            <CardDescription>We'll send you a verification code</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Phone Number</Label>
          <Input
            value={phone}
            disabled
            className="bg-muted"
          />
        </div>

        {!otpSent ? (
          <Button
            onClick={sendOTP}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Verification Code'
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Enter 6-digit Code</Label>
              <Input
                type="text"
                maxLength={6}
                placeholder="000000"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                className="text-center text-2xl tracking-widest"
              />
            </div>

            <Button
              onClick={verifyOTP}
              disabled={isLoading || otpCode.length !== 6}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Code'
              )}
            </Button>

            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-sm text-muted-foreground">
                  Resend code in {countdown}s
                </p>
              ) : (
                <Button
                  variant="link"
                  onClick={sendOTP}
                  disabled={isLoading}
                  className="text-sm"
                >
                  Resend Code
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
