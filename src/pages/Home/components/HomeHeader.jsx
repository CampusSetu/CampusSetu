import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export default function HomeHeader({ onAuth }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-20 bg-white/85 backdrop-blur border-b border-slate-200/60">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full border border-primary/30 flex items-center justify-center text-lg font-semibold text-primary">
            CS
          </div>
          <span className="text-lg font-semibold tracking-tight">CampusSetu</span>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#about" className="hover:text-primary transition-colors">
            About
          </a>
          <a href="#features" className="hover:text-primary transition-colors">
            Features
          </a>
          <Link to="/analytics" className="hover:text-primary transition-colors">
            Analytics
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <Link
                to={`/${user.role || "dashboard"}`}
                className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:border-primary hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-full bg-primary text-white font-medium shadow-sm hover:shadow-md transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onAuth}
                className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:border-primary hover:text-primary transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={onAuth}
                className="px-5 py-2 rounded-full bg-primary text-white font-medium shadow-sm hover:shadow-md transition"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
