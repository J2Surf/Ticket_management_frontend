import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

interface PanelProps {
  items: {
    name: string;
    path: string;
    isActive?: boolean;
    icon?: React.ReactNode;
    badge?: string;
    description?: string;
  }[];
}

const Panel: React.FC<PanelProps> = ({ items }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div
      className={`w-64 min-h-screen ${
        isDarkMode ? "bg-[#111827] border-gray-800" : "bg-white border-gray-200"
      } border-r`}
    >
      <div
        className={`flex items-center justify-between p-4 border-b ${
          isDarkMode ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white">
            <div className="w-4 h-4 bg-white/30 rounded-full"></div>
          </div>
          <span
            className={`text-xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Tapsndr
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-8">
          <div
            className={`text-xs font-medium ${
              isDarkMode ? "text-gray-500" : "text-gray-400"
            } mb-4`}
          >
            OVERVIEW
          </div>
          <nav className="space-y-1">
            {items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center ${
                  isDarkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                } py-2 px-3 rounded-lg ${
                  item.isActive ? "bg-gray-100 dark:bg-gray-800" : ""
                }`}
                title={item.description || item.name}
              >
                {item.icon}
                <span className="text-sm">{item.name}</span>
                {item.badge && (
                  <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Panel;
