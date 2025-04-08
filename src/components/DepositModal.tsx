import React, { useState, useEffect } from "react";
import { walletService, Wallet } from "../services/wallet.service";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (
    amount: number,
    adminAddress: string,
    adminUserId: number
  ) => void;
  isDarkMode?: boolean;
  selectedWallet?: Wallet | null;
}

const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  onDeposit,
  isDarkMode = false,
  selectedWallet = null,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [adminWallets, setAdminWallets] = useState<Wallet[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const [selectedAdminAddress, setSelectedAdminAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminWallets = async () => {
      if (isOpen) {
        setIsLoading(true);
        setError(null);
        try {
          const wallets = await walletService.getAdminWallets();
          setAdminWallets(wallets);
          if (wallets.length > 0) {
            console.log("fetchAdminWallets", wallets[0]);
            setSelectedUserId(wallets[0].userId);
            setSelectedAdminAddress(wallets[0].address);
          } else {
            setError("No admin wallets available");
          }
        } catch (err) {
          setError("Failed to load admin wallets");
          console.error("Error fetching admin wallets:", err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAdminWallets();
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0 || !selectedAdminAddress) {
      return;
    }
    console.log("selectedUserId", selectedUserId);
    onDeposit(numericAmount, selectedAdminAddress, selectedUserId);
    setAmount("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg p-6 w-[600px] shadow-xl`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-xl font-semibold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Deposit Funds
          </h2>
          <button
            onClick={onClose}
            className={`${
              isDarkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div
              className={`mb-4 p-3 rounded-lg ${
                isDarkMode
                  ? "bg-red-900/30 text-red-300"
                  : "bg-red-50 text-red-600"
              }`}
            >
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Select Admin's address to deposit
            </label>
            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mx-auto"></div>
                <p
                  className={`text-sm mt-2 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Loading admin address...
                </p>
              </div>
            ) : (
              <select
                value={selectedAdminAddress}
                onChange={(e) => setSelectedAdminAddress(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              >
                <option value="" disabled>
                  Select a admin address
                </option>
                {adminWallets.map((wallet) => (
                  <option key={wallet.address} value={wallet.address}>
                    {wallet.address} ({wallet.token_type || "USDT"})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter amount to deposit"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${
                isDarkMode
                  ? "bg-gray-700 text-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !selectedAdminAddress || !!error}
              className={`px-4 py-2 rounded-lg ${
                isLoading || !selectedAdminAddress || !!error
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-blue-500 text-gray-700 hover:bg-blue-600"
              }`}
            >
              Deposit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepositModal;
