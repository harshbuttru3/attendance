import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import toast from "react-hot-toast";
import { FaUserPlus, FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa";

const Signup = () => {
  const { user, login } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/attendance");
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (formData.password && formData.confirmPassword) {
      setPasswordMatch(formData.password === formData.confirmPassword);
    } else {
      setPasswordMatch(null);
    }
  }, [formData.password, formData.confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill all required fields.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { confirmPassword, ...userData } = formData;
      await axios.post(
        "https://dce-attendance.onrender.com/api/auth/signup",
        userData,
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Account established successfully.");
      login(userData);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b2438] flex items-center justify-center p-6 relative overflow-hidden font-inter">
      {/* Decorative Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#133b5c]/40 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#c6b677]/5 blur-[150px] rounded-full" />
      
      <div className="w-full max-w-lg z-10 animate-fade-in">
        <div className="card-institutional p-10 md:p-14 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c6b677]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#133b5c] text-[#c6b677] mb-6 shadow-2xl border border-white/5 transform transition-transform group-hover:scale-110 duration-500">
              <FaUserPlus size={28} />
            </div>
            <h1 className="text-4xl font-serif font-bold text-white mb-3">Induct <span className="text-[#c6b677]">Profile</span></h1>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-mono">Establish Institutional Credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#c6b677] uppercase tracking-widest ml-1">Full Legal Name</label>
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-[#c6b677] transition-colors">
                  <FaUser size={14} />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Alexander Hamilton"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-institutional pl-12 h-14 text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#c6b677] uppercase tracking-widest ml-1">Institutional Email</label>
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-[#c6b677] transition-colors">
                  <FaEnvelope size={14} />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="name@institution.edu"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-institutional pl-12 h-14 text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#c6b677] uppercase tracking-widest ml-1">Password</label>
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-[#c6b677] transition-colors">
                    <FaLock size={14} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-institutional pl-12 h-14 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#c6b677] transition-colors"
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#c6b677] uppercase tracking-widest ml-1">Confirm</label>
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-[#c6b677] transition-colors">
                    <FaLock size={14} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-institutional pl-12 h-14 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#c6b677] transition-colors"
                  >
                    {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {passwordMatch !== null && (
              <p className={`text-[10px] font-mono tracking-widest uppercase text-center mt-2 ${passwordMatch ? "text-green-400" : "text-red-400"}`}>
                {passwordMatch ? "Verification Synchronized" : "Verification Failed"}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-institutional w-full h-14 text-[11px] font-bold uppercase tracking-[0.3em] flex items-center justify-center group/btn"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white" />
              ) : (
                <>Establish Induction <FaArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" /></>
              )}
            </button>

            <p className="text-center text-white/40 text-[10px] uppercase tracking-widest pt-6 border-t border-white/5">
              Legacy Account Detected?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-[#c6b677] hover:underline font-bold transition-all"
              >
                Access Archives
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
