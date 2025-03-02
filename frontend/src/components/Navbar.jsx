import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
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
      <div className="container mx-auto px-6 py-2 flex justify-between items-center">
        {/* Left Side: Heading + Dashboard Button */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">DCE Attendance</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 focus:outline-none shadow-md"
          >
            Dashboard
          </button>
        </div>

        {/* Right Side: Mobile Menu Toggle */}
        <div className="md:hidden">
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
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none shadow-md"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 focus:outline-none shadow-md"
          >
            Signup
          </button>
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
          className={`md:hidden ${
            darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
          } border-t border-gray-200 dark:border-gray-700 shadow-md`}
        >
          <div className="flex flex-col items-center space-y-4 py-4">
            <button
              onClick={() => navigate("/login")}
              className="w-4/5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none shadow-md"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="w-4/5 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 focus:outline-none shadow-md"
            >
              Signup
            </button>
            <button
              onClick={toggleDarkMode}
              className={`w-4/5 px-4 py-2 rounded-lg transition duration-300 focus:outline-none shadow-md 
                ${
                  darkMode
                    ? "bg-yellow-400 hover:bg-yellow-500"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
            >
              {darkMode ? (
                <span className="flex items-center justify-center">
                  <FaSun className="text-white text-xl mr-2" />
                  Light Mode
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <FaMoon className="text-gray-800 text-xl mr-2" />
                  Dark Mode
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
