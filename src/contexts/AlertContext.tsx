import React, { createContext, useContext, useState } from "react";
import Alert, { AlertType } from "../components/common/Alert";

interface AlertContextType {
  showAlert: (type: AlertType, message: string) => void;
  alerts: AlertMessage[];
  removeAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface AlertMessage {
  id: string;
  type: AlertType;
  message: string;
}

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  const showAlert = (type: AlertType, message: string) => {
    const id = Date.now().toString();
    setAlerts((prev) => [...prev, { id, type, message }]);
  };

  const removeAlert = () => {
    setAlerts([]);
  };

  return (
    <AlertContext.Provider value={{ showAlert, alerts, removeAlert }}>
      {children}
      {/* {alerts.map((alert) => (
        <Alert
          key={alert.id}
          type={alert.type}
          message={alert.message}
          onClose={() => removeAlert(alert.id)}
        />
      ))} */}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
