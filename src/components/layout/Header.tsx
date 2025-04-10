import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../hooks/useAuth";
import { LegacyButton } from "../common/LegacyButton";
import { useAlert } from "../../contexts/AlertContext";
import { FaUserCircle } from "react-icons/fa";
import { IoIosMoon, IoMdNotificationsOutline, IoMdSunny } from "react-icons/io";
import { HiBellAlert } from "react-icons/hi2";

const Header: React.FC = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { alerts } = useAlert();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const userRole = user?.roles?.[0]?.name?.toLowerCase() || "user";
  const dashboardTitle =
    userRole === "fulfiller" ? "Fulfiller Dashboard" : "Client Dashboard";
  const navigate = useNavigate();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header
      className={`${
        isDarkMode ? "bg-[#111827] border-gray-800" : "bg-white border-gray-200"
      } border-b`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Breadcrumb */}
          <div className="flex items-center">
            <nav className="flex" aria-label="Breadcrumb">
              <span
                className={`text-xl font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {dashboardTitle}
              </span>
            </nav>
          </div>

          {/* Right side - Icons */}
          <div className="flex items-center gap-3">
            {/* Alert Bell */}
            <button
              className={`${
                isDarkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-500 hover:text-gray-900"
              } relative`}
            >
              <HiBellAlert size={24} className="text-gray-400" />
              {/* <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg> */}
              {alerts?.length > 0 ? (
                <div
                  className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                  title={alerts[0].message}
                ></div>
              ) : null}
            </button>

            {/* Dark Mode Toggle */}
            <button
              className={`${
                isDarkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-500 hover:text-gray-900"
              }`}
              // onClick={toggleTheme}
            >
              {!isDarkMode ? (
                <IoMdSunny size={24} className="text-gray-400" />
              ) : (
                // <svg
                //   className="w-5 h-5"
                //   viewBox="0 0 20 20"
                //   fill="currentColor"
                // >
                //   <path
                //     fillRule="evenodd"
                //     d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                //     clipRule="evenodd"
                //   />
                // </svg>
                // <svg
                //   className="w-5 h-5"
                //   viewBox="0 0 20 20"
                //   fill="currentColor"
                // >
                //   <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                // </svg>
                <IoIosMoon size={24} className="text-gray-400" />
              )}
            </button>

            {/* Profile */}
            <div className="relative">
              <LegacyButton
                buttonType="circleBtn"
                isDarkMode={isDarkMode}
                isDisabled={false}
                onClickAction={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <FaUserCircle size={24} className="text-gray-400" />
                {/* <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Profile"
                  className="w-full h-full object-cover"
                /> */}
              </LegacyButton>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#1F2937] rounded-lg shadow-lg border border-gray-700 z-50">
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                      <FaUserCircle size={48} className="text-gray-400" />
                      {/* <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="First Last Name"
                        className="w-10 h-10 rounded-lg"
                      /> */}
                      <div>
                        <div className="text-sm font-medium text-white">
                          {user?.username}
                        </div>
                        <div className="text-xs text-gray-400">
                          {userRole === "fulfiller" ? "Fulfiller" : "User"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <a
                      href="#"
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg"
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Logout
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
