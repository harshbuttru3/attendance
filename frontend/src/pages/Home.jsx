import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { FaGraduationCap, FaCheckCircle, FaUsers, FaArrowRight } from "react-icons/fa";

const Home = () => {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-[#0b2438] pt-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#133b5c]/80 to-[#0b2438] z-10" />
          <img
            src="https://images.unsplash.com/photo-1541339907198-e08759df9a73?auto=format&fit=crop&q=80"
            alt="Campus"
            className="w-full h-full object-cover scale-110"
          />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center relative z-20 animate-fade-in">
          <span className="text-[#c6b677] uppercase tracking-[0.4em] text-xs font-bold mb-6 block">
            Digital Campus Experience
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-tight font-serif">
            Empowering <span className="text-[#c6b677]">Future</span> Leaders
          </h1>
          <p className="text-white/70 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-mono">
            A state-of-the-art attendance management system designed for seamless academic integration.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            {user ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="btn-institutional group"
              >
                Teacher Dashboard <FaArrowRight className="transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <Link to="/login" className="btn-institutional group">
                Get Started <FaArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            )}
            <Link to="/student-attendance" className="px-8 py-3 rounded-full border border-white/20 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all">
              Check Attendance
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: <FaGraduationCap size={40} />, title: "Academic Excellence", desc: "Focus on learning while we handle the tracking." },
            { icon: <FaCheckCircle size={40} />, title: "Precision Tracking", desc: "Real-time records with pinpoint accuracy." },
            { icon: <FaUsers size={40} />, title: "Seamless Integration", desc: "Built for students and faculty alike." },
          ].map((feature, i) => (
            <div key={i} className="card-institutional p-10 flex flex-col items-center text-center group">
              <div className="text-[#c6b677] mb-8 transition-transform group-hover:scale-110 duration-500">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 font-serif">{feature.title}</h3>
              <p className="text-white/50 leading-relaxed font-mono text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
