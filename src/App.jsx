import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import JobDetails from "./pages/JobDetails/JobDetails";
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthModal from "./components/AuthModal";

// Student Pages
import StudentLayout from "./pages/Student/StudentLayout";
import StudentDashboard from "./pages/Student/Dashboard";
import StudentApplications from "./pages/Student/Applications";
import StudentProfile from "./pages/Student/Profile";

// Recruiter Pages
import RecruiterLayout from "./pages/Recruiter/RecruiterLayout";
import PostJob from "./pages/Recruiter/PostJob";
import JobListings from "./pages/Recruiter/JobListings";
import Applicants from "./pages/Recruiter/Applicants";

export default function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

        {/* Protected Student Routes */}
        <Route path="/student" element={<ProtectedRoute><StudentLayout /></ProtectedRoute>}>
          <Route index element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="applications" element={<StudentApplications />} />
        </Route>

        {/* Protected Recruiter Routes */}
        <Route path="/recruiter" element={<ProtectedRoute><RecruiterLayout /></ProtectedRoute>}>
          <Route path="post-job" element={<PostJob />} />
          <Route path="jobs" element={<JobListings />} />
          <Route path="jobs/:id/applicants" element={<Applicants />} />
        </Route>

        {/* Not Found Route */}
        <Route
          path="*"
          element={<div style={{ padding: 40 }}>Page not found</div>}
        />
      </Routes>
      <AuthModal />
    </>
  );
}
