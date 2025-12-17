import { createContext, useContext, useState, ReactNode } from 'react';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: number | null;
  balance: {
    usdc: number;
    usdt: number;
  };
}

interface WalletContextType extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
  isCorrectNetwork: boolean;
}

const AVALANCHE_CHAIN_ID = 43114;

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    chainId: null,
    balance: { usdc: 0, usdt: 0 },
  });

  // Mock wallet connection (will be replaced with Thirdweb)
  const connect = async () => {
    setWallet(prev => ({ ...prev, isConnecting: true }));
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock connected wallet
    setWallet({
      address: '0x1234...abcd',
      isConnected: true,
      isConnecting: false,
      chainId: AVALANCHE_CHAIN_ID,
      balance: {
        usdc: 150.00,
        usdt: 75.50,
      },
    });
  };

  const disconnect = () => {
    setWallet({
      address: null,
      isConnected: false,
      isConnecting: false,
      chainId: null,
      balance: { usdc: 0, usdt: 0 },
    });
  };

  const switchNetwork = async (chainId: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setWallet(prev => ({ ...prev, chainId }));
  };

  const isCorrectNetwork = wallet.chainId === AVALANCHE_CHAIN_ID;

  return (
    <WalletContext.Provider value={{
      ...wallet,
      connect,
      disconnect,
      switchNetwork,
      isCorrectNetwork,
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
