import React, { useState } from "react";
import {
  walletService,
  Wallet,
  CryptoTransaction,
} from "../services/wallet.service";

interface ProcessingModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onComplete: () => void;
}
const processTransactions = async () => {};

const ProcessingModal: React.FC<ProcessingModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  onComplete,
}) => {
  if (!isOpen) return null;

  processTransactions();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={`w-full max-w-md p-6 rounded-lg shadow-lg ${
          isDarkMode ? "bg-[#1F2937] text-white" : "bg-white text-gray-900"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Processing Transactions</h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-full hover:bg-opacity-10 ${
              isDarkMode ? "hover:bg-gray-300" : "hover:bg-gray-700"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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

        <form>
          <div className="mb-4">
            <label
              className={`block mb-2 text-sm font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Transaction ID
            </label>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProcessingModal;
