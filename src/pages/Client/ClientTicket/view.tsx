import React, { useState, useEffect } from "react";
import { useAlert } from "../../../contexts/AlertContext";
import { useTheme } from "../../../contexts/ThemeContext";
import {
  ticketService,
  Ticket as ApiTicket,
} from "../../../services/ticket.service";
import {
  walletService,
  Wallet,
  CryptoTransaction,
} from "../../../services/wallet.service";
import { LegacyButton } from "../../../components/common/LegacyButton";

interface Ticket {
  id: number;
  name: string;
  amount: number;
  status: string;
  action?: string;
}

export const ClientTicket: React.FC = () => {
  const { showAlert } = useAlert();
  const { isDarkMode } = useTheme();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [sortField, setSortField] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [wallets, setWallets] = useState<Wallet[]>([]);
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
    <div className="flex-1 p-8 overflow-auto">
      <div className="space-y-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Tickets</h2>
          <span className="text-sm text-gray-500">
            {/* Last updated: {new Date().toLocaleTimeString()} */}
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
                onClickAction={() => handlePageChange(1)}
              >
                First
              </LegacyButton>
              <LegacyButton
                buttonType="commonBtn"
                isDarkMode={isDarkMode}
                isDisabled={currentPage === 1}
                onClickAction={() => handlePageChange(currentPage - 1)}
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
                onClickAction={() => handlePageChange(currentPage + 1)}
              >
                Next
              </LegacyButton>
              <LegacyButton
                buttonType="commonBtn"
                isDarkMode={isDarkMode}
                isDisabled={currentPage === totalPages}
                onClickAction={() => handlePageChange(totalPages)}
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
                        onClick={() => handleSort("id")}
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
                        onClick={() => handleSort("name")}
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
                        onClick={() => handleSort("amount")}
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
                        onClick={() => handleSort("status")}
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
                              onClick={() =>
                                handleTicketAction("validate", ticket.id)
                              }
                              className={`font-medium ${
                                isDarkMode
                                  ? "text-green-400 hover:text-green-300"
                                  : "text-green-600 hover:text-green-700"
                              } hover:underline transition-colors`}
                            >
                              Validate
                            </button>
                            <button
                              onClick={() =>
                                handleTicketAction("decline", ticket.id)
                              }
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
    </div>
  );
};
