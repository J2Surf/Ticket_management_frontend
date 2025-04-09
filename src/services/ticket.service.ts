import { api } from "./api";
import axios from "axios";

export interface Ticket {
  id: number;
  ticket_id?: string;
  created_at?: string;
  facebook_name: string;
  amount: number;
  status: string;
  payment_method?: string;
  account_name?: string;
  image?: string;
  game: string;
  game_id: string;
  payment_tag: string;
  payment_qr_code: string;
}

export interface CreateTicketDto {
  facebook_name: string;
  amount: number;
  game: string;
  game_id: string;
  payment_method: string;
  payment_tag: string;
  account_name: string;
  payment_qr_code: string;
}

export interface TicketResponse {
  data: Ticket[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const ticketService = {
  async getTickets(
    status?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<TicketResponse> {
    const response = await api.get<TicketResponse>("/tickets", {
      params: { status, page, limit },
    });
    return response.data;
  },

  async getTicket(id: string): Promise<Ticket> {
    const response = await api.get<Ticket>(`/tickets/${id}`);
    return response.data;
  },

  async createTicket(data: CreateTicketDto): Promise<Ticket> {
    const response = await api.post<Ticket>("/tickets", data);
    return response.data;
  },

  async validateTicket(id: string): Promise<Ticket> {
    const response = await api.put<Ticket>(`/tickets/${id}/validate`);
    return response.data;
  },

  async declineTicket(id: string): Promise<Ticket> {
    const response = await api.put<Ticket>(`/tickets/${id}/decline`);
    return response.data;
  },

  async completeTicket(
    id: string,
    fulfillerId: number,
    paymentImageUrl: string
  ): Promise<Ticket> {
    const response = await api.put(`/tickets/${id}/complete`, {
      fulfiller_id: fulfillerId,
      paymentImageUrl: paymentImageUrl,
    });
    return response.data;
  },

  async getTicketsByStatus(status: string): Promise<Ticket[]> {
    const response = await api.get<Ticket[]>(`/tickets/status/${status}`);
    return response.data;
  },

  async updateTicketStatus(
    id: string,
    action: "validated" | "declined" | "completed",
    data?: {
      fulfillerId?: number;
      paymentImageUrl?: string;
    }
  ): Promise<Ticket> {
    switch (action) {
      case "validated":
        return this.validateTicket(id);
      case "declined":
        return this.declineTicket(id);
      case "completed":
        if (!data?.fulfillerId || !data?.paymentImageUrl) {
          throw new Error("Missing required data for completing ticket");
        }
        return this.completeTicket(id, data.fulfillerId, data.paymentImageUrl);
      default:
        throw new Error("Invalid ticket status update action");
    }
  },
};
