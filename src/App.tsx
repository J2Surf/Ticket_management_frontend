import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  BrowserRouter,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "./components/layout/Header";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import WalletPage from "./pages/wallet/WalletPage";
import TicketList from "./components/tickets/TicketList";
import CreateTicketForm from "./components/tickets/CreateTicketForm";
// import DashboardPage from "./pages/dashboard/DashboardPage";
import { useAuth } from "./hooks/useAuth";
import { AuthProvider } from "./hooks/useAuth";
import { AlertProvider } from "./contexts/AlertContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ClientDashboard from "./components/ClientDashboard";
import FulfillerDashboard from "./components/FulfillerDashboard";
import "./App.css";
import { Client } from "./pages";

const queryClient = new QueryClient();

type UserRole = "user" | "fulfiller";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <>
    <Header />
    {children}
  </>
);

function AppRoutes() {
  const { user } = useAuth();
  const userRole = (user?.roles?.[0]?.name as UserRole) || "user";

  // return (
  //   <Routes>
  //     {/* Public routes */}
  //     <Route path="/login" element={<Login />} />
  //     <Route path="/register" element={<Register />} />

  //     {/* Protected routes */}
  //     <Route
  //       path="/"
  //       element={
  //         userRole === "user" ? (
  //           <Navigate to="/client/payment" replace />
  //         ) : (
  //           <Navigate to="/fulfiller/payment" replace />
  //         )
  //       }
  //     />
  //     <Route
  //       path="/client/*"
  //       element={
  //         userRole === "user" ? (
  //           <DashboardLayout>
  //             <ClientDashboard />
  //           </DashboardLayout>
  //         ) : (
  //           <Navigate to="/fulfiller/payment" replace />
  //         )
  //       }
  //     />
  //     <Route
  //       path="/fulfiller/*"
  //       element={
  //         userRole === "fulfiller" ? (
  //           <DashboardLayout>
  //             <FulfillerDashboard />
  //           </DashboardLayout>
  //         ) : (
  //           <Navigate to="/client/payment" replace />
  //         )
  //       }
  //     />

  //     {/* Legacy routes */}
  //     <Route
  //       path="/dashboard"
  //       element={
  //         <PrivateRoute>
  //           <DashboardLayout>
  //             <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
  //               <div className="px-4 py-6 sm:px-0">
  //                 <DashboardPage />
  //               </div>
  //             </main>
  //           </DashboardLayout>
  //         </PrivateRoute>
  //       }
  //     />
  //     <Route
  //       path="/tickets"
  //       element={
  //         <PrivateRoute>
  //           <DashboardLayout>
  //             <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
  //               <div className="px-4 py-6 sm:px-0">
  //                 <div className="mb-8">
  //                   <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
  //                     Create New Ticket
  //                   </h2>
  //                   <div className="mt-4">
  //                     <CreateTicketForm />
  //                   </div>
  //                 </div>
  //                 <div>
  //                   <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
  //                     Tickets
  //                   </h2>
  //                   <div className="mt-4">
  //                     <TicketList />
  //                   </div>
  //                 </div>
  //               </div>
  //             </main>
  //           </DashboardLayout>
  //         </PrivateRoute>
  //       }
  //     />
  //     <Route
  //       path="/wallet"
  //       element={
  //         <PrivateRoute>
  //           <DashboardLayout>
  //             <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
  //               <div className="px-4 py-6 sm:px-0">
  //                 <WalletPage />
  //               </div>
  //             </main>
  //           </DashboardLayout>
  //         </PrivateRoute>
  //       }
  //     />
  //   </Routes>
  // );

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/client/*" element={<Client />} />
      {/* <Route path="/fulfiller/*" element={<Fulfiller />} /> */}
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AlertProvider>
            <div className="min-h-screen bg-gray-50 z-50">
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </div>
          </AlertProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
