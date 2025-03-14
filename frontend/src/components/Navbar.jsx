import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import {
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaHome,
  FaClipboardList,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaUserCog, // Icon for Admin Dashboard
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext); // Get user and logout function
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } shadow-lg transition duration-300`}
    >
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Left Side: Heading + Dashboard Link */}
        <div className="flex items-center space-x-6">
          {/* Clickable Heading */}
          <h1
            onClick={() => navigate("/")} // Navigate to home route
            className="text-2xl font-bold cursor-pointer hover:text-purple-600 transition duration-300"
          >
            DCE Attendance
          </h1>
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="/dashboard"
              className="flex items-center space-x-2 text-lg font-medium hover:text-purple-600 transition duration-300"
            >
              <FaHome className="text-xl" />
              <span>Dashboard</span>
            </a>
            <a
              href="/attendance"
              className="flex items-center space-x-2 text-lg font-medium hover:text-purple-600 transition duration-300"
            >
              <FaClipboardList className="text-xl" />
              <span>All Attendance</span>
            </a>
            {/* Admin Dashboard Link (Visible to All) */}
            <a
              href="/admin/dashboard"
              className="flex items-center space-x-2 text-lg font-medium hover:text-purple-600 transition duration-300"
            >
              <FaUserCog className="text-xl" />
              <span>Admin Dashboard</span>
            </a>
          </div>
        </div>

        {/* Right Side: Mobile Menu Toggle */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Dark/Light Mode Toggler */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition duration-300 focus:outline-none shadow-md 
              ${
                darkMode
                  ? "bg-yellow-400 hover:bg-yellow-500"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            {darkMode ? (
              <FaSun className="text-white text-xl" />
            ) : (
              <FaMoon className="text-gray-800 text-xl" />
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300 focus:outline-none shadow-md"
          >
            {isMenuOpen ? (
              <FaTimes className="text-xl" />
            ) : (
              <FaBars className="text-xl" />
            )}
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {!isAdminRoute && (
            <>
              {user ? (
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 focus:outline-none shadow-md"
                >
                  <FaSignOutAlt className="text-xl" />
                  <span>Logout</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none shadow-md"
                >
                  <FaSignInAlt className="text-xl" />
                  <span>Teacher Login</span>
                </button>
              )}
            </>
          )}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition duration-300 focus:outline-none shadow-md 
              ${
                darkMode
                  ? "bg-yellow-400 hover:bg-yellow-500"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            {darkMode ? (
              <FaSun className="text-white text-xl" />
            ) : (
              <FaMoon className="text-gray-800 text-xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Full-Width Dropdown) */}
      {isMenuOpen && (
        <div
          className={`fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={toggleMenu}
        >
          <div
            className={`fixed top-0 right-0 h-full w-64 ${
              darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
            } shadow-lg transform transition-all duration-500 ease-in-out ${
              isMenuOpen
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }`}
            style={{
              animation: isMenuOpen
                ? "slideInRight 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)"
                : "none",
            }}
          >
            <div className="flex flex-col space-y-6 p-6">
              {/* Dashboard Link */}
              <a
                href="/dashboard"
                className="flex items-center space-x-2 text-lg font-medium hover:text-purple-600 transition duration-300"
                style={{
                  animation: isMenuOpen
                    ? "fadeIn 0.5s ease-in-out 0.2s forwards"
                    : "none",
                  opacity: 0,
                }}
              >
                <FaHome className="text-xl" />
                <span>Dashboard</span>
              </a>

              {/* All Attendance Link */}
              <a
                href="/attendance"
                className="flex items-center space-x-2 text-lg font-medium hover:text-purple-600 transition duration-300"
                style={{
                  animation: isMenuOpen
                    ? "fadeIn 0.5s ease-in-out 0.3s forwards"
                    : "none",
                  opacity: 0,
                }}
              >
                <FaClipboardList className="text-xl" />
                <span>All Attendance</span>
              </a>

              {/* Admin Dashboard Link (Visible to All) */}
              <a
                href="/admin/dashboard"
                className="flex items-center space-x-2 text-lg font-medium hover:text-purple-600 transition duration-300"
                style={{
                  animation: isMenuOpen
                    ? "fadeIn 0.5s ease-in-out 0.4s forwards"
                    : "none",
                  opacity: 0,
                }}
              >
                <FaUserCog className="text-xl" />
                <span>Admin Dashboard</span>
              </a>

              {/* Login/Logout Links */}
              {!isAdminRoute && (
                <>
                  {user ? (
                    <a
                      onClick={logout}
                      className="flex items-center space-x-2 text-lg font-medium hover:text-red-600 transition duration-300 cursor-pointer"
                      style={{
                        animation: isMenuOpen
                          ? "fadeIn 0.5s ease-in-out 0.5s forwards"
                          : "none",
                        opacity: 0,
                      }}
                    >
                      <FaSignOutAlt className="text-xl" />
                      <span>Logout</span>
                    </a>
                  ) : (
                    <>
                      <a
                        onClick={() => navigate("/login")}
                        className="flex items-center space-x-2 text-lg font-medium hover:text-blue-600 transition duration-300 cursor-pointer"
                        style={{
                          animation: isMenuOpen
                            ? "fadeIn 0.5s ease-in-out 0.6s forwards"
                            : "none",
                          opacity: 0,
                        }}
                      >
                        <FaSignInAlt className="text-xl" />
                        <span>Login</span>
                      </a>
                      <a
                        onClick={() => navigate("/signup")}
                        className="flex items-center space-x-2 text-lg font-medium hover:text-green-600 transition duration-300 cursor-pointer"
                        style={{
                          animation: isMenuOpen
                            ? "fadeIn 0.5s ease-in-out 0.7s forwards"
                            : "none",
                          opacity: 0,
                        }}
                      >
                        <FaUserPlus className="text-xl" />
                        <span>Signup</span>
                      </a>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add CSS Animations */}
      <style>
        {`
          @keyframes slideInRight {
            0% {
              transform: translateX(100%);
              opacity: 0;
            }
            60% {
              transform: translateX(-10%);
              opacity: 1;
            }
            100% {
              transform: translateX(0);
              opacity: 1;
            }
          }

          @keyframes fadeIn {
            0% {
              opacity: 0;
              transform: translateY(10px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;
