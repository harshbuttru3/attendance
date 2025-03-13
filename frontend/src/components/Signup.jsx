import { useState, useContext, useEffect } from "react"; // Added useEffect
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import toast from "react-hot-toast";

const Signup = () => {
  const { user, login } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/attendance");
      // toast.error("Already Logged In!!");
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordMatch, setPasswordMatch] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Use useEffect to check password match after formData is updated
  useEffect(() => {
    if (formData.password && formData.confirmPassword) {
      setPasswordMatch(formData.password === formData.confirmPassword);
    } else {
      setPasswordMatch(null); // Reset if either field is empty
    }
  }, [formData.password, formData.confirmPassword]);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;
      const res = await axios.post(
        "http://https://dce-attendance.onrender.com/api/auth/signup",
        userData,
        { headers: { "Content-Type": "application/json" } }
      );

      alert(res.data.message);
      login(userData);
      navigate("/dashboard");
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || "Something went wrong"));
    }
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
        } p-6 rounded-xl shadow-2xl w-full max-w-md border ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } transition duration-300`}
      >
        <h2
          className={`text-3xl font-bold mb-6 ${
            darkMode ? "text-white" : "text-gray-900"
          } text-center transition duration-300`}
        >
          Sign Up
        </h2>
        <div className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              } mb-2 transition duration-300`}
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode ? "border-gray-600" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? "bg-gray-700 text-white" : "bg-white"
              } transition duration-300`}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              } mb-2 transition duration-300`}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode ? "border-gray-600" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? "bg-gray-700 text-white" : "bg-white"
              } transition duration-300`}
            />
          </div>

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
                className={`absolute right-3 top-2 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                } hover:${
                  darkMode ? "text-gray-300" : "text-gray-700"
                } transition duration-300`}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              } mb-2 transition duration-300`}
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
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
                onClick={toggleConfirmPasswordVisibility}
                className={`absolute right-3 top-2 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                } hover:${
                  darkMode ? "text-gray-300" : "text-gray-700"
                } transition duration-300`}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {passwordMatch === false && (
            <p className="text-red-500 text-sm transition duration-300">
              Passwords do not match
            </p>
          )}
          {passwordMatch === true && (
            <p className="text-green-500 text-sm transition duration-300">
              Passwords match
            </p>
          )}
        </div>

        <button
          type="submit"
          className={`w-full mt-6 ${
            darkMode ? "bg-blue-600" : "bg-blue-600"
          } text-white py-2 rounded-lg hover:${
            darkMode ? "bg-blue-700" : "bg-blue-700"
          } transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          Sign Up
        </button>

        <p
          className={`mt-4 text-center ${
            darkMode ? "text-gray-300" : "text-gray-700"
          } transition duration-300`}
        >
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline focus:outline-none"
          >
            Log In
          </button>
        </p>
      </form>
    </div>
  );
};

export default Signup;
