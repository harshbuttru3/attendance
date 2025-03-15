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
      className={`fixed top-0 w-full z-50 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } shadow-md transition duration-300`}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Left Side: Heading + Dashboard Link */}
        <div className="flex items-center space-x-4">
          {/* Clickable Heading */}
          <h1
            onClick={() => navigate("/")} // Navigate to home route
            className="text-xl md:text-2xl font-bold cursor-pointer hover:text-purple-600 transition duration-300"
          >
            DCE Attendance
          </h1>
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="/dashboard"
              className="flex items-center space-x-2 text-base font-medium hover:text-purple-600 transition duration-300 cursor-pointer"
            >
              <FaHome className="text-lg" />
              <span>Dashboard</span>
            </a>
            <a
              href="/attendance"
              className="flex items-center space-x-2 text-base font-medium hover:text-purple-600 transition duration-300 cursor-pointer"
            >
              <FaClipboardList className="text-lg" />
              <span>All Attendance</span>
            </a>
            {/* Admin Dashboard Link (Visible to All) */}
            <a
              href="/admin/dashboard"
              className="flex items-center space-x-2 text-base font-medium hover:text-purple-600 transition duration-300 cursor-pointer"
            >
              <FaUserCog className="text-lg" />
              <span>Admin Dashboard</span>
            </a>
          </div>
        </div>

        {/* Right Side: Mobile Menu Toggle */}
        <div className="md:hidden flex items-center space-x-2">
          {/* Dark/Light Mode Toggler */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition duration-300 focus:outline-none shadow-md cursor-pointer ${
              darkMode
                ? "bg-yellow-400 hover:bg-yellow-500"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {darkMode ? (
              <FaSun className="text-white text-lg" />
            ) : (
              <FaMoon className="text-gray-800 text-lg" />
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300 focus:outline-none shadow-md cursor-pointer"
          >
            {isMenuOpen ? (
              <FaTimes className="text-lg" />
            ) : (
              <FaBars className="text-lg" />
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
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 focus:outline-none shadow-md cursor-pointer"
                >
                  <FaSignOutAlt className="text-lg" />
                  <span>Logout</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none shadow-md cursor-pointer"
                >
                  <FaSignInAlt className="text-lg" />
                  <span>Teacher's Login</span>
                </button>
              )}
            </>
          )}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition duration-300 focus:outline-none shadow-md cursor-pointer ${
              darkMode
                ? "bg-yellow-400 hover:bg-yellow-500"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {darkMode ? (
              <FaSun className="text-white text-lg" />
            ) : (
              <FaMoon className="text-gray-800 text-lg" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Full-Width Dropdown) */}
      {isMenuOpen && (
        <div
          className={`fixed top-0 right-0 h-full w-64 ${
            darkMode ? "bg-gray-900/90 text-white" : "bg-white/90 text-gray-900"
          } shadow-lg transform transition-all duration-300 ease-in-out backdrop-blur-md`}
          style={{ transform: "translateX(0)" }} // Directly set transform for stickiness
        >
          <div className="flex flex-col space-y-4 p-6">
            {/* Close Button for Mobile Menu */}
            <div className="flex justify-end mb-4">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-full focus:outline-none cursor-pointer"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            {/* Dashboard Link */}
            <a
              href="/dashboard"
              className="flex items-center space-x-2 text-lg font-medium hover:text-purple-600 transition duration-300 cursor-pointer"
            >
              <FaHome className="text-xl" />
              <span>Dashboard</span>
            </a>

            {/* All Attendance Link */}
            <a
              href="/attendance"
              className="flex items-center space-x-2 text-lg font-medium hover:text-purple-600 transition duration-300 cursor-pointer"
            >
              <FaClipboardList className="text-xl" />
              <span>All Attendance</span>
            </a>

            {/* Admin Dashboard Link (Visible to All) */}
            <a
              href="/admin/dashboard"
              className="flex items-center space-x-2 text-lg font-medium hover:text-purple-600 transition duration-300 cursor-pointer"
            >
              <FaUserCog className="text-xl" />
              <span>Admin Dashboard</span>
            </a>

            {/* Login/Logout Links */}
            {!isAdminRoute && (
              <>
                {user ? (
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 text-lg font-medium hover:text-red-600 transition duration-300 cursor-pointer"
                  >
                    <FaSignOutAlt className="text-xl" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="flex items-center space-x-2 text-lg font-medium hover:text-blue-600 transition duration-300 cursor-pointer"
                  >
                    <FaSignInAlt className="text-xl" />
                    <span>Teacher's Login</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
