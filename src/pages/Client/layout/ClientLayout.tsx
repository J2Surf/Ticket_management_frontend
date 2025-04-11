import Panel from "../../../components/Panel";
import { useTheme } from "../../../contexts/ThemeContext";
import { BaseLayout } from "../../../layout/BaseLayout";
import Payment from "../../../assets/svg/payment.svg";
import Ticket from "../../../assets/svg/ticket.svg";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const { isDarkMode } = useTheme();
  const panelItems = [
    {
      category: "User",
      name: "Payments",
      path: "/client/payment",
      icon: <img src={Payment} />,
      isActive: location.pathname.includes("/payment"),
    },
    {
      category: "User",
      name: "Tickets",
      path: "/client/ticket",
      icon: <img src={Ticket} />,
      isActive: location.pathname.includes("/ticket"),
    },
  ];
  return (
    <BaseLayout>
      <div
        className={`flex min-h-screen ${
          isDarkMode ? "bg-[#111827] text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <Panel items={panelItems} />
        {children}
      </div>
    </BaseLayout>
  );
};
