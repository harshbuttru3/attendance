import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext"; // Import ThemeContext

const NotFound = () => {
  const { darkMode } = useContext(ThemeContext); // Access dark mode state

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } transition duration-300 p-4`}
    >
      <div
        className={`text-center p-8 rounded-xl shadow-2xl border ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } transition duration-300`}
      >
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className={`px-6 py-3 rounded-lg text-lg font-semibold transition duration-300 focus:outline-none shadow-md ${
            darkMode
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
