import { Route, Routes } from "react-router-dom";
import { ClientTicketPage } from "./ClientTicket";
import { ClientPaymentPage } from "./ClientPayment";

export const Client = () => {
  return (
    <Routes>
      <Route path="/ticket" element={<ClientTicketPage />} />
      <Route path="/payment" element={<ClientPaymentPage />} />
    </Routes>
  );
};
