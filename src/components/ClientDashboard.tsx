import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Panel from "./Panel";
import { useAlert } from "../contexts/AlertContext";
import { useTheme } from "../contexts/ThemeContext";
import { ticketService, Ticket as ApiTicket } from "../services/ticket.service";

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
  isDarkMode: boolean;
}> = ({ transactions, balance, onConnectWallet, onDeposit, isDarkMode }) => (
  <div className="space-y-8">
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-semibold">Payment Overview</h1>
      <span className="text-sm text-gray-500">Last updated: 12:13:00 AM</span>
    </div>

    {/* Accounts Section */}
    <div
      className={`${isDarkMode ? "bg-[#1F2937]" : "bg-white"} rounded-xl p-6 ${
        isDarkMode ? "" : "shadow-sm"
      }`}
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

      <div className="mb-6">
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
          ${balance.toLocaleString()}.25
        </div>
      </div>

      <div
        className={`text-sm ${
          isDarkMode ? "text-gray-400" : "text-gray-500"
        } mb-4`}
      >
        Your Accounts
      </div>

      <div className="space-y-3">
        <div
          className={`flex items-center justify-between p-3 ${
            isDarkMode ? "bg-[#111827]" : "bg-gray-50"
          } rounded-lg`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 ${
                isDarkMode ? "bg-green-500/20" : "bg-green-100"
              } rounded-lg flex items-center justify-center`}
            >
              <svg
                className={`w-5 h-5 ${
                  isDarkMode ? "text-green-500" : "text-green-600"
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
            </div>
            <div>
              <div
                className={`font-medium ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Main Savings
              </div>
              <div
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Personal savings
              </div>
            </div>
          </div>
          <div
            className={`font-medium ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            $8,459.45
          </div>
        </div>

        <div
          className={`flex items-center justify-between p-3 ${
            isDarkMode ? "bg-[#111827]" : "bg-gray-50"
          } rounded-lg`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 ${
                isDarkMode ? "bg-blue-500/20" : "bg-blue-100"
              } rounded-lg flex items-center justify-center`}
            >
              <svg
                className={`w-5 h-5 ${
                  isDarkMode ? "text-blue-500" : "text-blue-600"
                }`}
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
              <div
                className={`font-medium ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Checking Account
              </div>
              <div
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Daily expenses
              </div>
            </div>
          </div>
          <div
            className={`font-medium ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            $2,850.00
          </div>
        </div>

        <div
          className={`flex items-center justify-between p-3 ${
            isDarkMode ? "bg-[#111827]" : "bg-gray-50"
          } rounded-lg`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 ${
                isDarkMode ? "bg-purple-500/20" : "bg-purple-100"
              } rounded-lg flex items-center justify-center`}
            >
              <svg
                className={`w-5 h-5 ${
                  isDarkMode ? "text-purple-500" : "text-purple-600"
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
            </div>
            <div>
              <div
                className={`font-medium ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Investment Portfolio
              </div>
              <div
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Stock & ETFs
              </div>
            </div>
          </div>
          <div
            className={`font-medium ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            $15,230.80
          </div>
        </div>

        <div
          className={`flex items-center justify-between p-3 ${
            isDarkMode ? "bg-[#111827]" : "bg-gray-50"
          } rounded-lg`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 ${
                isDarkMode ? "bg-green-500/20" : "bg-green-100"
              } rounded-lg flex items-center justify-center`}
            >
              <svg
                className={`w-5 h-5 ${
                  isDarkMode ? "text-green-500" : "text-green-600"
                }`}
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
              <div
                className={`font-medium ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Savings Account
              </div>
              <div
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Emergency fund
              </div>
            </div>
          </div>
          <div
            className={`font-medium ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            $3,000.00
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mt-6">
        <button
          className={`flex items-center justify-center gap-2 py-2 px-3 ${
            isDarkMode
              ? "bg-[#111827] text-white hover:bg-gray-800"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          } rounded-lg transition-colors`}
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add
        </button>
        <button
          className={`flex items-center justify-center gap-2 py-2 px-3 ${
            isDarkMode
              ? "bg-[#111827] text-white hover:bg-gray-800"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          } rounded-lg transition-colors`}
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Send
        </button>
        <button
          className={`flex items-center justify-center gap-2 py-2 px-3 ${
            isDarkMode
              ? "bg-[#111827] text-white hover:bg-gray-800"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          } rounded-lg transition-colors`}
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Top-up
        </button>
        <button
          className={`flex items-center justify-center gap-2 py-2 px-3 ${
            isDarkMode
              ? "bg-[#111827] text-white hover:bg-gray-800"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          } rounded-lg transition-colors`}
        >
          More
        </button>
      </div>
    </div>

    {/* Recent Transactions Section */}
    <div
      className={`${isDarkMode ? "bg-[#1F2937]" : "bg-white"} rounded-xl p-6 ${
        isDarkMode ? "" : "shadow-sm"
      }`}
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
              23 transactions
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
        <table className="w-full">
          <thead>
            <tr>
              <th
                className={`p-4 text-left ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Date
              </th>
              <th
                className={`p-4 text-left ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Income
              </th>
              <th
                className={`p-4 text-left ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Outcome
              </th>
              <th
                className={`p-4 text-left ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Ticket Name
              </th>
              <th
                className={`p-4 text-left ${
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
            {transactions.map((transaction) => (
              <tr
                key={transaction.transactionHash}
                className={`${
                  isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
                }`}
              >
                <td
                  className={`p-4 ${
                    isDarkMode ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  {transaction.date}
                </td>
                <td
                  className={`p-4 font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  {transaction.income ? (
                    <span className="text-green-500">
                      +${transaction.income.toLocaleString()}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td
                  className={`p-4 font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  {transaction.outcome ? (
                    <span className="text-red-500">
                      -${transaction.outcome.toLocaleString()}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td
                  className={`p-4 ${
                    isDarkMode ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  {transaction.ticketName || "-"}
                </td>
                <td
                  className={`p-4 font-mono ${
                    isDarkMode ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  {transaction.transactionHash}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className={`w-full mt-6 py-3 text-center ${
          isDarkMode
            ? "bg-[#111827] text-white hover:bg-gray-800"
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

const TicketSection: React.FC<{
  tickets: Ticket[];
  onAction: (action: string, ticketId: number) => void;
  isDarkMode: boolean;
  loading?: boolean;
}> = ({ tickets, onAction, isDarkMode, loading = false }) => (
  <div className="space-y-8">
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-semibold">Ticket Management</h1>
      <span className="text-sm text-gray-500">
        Last updated: {new Date().toLocaleTimeString()}
      </span>
    </div>

    <div
      className={`${isDarkMode ? "bg-[#1F2937]" : "bg-white"} rounded-xl p-6 ${
        isDarkMode ? "" : "shadow-sm"
      }`}
    >
      <div className="flex items-center gap-2 mb-6">
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

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No tickets found</div>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr>
                <th
                  className={`p-4 text-left ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  ID
                </th>
                <th
                  className={`p-4 text-left ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  NAME
                </th>
                <th
                  className={`p-4 text-left ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  AMOUNT
                </th>
                <th
                  className={`p-4 text-left ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  STATUS
                </th>
                <th
                  className={`p-4 text-left ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  ACTION
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
                    className={`p-4 font-mono ${
                      isDarkMode ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    {ticket.id}
                  </td>
                  <td
                    className={`p-4 ${
                      isDarkMode ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    {ticket.name}
                  </td>
                  <td
                    className={`p-4 font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    {ticket.amount} USDT
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        ticket.status === "Completed"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : ticket.status === "Processing"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {ticket.action && (
                      <button
                        onClick={() => onAction(ticket.action!, ticket.id)}
                        className={`font-medium ${
                          isDarkMode
                            ? "text-blue-400 hover:text-blue-300"
                            : "text-blue-600 hover:text-blue-700"
                        } hover:underline transition-colors`}
                      >
                        {ticket.action}
                      </button>
                    )}
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

const ClientDashboard: React.FC = () => {
  const location = useLocation();
  const { showAlert } = useAlert();
  const { isDarkMode } = useTheme();
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

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await ticketService.getTickets();
        const formattedTickets = response.data.map((ticket: ApiTicket) => ({
          id: ticket.id,
          name: ticket.facebook_name,
          amount: ticket.amount,
          status: mapTicketStatus(ticket.status),
          action: getTicketAction(ticket.status),
        }));
        setTickets(formattedTickets);
      } catch (error) {
        showAlert("error", "Failed to fetch tickets");
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [showAlert]);

  const mapTicketStatus = (
    status: string
  ): "Completed" | "Processing" | "Disputed" => {
    switch (status.toLowerCase()) {
      case "completed":
        return "Completed";
      case "new":
      case "validated":
        return "Processing";
      case "declined":
        return "Disputed";
      default:
        return "Processing";
    }
  };

  const getTicketAction = (status: string): string | undefined => {
    switch (status.toLowerCase()) {
      case "completed":
        return "dispute";
      case "declined":
        return "solve";
      default:
        return undefined;
    }
  };

  const handleConnectWallet = () => {
    showAlert("info", "Connecting to wallet...");
  };

  const handleDeposit = () => {
    showAlert("info", "Processing deposit...");
  };

  const handleTicketAction = async (action: string, ticketId: number) => {
    try {
      if (action === "dispute") {
        await ticketService.declineTicket(ticketId.toString());
        showAlert("success", `Ticket #${ticketId} has been disputed`);
      } else if (action === "solve") {
        await ticketService.validateTicket(ticketId.toString());
        showAlert("success", `Ticket #${ticketId} has been solved`);
      }
      // Refresh tickets after action
      const response = await ticketService.getTickets();
      const formattedTickets = response.data.map((ticket: ApiTicket) => ({
        id: ticket.id,
        name: ticket.facebook_name,
        amount: ticket.amount,
        status: mapTicketStatus(ticket.status),
        action: getTicketAction(ticket.status),
      }));
      setTickets(formattedTickets);
    } catch (error) {
      showAlert("error", `Failed to ${action} ticket #${ticketId}`);
      console.error(`Error ${action}ing ticket:`, error);
    }
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
                isDarkMode={isDarkMode}
              />
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
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default ClientDashboard;
