import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Panel from "./Panel";
import { useAlert } from "../contexts/AlertContext";
import { useTheme } from "../contexts/ThemeContext";
import { ticketService, Ticket as ApiTicket } from "../services/ticket.service";
import {
  walletService,
  Wallet,
  CryptoTransaction,
} from "../services/wallet.service";
import DepositModal from "./DepositModal";
import WithdrawModal from "./WithdrawModal";
import { format } from "date-fns";
import { LegacyButton } from "./common/LegacyButton";

interface Transaction {
  date: string;
  income?: number;
  outcome?: number;
  ticketName?: string;
  transactionHash: string;
}

interface Ticket {
  id: number;
  name: string;
  amount: number;
  status: string;
  action?: string;
}

const PaymentSection: React.FC<{
  transactions: Transaction[];
  balance: number;
  onConnectWallet: () => void;
  onDeposit: () => void;
  onWithdraw: () => void;
  isDarkMode: boolean;
  wallets: Wallet[];
  selectedWallet: Wallet | null;
  onWalletSelect: (wallet: Wallet) => void;
  showWalletDropdown: boolean;
  setShowWalletDropdown: (show: boolean) => void;
  cryptoTransactions: CryptoTransaction[];
  isCryptoLoading: boolean;
}> = ({
  transactions,
  balance,
  onConnectWallet,
  onDeposit,
  onWithdraw,
  isDarkMode,
  wallets,
  selectedWallet,
  onWalletSelect,
  showWalletDropdown,
  setShowWalletDropdown,
  cryptoTransactions,
  isCryptoLoading,
}) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Payment Overview</h1>
        <span className="text-sm text-gray-500">Last updated: 12:13:00 AM</span>
      </div>
      <div className="flex gap-4">
        <div className="relative">
          <button
            onClick={() => setShowWalletDropdown(!showWalletDropdown)}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
              isDarkMode
                ? "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                : "bg-[#1F2937] text-gray-200 hover:bg-gray-800"
            }`}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M22 8H2"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 12h0"
              />
            </svg>
            {selectedWallet
              ? `Connected: ${selectedWallet.address.slice(
                  0,
                  6
                )}...${selectedWallet.address.slice(-4)}`
              : "Connect Wallet"}
          </button>
          {showWalletDropdown && (
            <div
              className={`absolute mt-2 w-44 rounded-md shadow-lg ${
                isDarkMode ? "bg-[#1F2937]" : "bg-white"
              } ring-1 ring-black ring-opacity-5 z-10`}
            >
              <div className="py-1" role="menu" aria-orientation="vertical">
                {wallets.length === 0 ? (
                  <button
                    onClick={() => {
                      onConnectWallet();
                      setShowWalletDropdown(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      isDarkMode
                        ? "text-gray-700 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    role="menuitem"
                  >
                    Create Wallet
                  </button>
                ) : (
                  wallets.map((wallet) => (
                    <div
                      key={wallet.id}
                      className="flex justify-between items-center"
                    >
                      <button
                        onClick={() => {
                          onWalletSelect(wallet);
                          setShowWalletDropdown(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          isDarkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        role="menuitem"
                      >
                        {wallet.token_type || wallet.type} -{" "}
                        {wallet.address.substring(0, 6)}...
                        {wallet.address.substring(wallet.address.length - 4)}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onDeposit}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
            isDarkMode
              ? "bg-green-600 text-gray-700 hover:bg-green-700"
              : "bg-green-500 text-gray-700 hover:bg-green-600"
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 00-1 1v9.586L5.707 10.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L10 13.586V4a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          Deposit
        </button>

        <button
          onClick={onWithdraw}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
            isDarkMode
              ? "bg-red-500 text-gray-700 hover:bg-red-600"
              : "bg-red-400 text-gray-700 hover:bg-red-500"
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 17a1 1 0 001-1V6.414l3.293 3.293a1 1 0 001.414-1.414l-4-4a1 1 0 00-1.414 0l-4 4a1 1 0 101.414 1.414L10 6.414V16a1 1 0 001 1z"
              clipRule="evenodd"
            />
          </svg>
          Withdraw
        </button>
      </div>

      {/* Accounts Section */}
      <div
        className={`${
          isDarkMode ? "bg-[#1F2937]" : "bg-white"
        } rounded-xl p-6 ${isDarkMode ? "" : "shadow-sm"}`}
      >
        <div className="flex items-center gap-2 mb-6">
          <svg
            className={`w-5 h-5 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path
              fillRule="evenodd"
              d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
              clipRule="evenodd"
            />
          </svg>
          <h2
            className={`text-xl font-semibold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Accounts
          </h2>
        </div>

        <div>
          <div
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Total Balance
          </div>
          <div
            className={`text-2xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            ${balance.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div
        className={`${
          isDarkMode ? "bg-[#1F2937]" : "bg-white"
        } rounded-xl p-6 ${isDarkMode ? "" : "shadow-sm"}`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <svg
              className={`w-5 h-5 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h2
                className={`text-xl font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Recent Transactions
              </h2>
              <div
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {cryptoTransactions.length} transactions
              </div>
            </div>
          </div>
          <div
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            This Month
          </div>
        </div>

        <div className="overflow-x-auto">
          {isCryptoLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : cryptoTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No transactions found
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <th
                    className={`p-4 text-center ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Date
                  </th>
                  <th
                    className={`p-4 text-center ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Type
                  </th>
                  <th
                    className={`p-4 text-center ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Amount
                  </th>
                  <th
                    className={`p-4 text-center ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Description
                  </th>
                  <th
                    className={`p-4 text-center ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Transaction Hash
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isDarkMode ? "divide-gray-700" : "divide-gray-100"
                }`}
              >
                {cryptoTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className={`${
                      isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
                    }`}
                  >
                    <td
                      className={`p-4 ${
                        isDarkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {format(new Date(transaction.created_at), "dd/MM/yyyy")}
                    </td>
                    <td
                      className={`p-4 font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {transaction.transaction_type}
                    </td>
                    <td
                      className={`p-4 font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {transaction.transaction_type === "deposit" ? (
                        <span className="text-green-500">
                          +${transaction.amount.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-red-500">
                          -${transaction.amount.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td
                      className={`p-4 ${
                        isDarkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {transaction.description || "-"}
                    </td>
                    <td
                      className={`p-4 font-mono ${
                        isDarkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {transaction.transaction_hash || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <button
          className={`w-full mt-6 py-3 text-center ${
            isDarkMode
              ? "bg-[#111827] text-gray-700 hover:bg-gray-800"
              : "bg-white text-gray-700 hover:bg-gray-50"
          } rounded-lg transition-colors flex items-center justify-center gap-2`}
        >
          View All Transactions
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

const TicketSection: React.FC<{
  tickets: Ticket[];
  onAction: (action: string, ticketId: number) => void;
  isDarkMode: boolean;
  loading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
}> = ({
  tickets,
  onAction,
  isDarkMode,
  loading = false,
  currentPage,
  totalPages,
  onPageChange,
  sortField,
  sortDirection,
  onSort,
}) => {
  const getTicketAction = (status: string): boolean => {
    return status.toLowerCase() === "new";
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return (
        <svg
          className="w-4 h-4 ml-1 opacity-50"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    return sortDirection === "asc" ? (
      <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
          clipRule="evenodd"
        />
      </svg>
    ) : (
      <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Ticket Management</h1>
        <span className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </span>
      </div>

      <div
        className={`${
          isDarkMode ? "bg-[#1F2937]" : "bg-white"
        } rounded-xl p-6 ${isDarkMode ? "" : "shadow-sm"}`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <svg
              className={`w-5 h-5 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
            <h2
              className={`text-xl font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Recent Tickets
            </h2>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center space-x-2">
            <LegacyButton
              buttonType="commonBtn"
              isDarkMode={isDarkMode}
              isDisabled={currentPage === 1}
              onClickAction={() => onPageChange(1)}
            >
              First
            </LegacyButton>
            <LegacyButton
              buttonType="commonBtn"
              isDarkMode={isDarkMode}
              isDisabled={currentPage === 1}
              onClickAction={() => onPageChange(currentPage - 1)}
            >
              Previous
            </LegacyButton>
            <span
              className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Page {currentPage} of {totalPages}
            </span>
            <LegacyButton
              buttonType="commonBtn"
              isDarkMode={isDarkMode}
              isDisabled={currentPage === totalPages}
              onClickAction={() => onPageChange(currentPage + 1)}
            >
              Next
            </LegacyButton>
            <LegacyButton
              buttonType="commonBtn"
              isDarkMode={isDarkMode}
              isDisabled={currentPage === totalPages}
              onClickAction={() => onPageChange(totalPages)}
            >
              Last
            </LegacyButton>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No tickets found
            </div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr>
                  <th
                    className={`p-4 text-left ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => onSort("id")}
                    >
                      ID {getSortIcon("id")}
                    </button>
                  </th>
                  <th
                    className={`p-4 text-left ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => onSort("name")}
                    >
                      Name {getSortIcon("name")}
                    </button>
                  </th>
                  <th
                    className={`p-4 text-left ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => onSort("amount")}
                    >
                      Amount {getSortIcon("amount")}
                    </button>
                  </th>
                  <th
                    className={`p-4 text-left ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => onSort("status")}
                    >
                      Status {getSortIcon("status")}
                    </button>
                  </th>
                  <th
                    className={`p-4 text-left ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isDarkMode ? "divide-gray-700" : "divide-gray-100"
                }`}
              >
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className={`${
                      isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
                    }`}
                  >
                    <td
                      className={`p-4 font-mono text-left ${
                        isDarkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {ticket.id}
                    </td>
                    <td
                      className={`p-4 text-left ${
                        isDarkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {ticket.name}
                    </td>
                    <td
                      className={`p-4 font-medium text-left ${
                        isDarkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {ticket.amount} USDT
                    </td>
                    <td className="p-4 text-left">
                      <span
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          ticket.status.toLowerCase() === "completed"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : ticket.status.toLowerCase() === "new"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : ticket.status.toLowerCase() === "validated"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                            : ticket.status.toLowerCase() === "declined"
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-4 text-left">
                      {getTicketAction(ticket.status) ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => onAction("validate", ticket.id)}
                            className={`font-medium ${
                              isDarkMode
                                ? "text-green-400 hover:text-green-300"
                                : "text-green-600 hover:text-green-700"
                            } hover:underline transition-colors`}
                          >
                            Validate
                          </button>
                          <button
                            onClick={() => onAction("decline", ticket.id)}
                            className={`font-medium ${
                              isDarkMode
                                ? "text-red-400 hover:text-red-300"
                                : "text-red-600 hover:text-red-700"
                            } hover:underline transition-colors`}
                          >
                            Decline
                          </button>
                        </div>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const ClientDashboard: React.FC = () => {
  const location = useLocation();
  const { showAlert } = useAlert();
  const { isDarkMode } = useTheme();
  const [balance, setBalance] = useState<number>(0);
  const [transactions] = useState<Transaction[]>([
    {
      date: "27/3/2025",
      income: 100,
      ticketName: "Ticket 1",
      transactionHash: "0x124...",
    },
    {
      date: "26/3/2025",
      outcome: 10,
      ticketName: "Ticket 2",
      transactionHash: "0xc35...",
    },
  ]);

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [sortField, setSortField] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [gasFee] = useState<number>(5); // Fixed gas fee of 5 USDT for withdrawals
  const [cryptoTransactions, setCryptoTransactions] = useState<
    CryptoTransaction[]
  >([]);
  const [isCryptoLoading, setIsCryptoLoading] = useState(true);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const fetchedWallets = await walletService.getWallets();
        setWallets(fetchedWallets);
      } catch (error) {
        showAlert("error", "Failed to fetch wallets");
        console.error("Error fetching wallets:", error);
      }
    };

    fetchWallets();
  }, [showAlert]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await ticketService.getTickets(
          undefined,
          currentPage,
          limit
        );
        const formattedTickets = response.data.map((ticket: ApiTicket) => ({
          id: ticket.id,
          name: ticket.facebook_name,
          amount: ticket.amount,
          status: mapTicketStatus(ticket.status),
        }));

        // Sort tickets based on current sort field and direction
        const sortedTickets = sortTickets(
          formattedTickets,
          sortField,
          sortDirection
        );

        setTickets(sortedTickets);
        setTotalPages(response.meta.totalPages);
      } catch (error) {
        showAlert("error", "Failed to fetch tickets");
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [showAlert, currentPage, limit, sortField, sortDirection]);

  useEffect(() => {
    const fetchCryptoTransactions = async () => {
      try {
        const response = await walletService.getCryptoTransactions();
        setCryptoTransactions(response);
      } catch (error) {
        console.error("Error fetching crypto transactions:", error);
      } finally {
        setIsCryptoLoading(false);
      }
    };

    fetchCryptoTransactions();
  }, []);

  const sortTickets = (
    ticketsToSort: Ticket[],
    field: string,
    direction: "asc" | "desc"
  ): Ticket[] => {
    return [...ticketsToSort].sort((a, b) => {
      let valueA: any = a[field as keyof Ticket];
      let valueB: any = b[field as keyof Ticket];

      // Handle numeric values
      if (field === "id" || field === "amount") {
        valueA = Number(valueA);
        valueB = Number(valueB);
      }

      // Handle string values
      if (typeof valueA === "string") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (direction === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const mapTicketStatus = (status: string): string => {
    return status;
  };

  const handleConnectWallet = async () => {
    try {
      if (wallets.length === 0) {
        // Create a new Ethereum wallet
        const newWallet = await walletService.createEthereumWallet();

        // Convert EthereumWalletDto to Wallet format
        const wallet: Wallet = {
          id: newWallet.id,
          type: "CUSTOMER", // Default type
          balance: newWallet.balance,
          userId: 0, // This will be set by the backend
          address: newWallet.address,
          created_at: newWallet.createdAt,
          updated_at: newWallet.updatedAt,
        };

        setWallets([...wallets, wallet]);
        setSelectedWallet(wallet);

        // Show success message with private key warning
        showAlert("success", "Ethereum wallet created successfully.");
      } else if (!selectedWallet) {
        showAlert("error", "Please select a wallet first");
        return;
      } else {
        const connectedWallet = await walletService.connectWallet({
          type: "ETH", // Default to USDT for now
          tokenType: "USDT",
          walletAddress: selectedWallet.address,
        });
        setBalance(connectedWallet.balance);
        showAlert("success", "Wallet connected successfully");
      }
    } catch (error) {
      showAlert("error", "Failed to create or connect wallet");
      console.error("Error connecting wallet:", error);
    }
  };

  const handleWalletSelect = async (wallet: Wallet) => {
    setSelectedWallet(wallet);
    // Connect the wallet directly using the wallet parameter
    try {
      const connectedWallet = await walletService.connectWallet({
        type: "ETH",
        tokenType: "USDT",
        walletAddress: wallet.address,
      });

      setBalance(connectedWallet.balance);
      showAlert("success", "Wallet connected successfully");
    } catch (error) {
      showAlert("error", "Failed to connect wallet");
      console.error("Error connecting wallet:", error);
    }
  };

  const handleDeposit = () => {
    if (!selectedWallet) {
      showAlert("error", "Please select a wallet first");
      return;
    }
    setIsDepositModalOpen(true);
  };

  const handleDepositSubmit = async (
    amount: number,
    adminAddress: string,
    adminUserId: number
  ) => {
    try {
      if (!selectedWallet) {
        showAlert("error", "Please select a wallet first");
        return;
      }

      const updatedWallet = await walletService.deposit({
        type: "DEPOSIT",
        amount: amount,
        token_type: "USDT",
        wallet_id: selectedWallet.id,
        description: "Deposit from client's wallet to admin's wallet",
        address_from: selectedWallet.address,
        address_to: adminAddress,
        user_id_from: selectedWallet.userId,
        user_id_to: adminUserId,
      });

      setBalance(updatedWallet.balance);
      showAlert("success", "Deposit successful");
      setIsDepositModalOpen(false);
    } catch (error) {
      showAlert("error", "Failed to process deposit");
      console.error("Error processing deposit:", error);
    }
  };

  const handleWithdraw = () => {
    if (!selectedWallet) {
      showAlert("error", "Please select a wallet first");
      return;
    }

    setIsWithdrawModalOpen(true);
  };

  const handleWithdrawSubmit = async (
    amount: number,
    adminAddress: string,
    adminUserId: number
  ) => {
    try {
      if (!selectedWallet) {
        showAlert("error", "Please select a wallet first");
        return;
      }

      const updatedWallet = await walletService.withdraw({
        type: "WITHDRAW",
        amount: amount,
        token_type: "USDT",
        wallet_id: selectedWallet.id,
        description: "Withdrawal from wallet",
        address_from: adminAddress,
        address_to: selectedWallet.address,
        user_id_from: adminUserId,
        user_id_to: selectedWallet.userId,
      });

      setBalance(Number(updatedWallet.balance));
      showAlert("success", "Withdrawal successful");
      setIsWithdrawModalOpen(false);
    } catch (error) {
      showAlert("error", "Failed to process withdrawal");
      console.error("Error processing withdrawal:", error);
    }
  };

  const handleTicketAction = async (action: string, ticketId: number) => {
    try {
      if (action === "validate") {
        await ticketService.validateTicket(ticketId.toString());
        showAlert("success", `Ticket #${ticketId} has been validated`);
      } else if (action === "decline") {
        await ticketService.declineTicket(ticketId.toString());
        showAlert("success", `Ticket #${ticketId} has been declined`);
      }
      // Refresh tickets after action
      const response = await ticketService.getTickets(
        undefined,
        currentPage,
        limit
      );
      const formattedTickets = response.data.map((ticket: ApiTicket) => ({
        id: ticket.id,
        name: ticket.facebook_name,
        amount: ticket.amount,
        status: mapTicketStatus(ticket.status),
      }));

      // Sort tickets based on current sort field and direction
      const sortedTickets = sortTickets(
        formattedTickets,
        sortField,
        sortDirection
      );

      setTickets(sortedTickets);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      showAlert("error", `Failed to ${action} ticket #${ticketId}`);
      console.error(`Error ${action}ing ticket:`, error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setLoading(true);
  };

  // Payment icon component
  const PaymentIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
      <path
        fillRule="evenodd"
        d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
        clipRule="evenodd"
      />
    </svg>
  );

  // Ticket icon component
  const TicketIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
        clipRule="evenodd"
      />
    </svg>
  );

  const panelItems = [
    {
      name: "Payment management",
      path: "/client/payment",
      icon: <PaymentIcon />,
      isActive: location.pathname.includes("/payment"),
    },
    {
      name: "Ticket management",
      path: "/client/ticket",
      icon: <TicketIcon />,
      isActive: location.pathname.includes("/ticket"),
    },
  ];

  return (
    <div
      className={`flex min-h-screen ${
        isDarkMode ? "bg-[#111827] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Panel items={panelItems} />
      <div className="flex-1 p-8 overflow-auto">
        <Routes>
          <Route
            path="/payment"
            element={
              <>
                <PaymentSection
                  transactions={transactions}
                  balance={balance}
                  onConnectWallet={handleConnectWallet}
                  onDeposit={handleDeposit}
                  onWithdraw={handleWithdraw}
                  isDarkMode={isDarkMode}
                  wallets={wallets}
                  selectedWallet={selectedWallet}
                  onWalletSelect={handleWalletSelect}
                  showWalletDropdown={showWalletDropdown}
                  setShowWalletDropdown={setShowWalletDropdown}
                  cryptoTransactions={cryptoTransactions}
                  isCryptoLoading={isCryptoLoading}
                />
                <DepositModal
                  isOpen={isDepositModalOpen}
                  onClose={() => setIsDepositModalOpen(false)}
                  onDeposit={handleDepositSubmit}
                  isDarkMode={isDarkMode}
                  selectedWallet={selectedWallet}
                />
                <WithdrawModal
                  isOpen={isWithdrawModalOpen}
                  onClose={() => setIsWithdrawModalOpen(false)}
                  onWithdraw={handleWithdrawSubmit}
                  isDarkMode={isDarkMode}
                  selectedWallet={selectedWallet}
                  balance={Number(balance)}
                  gasFee={Number(gasFee)}
                />
              </>
            }
          />
          <Route
            path="/ticket"
            element={
              <TicketSection
                tickets={tickets}
                onAction={handleTicketAction}
                isDarkMode={isDarkMode}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default ClientDashboard;
