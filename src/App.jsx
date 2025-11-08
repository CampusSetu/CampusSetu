import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import JobDetails from "./pages/JobDetails/JobDetails";
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthModal from "./components/AuthModal";

// Student Pages
import {
  StudentLayout,
  StudentDashboard,
  StudentApplications,
  StudentProfile,
} from "./pages/Student";

import {
  RecruiterLayout,
  RecruiterDashboard,
  PostJob,
  JobListings,
  Applicants,
  EditJob,
} from "./pages/Recruiter";

// CGC Pages
import {
  PlacementLayout,
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
          path="/student"
          element={
            <ProtectedRoute>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="applications" element={<StudentApplications />} />
        </Route>

        {/* Protected Recruiter Routes */}
        <Route
          path="/recruiter"
          element={
            <ProtectedRoute>
              <RecruiterLayout />
            </ProtectedRoute>
          }
        > 
          <Route path="dashboard" element={<RecruiterDashboard />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="jobs" element={<JobListings />} />
          <Route path="jobs/:id/applicants" element={<Applicants />} />
          <Route path="edit-job/:id" element={<EditJob />} />
        </Route>

  {/* Protected CGC Routes */}
        <Route
          path="/placement"
          element={
            <ProtectedRoute>
              <PlacementLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<PlacementDashboard />} />
          <Route path="approvals" element={<JobApprovals />} />
          <Route path="students" element={<ManageStudents />} />
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
