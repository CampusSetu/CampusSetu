import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import JobDetails from "./pages/JobDetails/JobDetails";
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthModal from "./components/AuthModal";

// Student Pages
import {
  StudentDashboard,
  StudentApplications,
  StudentProfile,
} from "./pages/Student";

// Recruiter Pages
import {
  RecruiterDashboard,
  PostJob,
  JobListings,
  Applicants,
  EditJob,
} from "./pages/Recruiter";

// Placement (CGC) Pages
import {
  PlacementDashboard,
  JobApprovals,
  ManageStudents,
} from "./pages/Placement";

// Analytics Page
import { AnalyticsDashboard } from "./pages/Analytics";

export default function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />

        {/* Protected Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute>
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/applications"
          element={
            <ProtectedRoute>
              <StudentApplications />
            </ProtectedRoute>
          }
        />

        {/* Protected Recruiter Routes */}
        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute>
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/post-job"
          element={
            <ProtectedRoute>
              <PostJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/jobs"
          element={
            <ProtectedRoute>
              <JobListings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/jobs/:id/applicants"
          element={
            <ProtectedRoute>
              <Applicants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/edit-job/:id"
          element={
            <ProtectedRoute>
              <EditJob />
            </ProtectedRoute>
          }
        />

        {/* Protected CGC Routes */}
        <Route
          path="/placement/dashboard"
          element={
            <ProtectedRoute>
              <PlacementDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/placement/approvals"
          element={
            <ProtectedRoute>
              <JobApprovals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/placement/students"
          element={
            <ProtectedRoute>
              <ManageStudents />
            </ProtectedRoute>
          }
        />

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
