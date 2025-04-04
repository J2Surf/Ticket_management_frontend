import { api } from "./api";

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
    const response = await api.post<Ticket>(`/tickets/${id}/validate`);
    return response.data;
  },

  async declineTicket(id: string): Promise<Ticket> {
    const response = await api.post<Ticket>(`/tickets/${id}/decline`);
    return response.data;
  },

  async completeTicket(
    id: string,
    data: { paymentImageUrl: string; transactionId: string; user_id: number }
  ): Promise<any> {
    const response = await api.put(`/tickets/${id}/complete`, data);
    return response.data;
  },

  async getTicketsByStatus(status: string): Promise<Ticket[]> {
    const response = await api.get<Ticket[]>(`/tickets/status/${status}`);
    return response.data;
  },
};
