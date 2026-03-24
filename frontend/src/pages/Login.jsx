import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext"; // Added AuthContext import
import { FaUser, FaLock, FaArrowRight, FaSchool } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { darkMode } = useContext(ThemeContext);
  const { user } = useContext(AuthContext); // Get user from AuthContext
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // If user is already logged in, redirect to dashboard
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("https://dce-attendance.onrender.com/api/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Login Successful!");
      // Assuming login function from AuthContext is not needed here as we are setting localStorage directly
      // If AuthContext's login function also updates state, it should be called here.
      // For now, relying on the useEffect to redirect if user state updates.
      if (res.data.user.role === "admin") navigate("/admin-dashboard");
      else navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b2438] px-6 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#133b5c]/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#c6b677]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md z-10 animate-fade-in">
        <div className="card-institutional p-10 border-white/10">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#133b5c] mb-6 shadow-xl">
              <FaSchool size={32} />
            </div>
            <h2 className="text-3xl font-extrabold text-white font-serif mb-2">Portal Access</h2>
            <p className="text-white/50 text-sm font-mono tracking-tighter uppercase">Authorized Personnel Only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-[#c6b677] ml-1">Email Identifier</label>
              <div className="relative group">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 transition-colors group-focus-within:text-[#c6b677]" />
                <input
                  type="email"
                  placeholder="name@institution.edu"
                  className="input-institutional pl-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-[#c6b677] ml-1">Secure Password</label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 transition-colors group-focus-within:text-[#c6b677]" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-institutional pl-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-institutional w-full mt-8 h-12 shadow-lg hover:shadow-[#c6b677]/20"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In Securely <FaArrowRight /></>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/10 text-center">
            <p className="text-white/40 text-xs font-medium mb-4 uppercase tracking-widest">
              Administrative Issue?
            </p>
            <Link to="/" className="text-[#c6b677] hover:text-white transition-colors text-xs font-bold uppercase tracking-widest" onClick={() => navigate("/")}>
              Return to Gateway
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
