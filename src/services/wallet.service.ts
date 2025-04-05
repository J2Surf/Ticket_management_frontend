import { api } from "./api";

export type TokenType = "ETH" | "BTC" | "USDT" | "THB";
export type WalletType = "ETH";

export interface Wallet {
  id: number;
  type: "CUSTOMER" | "FULFILLER";
  balance: number;
  user_id: number;
  address: string;
  created_at: string;
  updated_at: string;
  token_type?: TokenType;
}

export interface ConnectWalletDto {
  type: WalletType;
  tokenType: TokenType;
  walletAddress: string;
}

export interface EthereumWalletDto {
  id: number;
  type: "ETH";
  address: string;
  balance: number;
  privateKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrivateKeyResponse {
  privateKey: string;
}

export interface PublicKeyResponse {
  publicKey: string;
}

export interface Transaction {
  id: number;
  wallet_id: number;
  amount: number;
  type: "DEPOSIT" | "WITHDRAWAL";
  status: "PENDING" | "COMPLETED" | "FAILED";
  created_at: string;
}

export interface TransactionDto {
  type: "USDT" | "BTC";
  amount: number;
}

export const walletService = {
  async getWallets(): Promise<Wallet[]> {
    const response = await api.get<Wallet[]>("/wallet");
    return response.data;
  },

  async getWallet(type: "ETH"): Promise<Wallet> {
    const response = await api.get<Wallet>(`/wallet/${type}`);
    return response.data;
  },

  async createWallet(data: ConnectWalletDto): Promise<Wallet> {
    const response = await api.post<Wallet>("/wallet/create", data);
    return response.data;
  },

  async createEthereumWallet(): Promise<EthereumWalletDto> {
    const response = await api.post<EthereumWalletDto>(
      "/wallet/create/ethereum"
    );
    return response.data;
  },

  async getPrivateKey(walletId: number): Promise<string> {
    const response = await api.get<PrivateKeyResponse>(
      `/wallet/private-key/${walletId}`
    );
    return response.data.privateKey;
  },

  async getPublicKey(walletId: number): Promise<string> {
    const response = await api.get<PublicKeyResponse>(
      `/wallet/public-key/${walletId}`
    );
    return response.data.publicKey;
  },

  async connectWallet(data: ConnectWalletDto): Promise<Wallet> {
    console.log("connectWallet data", data);
    try {
      const response = await api.post<Wallet>("/wallet/connect", data);
      return response.data;
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      if (error.response?.status === 401) {
        // Handle unauthorized access - token might be missing or expired
        console.error("Authentication error. Please log in again.");
      } else if (error.response?.status === 403) {
        // Handle forbidden access - user doesn't have required roles
        console.error(
          "Access forbidden. You don't have permission to connect a wallet."
        );
      } else if (error.response?.status === 404) {
        // Handle not found error
        console.error(
          "Wallet endpoint not found. Please check if the backend server is running."
        );
      }
      throw error;
    }
  },

  async getTransactions(walletId: number): Promise<Transaction[]> {
    const response = await api.get<Transaction[]>(
      `/wallet/${walletId}/transactions`
    );
    return response.data;
  },

  async createTransaction(data: {
    wallet_id: number;
    amount: number;
    type: "DEPOSIT" | "WITHDRAWAL";
  }): Promise<Transaction> {
    const response = await api.post<Transaction>("/wallet/deposit", data);
    return response.data;
  },

  async deposit(data: TransactionDto): Promise<Wallet> {
    const response = await api.post<Wallet>("/wallet/deposit", data);
    return response.data;
  },

  async withdraw(data: TransactionDto): Promise<Wallet> {
    console.log(data);
    const response = await api.post<Wallet>("/wallet/withdraw", data);
    return response.data;
  },
};
