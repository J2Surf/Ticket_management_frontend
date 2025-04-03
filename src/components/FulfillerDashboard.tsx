import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Panel from "./Panel";
import { useAlert } from "../contexts/AlertContext";
import { useTheme } from "../contexts/ThemeContext";

interface Transaction {
  date: string;
  income?: number;
  outcome?: number;
  ticketName: string;
  transactionHash: string;
}

interface Ticket {
  id: string;
  paymentMethod: string;
  paymentTag: string;
  accountName: string;
  amount: number;
  image: string;
  status: "Completed" | "Processing" | "Failed";
  action?: string;
}

const PaymentSection: React.FC<{
  transactions: Transaction[];
  balance: number;
  onConnectWallet: () => void;
  onWithdraw: () => void;
}> = ({ transactions, balance, onConnectWallet, onWithdraw }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Payment Management
      </h1>
      <div className="flex space-x-4">
        <button
          onClick={onConnectWallet}
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-lg shadow-primary-500/30 dark:shadow-primary-500/10 hover:shadow-primary-500/50 dark:hover:shadow-primary-500/20 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Connect Wallet
        </button>
        <button
          onClick={onWithdraw}
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-medium shadow-lg shadow-green-500/30 dark:shadow-green-500/10 hover:shadow-green-500/50 dark:hover:shadow-green-500/20 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Withdraw
        </button>
      </div>
    </div>

    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
              <th className="p-4 text-left rounded-tl-lg">Date</th>
              <th className="p-4 text-left">Income</th>
              <th className="p-4 text-left">Outcome</th>
              <th className="p-4 text-left">Ticket Name</th>
              <th className="p-4 text-left rounded-tr-lg">Transaction hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {transactions.map((tx, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
              >
                <td className="p-4 text-gray-900 dark:text-gray-100">
                  {tx.date}
                </td>
                <td className="p-4 text-green-600 dark:text-green-400 font-medium">
                  {tx.income && `+${tx.income}`}
                </td>
                <td className="p-4 text-red-600 dark:text-red-400 font-medium">
                  {tx.outcome && `-${tx.outcome}`}
                </td>
                <td className="p-4 text-gray-900 dark:text-gray-100">
                  {tx.ticketName}
                </td>
                <td className="p-4 font-mono text-gray-500 dark:text-gray-400">
                  {tx.transactionHash}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="flex justify-end">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 px-6">
        <p className="text-xl font-bold text-gray-900 dark:text-white">
          Total balance:{" "}
          <span className="text-primary-600 dark:text-primary-400">
            {balance} USDT
          </span>
        </p>
      </div>
    </div>
  </div>
);

const TicketSection: React.FC<{
  tickets: Ticket[];
  onAction: (action: string, ticketId: string) => void;
}> = ({ tickets, onAction }) => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
      Ticket Management
    </h1>

    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
              <th className="p-4 text-left rounded-tl-lg">ID</th>
              <th className="p-4 text-left">NAME</th>
              <th className="p-4 text-left">AMOUNT</th>
              <th className="p-4 text-left">STATUS</th>
              <th className="p-4 text-left rounded-tr-lg">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
              >
                <td className="p-4 font-mono text-gray-900 dark:text-gray-100">
                  {ticket.id}
                </td>
                <td className="p-4 text-gray-900 dark:text-gray-100">
                  {ticket.accountName}
                </td>
                <td className="p-4 font-medium text-gray-900 dark:text-gray-100">
                  {ticket.amount} USDT
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      ticket.status === "Completed"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : ticket.status === "Processing"
                        ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </td>
                <td className="p-4">
                  {ticket.action && (
                    <button
                      onClick={() => onAction(ticket.action!, ticket.id)}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium hover:underline transition-colors"
                    >
                      {ticket.action}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const FulfillerDashboard: React.FC = () => {
  const location = useLocation();
  const { showAlert } = useAlert();
  const [balance] = useState(-5);
  const [transactions] = useState<Transaction[]>([
    {
      date: "2024-03-15",
      income: 500,
      ticketName: "Website Development",
      transactionHash: "0x123...abc",
    },
    {
      date: "2024-03-14",
      outcome: 100,
      ticketName: "Logo Design",
      transactionHash: "0x456...def",
    },
    {
      date: "2024-03-13",
      income: 750,
      ticketName: "Mobile App Development",
      transactionHash: "0x789...ghi",
    },
    {
      date: "2024-03-12",
      income: 300,
      ticketName: "SEO Optimization",
      transactionHash: "0xabc...123",
    },
    {
      date: "2024-03-11",
      income: 450,
      ticketName: "Content Writing",
      transactionHash: "0xdef...456",
    },
  ]);

  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<"current" | "error">("current");

  const handleConnectWallet = () => {
    showAlert("info", "Connecting to wallet...");
  };

  const handleWithdraw = () => {
    showAlert("info", "Processing withdrawal...");
  };

  const panelItems = [
    {
      name: "Payment management",
      path: "/fulfiller/payment",
      isActive: location.pathname.includes("/payment"),
    },
  ];

  const tickets: Ticket[] = [
    {
      id: "11-1742879552-PXBB",
      paymentMethod: "CashApp",
      paymentTag: "test",
      accountName: "test",
      amount: 1.0,
      image: "path/to/image",
      status: "Completed",
    },
  ];

  return (
    <div
      className={`w-full p-6 ${
        isDarkMode ? "bg-[#111827] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
          <span className="text-sm text-gray-500">
            Last updated: 12:13:00 AM
          </span>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Current Batch */}
          <div
            className={`p-4 rounded-lg ${
              isDarkMode ? "bg-[#1F2937]" : "bg-white"
            } shadow-sm`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-400 text-sm font-medium">
                  CURRENT BATCH
                </p>
                <p className="text-2xl font-semibold mt-1">$0.00</p>
              </div>
              <div
                className={`p-2 rounded-lg ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-100"
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
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Next Batch */}
          <div
            className={`p-4 rounded-lg ${
              isDarkMode ? "bg-[#1F2937]" : "bg-white"
            } shadow-sm`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-yellow-400 text-sm font-medium">
                  NEXT BATCH
                </p>
                <p className="text-2xl font-semibold mt-1">$0.00</p>
              </div>
              <div
                className={`p-2 rounded-lg ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-100"
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
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Today's Total */}
          <div
            className={`p-4 rounded-lg ${
              isDarkMode ? "bg-[#1F2937]" : "bg-white"
            } shadow-sm`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-400 text-sm font-medium">
                  TODAY'S TOTAL
                </p>
                <p className="text-2xl font-semibold mt-1">$101.00</p>
              </div>
              <div
                className={`p-2 rounded-lg ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-100"
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Error Tickets */}
          <div
            className={`p-4 rounded-lg ${
              isDarkMode ? "bg-[#1F2937]" : "bg-white"
            } shadow-sm`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-red-400 text-sm font-medium">
                  ERROR TICKETS
                </p>
                <p className="text-2xl font-semibold mt-1">0</p>
              </div>
              <div
                className={`p-2 rounded-lg ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-100"
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div
          className={`rounded-lg ${
            isDarkMode ? "bg-[#1F2937]" : "bg-white"
          } shadow-sm`}
        >
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("current")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "current"
                    ? isDarkMode
                      ? "border-b-2 border-blue-500 text-white"
                      : "border-b-2 border-blue-500 text-gray-900"
                    : isDarkMode
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Current Tickets
                <span className="ml-2 bg-gray-100 text-gray-700 py-0.5 px-2 rounded-full text-xs">
                  1 ticket
                </span>
              </button>
              <button
                onClick={() => setActiveTab("error")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "error"
                    ? isDarkMode
                      ? "border-b-2 border-red-500 text-white"
                      : "border-b-2 border-red-500 text-gray-900"
                    : isDarkMode
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Error Tickets
                <span className="ml-2 bg-gray-100 text-gray-700 py-0.5 px-2 rounded-full text-xs">
                  0 errors
                </span>
              </button>
            </nav>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className={`text-left ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  } text-sm`}
                >
                  <th className="px-6 py-3">Ticket ID</th>
                  <th className="px-6 py-3">Payment Method</th>
                  <th className="px-6 py-3">Payment Tag</th>
                  <th className="px-6 py-3">Account Name</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Image</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className={`border-t ${
                      isDarkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <td className="px-6 py-4">{ticket.id}</td>
                    <td className="px-6 py-4">{ticket.paymentMethod}</td>
                    <td className="px-6 py-4">{ticket.paymentTag}</td>
                    <td className="px-6 py-4">{ticket.accountName}</td>
                    <td className="px-6 py-4">${ticket.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <button
                        className={`p-2 rounded-lg ${
                          isDarkMode
                            ? "bg-gray-800 hover:bg-gray-700"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        Process
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FulfillerDashboard;
