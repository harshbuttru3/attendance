import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import Loader from "../components/Loader";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast"; // Import toast

const AdminLogin = () => {
  const [formData, setFormData] = useState({ employee_id: "", password: "" });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { darkMode } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false); // State to manage loading

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true when the request starts

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/auth/login",
        formData
      );
      localStorage.setItem("adminToken", res.data.token);
      console.log(res.data);
      toast.success(res.data.message); // Use react-hot-toast for success message
      setTimeout(() => navigate("/admin/dashboard"), 100);
    } catch (err) {
      toast.error(
        "Error: " + (err.response?.data?.error || "Something went wrong")
      ); // Use react-hot-toast for error message
    } finally {
      setIsLoading(false); // Set loading to false when the request finishes (success or error)
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      } transition duration-300 p-4`}
    >
      {isLoading ? (
        <Loader size="h-12 w-12" color="text-blue-500" />
      ) : (
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
            Admin Login
          </h2>

          <div className="space-y-6">
            {/* ✅ Employee ID Field */}
            <div>
              <label
                className={`block text-sm font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                } mb-2 transition duration-300`}
              >
                Admin ID
              </label>
              <input
                type="text"
                name="employee_id"
                placeholder="Enter your Admin ID"
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
      )}
    </div>
  );
};

export default AdminLogin;
