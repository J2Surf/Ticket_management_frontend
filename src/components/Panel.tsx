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

        <div className="mb-8">
          <div
            className={`text-xs font-medium ${
              isDarkMode ? "text-gray-500" : "text-gray-400"
            } mb-4`}
          >
            TEAM
          </div>
          <nav className="space-y-1">
            <Link
              to=""
              // to="/members"
              className={`flex items-center ${
                isDarkMode
                  ? "text-gray-300 hover:text-white hover:bg-gray-800"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              } py-2 px-3 rounded-lg`}
            >
              <svg
                className="w-5 h-5 mr-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span className="text-sm">Members</span>
            </Link>

            {/* Separator */}
            <div
              className={`h-px mx-3 ${
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              }`}
            ></div>

            <Link
              to=""
              // to="/settings"
              className={`flex items-center ${
                isDarkMode
                  ? "text-gray-300 hover:text-white hover:bg-gray-800"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              } py-2 px-3 rounded-lg`}
            >
              <svg
                className="w-5 h-5 mr-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">Settings</span>
            </Link>

            <Link
              to=""
              // to="/help"
              className={`flex items-center ${
                isDarkMode
                  ? "text-gray-300 hover:text-white hover:bg-gray-800"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              } py-2 px-3 rounded-lg`}
            >
              <svg
                className="w-5 h-5 mr-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">Help</span>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Panel;
