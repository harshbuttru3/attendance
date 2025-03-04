import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

const Home = () => {
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext); // Access dark mode state
  const navigate = useNavigate();

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } transition duration-300 p-6`}
    >
      {/* Hero Section */}
      <div
        className={`max-w-4xl text-center p-8 rounded-lg shadow-2xl ${
          darkMode ? "bg-gray-800" : "bg-white"
        } transition duration-300`}
      >
        <h1 className="text-5xl font-bold mb-6">
          Welcome to Centralized Attendance System
        </h1>
        <p className="text-xl mb-8">
          Manage student attendance efficiently with our system.
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
          {user ? (
            <button
              onClick={() => navigate("/dashboard")}
              className={`px-6 py-3 rounded-lg text-lg font-semibold transition duration-300 focus:outline-none shadow-md ${
                darkMode
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className={`px-6 py-3 rounded-lg text-lg font-semibold transition duration-300 focus:outline-none shadow-md ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className={`px-6 py-3 rounded-lg text-lg font-semibold transition duration-300 focus:outline-none shadow-md ${
                  darkMode
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                Signup
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
