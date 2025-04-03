import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Panel from "./Panel";
import { useAlert } from "../contexts/AlertContext";

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
  status: "Completed" | "Processing" | "Disputed";
  action?: string;
}

const PaymentSection: React.FC<{
  transactions: Transaction[];
  balance: number;
  onConnectWallet: () => void;
  onDeposit: () => void;
}> = ({ transactions, balance, onConnectWallet, onDeposit }) => (
  <div className="space-y-8">
    {/* Accounts Section */}
    <div className="bg-[#1F2937] rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <svg
          className="w-5 h-5 text-gray-300"
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
        <h2 className="text-xl font-semibold text-white">Accounts</h2>
      </div>

      <div className="mb-6">
        <div className="text-sm text-gray-400">Total Balance</div>
        <div className="text-2xl font-bold text-white">
          ${balance.toLocaleString()}.25
        </div>
      </div>

      <div className="text-sm text-gray-400 mb-4">Your Accounts</div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-[#111827] rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-500"
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
            </div>
            <div>
              <div className="font-medium text-white">Main Savings</div>
              <div className="text-sm text-gray-400">Personal savings</div>
            </div>
          </div>
          <div className="font-medium text-white">$8,459.45</div>
        </div>

        <div className="flex items-center justify-between p-3 bg-[#111827] rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <div className="font-medium text-white">Checking Account</div>
              <div className="text-sm text-gray-400">Daily expenses</div>
            </div>
          </div>
          <div className="font-medium text-white">$2,850.00</div>
        </div>

        <div className="flex items-center justify-between p-3 bg-[#111827] rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-purple-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-white">Investment Portfolio</div>
              <div className="text-sm text-gray-400">Stock & ETFs</div>
            </div>
          </div>
          <div className="font-medium text-white">$15,230.80</div>
        </div>

        <div className="flex items-center justify-between p-3 bg-[#111827] rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <div className="font-medium text-white">Savings Account</div>
              <div className="text-sm text-gray-400">Emergency fund</div>
            </div>
          </div>
          <div className="font-medium text-white">$3,000.00</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mt-6">
        <button className="flex items-center justify-center gap-2 py-2 px-3 bg-[#111827] text-white rounded-lg hover:bg-gray-800 transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add
        </button>
        <button className="flex items-center justify-center gap-2 py-2 px-3 bg-[#111827] text-white rounded-lg hover:bg-gray-800 transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Send
        </button>
        <button className="flex items-center justify-center gap-2 py-2 px-3 bg-[#111827] text-white rounded-lg hover:bg-gray-800 transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Top-up
        </button>
        <button className="flex items-center justify-center gap-2 py-2 px-3 bg-[#111827] text-white rounded-lg hover:bg-gray-800 transition-colors">
          More
        </button>
      </div>
    </div>

    {/* Recent Transactions Section */}
    <div className="bg-[#1F2937] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-gray-300"
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
            <h2 className="text-xl font-semibold text-white">
              Recent Transactions
            </h2>
            <div className="text-sm text-gray-400">23 transactions</div>
          </div>
        </div>
        <div className="text-sm text-gray-400">This Month</div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-[#111827] rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <div className="font-medium text-white">Apple Store Purchase</div>
              <div className="text-sm text-gray-400">Today, 2:45 PM</div>
            </div>
          </div>
          <div className="font-medium text-red-500">-$999.00</div>
        </div>

        <div className="flex items-center justify-between p-3 bg-[#111827] rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <div className="font-medium text-white">Salary Deposit</div>
              <div className="text-sm text-gray-400">Today, 9:00 AM</div>
            </div>
          </div>
          <div className="font-medium text-green-500">+$4,500.00</div>
        </div>

        <div className="flex items-center justify-between p-3 bg-[#111827] rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <div className="font-medium text-white">Netflix Subscription</div>
              <div className="text-sm text-gray-400">Yesterday</div>
            </div>
          </div>
          <div className="font-medium text-red-500">-$15.99</div>
        </div>
      </div>

      <button className="w-full mt-6 py-3 text-center text-white bg-[#111827] rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
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

const ClientDashboard: React.FC = () => {
  const location = useLocation();
  const { showAlert } = useAlert();
  const [balance] = useState(90);
  const [transactions] = useState<Transaction[]>([
    {
      date: "27/3/2025",
      income: 100,
      transactionHash: "0x124...",
    },
    {
      date: "26/3/2025",
      outcome: 10,
      ticketName: "Ticket 1",
      transactionHash: "0xc35...",
    },
  ]);

  const [tickets] = useState<Ticket[]>([
    {
      id: 15241,
      name: "Ticket 1",
      amount: 10,
      status: "Completed",
      action: "dispute",
    },
    { id: 15356, name: "Ticket 2", amount: 5, status: "Processing" },
    {
      id: 13515,
      name: "Ticket 3",
      amount: 7,
      status: "Disputed",
      action: "solve",
    },
  ]);

  const handleConnectWallet = () => {
    showAlert("info", "Connecting to wallet...");
  };

  const handleDeposit = () => {
    showAlert("info", "Processing deposit...");
  };

  const handleTicketAction = (action: string, ticketId: number) => {
    showAlert("info", `Processing ${action} for ticket #${ticketId}`);
  };

  const panelItems = [
    {
      name: "Payment management",
      path: "/client/payment",
      isActive: location.pathname.includes("/payment"),
    },
    {
      name: "Ticket management",
      path: "/client/ticket",
      isActive: location.pathname.includes("/ticket"),
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
                onDeposit={handleDeposit}
              />
            }
          />
          <Route
            path="/ticket"
            element={
              <TicketSection tickets={tickets} onAction={handleTicketAction} />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default ClientDashboard;
