import React, { useState } from "react";
import { Wallet, walletService } from "../services/wallet.service";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (amount: number) => void;
  isDarkMode: boolean;
  selectedWallet: Wallet | null;
  balance: number;
  gasFee: number;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  onWithdraw,
  isDarkMode,
  selectedWallet,
  balance,
  gasFee,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Ensure balance and gasFee are numbers
  const numericBalance = Number(balance);
  const numericGasFee = Number(gasFee);
  const maxWithdrawable = numericBalance - numericGasFee;

  const handleSubmit = async (e: React.FormEvent) => {
    console.log(maxWithdrawable);
    e.preventDefault();
    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (numericAmount > maxWithdrawable) {
      setError(
        `Maximum withdrawable amount is ${maxWithdrawable.toFixed(
          2
        )} USDT (balance - gas fee)`
      );
      return;
    }

    console.log(numericAmount);
    try {
      setIsLoading(true);
      onWithdraw(numericAmount);
      setAmount("");
      setError("");
    } catch (err) {
      setError("Failed to process withdrawal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`${
          isDarkMode ? "bg-[#1F2937]" : "bg-white"
        } rounded-lg p-6 w-96 shadow-xl`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-xl font-semibold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Withdraw Funds
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
          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Amount (USDT)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max={maxWithdrawable}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter amount"
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Available Balance: {numericBalance.toFixed(2)} USDT
            </p>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Gas Fee: {numericGasFee.toFixed(2)} USDT
            </p>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Maximum Withdrawable: {maxWithdrawable.toFixed(2)} USDT
            </p>
          </div>

          {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className={`mr-2 px-4 py-2 rounded-lg ${
                isDarkMode
                  ? "bg-gray-700 text-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg ${
                isDarkMode
                  ? "bg-blue-600 text-gray-700 hover:bg-blue-700"
                  : "bg-blue-500 text-gray-700 hover:bg-blue-600"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Withdraw"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawModal;
