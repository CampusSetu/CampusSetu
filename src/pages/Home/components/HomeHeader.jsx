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

  const handleFeatureClick = (path, dashboardPath = null) => {
    // If user is logged in and this feature has a specific dashboard for their role
    if (user && dashboardPath && dashboardPath[user.role]) {
      navigate(dashboardPath[user.role]);
    } else {
      navigate(path);
    }
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
            Overview
          </a>
          <div className="group relative">
            <button className="flex items-center gap-1 hover:text-primary transition-colors">
              Features
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="invisible group-hover:visible absolute left-0 top-full pt-2 w-64">
              <div className="rounded-lg border border-slate-200 bg-white py-2 shadow-lg">
                <button 
                  onClick={() => handleFeatureClick("/features/company-insights", { student: "/insights/overview" })}
                  className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary"
                >
                  Company Insights & Ratings
                </button>
                <button 
                  onClick={() => handleFeatureClick("/features/alumni-network", { alumni: "/alumni/dashboard", student: "/student/mentorship" })}
                  className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary"
                >
                  Alumni Network & Mentorship
                </button>
                <button 
                  onClick={() => handleFeatureClick("/features/interview-scheduling", { student: "/student/interviews" })}
                  className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary"
                >
                  Smart Interview Scheduling
                </button>
                <button 
                  onClick={() => handleFeatureClick("/features/resume-intelligence", { student: "/student/resume-lab" })}
                  className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary"
                >
                  Resume Intelligence
                </button>
              </div>
            </div>
          </div>
          <a href="#workflow" className="hover:text-primary transition-colors">
            How It Works
          </a>
          <a href="#personas" className="hover:text-primary transition-colors">
            For Teams
          </a>
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
