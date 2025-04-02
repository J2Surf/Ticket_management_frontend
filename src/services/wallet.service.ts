import api from "./api";

export interface Wallet {
  id: number;
  type: "CUSTOMER" | "FULFILLER";
  balance: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface ConnectWalletDto {
  type: "CUSTOMER" | "FULFILLER";
  address: string;
}

export interface Transaction {
  id: number;
  wallet_id: number;
  amount: number;
  type: "DEPOSIT" | "WITHDRAWAL";
  status: "PENDING" | "COMPLETED" | "FAILED";
  created_at: string;
}

export const walletService = {
  async getWallets(): Promise<Wallet[]> {
    const response = await api.get<Wallet[]>("/wallet");
    return response.data;
  },

  async getWallet(type: "CUSTOMER" | "FULFILLER"): Promise<Wallet> {
    const response = await api.get<Wallet>(`/wallet/${type}`);
    return response.data;
  },

  async connectWallet(data: ConnectWalletDto): Promise<Wallet> {
    const response = await api.post<Wallet>("/wallet/connect", data);
    return response.data;
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
    const response = await api.post<Transaction>("/wallet/transaction", data);
    return response.data;
  },
};
