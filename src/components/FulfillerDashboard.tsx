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
import WithdrawModal from "./WithdrawModal";
import ProcessingModal from "./ProcessingModal";
import { useAuth } from "../hooks/useAuth";
import { format } from "date-fns";

interface User {
  id: number;
  // Add other user properties as needed
}

interface Transaction {
  date: string;
  income?: number;
  outcome?: number;
  ticketName: string;
  transactionHash: string;
}

interface Ticket {
  id: number;
  ticket_id: string;
  time: string;
  amount: number;
  status: string;
  payment_method: string;
  payment_tag: string;
  account_name: string;
  image: string;
  action?: string;
}

// Helper function to convert API ticket to UI ticket
const convertApiTicketToUiTicket = (apiTicket: ApiTicket): Ticket => ({
  id: apiTicket.id,
  ticket_id: apiTicket.ticket_id || `TICKET-${apiTicket.id}`,
  time: apiTicket.created_at || new Date().toISOString(),
  amount: apiTicket.amount,
  status: apiTicket.status,
  payment_method: apiTicket.payment_method || "N/A",
  payment_tag: apiTicket.payment_tag || "N/A",
  account_name: apiTicket.account_name || "N/A",
  image: apiTicket.image || "",
});

const PaymentSection: React.FC<{
  // transactions: Transaction[];
  balance: number;
  onConnectWallet: () => void;
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
  // transactions,
  balance,
  onConnectWallet,
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
        <h1 className="text-2xl font-semibold">Payments</h1>
        {/* <span className="text-sm text-gray-500">Last updated: 12:13:00 AM</span> */}
      </div>
      <div className="flex gap-4">
        <div className="relative">
          <button
            onClick={() => setShowWalletDropdown(!showWalletDropdown)}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
              isDarkMode
                ? "bg-[#1F2937] text-gray-200 hover:bg-gray-800"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
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
            {/* This Month */}
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
  // tickets: Ticket[];
  onAction: (action: string, ticketId: string) => void;
  isDarkMode: boolean;
  loading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  user: User | null;
}> = ({
  // tickets,
  onAction,
  isDarkMode,
  loading = false,
  currentPage,
  totalPages,
  onPageChange,
  sortField,
  sortDirection,
  onSort,
  user,
}) => {
  const { showAlert } = useAlert();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [incomingTickets, setIncomingTickets] = useState<Ticket[]>([]);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);
  const [processInterval, setProcessInterval] = useState<number | null>(null);
  const [acceptedTickets, setAcceptedTickets] = useState<Ticket[]>([]);
  const [holdingBalance, setHoldingBalance] = useState<number>(0);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [ticketTimers, setTicketTimers] = useState<Record<number, number>>({});

  // Create new tickets every 20 seconds
  useEffect(() => {
    let isMounted = true;
    const createNewTicket = async () => {
      if (!isMounted) return;

      try {
        // Generate random ticket data
        const paymentMethods = ["Apple Pay", "CashApp", "PayPal", "Venmo"];
        const randomPaymentMethod =
          paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
        const randomAmount = Math.floor(Math.random() * 1000) + 50; // Random amount between 50 and 1050

        // Create a new ticket using the API
        const newTicket = await ticketService.createTicket({
          facebook_name: `User-${Math.floor(Math.random() * 1000)}`,
          amount: randomAmount,
          game: "Random Game",
          game_id: `GAME-${Math.floor(Math.random() * 1000)}`,
          payment_method: randomPaymentMethod,
          payment_tag: `TAG-${Math.floor(Math.random() * 1000)}`,
          account_name: `User-${Math.floor(Math.random() * 1000)}`,
          payment_qr_code: "https://example.com/qr-code.png",
        });

        const validateTicket = await ticketService.validateTicket(
          newTicket.id.toString()
        );

        // Convert API ticket to UI ticket and add to incoming tickets
        const uiTicket = convertApiTicketToUiTicket(validateTicket);
        setIncomingTickets((prev) => [...prev, uiTicket]);

        console.log("Created new ticket:", uiTicket);
      } catch (error) {
        console.error("Error creating new ticket:", error);
      }
    };

    // Initial creation
    createNewTicket();

    // Set up interval for subsequent creations
    const interval = window.setInterval(createNewTicket, 20000);
    setRefreshInterval(interval);

    // Cleanup
    return () => {
      isMounted = false;
      if (refreshInterval) {
        window.clearInterval(refreshInterval);
      }
    };
  }, []);

  // Process oldest tickets every 30 seconds
  useEffect(() => {
    const processOldestTicket = async () => {
      try {
        if (incomingTickets.length > 0) {
          // Sort tickets by time (oldest first)
          const sortedTickets = [...incomingTickets].sort(
            (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
          );

          // Get the oldest ticket
          const oldestTicket = sortedTickets[0];

          // Process the oldest ticket
          await handleProcessTicket(oldestTicket, user);

          console.log("Processed oldest ticket:", oldestTicket);
        }
      } catch (error) {
        console.error("Error processing oldest ticket:", error);
      }
    };

    // Set up interval for processing oldest tickets
    const interval = window.setInterval(processOldestTicket, 30000);
    setProcessInterval(interval);

    // Cleanup
    return () => {
      if (processInterval) {
        window.clearInterval(processInterval);
      }
    };
  }, [incomingTickets]);

  // Check for tickets that have been in the system for more than 1 hour
  useEffect(() => {
    const checkTicketTimers = () => {
      const now = Date.now();
      // const oneHourInMs = 60 * 60 * 1000; // 1 hour in milliseconds
      const oneHourInMs = 10 * 1000; // 1 hour in milliseconds

      // Check each accepted ticket
      acceptedTickets.forEach((ticket) => {
        // If we don't have a timer for this ticket yet, set it
        if (!ticketTimers[ticket.id]) {
          setTicketTimers((prev) => ({
            ...prev,
            [ticket.id]: now,
          }));
        } else {
          // Calculate how long the ticket has been in the system
          const ticketAge = now - ticketTimers[ticket.id];

          // If the ticket has been in the system for more than 1 hour
          if (ticketAge > oneHourInMs) {
            // Show a warning alert
            showAlert(
              "warning",
              `Ticket ${ticket.ticket_id} has been in your account for more than 1 hour. Please process it soon.`
            );

            // Update the timer to prevent showing the alert every second
            setTicketTimers((prev) => ({
              ...prev,
              [ticket.id]: now - oneHourInMs + 1000, // Reset to just under 1 hour to show again in 1 minute
            }));
          }
        }
      });
    };

    // Run the check every minute
    const interval = setInterval(checkTicketTimers, 1000);

    // Run immediately on first render
    checkTicketTimers();

    // Cleanup
    return () => clearInterval(interval);
  }, [acceptedTickets, ticketTimers, showAlert]);

  // Show all tickets
  // useEffect(() => {
  //   const fetchTickets = async () => {
  //     try {
  //       const response = await ticketService.getTickets(
  //         undefined,
  //         currentPage,
  //         limit
  //       );
  //       const formattedTickets = response.data.map((ticket: ApiTicket) => ({
  //         id: ticket.id,
  //         ticket_id: ticket.ticket_id || `TICKET-${ticket.id}`,
  //         time: ticket.created_at || new Date().toISOString(),
  //         amount: ticket.amount,
  //         status: mapTicketStatus(ticket.status),
  //         payment_method: ticket.payment_method || "N/A",
  //         payment_tag: ticket.payment_tag || "N/A",
  //         account_name: ticket.account_name || "N/A",
  //         image: ticket.image || "",
  //       }));

  //       // Sort tickets based on current sort field and direction
  //       const sortedTickets = sortTickets(
  //         formattedTickets,
  //         sortField,
  //         sortDirection
  //       );

  //       setTickets(sortedTickets);
  //       setTotalPages(response.meta.totalPages);
  //     } catch (error) {
  //       showAlert("error", "Failed to fetch tickets");
  //       console.error("Error fetching tickets:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchTickets();
  // }, [showAlert, currentPage, limit, sortField, sortDirection]);

  // Show accepted tickets
  useEffect(() => {
    // Sort tickets based on current sort field and direction
    const sortedTickets = sortTickets(
      acceptedTickets,
      sortField,
      sortDirection
    );

    setTickets(sortedTickets);
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

  const handleAddTicket = async (ticket: Ticket) => {
    if (acceptedTickets.length >= 5) {
      return;
    }

    try {
      // Remove the ticket from incoming tickets
      setIncomingTickets((prev) => prev.filter((t) => t.id !== ticket.id));

      setHoldingBalance(
        (prevBalance) => Number(prevBalance) + Number(ticket.amount)
      );
      setAcceptedTickets((prev) => [...prev, ticket]);

      // Set the timer for this ticket
      setTicketTimers((prev) => ({
        ...prev,
        [ticket.id]: Date.now(),
      }));

      // Update the ticket status to "pending" in the API
      // await ticketService.updateTicketStatus(ticket.id, "pending");

      // Refresh the main tickets table
      // onAction("refresh", 0);
    } catch (error) {
      console.error("Error adding ticket:", error);
      // Add the ticket back to incoming tickets if there's an error
      setIncomingTickets((prev) => [...prev, ticket]);
    }
  };

  const handleProcessTicket = async (ticket: Ticket, user: User | null) => {
    try {
      // Remove the ticket from incoming tickets
      setAcceptedTickets((prev) => prev.filter((t) => t.id !== ticket.id));

      // Remove the timer for this ticket
      setTicketTimers((prev) => {
        const newTimers = { ...prev };
        delete newTimers[ticket.id];
        return newTimers;
      });

      setCurrentBalance(
        (prevBalance) => Number(prevBalance) + Number(ticket.amount)
      );

      // Update the ticket status to "completed" in the API
      if (!user) {
        showAlert("error", "User not authenticated");
        return;
      }

      await ticketService.completeTicket(
        ticket.id.toString(),
        user.id,
        "http://example.com/image.png"
      );

      // Refresh the main tickets table
      onAction("refresh", ticket.ticket_id);
    } catch (error) {
      console.error("Error processing ticket:", error);
    }
  };

  const getTicketAction = (status: string): boolean => {
    // return status.toLowerCase() === "validated";
    return true;
  };

  const getCompletedAction = (status: string): boolean => {
    return status.toLowerCase() === "validated";
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
        <h1 className="text-2xl font-semibold">Tickets</h1>
        <span className="text-sm text-gray-500">
          {/* Last updated: {new Date().toLocaleTimeString()} */}
        </span>
      </div>
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8`}
      >
        <div
          className={`${
            isDarkMode ? "bg-[#1F2937]" : "bg-white"
          } p-6 rounded-xl ${isDarkMode ? "" : "shadow-sm"}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`p-2 rounded-lg ${
                  isDarkMode ? "bg-green-500/10" : "bg-green-50"
                }`}
              >
                <svg
                  className="w-6 h-6 text-green-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                </svg>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Current Balance
                </p>
                <p
                  className={`text-xl font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  ${currentBalance.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`${
            isDarkMode ? "bg-[#1F2937]" : "bg-white"
          } p-6 rounded-xl ${isDarkMode ? "" : "shadow-sm"}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`p-2 rounded-lg ${
                  isDarkMode ? "bg-purple-500/10" : "bg-purple-50"
                }`}
              >
                <svg
                  className="w-6 h-6 text-purple-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                </svg>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Holding Balance
                </p>
                <p
                  className={`text-xl font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  ${holdingBalance.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-8`}
      >
        <div
          className={`${
            isDarkMode ? "bg-[#1F2937]" : "bg-white"
          } rounded-xl p-6 ${
            isDarkMode ? "" : "shadow-sm"
          } md:col-span-3 lg:col-span-3`}
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
                Accepted Tickets
              </h2>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? isDarkMode
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : isDarkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                First
              </button>
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? isDarkMode
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : isDarkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Previous
              </button>
              <span
                className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? isDarkMode
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : isDarkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Next
              </button>
              <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? isDarkMode
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : isDarkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Last
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : acceptedTickets.length === 0 ? (
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
                        onClick={() => onSort("ticket_id")}
                      >
                        Ticket ID {getSortIcon("ticket_id")}
                      </button>
                    </th>
                    <th
                      className={`p-4 text-left ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <button
                        className="flex items-center focus:outline-none"
                        onClick={() => onSort("payment_method")}
                      >
                        Payment Method {getSortIcon("payment_method")}
                      </button>
                    </th>
                    <th
                      className={`p-4 text-left ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <button
                        className="flex items-center focus:outline-none"
                        onClick={() => onSort("payment_tag")}
                      >
                        Payment Tag {getSortIcon("payment_tag")}
                      </button>
                    </th>
                    <th
                      className={`p-4 text-left ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <button
                        className="flex items-center focus:outline-none"
                        onClick={() => onSort("account_name")}
                      >
                        Account Name {getSortIcon("account_name")}
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
                      Image
                    </th>
                    <th
                      className={`p-4 text-left ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    isDarkMode ? "divide-gray-700" : "divide-gray-100"
                  }`}
                >
                  {acceptedTickets.map((ticket) => (
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
                        {ticket.ticket_id}
                      </td>
                      <td
                        className={`p-4 ${
                          isDarkMode ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        {ticket.payment_method}
                      </td>
                      <td
                        className={`p-4 ${
                          isDarkMode ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        {ticket.payment_tag}
                      </td>
                      <td
                        className={`p-4 ${
                          isDarkMode ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        {ticket.account_name}
                      </td>
                      <td
                        className={`p-4 font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        {ticket.amount} USDT
                      </td>
                      <td className="p-4">
                        {ticket.image && (
                          <button
                            className={`p-2 rounded-lg ${
                              isDarkMode
                                ? "bg-gray-700 hover:bg-gray-600"
                                : "bg-gray-100 hover:bg-gray-200"
                            }`}
                            onClick={() => window.open(ticket.image, "_blank")}
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
                        )}
                      </td>
                      <td className="p-4">
                        {getTicketAction(ticket.status) ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleProcessTicket(ticket, user)}
                              className={`font-medium ${
                                isDarkMode
                                  ? "text-blue-400 hover:text-blue-300"
                                  : "text-blue-600 hover:text-blue-700"
                              } hover:underline transition-colors`}
                            >
                              Process
                            </button>
                          </div>
                        ) : getCompletedAction(ticket.status) ? (
                          <button
                            onClick={() =>
                              onAction("complete", ticket.ticket_id)
                            }
                            className={`font-medium ${
                              isDarkMode
                                ? "text-blue-400 hover:text-blue-300"
                                : "text-blue-600 hover:text-blue-700"
                            } hover:underline transition-colors`}
                          >
                            Complete
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div
          className={`${
            isDarkMode ? "bg-[#1F2937]" : "bg-white"
          } rounded-xl p-6 ${isDarkMode ? "" : "shadow-sm"}`}
        >
          <div className="flex flex-col h-full">
            <h2
              className={`text-xl font-semibold mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Incoming Tickets
            </h2>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              } mb-6`}
            >
              New tickets arrive every 20 seconds
            </p>

            <div className="space-y-4">
              {incomingTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between bg-white/5 p-4 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-1 h-12 ${
                        ticket.payment_method === "Apple Pay"
                          ? "bg-black"
                          : ticket.payment_method === "CashApp"
                          ? "bg-green-500"
                          : ticket.payment_method === "PayPal"
                          ? "bg-fuchsia-500"
                          : "bg-blue-500"
                      } rounded-full`}
                    ></div>
                    <div>
                      <p
                        className={`font-medium ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {ticket.ticket_id}
                      </p>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {ticket.payment_method}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddTicket(ticket)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FulfillerDashboard: React.FC = () => {
  const location = useLocation();
  const { showAlert, removeAlert } = useAlert();
  const { isDarkMode } = useTheme();
  const { user } = useAuth() as { user: User | null };
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

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [sortField, setSortField] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);
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
        const walletData: Wallet = {
          id: newWallet.id,
          type: "FULFILLER", // Use the correct wallet type from the frontend interface
          balance: newWallet.balance,
          userId: 0, // This will be set by the backend
          address: newWallet.address,
          created_at: newWallet.createdAt,
          updated_at: newWallet.updatedAt,
          token_type: "USDT", // Add the token type
        };

        setWallets([...wallets, walletData]);
        setSelectedWallet(walletData);
        showAlert("success", "Wallet created successfully");

        // Fetch updated wallet data
        const updatedWallet = await walletService.getWallet("ETH");
        setBalance(updatedWallet.balance);
      } else if (!selectedWallet) {
        showAlert("error", "Please select a wallet first");
        return;
      } else {
        const connectedWallet = await walletService.connectWallet({
          type: "ETH",
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

    console.log("Processing modal open");
    setIsProcessingModalOpen(true);
  };

  const handleTicketAction = async (action: string, ticketId: string) => {
    try {
      setLoading(true);
      if (action === "validate") {
        await ticketService.validateTicket(ticketId);
        showAlert("success", `Ticket #${ticketId} has been validated`);
      } else if (action === "decline") {
        await ticketService.declineTicket(ticketId);
        showAlert("success", `Ticket #${ticketId} has been declined`);
      } else if (action === "complete") {
        if (!user) {
          showAlert("error", "User not authenticated");
          return;
        }

        await ticketService.completeTicket(
          ticketId,
          user.id,
          "https://example.com/payment/123456.jpg"
        );
        showAlert("success", `Ticket #${ticketId} has been completed`);
      }
      // Refresh tickets after action
      const response = await ticketService.getTickets(
        undefined,
        currentPage,
        limit
      );
      const formattedTickets = response.data.map((ticket: ApiTicket) => ({
        id: ticket.id,
        ticket_id: ticket.ticket_id || `TICKET-${ticket.id}`,
        time: ticket.created_at || new Date().toISOString(),
        amount: ticket.amount,
        status: mapTicketStatus(ticket.status),
        payment_method: ticket.payment_method || "N/A",
        payment_tag: ticket.payment_tag || "N/A",
        account_name: ticket.account_name || "N/A",
        image: ticket.image || "",
      }));

      // Sort tickets based on current sort field and direction
      // const sortedTickets = sortTickets(
      //   formattedTickets,
      //   sortField,
      //   sortDirection
      // );

      // setTickets(sortedTickets);
      // setTotalPages(response.meta.totalPages);
    } catch (error) {
      showAlert("error", `Failed to ${action} ticket #${ticketId}`);
      console.error(`Error ${action}ing ticket:`, error);
    } finally {
      removeAlert();
      setLoading(false);
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
      category: "Fulfiller",
      name: "Payments",
      path: "/fulfiller/payment",
      icon: <PaymentIcon />,
      isActive: location.pathname.includes("/payment"),
    },
    {
      category: "Fulfiller",
      name: "Tickets",
      path: "/fulfiller/ticket",
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
              <PaymentSection
                // transactions={transactions}
                balance={balance}
                onConnectWallet={handleConnectWallet}
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
            }
          />
          <Route
            path="/ticket"
            element={
              <TicketSection
                // tickets={tickets}
                onAction={handleTicketAction}
                isDarkMode={isDarkMode}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                user={user}
              />
            }
          />
        </Routes>
      </div>
      {isWithdrawModalOpen && (
        <WithdrawModal
          isOpen={isWithdrawModalOpen}
          onClose={() => setIsWithdrawModalOpen(false)}
          onWithdraw={handleWithdrawSubmit}
          isDarkMode={isDarkMode}
          selectedWallet={selectedWallet}
          balance={balance}
          gasFee={gasFee}
        />
      )}
      {isProcessingModalOpen && (
        <ProcessingModal
          isOpen={isProcessingModalOpen}
          onClose={() => setIsProcessingModalOpen(false)}
          isDarkMode={isDarkMode}
          onComplete={() => {
            // setIsProcessingModalOpen(false);
            setLoading(true);
            // Refresh tickets after processing
            ticketService
              .getTickets(undefined, currentPage, limit)
              .then((response) => {
                const formattedTickets = response.data.map(
                  (ticket: ApiTicket) => ({
                    id: ticket.id,
                    ticket_id: ticket.ticket_id || `TICKET-${ticket.id}`,
                    time: ticket.created_at || new Date().toISOString(),
                    amount: ticket.amount,
                    status: mapTicketStatus(ticket.status),
                    payment_method: ticket.payment_method || "N/A",
                    payment_tag: ticket.payment_tag || "N/A",
                    account_name: ticket.account_name || "N/A",
                    image: ticket.image || "",
                  })
                );
                // setTickets(
                //   sortTickets(formattedTickets, sortField, sortDirection)
                // );
                setTotalPages(response.meta.totalPages);
                setLoading(false);
              });
          }}
        />
      )}
    </div>
  );
};

export default FulfillerDashboard;
