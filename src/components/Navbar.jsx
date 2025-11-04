import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import { useAuth } from "../contexts/AuthContext";
import { useUI } from "../contexts/UIContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { openAuthModal } = useUI();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl shadow-md">
          C
        </div>
        <span className="font-semibold text-xl text-gray-800">campus</span>
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/features" className="text-muted hidden md:inline">
          Features
        </Link>
        <Link to="/approach" className="text-muted hidden md:inline">
          Our Approach
        </Link>
        
        {user ? (
          <>
            <Link to={`/${user.role}`} className="hidden md:inline text-muted font-medium">
              Dashboard
            </Link>
            <Button onClick={handleLogout} variant="ghost" className="ml-2 hidden md:inline">
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" className="ml-2 hidden md:inline">
              Try Beta
            </Button>
            <Button onClick={openAuthModal} variant="primary" className="ml-2">
              Get Started
            </Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
