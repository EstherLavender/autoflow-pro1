import { useState } from 'react';
import { Loader2, Check, AlertCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StablecoinType } from '@/types';
import { exchangeRates } from '@/data/mockData';

interface PaymentConfirmationProps {
  amountKes: number;
  stablecoin: StablecoinType;
  onConfirm: () => void;
  onCancel: () => void;
}

type PaymentStatus = 'idle' | 'signing' | 'processing' | 'success' | 'failed';

export default function PaymentConfirmation({ 
  amountKes, 
  stablecoin, 
  onConfirm, 
  onCancel 
}: PaymentConfirmationProps) {
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);

  const amountUsd = amountKes / exchangeRates.usdToKes;
  const symbol = stablecoin.toUpperCase();

  const handlePayment = async () => {
    try {
      // Step 1: Sign the payment
      setStatus('signing');
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Step 2: Process via x402 facilitator
      setStatus('processing');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 3: Success
      setTxHash('0x1234...5678');
      setStatus('success');
      
      setTimeout(() => {
        onConfirm();
      }, 1500);
    } catch (error) {
      setStatus('failed');
    }
  };

  if (status === 'success') {
    return (
      <Card className="border-success/30 bg-success/5">
        <CardContent className="py-6 text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-success/20 flex items-center justify-center mx-auto">
            <Check className="h-8 w-8 text-success" />
          </div>
          <div>
            <p className="font-bold text-lg">Payment Successful!</p>
            <p className="text-sm text-muted-foreground">
              {amountUsd.toFixed(2)} {symbol} transferred
            </p>
          </div>
          {txHash && (
            <Button variant="link" size="sm" className="gap-1">
              View on Explorer
              <ExternalLink className="h-3 w-3" />
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (status === 'failed') {
    return (
      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="py-6 text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <p className="font-bold text-lg">Payment Failed</p>
            <p className="text-sm text-muted-foreground">
              Transaction was rejected or timed out
            </p>
          </div>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button onClick={() => setStatus('idle')}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === 'signing' || status === 'processing') {
    return (
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="py-6 text-center space-y-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
          <div>
            <p className="font-bold text-lg">
              {status === 'signing' ? 'Awaiting Signature...' : 'Processing Payment...'}
            </p>
            <p className="text-sm text-muted-foreground">
              {status === 'signing' 
                ? 'Please sign the transaction in your wallet' 
                : 'x402 facilitator is verifying and settling'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <CardContent className="py-5 space-y-4">
        <div className="text-center pb-4 border-b border-border">
          <p className="text-sm text-muted-foreground">You're paying</p>
          <p className="text-3xl font-bold">${amountUsd.toFixed(2)} {symbol}</p>
          <p className="text-sm text-muted-foreground">≈ KES {amountKes.toLocaleString()}</p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Network</span>
            <span className="font-medium">Avalanche C-Chain</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment Method</span>
            <span className="font-medium">x402 (Gasless)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Gas Fee</span>
            <span className="font-medium text-success">$0.00 (Sponsored)</span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="hero" className="flex-1" onClick={handlePayment}>
            Confirm Payment
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          By confirming, you authorize a gasless token transfer via ERC-3009
        </p>
      </CardContent>
    </Card>
  );
}
