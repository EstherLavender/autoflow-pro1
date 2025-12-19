import { useState } from 'react';
import { Heart, Wallet, Phone, Check, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TipPromptProps {
  recipientName: string;
  recipientType: 'operator' | 'mobile_provider';
  onTipComplete: (amount: number, method: 'mpesa' | 'x402') => void;
  onSkip: () => void;
}

const tipPresets = [50, 100, 200, 500];

export default function TipPrompt({ recipientName, recipientType, onTipComplete, onSkip }: TipPromptProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(100);
  const [customAmount, setCustomAmount] = useState('');
  const [tipMethod, setTipMethod] = useState<'mpesa' | 'x402'>('mpesa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [tipSent, setTipSent] = useState(false);

  const amount = customAmount ? parseInt(customAmount) : selectedAmount;

  const handleTip = async () => {
    if (!amount || amount <= 0) return;
    
    setIsProcessing(true);
    // Simulate tip processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setTipSent(true);
    toast.success(`Tip of KES ${amount} sent to ${recipientName}!`);
    
    setTimeout(() => {
      onTipComplete(amount, tipMethod);
    }, 1500);
  };

  if (tipSent) {
    return (
      <Card variant="elevated" className="text-center">
        <CardContent className="py-8">
          <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-success" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Thank You!</h3>
          <p className="text-muted-foreground">
            Your tip has been sent to {recipientName}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <CardHeader className="text-center pb-2">
        <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2">
          <Heart className="h-7 w-7 text-accent" />
        </div>
        <CardTitle className="text-lg">Say Thanks to {recipientName}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Show your appreciation with a tip. It goes directly to them.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Preset Amounts */}
        <div className="grid grid-cols-4 gap-2">
          {tipPresets.map((preset) => (
            <button
              key={preset}
              onClick={() => {
                setSelectedAmount(preset);
                setCustomAmount('');
              }}
              className={cn(
                "py-3 rounded-lg text-sm font-semibold transition-all",
                selectedAmount === preset && !customAmount
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              KES {preset}
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
            KES
          </span>
          <Input
            type="number"
            placeholder="Custom amount"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setSelectedAmount(null);
            }}
            className="pl-12"
          />
        </div>

        {/* Payment Method */}
        <div className="flex gap-2">
          <button
            onClick={() => setTipMethod('mpesa')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all",
              tipMethod === 'mpesa'
                ? "bg-success/10 border-2 border-success text-success"
                : "bg-muted border-2 border-transparent"
            )}
          >
            <Phone className="h-4 w-4" />
            M-Pesa
          </button>
          <button
            onClick={() => setTipMethod('x402')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all",
              tipMethod === 'x402'
                ? "bg-primary/10 border-2 border-primary text-primary"
                : "bg-muted border-2 border-transparent"
            )}
          >
            <Wallet className="h-4 w-4" />
            Stablecoin
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="ghost" className="flex-1" onClick={onSkip}>
            Maybe Later
          </Button>
          <Button 
            variant="hero" 
            className="flex-1" 
            onClick={handleTip}
            disabled={!amount || amount <= 0 || isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              `Send KES ${amount || 0}`
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
