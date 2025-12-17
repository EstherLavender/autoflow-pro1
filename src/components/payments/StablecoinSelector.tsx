import { Check, CircleDollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/context/WalletContext';
import { StablecoinType } from '@/types';
import { exchangeRates } from '@/data/mockData';

interface StablecoinSelectorProps {
  selected: StablecoinType | null;
  onSelect: (coin: StablecoinType) => void;
  amountKes: number;
}

export default function StablecoinSelector({ selected, onSelect, amountKes }: StablecoinSelectorProps) {
  const { balance, isConnected } = useWallet();

  const coins: { type: StablecoinType; name: string; symbol: string; rate: number }[] = [
    { type: 'usdc', name: 'USD Coin', symbol: 'USDC', rate: exchangeRates.usdcToUsd },
    { type: 'usdt', name: 'Tether', symbol: 'USDT', rate: exchangeRates.usdtToUsd },
  ];

  const amountUsd = amountKes / exchangeRates.usdToKes;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Select stablecoin:</span>
        <span className="font-medium">
          ≈ ${amountUsd.toFixed(2)} USD
        </span>
      </div>

      {coins.map((coin) => {
        const walletBalance = balance[coin.type];
        const hasEnough = walletBalance >= amountUsd;
        const isSelected = selected === coin.type;

        return (
          <Card
            key={coin.type}
            variant={isSelected ? 'accent' : 'interactive'}
            className={!isConnected || !hasEnough ? 'opacity-60' : ''}
            onClick={() => isConnected && hasEnough && onSelect(coin.type)}
          >
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                  isSelected ? 'bg-accent/20' : 'bg-muted'
                }`}>
                  <CircleDollarSign className={`h-6 w-6 ${
                    coin.type === 'usdc' ? 'text-blue-500' : 'text-emerald-500'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{coin.name}</p>
                    <Badge variant="secondary">{coin.symbol}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Balance: ${walletBalance.toFixed(2)}</span>
                    {!hasEnough && isConnected && (
                      <Badge variant="destructive" className="text-xs">Insufficient</Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">${(amountUsd / coin.rate).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{coin.symbol}</p>
                </div>
                {isSelected && <Check className="h-5 w-5 text-accent shrink-0" />}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Price feed info */}
      <div className="flex items-center justify-center gap-2 py-2">
        <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
        <span className="text-xs text-muted-foreground">
          Live rates via Chainlink • 1 USD = KES {exchangeRates.usdToKes.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
