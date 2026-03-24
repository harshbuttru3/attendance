import React from "react";
import { FaUniversity, FaShieldAlt, FaCode } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0b2438] border-t border-white/5 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#c6b677]/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-8 opacity-40 grayscale group hover:grayscale-0 transition-all duration-700">
          <FaUniversity className="text-[#c6b677]" size={24} />
          <h2 className="text-white font-serif font-bold uppercase tracking-[0.4em] text-xs">Institutional Systems</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-8 mb-12 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-[#c6b677] font-bold uppercase tracking-widest text-[10px] mb-4">Core Architecture</h3>
            <p className="text-white/30 text-xs font-mono max-w-xs leading-relaxed">
              Proprietary attendance tracking engine designed for academic excellence and data integrity.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-[#c6b677] font-bold uppercase tracking-widest text-[10px] mb-4">Security Protocol</h3>
            <div className="flex items-center gap-3 text-white/30">
              <FaShieldAlt size={14} />
              <span className="text-xs font-mono">AES-256 Encrypted Stream</span>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <h3 className="text-[#c6b677] font-bold uppercase tracking-widest text-[10px] mb-4">System Status</h3>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-white/30 text-xs font-mono uppercase tracking-tighter">Operational - v2.4.0</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 w-full flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/20 text-[10px] uppercase font-bold tracking-[0.2em]">
            © {new Date().getFullYear()} Centralized Attendance System. 
            <span className="ml-2 text-white/10 hidden md:inline">| Authorization Level 4 Active</span>
          </p>
          <div className="flex items-center gap-4 text-white/20 hover:text-[#c6b677] transition-colors cursor-pointer group">
            <FaCode size={12} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Techno-Institutional Hub</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
