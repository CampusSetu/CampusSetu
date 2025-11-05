import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function RecruiterLayout() {
  const { user, logout } = useAuth();

  const activeLinkStyle = { 
    color: '#1E40AF',
    borderBottom: '2px solid #1E40AF',
    fontWeight: '600'
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-6">
              <NavLink to="/" className="font-bold text-xl text-primary">
                Campus SETU
              </NavLink>
              <nav className="hidden md:flex items-center gap-4 h-full">
                <NavLink to="/recruiter/dashboard" end style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="h-full flex items-center px-2 text-gray-600 hover:text-primary transition-colors">
                  Dashboard
                </NavLink>
                <NavLink to="/recruiter/jobs" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="h-full flex items-center px-2 text-gray-600 hover:text-primary transition-colors">
                  My Jobs
                </NavLink>
                <NavLink to="/recruiter/post-job" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="h-full flex items-center px-2 text-gray-600 hover:text-primary transition-colors">
                  Post a Job
                </NavLink>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">{user ? `Welcome, ${user.name}` : "Guest"}</span>
              <button onClick={logout} className="text-sm text-gray-500 hover:text-primary">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
