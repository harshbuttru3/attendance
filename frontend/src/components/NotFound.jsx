import React from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle, FaHome } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0b2438] flex flex-col items-center justify-center p-6 relative overflow-hidden font-inter">
      {/* Decorative Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#133b5c]/40 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#c6b677]/5 blur-[150px] rounded-full" />

      <div className="z-10 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-[#133b5c] text-[#c6b677] mb-8 shadow-2xl border border-white/5">
          <FaExclamationTriangle size={40} />
        </div>
        
        <h1 className="text-8xl font-serif font-bold text-white mb-4">404</h1>
        <h2 className="text-xl font-mono text-[#c6b677] uppercase tracking-[0.5em] mb-8">Resource Not Located</h2>
        
        <p className="text-white/40 max-w-md mx-auto mb-12 leading-relaxed">
          The requested institutional record or administrative interface could not be identified within the current directory structure.
        </p>
        
        <Link
          to="/"
          className="btn-institutional px-10 h-14 inline-flex items-center justify-center gap-3 group"
        >
          <FaHome className="group-hover:-translate-y-1 transition-transform" />
          <span>Return to Central Hub</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
