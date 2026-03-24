import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FaUserCircle, FaSignOutAlt, FaMoon, FaSun } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Attendance", path: "/student-attendance" },
    ...(user?.role === "teacher" ? [{ name: "Teacher Panel", path: "/dashboard" }] : []),
    ...(user?.role === "admin" ? [{ name: "Admin Panel", path: "/admin-dashboard" }] : []),
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? darkMode
            ? "glass-dark py-3"
            : "bg-white/80 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl grad-primary flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
            <FaClipboardList className="text-white text-xl" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            <span className={darkMode ? "text-white" : "text-slate-900"}>
              Attend
            </span>
            <span className="text-purple-500">Sync</span>
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:text-purple-500 ${
                  location.pathname === link.path
                    ? "text-purple-500"
                    : darkMode
                    ? "text-slate-400"
                    : "text-slate-600"
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-700/30 mx-2" />

          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-110 ${
                darkMode
                  ? "bg-slate-800 text-yellow-400 hover:bg-slate-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
            </button>

            {!isAdminRoute && (
              user ? (
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 text-red-500 rounded-xl font-bold border border-red-500/20 hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 px-5 py-2.5 grad-primary text-white rounded-xl font-bold hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-purple-500/20 cursor-pointer"
                >
                  <FaSignInAlt />
                  <span>Teacher Login</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg ${
              darkMode ? "bg-slate-800 text-yellow-400" : "bg-slate-100 text-slate-600"
            }`}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <button
            onClick={toggleMenu}
            className={`p-2 rounded-lg ${
              darkMode ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-900"
            }`}
          >
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden animate-fade-in">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={toggleMenu}
          />
          <div className={`absolute top-0 right-0 h-full w-72 shadow-2xl transition-transform duration-300 ${
            darkMode ? "glass-dark" : "bg-white"
          }`}>
            <div className="p-8 flex flex-col h-full">
              <div className="flex justify-between items-center mb-10">
                <span className="font-bold text-xl">Menu</span>
                <button onClick={toggleMenu} className="p-2">
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={toggleMenu}
                    className="flex items-center gap-4 text-lg font-bold hover:text-purple-500 transition-colors"
                  >
                    <span className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                      {link.icon}
                    </span>
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="mt-auto pt-8 border-t border-slate-700/20">
                {!isAdminRoute && (
                  user ? (
                    <button
                      onClick={() => { logout(); toggleMenu(); }}
                      className="w-full flex items-center justify-center gap-2 p-4 bg-red-500 text-white rounded-2xl font-bold"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  ) : (
                    <button
                      onClick={() => { navigate("/login"); toggleMenu(); }}
                      className="w-full flex items-center justify-center gap-2 p-4 grad-primary text-white rounded-2xl font-bold shadow-lg"
                    >
                      <FaSignInAlt /> Teacher Login
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
