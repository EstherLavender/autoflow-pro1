import { Wallet, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWallet } from '@/context/WalletContext';

export default function WalletConnect() {
  const { address, isConnected, isConnecting, connect, disconnect, isCorrectNetwork, switchNetwork } = useWallet();

  if (isConnecting) {
    return (
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
            <div>
              <p className="font-semibold">Connecting Wallet...</p>
              <p className="text-sm text-muted-foreground">Please approve in your wallet</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isConnected && !isCorrectNetwork) {
    return (
      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-warning/20 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="font-semibold">Wrong Network</p>
                <p className="text-sm text-muted-foreground">Please switch to Avalanche</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => switchNetwork(43114)}>
              Switch Network
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isConnected) {
    return (
      <Card className="border-success/30 bg-success/5">
        <CardContent className="py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-success/20 flex items-center justify-center">
                <Check className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="font-semibold">Wallet Connected</p>
                <p className="text-sm text-muted-foreground font-mono">{address}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={disconnect}>
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="interactive" className="cursor-pointer" onClick={connect}>
      <CardContent className="py-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">Connect Wallet</p>
            <p className="text-sm text-muted-foreground">WalletConnect or MetaMask</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
