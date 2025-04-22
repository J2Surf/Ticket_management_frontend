"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { ethers } from "ethers";

interface WalletContextType {
  account: string | null;
  chainId: number | null;
  balance: string | null;
  isConnecting: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnected: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    const { ethereum } = window as any;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  // Connect wallet function
  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      if (!isMetaMaskInstalled()) {
        throw new Error(
          "MetaMask is not installed. Please install MetaMask to continue."
        );
      }

      const { ethereum } = window as any;
      const provider = new ethers.BrowserProvider(ethereum);

      // Request account access
      const accounts = await provider.send("eth_requestAccounts", []);
      const account = accounts[0];
      setAccount(account);

      // Get network information
      const network = await provider.getNetwork();
      setChainId(Number(network.chainId));

      // Get account balance
      const balance = await provider.getBalance(account);
      setBalance(ethers.formatEther(balance));

      // Listen for account changes
      ethereum.on("accountsChanged", handleAccountsChanged);

      // Listen for chain changes
      ethereum.on("chainChanged", handleChainChanged);
    } catch (err: any) {
      console.error("Error connecting wallet:", err);
      setError(err.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
    setBalance(null);
    setError(null);

    // Remove event listeners
    const { ethereum } = window as any;
    if (ethereum && ethereum.removeListener) {
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
      ethereum.removeListener("chainChanged", handleChainChanged);
    }
  };

  // Handle account changes
  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      disconnectWallet();
    } else {
      // Account changed, update state
      setAccount(accounts[0]);

      // Update balance for new account
      try {
        const { ethereum } = window as any;
        const provider = new ethers.BrowserProvider(ethereum);
        const balance = await provider.getBalance(accounts[0]);
        setBalance(ethers.formatEther(balance));
      } catch (err) {
        console.error("Error updating balance:", err);
      }
    }
  };

  // Handle chain changes
  const handleChainChanged = (chainId: string) => {
    window.location.reload();
  };

  // Check for existing connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskInstalled()) {
        const { ethereum } = window as any;
        const provider = new ethers.BrowserProvider(ethereum);

        try {
          const accounts = await provider.listAccounts();

          if (accounts.length > 0) {
            const account = accounts[0].address;
            setAccount(account);

            const network = await provider.getNetwork();
            setChainId(Number(network.chainId));

            const balance = await provider.getBalance(account);
            setBalance(ethers.formatEther(balance));

            // Set up listeners
            ethereum.on("accountsChanged", handleAccountsChanged);
            ethereum.on("chainChanged", handleChainChanged);
          }
        } catch (err) {
          console.error("Error checking existing connection:", err);
        }
      }
    };

    checkConnection();

    // Cleanup listeners on unmount
    return () => {
      const { ethereum } = window as any;
      if (ethereum && ethereum.removeListener) {
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
        ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  const value = {
    account,
    chainId,
    balance,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    isConnected: !!account,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}
