import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    // If no user is logged in, redirect to the auth page
    return <Navigate to="/" replace />;
  }

  // If user is logged in, render the child components (or an <Outlet />)
  return children || <Outlet />;
}
