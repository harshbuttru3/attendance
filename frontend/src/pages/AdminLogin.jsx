import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import Loader from "../components/Loader";
import { FaEye, FaEyeSlash, FaUserShield, FaClock } from "react-icons/fa";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ employee_id: "" , password: "" });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { darkMode } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    try {
      const res = await axios.post(
        "https://dce-attendance.onrender.com/api/admin/auth/login",
        formData
      );
      localStorage.setItem("adminToken", res.data.token);
      toast.success("Administrative Access Granted");
      setTimeout(() => navigate("/admin/dashboard"), 100);
    } catch (err) {
      toast.error(
        "Access Denied: " + (err.response?.data?.error || "Invalid Credentials")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-[#0b2438] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Institutional Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#133b5c]/30 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#c6b677]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-lg z-10 animate-fade-in">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#c6b677]/10 border border-[#c6b677]/20 mb-6 group transition-all duration-700 hover:scale-110">
            <FaUserShield className="text-[#c6b677] group-hover:rotate-12 transition-transform" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 font-serif tracking-tight">
            Admin <span className="text-[#c6b677]">Portal</span>
          </h1>
          <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.4em] flex justify-center items-center gap-2">
            <span className="w-8 h-px bg-white/10" /> Authorized Personnel Only <span className="w-8 h-px bg-white/10" />
          </p>
        </div>

        <div className="card-institutional p-10 border-white/5 shadow-3xl backdrop-blur-2xl relative overflow-hidden">
          {/* Security Overlay */}
          <div className="absolute top-4 right-6 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[8px] font-bold text-white/30 tracking-widest uppercase font-mono">Secure Node: 0x2A</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c6b677] ml-1">Administrative Identifier</label>
              <div className="relative group">
                <input
                  type="text"
                  name="employee_id"
                  placeholder="Employee Reference ID"
                  value={formData.employee_id}
                  onChange={handleChange}
                  required
                  className="input-institutional pl-4 h-14"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-[#c6b677] transition-colors">
                  <FaUserShield size={16} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c6b677] ml-1">Security Credential</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="input-institutional pl-4 h-14 pr-12"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#c6b677] transition-colors cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-institutional w-full h-14 text-sm shadow-xl active:scale-95 flex items-center justify-center gap-4 group"
              >
                {isLoading ? (
                  <Loader size="h-5 w-5" color="text-[#133b5c]" />
                ) : (
                  <>
                    Establish Secure Session
                    <span className="w-8 h-px bg-[#133b5c]/20 group-hover:w-12 transition-all duration-500" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2 text-white/20">
              <FaClock size={10} />
              <span className="text-[8px] font-bold uppercase tracking-widest font-mono">Last Sync: Just Now</span>
            </div>
            <a href="#" className="text-[8px] font-bold uppercase tracking-widest text-[#c6b677]/60 hover:text-[#c6b677] transition-colors">Emergency Reset</a>
          </div>
        </div>
        
        <p className="mt-8 text-center text-[10px] text-white/20 font-bold uppercase tracking-[0.3em]">
          Centralized Attendance Management System v4.0.1
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
