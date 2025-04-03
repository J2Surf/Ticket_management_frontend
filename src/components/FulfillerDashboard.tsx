import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Panel from "./Panel";
import { useAlert } from "../contexts/AlertContext";

interface Transaction {
  date: string;
  income?: number;
  outcome?: number;
  ticketName: string;
  transactionHash: string;
}

interface Ticket {
  id: number;
  name: string;
  amount: number;
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
  onAction: (action: string, ticketId: number) => void;
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
                  {ticket.name}
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Panel items={panelItems} />
      <div className="flex-1 p-8">
        <Routes>
          <Route
            path="/payment"
            element={
              <PaymentSection
                transactions={transactions}
                balance={balance}
                onConnectWallet={handleConnectWallet}
                onWithdraw={handleWithdraw}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default FulfillerDashboard;
