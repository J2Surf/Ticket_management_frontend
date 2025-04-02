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

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <div>
              <Header />
              <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                  {/* <DashboardPage /> */}
                </div>
              </main>
            </div>
          </PrivateRoute>
        }
      />
      {/* <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <div>
              <Header />
              <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                  <DashboardPage />
                </div>
              </main>
            </div>
          </PrivateRoute>
        }
      /> */}
      <Route
        path="/tickets"
        element={
          <PrivateRoute>
            <Header />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <div className="px-4 py-6 sm:px-0">
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Create New Ticket
                  </h2>
                  <div className="mt-4">
                    <CreateTicketForm />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Tickets
                  </h2>
                  <div className="mt-4">
                    <TicketList />
                  </div>
                </div>
              </div>
            </main>
          </PrivateRoute>
        }
      />
      <Route
        path="/wallet"
        element={
          <PrivateRoute>
            <Header />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <div className="px-4 py-6 sm:px-0">
                <WalletPage />
              </div>
            </main>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          {/* <Router> */}
          <AppRoutes />
          {/* </Router> */}
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
