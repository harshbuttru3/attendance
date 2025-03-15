import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import toast from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // Import eye icons

const Login = () => {
  const { user, login } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ employee_id: "", password: "" });
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  // ✅ Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard"); // Changed to /dashboard to match the comment
      // toast.error("Already Logged In!!");
    }
  }, [user, navigate]);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://dce-attendance.onrender.com/api/auth/login", // ✅ Correct Endpoint
        formData
      );
      login(res.data.user); // ✅ Save user info in context
      console.log("User after login:", res.data.user);
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    }
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      } transition duration-300 p-4`}
    >
      <form
        onSubmit={handleSubmit}
        className={`bg-white ${
          darkMode ? "dark:bg-gray-800" : ""
        } p-8 rounded-xl shadow-2xl w-full max-w-md border ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } transition duration-300`}
      >
        <h2
          className={`text-3xl font-bold mb-8 ${
            darkMode ? "text-white" : "text-gray-900"
          } text-center transition duration-300`}
        >
          Login
        </h2>

        {/* ✅ Employee ID Field */}
        <div className="space-y-6">
          <div>
            <label
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              } mb-2 transition duration-300`}
            >
              Employee ID
            </label>
            <input
              type="text"
              name="employee_id"
              placeholder="Enter your Employee ID"
              value={formData.employee_id}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode ? "border-gray-600" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? "bg-gray-700 text-white" : "bg-white"
              } transition duration-300`}
            />
          </div>

          {/* ✅ Password Field */}
          <div>
            <label
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              } mb-2 transition duration-300`}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode ? "border-gray-600" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? "bg-gray-700 text-white" : "bg-white"
                } transition duration-300`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500`}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* ✅ Login Button */}
          <button
            type="submit"
            className={`w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-semibold`}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
